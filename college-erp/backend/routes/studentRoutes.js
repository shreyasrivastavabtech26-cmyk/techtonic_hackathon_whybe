const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticateToken, isAdmin, canViewStudentRecords } = require('../middleware/auth');

// All routes require authentication
router.use(authenticateToken);

// View all students (Admin & Faculty)
router.get('/', canViewStudentRecords, studentController.getAllStudents);

// View single student (Admin, Faculty, or Self)
router.get('/:id', studentController.getStudentById);

// Create student (Admin only)
router.post('/', isAdmin, studentController.createStudent);

// Update student (Admin only)
router.put('/:id', isAdmin, studentController.updateStudent);

// Delete student (Admin only)
router.delete('/:id', isAdmin, studentController.deleteStudent);

module.exports = router;
