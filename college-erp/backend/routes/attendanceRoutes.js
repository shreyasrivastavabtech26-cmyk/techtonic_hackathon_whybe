const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticateToken, canEditAttendance } = require('../middleware/auth');

router.use(authenticateToken);

// Student Attendance Summary with <75% Warning Flag
router.get('/summary/:studentId', attendanceController.getStudentAttendanceSummary);

// View Attendance Logs (Admin & Faculty view all, Student views self)
router.get('/', attendanceController.getAttendanceRecords);

// Mark / Upsert Attendance (Faculty & Admin edit access)
router.post('/mark', canEditAttendance, attendanceController.markAttendance);

// Update specific attendance record (Faculty & Admin edit access)
router.put('/:id', canEditAttendance, attendanceController.updateAttendanceEntry);

module.exports = router;
