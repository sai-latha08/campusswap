const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorizeRoles } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(protect);
router.use(authorizeRoles('admin'));

router.get('/stats', adminController.getPlatformStats);
router.get('/users', adminController.getAllUsers);
router.patch('/users/:id/status', adminController.updateUserStatus);
router.get('/items', adminController.getAllItems);
router.patch('/items/:id/toggle', adminController.toggleItemStatus);
router.get('/reports', adminController.getAllReports);
router.patch('/reports/:id/resolve', adminController.resolveReport);

module.exports = router;
