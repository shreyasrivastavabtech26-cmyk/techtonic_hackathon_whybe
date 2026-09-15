// Student Management Controller: Role-Enforced CRUD on Student Records
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// GET /api/students - View Student Directory (Admin & Faculty)
const getAllStudents = async (req, res) => {
  try {
    const { department, semester, search } = req.query;
    let query = `
      SELECT s.id, s.roll_number, s.first_name, s.last_name, s.department, 
             s.semester, s.contact_email, s.phone, s.enrollment_date,
             u.username, u.email, u.is_active
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (department) {
      params.push(department);
      query += ` AND s.department ILIKE $${params.length}`;
    }
    if (semester) {
      params.push(parseInt(semester, 10));
      query += ` AND s.semester = $${params.length}`;
    }
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (s.roll_number ILIKE $${params.length} OR s.first_name ILIKE $${params.length} OR s.last_name ILIKE $${params.length})`;
    }

    query += ` ORDER BY s.roll_number ASC`;

    const result = await db.query(query, params);
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      students: result.rows,
    });
  } catch (error) {
    console.error('Error fetching students:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch student records.', error: error.message });
  }
};

// GET /api/students/:id - View Individual Student Record
const getStudentById = async (req, res) => {
  const { id } = req.params;

  // If role is student, they can only view their own record
  if (req.user.role === 'student' && req.user.student_id !== parseInt(id, 10)) {
    return res.status(403).json({
      success: false,
      message: 'Access Forbidden: Students can only view their own student record.',
    });
  }

  try {
    const query = `
      SELECT s.id, s.roll_number, s.first_name, s.last_name, s.department, 
             s.semester, s.contact_email, s.phone, s.enrollment_date,
             u.username, u.email, u.is_active
      FROM students s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = $1
    `;
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    return res.status(200).json({ success: true, student: result.rows[0] });
  } catch (error) {
    console.error('Error fetching student:', error);
    return res.status(500).json({ success: false, message: 'Could not fetch student record.', error: error.message });
  }
};

// POST /api/students - Create New Student (Admin only)
const createStudent = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Only Administrator role can create student records.',
    });
  }

  const { rollNumber, firstName, lastName, department, semester, contactEmail, phone, password } = req.body;

  if (!rollNumber || !firstName || !lastName || !department || !semester || !contactEmail) {
    return res.status(400).json({
      success: false,
      message: 'Required fields: rollNumber, firstName, lastName, department, semester, contactEmail.',
    });
  }

  try {
    const defaultPassword = password || 'UniversityPass2024!';
    const passwordHash = await bcrypt.hash(defaultPassword, 10);
    const username = rollNumber.toLowerCase().replace(/[^a-z0-9]/g, '_');

    // Create user account first
    const userInsert = `
      INSERT INTO users (username, email, password_hash, role)
      VALUES ($1, $2, $3, 'student')
      RETURNING id;
    `;
    const userResult = await db.query(userInsert, [username, contactEmail, passwordHash]);
    const newUserId = userResult.rows[0].id;

    // Create student record
    const studentInsert = `
      INSERT INTO students (user_id, roll_number, first_name, last_name, department, semester, contact_email, phone)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
    `;
    const studentResult = await db.query(studentInsert, [
      newUserId,
      rollNumber,
      firstName,
      lastName,
      department,
      parseInt(semester, 10),
      contactEmail,
      phone || null,
    ]);

    return res.status(201).json({
      success: true,
      message: `Student '${firstName} ${lastName}' successfully registered in database.`,
      student: studentResult.rows[0],
    });
  } catch (error) {
    console.error('Error creating student:', error);
    return res.status(500).json({ success: false, message: 'Failed to create student record.', error: error.message });
  }
};

// PUT /api/students/:id - Update Student Profile (Admin only)
const updateStudent = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Only Administrator role can edit student database records.',
    });
  }

  const { id } = req.params;
  const { firstName, lastName, department, semester, contactEmail, phone } = req.body;

  try {
    const updateQuery = `
      UPDATE students
      SET first_name = COALESCE($1, first_name),
          last_name = COALESCE($2, last_name),
          department = COALESCE($3, department),
          semester = COALESCE($4, semester),
          contact_email = COALESCE($5, contact_email),
          phone = COALESCE($6, phone),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *;
    `;
    const result = await db.query(updateQuery, [firstName, lastName, department, semester, contactEmail, phone, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Student record updated successfully.',
      student: result.rows[0],
    });
  } catch (error) {
    console.error('Error updating student:', error);
    return res.status(500).json({ success: false, message: 'Failed to update student record.', error: error.message });
  }
};

// DELETE /api/students/:id - Remove Student Record (Admin only)
const deleteStudent = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access Denied: Only Administrator role can delete student records.',
    });
  }

  const { id } = req.params;

  try {
    // Delete student, triggers user cascade
    const result = await db.query('DELETE FROM students WHERE id = $1 RETURNING roll_number, user_id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Student record not found.' });
    }

    // Also remove the user account
    await db.query('DELETE FROM users WHERE id = $1', [result.rows[0].user_id]);

    return res.status(200).json({
      success: true,
      message: `Student with Roll Number ${result.rows[0].roll_number} deleted successfully.`,
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete student.', error: error.message });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
