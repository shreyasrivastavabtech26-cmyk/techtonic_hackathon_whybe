// Attendance Module Controller: Tracking, Percentage & <75% Warning Logic
const db = require('../config/db');

// GET /api/attendance/summary/:studentId - Get attendance stats & <75% warning flag
const getStudentAttendanceSummary = async (req, res) => {
  const { studentId } = req.params;

  // Students can only view their own attendance
  if (req.user.role === 'student' && req.user.student_id !== parseInt(studentId, 10)) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: You are only authorized to view your own attendance record.',
    });
  }

  try {
    // 1. Overall stats
    const summaryQuery = `
      SELECT 
        COUNT(id) AS total_sessions,
        COUNT(CASE WHEN status = 'present' THEN 1 END) AS attended_sessions,
        COUNT(CASE WHEN status = 'absent' THEN 1 END) AS absent_sessions,
        COUNT(CASE WHEN status = 'late' THEN 1 END) AS late_sessions
      FROM attendance
      WHERE student_id = $1;
    `;
    const summaryRes = await db.query(summaryQuery, [studentId]);
    const { total_sessions, attended_sessions, absent_sessions, late_sessions } = summaryRes.rows[0];

    const total = parseInt(total_sessions, 10);
    const attended = parseInt(attended_sessions, 10);
    const percentage = total > 0 ? parseFloat(((attended / total) * 100).toFixed(2)) : 0;
    const isBelow75 = total > 0 && percentage < 75.0;

    // Calculate required classes to reach 75%
    let classesNeededToRecover = 0;
    if (isBelow75) {
      // (attended + x) / (total + x) >= 0.75  =>  x >= (0.75 * total - attended) / 0.25
      classesNeededToRecover = Math.max(0, Math.ceil((0.75 * total - attended) / 0.25));
    }

    // 2. Course-wise breakdown
    const courseBreakdownQuery = `
      SELECT 
        c.course_code,
        c.course_name,
        COUNT(a.id) AS course_total,
        COUNT(CASE WHEN a.status = 'present' THEN 1 END) AS course_attended,
        ROUND((COUNT(CASE WHEN a.status = 'present' THEN 1 END)::NUMERIC / NULLIF(COUNT(a.id), 0)::NUMERIC) * 100, 1) AS course_percentage
      FROM courses c
      LEFT JOIN attendance a ON c.course_code = a.course_code AND a.student_id = $1
      GROUP BY c.course_code, c.course_name
      ORDER BY c.course_code ASC;
    `;
    const courseRes = await db.query(courseBreakdownQuery, [studentId]);

    // 3. Recent Session Logs
    const logsQuery = `
      SELECT id, course_code, session_date, status, remarks
      FROM attendance
      WHERE student_id = $1
      ORDER BY session_date DESC
      LIMIT 15;
    `;
    const logsRes = await db.query(logsQuery, [studentId]);

    return res.status(200).json({
      success: true,
      data: {
        studentId: parseInt(studentId, 10),
        totalSessions: total,
        attendedSessions: attended,
        absentSessions: parseInt(absent_sessions, 10),
        lateSessions: parseInt(late_sessions, 10),
        attendancePercentage: percentage,
        isBelow75Warning: isBelow75,
        warningMessage: isBelow75
          ? `CRITICAL ATTENDANCE WARNING: Your current attendance is ${percentage}%, falling below the university mandated 75% threshold. You must attend the next ${classesNeededToRecover} consecutive lecture(s) without absence to avoid examination debarment.`
          : 'Attendance Good: Above the mandatory 75% university requirement.',
        classesNeededToRecover,
        courses: courseRes.rows,
        recentSessions: logsRes.rows,
      },
    });
  } catch (error) {
    console.error('Error fetching attendance summary:', error);
    return res.status(500).json({ success: false, message: 'Failed to compute attendance summary.', error: error.message });
  }
};

// GET /api/attendance - View Attendance Logs (Admin & Faculty, or Student own)
const getAttendanceRecords = async (req, res) => {
  try {
    const { studentId, courseCode, date } = req.query;
    let query = `
      SELECT a.id, a.student_id, s.roll_number, s.first_name || ' ' || s.last_name AS student_name,
             a.course_code, a.session_date, a.status, a.remarks, u.username AS marked_by_user
      FROM attendance a
      JOIN students s ON a.student_id = s.id
      LEFT JOIN users u ON a.marked_by = u.id
      WHERE 1=1
    `;
    const params = [];

    // Enforce student role restriction
    if (req.user.role === 'student') {
      params.push(req.user.student_id);
      query += ` AND a.student_id = $${params.length}`;
    } else if (studentId) {
      params.push(parseInt(studentId, 10));
      query += ` AND a.student_id = $${params.length}`;
    }

    if (courseCode) {
      params.push(courseCode);
      query += ` AND a.course_code = $${params.length}`;
    }
    if (date) {
      params.push(date);
      query += ` AND a.session_date = $${params.length}`;
    }

    query += ` ORDER BY a.session_date DESC, s.roll_number ASC`;

    const result = await db.query(query, params);
    return res.status(200).json({ success: true, count: result.rows.length, records: result.rows });
  } catch (error) {
    console.error('Error fetching attendance records:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch attendance records.', error: error.message });
  }
};

// POST /api/attendance/mark - Mark / Upsert Attendance (Faculty & Admin only)
const markAttendance = async (req, res) => {
  // Only Admin and Faculty can edit attendance
  if (!['admin', 'faculty'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Only Faculty and Administrators are authorized to edit attendance records.',
    });
  }

  const { studentId, courseCode, sessionDate, status, remarks } = req.body;

  if (!studentId || !courseCode || !sessionDate || !status) {
    return res.status(400).json({
      success: false,
      message: 'Required fields: studentId, courseCode, sessionDate, status (present/absent/late).',
    });
  }

  try {
    const upsertQuery = `
      INSERT INTO attendance (student_id, course_code, session_date, status, marked_by, remarks)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (student_id, course_code, session_date)
      DO UPDATE SET status = EXCLUDED.status, marked_by = EXCLUDED.marked_by, remarks = EXCLUDED.remarks
      RETURNING *;
    `;
    const result = await db.query(upsertQuery, [studentId, courseCode, sessionDate, status, req.user.id, remarks || null]);

    return res.status(200).json({
      success: true,
      message: `Attendance for session ${sessionDate} (${courseCode}) recorded successfully.`,
      attendance: result.rows[0],
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    return res.status(500).json({ success: false, message: 'Failed to record attendance.', error: error.message });
  }
};

// PUT /api/attendance/:id - Update Attendance Entry (Faculty & Admin only)
const updateAttendanceEntry = async (req, res) => {
  if (!['admin', 'faculty'].includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Only Faculty and Administrators can edit attendance entries.',
    });
  }

  const { id } = req.params;
  const { status, remarks } = req.body;

  try {
    const query = `
      UPDATE attendance
      SET status = COALESCE($1, status),
          remarks = COALESCE($2, remarks),
          marked_by = $3
      WHERE id = $4
      RETURNING *;
    `;
    const result = await db.query(query, [status, remarks, req.user.id, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Attendance record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Attendance entry updated successfully.',
      attendance: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating attendance entry:', error);
    return res.status(500).json({ success: false, message: 'Failed to update attendance.', error: error.message });
  }
};

module.exports = {
  getStudentAttendanceSummary,
  getAttendanceRecords,
  markAttendance,
  updateAttendanceEntry,
};
