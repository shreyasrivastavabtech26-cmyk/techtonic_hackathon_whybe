// Fee Module Controller: Fee Records, Remaining Balance & Due Warning Notifications
const db = require('../config/db');

// GET /api/fees/student/:studentId - Get Fee Ledger & Due Warning Notification
const getStudentFeeDetails = async (req, res) => {
  const { studentId } = req.params;

  // Students can only view their own fee ledger
  if (req.user.role === 'student' && req.user.student_id !== parseInt(studentId, 10)) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: You can only view your own institutional fee ledger.',
    });
  }

  try {
    const query = `
      SELECT f.id, f.student_id, f.semester, f.academic_year,
             f.total_amount, f.paid_amount, f.remaining_amount,
             f.due_date, f.status, f.last_payment_date,
             s.roll_number, s.first_name || ' ' || s.last_name AS student_name
      FROM fees f
      JOIN students s ON f.student_id = s.id
      WHERE f.student_id = $1
      ORDER BY f.semester DESC;
    `;
    const result = await db.query(query, [studentId]);

    // Aggregate balances
    let totalAssessed = 0;
    let totalPaid = 0;
    let totalRemaining = 0;
    let hasDueFee = false;
    let dueDetails = [];

    const now = new Date();

    result.rows.forEach(row => {
      const remaining = parseFloat(row.remaining_amount);
      const total = parseFloat(row.total_amount);
      const paid = parseFloat(row.paid_amount);

      totalAssessed += total;
      totalPaid += paid;
      totalRemaining += remaining;

      if (remaining > 0 && (row.status === 'due' || row.status === 'partial')) {
        hasDueFee = true;
        const dueDateObj = new Date(row.due_date);
        const isOverdue = dueDateObj < now;
        dueDetails.push({
          feeId: row.id,
          semester: row.semester,
          remainingAmount: remaining,
          dueDate: row.due_date,
          isOverdue,
        });
      }
    });

    const warningNotification = hasDueFee
      ? {
          active: true,
          severity: dueDetails.some(d => d.isOverdue) ? 'CRITICAL' : 'WARNING',
          message: `FEE PAYMENT WARNING: Outstanding tuition balance of $${totalRemaining.toLocaleString('en-US', { minimumFractionDigits: 2 })} remaining to be submitted. Please settle payment by ${dueDetails[0]?.dueDate || 'designated deadline'} to prevent course registration cancellation and transcript holds.`,
          totalDue: totalRemaining,
          pendingItems: dueDetails,
        }
      : {
          active: false,
          severity: 'CLEAR',
          message: 'All semester tuition and lab fees are fully paid and cleared. No outstanding dues.',
          totalDue: 0,
          pendingItems: [],
        };

    return res.status(200).json({
      success: true,
      summary: {
        totalAssessed,
        totalPaid,
        totalRemaining,
        hasDueFee,
        warningNotification,
      },
      ledger: result.rows,
    });
  } catch (error) {
    console.error('Error fetching fee details:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve fee records.', error: error.message });
  }
};

// GET /api/fees - View All Fee Records (Admin & Faculty)
const getAllFees = async (req, res) => {
  try {
    const { status, semester } = req.query;
    let query = `
      SELECT f.id, f.student_id, f.semester, f.academic_year,
             f.total_amount, f.paid_amount, f.remaining_amount,
             f.due_date, f.status, f.last_payment_date,
             s.roll_number, s.first_name || ' ' || s.last_name AS student_name,
             s.department
      FROM fees f
      JOIN students s ON f.student_id = s.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      params.push(status);
      query += ` AND f.status = $${params.length}`;
    }
    if (semester) {
      params.push(parseInt(semester, 10));
      query += ` AND f.semester = $${params.length}`;
    }

    query += ` ORDER BY f.due_date ASC, s.roll_number ASC`;

    const result = await db.query(query, params);
    return res.status(200).json({ success: true, count: result.rows.length, fees: result.rows });
  } catch (error) {
    console.error('Error fetching fees:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch fee records.', error: error.message });
  }
};

// POST /api/fees/payment - Record Fee Payment (Admin & Faculty edit permission)
const recordFeePayment = async (req, res) => {
  // Enforce role permission: Admin & Faculty can edit fee module
  if (!['admin', 'faculty'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Only Administrators and Faculty are authorized to edit fee records.',
    });
  }

  const { feeId, paymentAmount, paymentDate } = req.body;

  if (!feeId || paymentAmount === undefined || paymentAmount <= 0) {
    return res.status(400).json({
      success: false,
      message: 'Required valid feeId and positive paymentAmount.',
    });
  }

  try {
    // 1. Get current fee record
    const feeRes = await db.query('SELECT * FROM fees WHERE id = $1', [feeId]);
    if (feeRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Fee record not found.' });
    }

    const currentFee = feeRes.rows[0];
    const newPaidAmount = parseFloat(currentFee.paid_amount) + parseFloat(paymentAmount);
    const totalAmount = parseFloat(currentFee.total_amount);

    let newStatus = 'partial';
    if (newPaidAmount >= totalAmount) {
      newStatus = 'paid';
    } else if (newPaidAmount === 0) {
      newStatus = 'due';
    }

    const dateToRecord = paymentDate || new Date().toISOString().split('T')[0];

    const updateQuery = `
      UPDATE fees
      SET paid_amount = $1,
          status = $2,
          last_payment_date = $3,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING *;
    `;
    const updatedRes = await db.query(updateQuery, [newPaidAmount, newStatus, dateToRecord, feeId]);

    return res.status(200).json({
      success: true,
      message: `Payment of $${paymentAmount} applied successfully. Remaining balance: $${updatedRes.rows[0].remaining_amount}`,
      fee: updatedRes.rows[0],
    });
  } catch (error) {
    console.error('Error applying fee payment:', error);
    return res.status(500).json({ success: false, message: 'Failed to apply fee payment.', error: error.message });
  }
};

// POST /api/fees - Create/Assign Fee Structure (Admin & Faculty edit permission)
const createFee = async (req, res) => {
  if (!['admin', 'faculty'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Only Administrators and Faculty can assign fees.',
    });
  }

  const { studentId, semester, academicYear, totalAmount, dueDate } = req.body;

  if (!studentId || !semester || !totalAmount || !dueDate) {
    return res.status(400).json({
      success: false,
      message: 'Required fields: studentId, semester, totalAmount, dueDate.',
    });
  }

  try {
    const insertQuery = `
      INSERT INTO fees (student_id, semester, academic_year, total_amount, paid_amount, due_date, status)
      VALUES ($1, $2, $3, $4, 0.00, $5, 'due')
      RETURNING *;
    `;
    const result = await db.query(insertQuery, [
      studentId,
      semester,
      academicYear || '2024-2025',
      totalAmount,
      dueDate,
    ]);

    return res.status(201).json({
      success: true,
      message: 'Fee entry created successfully.',
      fee: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating fee entry:', error);
    return res.status(500).json({ success: false, message: 'Failed to create fee record.', error: error.message });
  }
};

module.exports = {
  getStudentFeeDetails,
  getAllFees,
  recordFeePayment,
  createFee,
};
