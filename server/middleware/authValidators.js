const { check } = require('express-validator');

const registerRules = [
  check('name', 'Name is required and must be at most 100 characters')
    .notEmpty()
    .trim()
    .isLength({ max: 100 }),
  check('email', 'Please provide a valid college or personal email')
    .isEmail()
    .normalizeEmail(),
  check('password', 'Password must be at least 6 characters')
    .isLength({ min: 6 }),
  check('college', 'College name is required')
    .notEmpty()
    .trim(),
  check('branch', 'Branch is optional')
    .optional()
    .trim(),
  check('year', 'Year must be a number between 1 and 6')
    .optional()
    .isInt({ min: 1, max: 6 }),
];

const loginRules = [
  check('email', 'Please provide a valid email')
    .isEmail()
    .normalizeEmail(),
  check('password', 'Password is required')
    .notEmpty(),
];

const updateProfileRules = [
  check('name', 'Name cannot be empty')
    .optional()
    .notEmpty()
    .trim(),
  check('bio', 'Bio cannot exceed 500 characters')
    .optional()
    .isLength({ max: 500 }),
  check('year', 'Year must be between 1 and 6')
    .optional()
    .isInt({ min: 1, max: 6 }),
];

const changePasswordRules = [
  check('currentPassword', 'Current password is required').notEmpty(),
  check('newPassword', 'New password must be at least 6 characters').isLength({ min: 6 }),
];

module.exports = {
  registerRules,
  loginRules,
  updateProfileRules,
  changePasswordRules,
};
