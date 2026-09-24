const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Get current user's notifications with pagination & filters
 * @route   GET /api/notifications
 * @access  Private
 */
exports.getNotifications = asyncHandler(async (req, res) => {
  const { isRead, limit = 20, page = 1 } = req.query;

  const query = { user: req.user._id };
  if (isRead !== undefined) {
    query.isRead = isRead === 'true';
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10));

  const total = await Notification.countDocuments(query);
  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

  sendSuccess(res, 200, 'Notifications retrieved', {
    notifications,
    total,
    unreadCount,
    page: parseInt(page, 10),
    pages: Math.ceil(total / parseInt(limit, 10)),
  });
});

/**
 * @desc    Get unread notification count
 * @route   GET /api/notifications/unread-count
 * @access  Private
 */
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const count = await Notification.countDocuments({
    user: req.user._id,
    isRead: false,
  });

  sendSuccess(res, 200, 'Unread notification count retrieved', { unreadCount: count });
});

/**
 * @desc    Mark a single notification as read
 * @route   PATCH /api/notifications/:id/read
 * @access  Private
 */
exports.markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  notification.isRead = true;
  await notification.save();

  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

  sendSuccess(res, 200, 'Notification marked as read', {
    notification,
    unreadCount,
  });
});

/**
 * @desc    Mark all notifications as read for current user
 * @route   PATCH /api/notifications/read-all
 * @access  Private
 */
exports.markAllAsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { user: req.user._id, isRead: false },
    { $set: { isRead: true } }
  );

  sendSuccess(res, 200, 'All notifications marked as read', { unreadCount: 0 });
});

/**
 * @desc    Delete a notification
 * @route   DELETE /api/notifications/:id
 * @access  Private
 */
exports.deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

  sendSuccess(res, 200, 'Notification removed', { unreadCount });
});
