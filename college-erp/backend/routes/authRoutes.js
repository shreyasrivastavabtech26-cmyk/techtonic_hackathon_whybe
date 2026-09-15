const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Public route: Login
router.post('/login', authController.login);

// Protected route: Current user profile
router.get('/me', authenticateToken, authController.getCurrentUser);

module.exports = router;
