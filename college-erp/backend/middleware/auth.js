// Role-Based Access Control (RBAC) & JWT Middleware
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_erp_jwt_key_2024_secure_and_random';

// 1. Verify JWT Authentication Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access Denied: Missing institutional authorization token.',
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Invalid or expired authorization token. Please re-authenticate.',
      });
    }
    req.user = decodedUser;
    next();
  });
};

// 2. Generic Role Authorization Guard
const requireRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' lacks permission for this action. Allowed: ${allowedRoles.join(', ')}`,
      });
    }

    next();
  };
};

// 3. Module-Specific Policy Helpers
// Admin has full access to all modules
const isAdmin = requireRole(['admin']);

// Student Management: Admin can edit (create/update/delete); Faculty can view; Student can view self
const canEditStudentRecords = requireRole(['admin']);
const canViewStudentRecords = requireRole(['admin', 'faculty']);

// Attendance Module: Admin & Faculty can edit (mark/update); Student can view own
const canEditAttendance = requireRole(['admin', 'faculty']);

// Fee Module: Admin & Faculty can edit (record payments/adjust); Student can view own
const canEditFees = requireRole(['admin', 'faculty']);

module.exports = {
  authenticateToken,
  requireRole,
  isAdmin,
  canEditStudentRecords,
  canViewStudentRecords,
  canEditAttendance,
  canEditFees,
  JWT_SECRET,
};
