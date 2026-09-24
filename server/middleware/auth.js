const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

/**
 * protect — verifies JWT from Authorization header or cookie.
 * Attaches the authenticated user to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check Authorization header first
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    // Fallback to cookie
    token = req.cookies.token;
  }

  if (!token) {
    return next(new AppError('Access denied. Please log in.', 401));
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    return next(new AppError('User no longer exists.', 401));
  }

  if (user.isSuspended) {
    return next(
      new AppError(
        `Your account has been suspended. Reason: ${user.suspensionReason || 'Policy violation.'}`,
        403
      )
    );
  }

  req.user = user;
  next();
});

/**
 * authorizeRoles — restricts access to specific roles.
 * Usage: authorizeRoles('admin')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(`Role '${req.user.role}' is not authorized to access this resource.`, 403)
      );
    }
    next();
  };
};

module.exports = { protect, authorizeRoles };
