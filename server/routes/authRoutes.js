const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');
const {
  registerRules,
  loginRules,
  updateProfileRules,
  changePasswordRules,
} = require('../middleware/authValidators');

// Public routes
router.post('/register', registerRules, validate, authController.register);
router.post('/login', loginRules, validate, authController.login);
router.post('/logout', authController.logout);

// Protected routes
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, updateProfileRules, validate, authController.updateProfile);
router.put('/change-password', protect, changePasswordRules, validate, authController.changePassword);

module.exports = router;
