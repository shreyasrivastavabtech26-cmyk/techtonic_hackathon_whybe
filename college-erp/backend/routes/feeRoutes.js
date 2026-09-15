const express = require('express');
const router = express.Router();
const feeController = require('../controllers/feeController');
const { authenticateToken, canEditFees } = require('../middleware/auth');

router.use(authenticateToken);

// View student fee ledger, remaining amount & due warning notification
router.get('/student/:studentId', feeController.getStudentFeeDetails);

// View all fee records (Admin & Faculty)
router.get('/', canEditFees, feeController.getAllFees);

// Record fee payment (Admin & Faculty edit access)
router.post('/payment', canEditFees, feeController.recordFeePayment);

// Create fee entry (Admin & Faculty edit access)
router.post('/', canEditFees, feeController.createFee);

module.exports = router;
