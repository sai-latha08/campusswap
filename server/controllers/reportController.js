const Report = require('../models/Report');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Submit a new user or item report
 * @route   POST /api/reports
 * @access  Private
 */
exports.createReport = asyncHandler(async (req, res, next) => {
  const { reportedUserId, itemId, reason, description } = req.body;

  if (!reason) {
    return next(new AppError('A valid report reason is required.', 400));
  }

  if (!reportedUserId && !itemId) {
    return next(new AppError('Must specify either a reported user or item.', 400));
  }

  if (reportedUserId && String(reportedUserId) === String(req.user._id)) {
    return next(new AppError('You cannot report yourself.', 400));
  }

  const report = await Report.create({
    reporter: req.user._id,
    reportedUser: reportedUserId || undefined,
    item: itemId || undefined,
    reason,
    description: description || '',
    status: 'open',
  });

  sendSuccess(res, 201, 'Report submitted to campus moderation team.', { report });
});

/**
 * @desc    Get reports submitted by current user
 * @route   GET /api/reports/my-reports
 * @access  Private
 */
exports.getMyReports = asyncHandler(async (req, res) => {
  const reports = await Report.find({ reporter: req.user._id })
    .populate('reportedUser', 'name email college')
    .populate('item', 'title category')
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, 'Your submitted reports fetched', { reports });
});
