const SkillRequest = require('../models/SkillRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Send a new skill exchange request to a student teacher
 * @route   POST /api/skill-requests
 * @access  Private
 */
exports.createRequest = asyncHandler(async (req, res, next) => {
  const { teacherId, skillId, skillOfferedId, preferredMode, preferredTime, description } = req.body;

  if (!teacherId || !skillId) {
    return next(new AppError('Teacher and Skill are required.', 400));
  }

  if (String(teacherId) === String(req.user._id)) {
    return next(new AppError('You cannot send a skill exchange request to yourself.', 400));
  }

  // Verify teacher exists
  const teacher = await User.findById(teacherId);
  if (!teacher) {
    return next(new AppError('Teacher not found.', 404));
  }

  // Check if active pending request already exists
  const existingPending = await SkillRequest.findOne({
    requester: req.user._id,
    teacher: teacherId,
    skill: skillId,
    status: 'pending',
  });

  if (existingPending) {
    return next(new AppError('You already have a pending request with this mentor for this skill.', 400));
  }

  const skillRequest = await SkillRequest.create({
    requester: req.user._id,
    teacher: teacherId,
    skill: skillId,
    skillOffered: skillOfferedId || undefined,
    preferredMode: preferredMode || 'both',
    preferredTime: preferredTime || '',
    description: description || '',
    status: 'pending',
  });

  // Create in-app notification for the teacher
  await Notification.create({
    user: teacherId,
    type: 'skill_request',
    title: 'New Skill Exchange Request',
    message: `${req.user.name} sent you a request to learn from you!`,
    referenceId: skillRequest._id,
    referenceModel: 'SkillRequest',
  });

  const populated = await SkillRequest.findById(skillRequest._id)
    .populate('requester', 'name college branch year profileImage trustScore')
    .populate('teacher', 'name college branch year profileImage trustScore')
    .populate('skill', 'name category')
    .populate('skillOffered', 'name category');

  sendSuccess(res, 201, 'Skill request sent successfully', { skillRequest: populated });
});

/**
 * @desc    Get skill requests received by current user (as teacher)
 * @route   GET /api/skill-requests/received
 * @access  Private
 */
exports.getReceivedRequests = asyncHandler(async (req, res) => {
  const requests = await SkillRequest.find({ teacher: req.user._id })
    .populate('requester', 'name college branch year profileImage trustScore bio location')
    .populate('skill', 'name category')
    .populate('skillOffered', 'name category')
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, 'Received skill requests fetched', { requests });
});

/**
 * @desc    Get skill requests sent by current user (as learner)
 * @route   GET /api/skill-requests/sent
 * @access  Private
 */
exports.getSentRequests = asyncHandler(async (req, res) => {
  const requests = await SkillRequest.find({ requester: req.user._id })
    .populate('teacher', 'name college branch year profileImage trustScore bio location')
    .populate('skill', 'name category')
    .populate('skillOffered', 'name category')
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, 'Sent skill requests fetched', { requests });
});

/**
 * @desc    Accept or reject a skill request (Teacher only)
 * @route   PATCH /api/skill-requests/:id/status
 * @access  Private
 */
exports.updateRequestStatus = asyncHandler(async (req, res, next) => {
  const { status, rejectionReason } = req.body;

  if (!['accepted', 'rejected'].includes(status)) {
    return next(new AppError('Status must be either accepted or rejected.', 400));
  }

  const skillRequest = await SkillRequest.findById(req.params.id)
    .populate('skill', 'name')
    .populate('teacher', 'name');

  if (!skillRequest) {
    return next(new AppError('Skill request not found', 404));
  }

  // Only the assigned teacher can accept/reject
  if (String(skillRequest.teacher._id) !== String(req.user._id)) {
    return next(new AppError('Only the requested mentor can respond to this request.', 403));
  }

  if (skillRequest.status !== 'pending') {
    return next(new AppError(`Request has already been ${skillRequest.status}.`, 400));
  }

  skillRequest.status = status;
  if (status === 'rejected' && rejectionReason) {
    skillRequest.rejectionReason = rejectionReason;
  }
  await skillRequest.save();

  // Notify the learner
  await Notification.create({
    user: skillRequest.requester,
    type: status === 'accepted' ? 'skill_request_accepted' : 'skill_request_rejected',
    title: `Skill Request ${status === 'accepted' ? 'Accepted! 🎉' : 'Declined'}`,
    message: `${req.user.name} has ${status} your request for ${skillRequest.skill?.name}.`,
    referenceId: skillRequest._id,
    referenceModel: 'SkillRequest',
  });

  const updated = await SkillRequest.findById(req.params.id)
    .populate('requester', 'name college branch year profileImage trustScore')
    .populate('teacher', 'name college branch year profileImage trustScore')
    .populate('skill', 'name category')
    .populate('skillOffered', 'name category');

  sendSuccess(res, 200, `Skill request ${status}`, { skillRequest: updated });
});

/**
 * @desc    Cancel a sent skill request (Learner only)
 * @route   PATCH /api/skill-requests/:id/cancel
 * @access  Private
 */
exports.cancelRequest = asyncHandler(async (req, res, next) => {
  const skillRequest = await SkillRequest.findById(req.params.id);

  if (!skillRequest) {
    return next(new AppError('Skill request not found', 404));
  }

  if (String(skillRequest.requester) !== String(req.user._id)) {
    return next(new AppError('You can only cancel requests you created.', 403));
  }

  if (skillRequest.status !== 'pending') {
    return next(new AppError(`Cannot cancel request that is already ${skillRequest.status}.`, 400));
  }

  skillRequest.status = 'cancelled';
  await skillRequest.save();

  sendSuccess(res, 200, 'Skill request cancelled', { skillRequest });
});
