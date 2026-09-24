const User = require('../models/User');
const Item = require('../models/Item');
const Skill = require('../models/Skill');
const SkillSession = require('../models/SkillSession');
const RentalBooking = require('../models/RentalBooking');
const BarterRequest = require('../models/BarterRequest');
const Report = require('../models/Report');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { recalculateTrustScore } = require('../utils/trustScoreCalculator');

/**
 * @desc    Get aggregate platform statistics for admin dashboard
 * @route   GET /api/admin/stats
 * @access  Private (Admin)
 */
exports.getPlatformStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalItems,
    totalSkills,
    totalSkillSessions,
    totalRentals,
    totalBarters,
    totalReports,
    pendingReports,
    recentUsers,
    recentReports,
  ] = await Promise.all([
    User.countDocuments(),
    Item.countDocuments(),
    Skill.countDocuments(),
    SkillSession.countDocuments(),
    RentalBooking.countDocuments(),
    BarterRequest.countDocuments(),
    Report.countDocuments(),
    Report.countDocuments({ status: { $in: ['open', 'under_review'] } }),
    User.find().sort({ createdAt: -1 }).limit(5).select('name email college branch trustScore isSuspended createdAt'),
    Report.find({ status: { $in: ['open', 'under_review'] } })
      .populate('reporter', 'name email college')
      .populate('reportedUser', 'name email college')
      .populate('item', 'title category')
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  // Aggregate stats
  const completedRentals = await RentalBooking.countDocuments({ status: 'completed' });
  const completedSkillSessions = await SkillSession.countDocuments({ status: 'completed' });
  const completedBarters = await BarterRequest.countDocuments({ status: 'completed' });

  sendSuccess(res, 200, 'Platform analytics retrieved', {
    overview: {
      totalUsers,
      totalItems,
      totalSkills,
      totalSkillSessions,
      completedSkillSessions,
      totalRentals,
      completedRentals,
      totalBarters,
      completedBarters,
      totalReports,
      pendingReports,
    },
    recentUsers,
    recentReports,
  });
});

/**
 * @desc    Get all registered users with search & filters
 * @route   GET /api/admin/users
 * @access  Private (Admin)
 */
exports.getAllUsers = asyncHandler(async (req, res) => {
  const { search, role, status, page = 1, limit = 20 } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { college: { $regex: search, $options: 'i' } },
    ];
  }

  if (role && role !== 'All') {
    query.role = role;
  }

  if (status === 'suspended') {
    query.isSuspended = true;
  } else if (status === 'active') {
    query.isSuspended = false;
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10));

  const total = await User.countDocuments(query);

  sendSuccess(res, 200, 'Users fetched', {
    users,
    total,
    page: parseInt(page, 10),
    pages: Math.ceil(total / parseInt(limit, 10)),
  });
});

/**
 * @desc    Suspend or reactivate a student user account
 * @route   PATCH /api/admin/users/:id/status
 * @access  Private (Admin)
 */
exports.updateUserStatus = asyncHandler(async (req, res, next) => {
  const { isSuspended, suspensionReason } = req.body;

  if (String(req.params.id) === String(req.user._id)) {
    return next(new AppError('You cannot suspend your own admin account.', 400));
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.isSuspended = Boolean(isSuspended);
  if (isSuspended) {
    user.suspensionReason = suspensionReason || 'Violation of CampusSwap community guidelines.';
    // Deduct 20 trust score points
    user.trustScore = Math.max(0, (user.trustScore || 50) - 20);
  } else {
    user.suspensionReason = '';
  }

  await user.save();

  // Send system notification
  await Notification.create({
    user: user._id,
    type: 'account_suspended',
    title: isSuspended ? 'Account Suspended ⚠️' : 'Account Reinstated ✅',
    message: isSuspended
      ? `Your account was suspended by campus moderators: ${user.suspensionReason}`
      : 'Your account access has been restored following moderator review.',
  });

  sendSuccess(res, 200, `User account ${isSuspended ? 'suspended' : 'reinstated'} successfully`, { user });
});

/**
 * @desc    Get all items for moderation
 * @route   GET /api/admin/items
 * @access  Private (Admin)
 */
exports.getAllItems = asyncHandler(async (req, res) => {
  const { search, category, status, page = 1, limit = 20 } = req.query;

  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  if (status === 'active') {
    query.isActive = true;
  } else if (status === 'inactive') {
    query.isActive = false;
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const items = await Item.find(query)
    .populate('owner', 'name email college trustScore')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10));

  const total = await Item.countDocuments(query);

  sendSuccess(res, 200, 'Items fetched for moderation', {
    items,
    total,
    page: parseInt(page, 10),
    pages: Math.ceil(total / parseInt(limit, 10)),
  });
});

/**
 * @desc    Toggle item listing active/inactive status (Moderator action)
 * @route   PATCH /api/admin/items/:id/toggle
 * @access  Private (Admin)
 */
exports.toggleItemStatus = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return next(new AppError('Item not found', 404));
  }

  item.isActive = !item.isActive;
  await item.save();

  sendSuccess(res, 200, `Item listing is now ${item.isActive ? 'Active' : 'Hidden/Deactivated'}`, { item });
});

/**
 * @desc    Get all student reports for moderation
 * @route   GET /api/admin/reports
 * @access  Private (Admin)
 */
exports.getAllReports = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const query = {};
  if (status && status !== 'all') {
    query.status = status;
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

  const reports = await Report.find(query)
    .populate('reporter', 'name email college trustScore')
    .populate('reportedUser', 'name email college trustScore isSuspended')
    .populate('item', 'title category images pricePerDay')
    .populate('resolvedBy', 'name')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit, 10));

  const total = await Report.countDocuments(query);

  sendSuccess(res, 200, 'Reports fetched for moderation', {
    reports,
    total,
    page: parseInt(page, 10),
    pages: Math.ceil(total / parseInt(limit, 10)),
  });
});

/**
 * @desc    Resolve or dismiss a student report
 * @route   PATCH /api/admin/reports/:id/resolve
 * @access  Private (Admin)
 */
exports.resolveReport = asyncHandler(async (req, res, next) => {
  const { status, resolutionNote, actionTaken } = req.body;

  if (!['resolved', 'dismissed', 'under_review'].includes(status)) {
    return next(new AppError('Invalid resolution status.', 400));
  }

  const report = await Report.findById(req.params.id)
    .populate('reporter', 'name')
    .populate('reportedUser', 'name email trustScore')
    .populate('item');

  if (!report) {
    return next(new AppError('Report not found', 404));
  }

  report.status = status;
  report.resolutionNote = resolutionNote || '';
  report.resolvedBy = req.user._id;
  await report.save();

  // If action was taken against reported user (e.g. penalty)
  if (actionTaken === 'penalty' && report.reportedUser) {
    await User.findByIdAndUpdate(report.reportedUser._id, {
      $inc: { trustScore: -10 },
    });
  } else if (actionTaken === 'deactivate_item' && report.item) {
    await Item.findByIdAndUpdate(report.item._id, {
      isActive: false,
    });
  }

  // Notify reporter
  await Notification.create({
    user: report.reporter._id,
    type: 'report_resolved',
    title: `Report ${status === 'resolved' ? 'Resolved ✅' : 'Updated'}`,
    message: `Your report regarding "${report.reason}" was reviewed by moderators: ${resolutionNote || 'Thank you for keeping CampusSwap safe.'}`,
    referenceId: report._id,
    referenceModel: 'Report',
  });

  sendSuccess(res, 200, `Report marked as ${status}`, { report });
});
