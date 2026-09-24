const BarterRequest = require('../models/BarterRequest');
const Item = require('../models/Item');
const Skill = require('../models/Skill');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Propose a skill-for-item barter exchange
 * @route   POST /api/barter
 * @access  Private
 */
exports.createBarterRequest = asyncHandler(async (req, res, next) => {
  const {
    receiverId,
    requestedItemId,
    offeredSkillId,
    numberOfSessions = 1,
    duration = 7,
    startDate,
    endDate,
    message,
  } = req.body;

  if (!requestedItemId || !offeredSkillId) {
    return next(new AppError('Both the requested item and offered skill are required.', 400));
  }

  // Verify item
  const item = await Item.findById(requestedItemId);
  if (!item || !item.isActive) {
    return next(new AppError('Item is not available for barter.', 404));
  }

  // Prevent proposing barter on own item
  if (String(item.owner) === String(req.user._id)) {
    return next(new AppError('You cannot propose a barter exchange on your own item.', 400));
  }

  // Verify skill exists
  const skill = await Skill.findById(offeredSkillId);
  if (!skill) {
    return next(new AppError('Offered skill not found.', 404));
  }

  const receiver = receiverId || item.owner;

  // Check if pending barter request already exists for this item by this proposer
  const existingPending = await BarterRequest.findOne({
    proposer: req.user._id,
    requestedItem: requestedItemId,
    status: 'pending',
  });

  if (existingPending) {
    return next(
      new AppError('You already have a pending barter proposal for this item with the owner.', 400)
    );
  }

  const barter = await BarterRequest.create({
    proposer: req.user._id,
    receiver,
    offeredSkill: offeredSkillId,
    numberOfSessions: Math.max(1, parseInt(numberOfSessions, 10)),
    requestedItem: requestedItemId,
    duration: Math.max(1, parseInt(duration, 10)),
    startDate: startDate ? new Date(startDate) : undefined,
    endDate: endDate ? new Date(endDate) : undefined,
    message: message || '',
    status: 'pending',
  });

  // Notify item owner
  await Notification.create({
    user: receiver,
    type: 'barter_request',
    title: 'New Skill ↔ Item Barter Proposal! ⭐',
    message: `${req.user.name} proposed to teach ${numberOfSessions} session(s) of "${skill.name}" in exchange for using your "${item.title}" for ${duration} days.`,
    referenceId: barter._id,
    referenceModel: 'BarterRequest',
  });

  const populated = await BarterRequest.findById(barter._id)
    .populate('proposer', 'name college branch year profileImage trustScore')
    .populate('receiver', 'name college branch year profileImage trustScore')
    .populate('offeredSkill', 'name category')
    .populate('requestedItem', 'title category images pricePerDay securityDeposit location');

  sendSuccess(res, 201, 'Skill-for-item barter proposal submitted to owner!', { barter: populated });
});

/**
 * @desc    Get barter proposals received by current user (as item owner)
 * @route   GET /api/barter/received
 * @access  Private
 */
exports.getReceivedBarterRequests = asyncHandler(async (req, res) => {
  const barters = await BarterRequest.find({ receiver: req.user._id })
    .populate('proposer', 'name college branch year profileImage trustScore bio phone location')
    .populate('offeredSkill', 'name category')
    .populate('requestedItem', 'title category images pricePerDay securityDeposit location condition')
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, 'Received barter proposals fetched', { barters });
});

/**
 * @desc    Get barter proposals sent by current user (as proposer)
 * @route   GET /api/barter/sent
 * @access  Private
 */
exports.getSentBarterRequests = asyncHandler(async (req, res) => {
  const barters = await BarterRequest.find({ proposer: req.user._id })
    .populate('receiver', 'name college branch year profileImage trustScore bio phone location')
    .populate('offeredSkill', 'name category')
    .populate('requestedItem', 'title category images pricePerDay securityDeposit location condition')
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, 'Sent barter proposals fetched', { barters });
});

/**
 * @desc    Get single barter request by ID
 * @route   GET /api/barter/:id
 * @access  Private
 */
exports.getBarterById = asyncHandler(async (req, res, next) => {
  const barter = await BarterRequest.findById(req.params.id)
    .populate('proposer', 'name college branch year profileImage trustScore bio phone location')
    .populate('receiver', 'name college branch year profileImage trustScore bio phone location')
    .populate('offeredSkill', 'name category')
    .populate('requestedItem', 'title category images pricePerDay securityDeposit location condition');

  if (!barter) {
    return next(new AppError('Barter proposal not found', 404));
  }

  sendSuccess(res, 200, 'Barter details fetched', { barter });
});

/**
 * @desc    Update barter status (Accept, Reject, Active, Complete)
 * @route   PATCH /api/barter/:id/status
 * @access  Private
 */
exports.updateBarterStatus = asyncHandler(async (req, res, next) => {
  const { status, rejectionReason } = req.body;

  const validStatuses = ['accepted', 'rejected', 'active', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid barter status.', 400));
  }

  const barter = await BarterRequest.findById(req.params.id)
    .populate('requestedItem', 'title')
    .populate('offeredSkill', 'name')
    .populate('proposer', 'name')
    .populate('receiver', 'name');

  if (!barter) {
    return next(new AppError('Barter proposal not found', 404));
  }

  const isReceiver = String(barter.receiver._id) === String(req.user._id);
  const isProposer = String(barter.proposer._id) === String(req.user._id);

  if (!isReceiver && !isProposer && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to update this barter.', 403));
  }

  // Only receiver can accept/reject
  if (['accepted', 'rejected'].includes(status) && !isReceiver) {
    return next(new AppError('Only the item owner can accept or reject this barter.', 403));
  }

  barter.status = status;
  if (rejectionReason) barter.rejectionReason = rejectionReason;
  await barter.save();

  // Notifications & Trust Score updates
  if (status === 'accepted') {
    await Notification.create({
      user: barter.proposer._id,
      type: 'barter_accepted',
      title: 'Skill Barter Accepted! ⭐🎉',
      message: `${req.user.name} accepted your barter proposal! You will teach ${barter.numberOfSessions} session(s) of ${barter.offeredSkill?.name} in exchange for ${barter.requestedItem?.title}.`,
      referenceId: barter._id,
      referenceModel: 'BarterRequest',
    });
  } else if (status === 'rejected') {
    await Notification.create({
      user: barter.proposer._id,
      type: 'barter_rejected',
      title: 'Barter Proposal Declined',
      message: `Your barter proposal for "${barter.requestedItem?.title}" was declined.`,
      referenceId: barter._id,
      referenceModel: 'BarterRequest',
    });
  } else if (status === 'completed') {
    // Both users successfully completed a signature barter exchange
    // Boost trust score by +3 and increment stats.completedBarters
    await User.findByIdAndUpdate(barter.proposer._id, {
      $inc: { 'stats.completedBarters': 1, trustScore: 3 },
    });
    await User.findByIdAndUpdate(barter.receiver._id, {
      $inc: { 'stats.completedBarters': 1, trustScore: 3 },
    });

    await Notification.create({
      user: barter.proposer._id,
      type: 'barter_completed',
      title: 'Barter Completed Successfully! ⭐',
      message: `Barter exchange for "${barter.requestedItem?.title}" is complete. Leave a review for ${barter.receiver.name}!`,
      referenceId: barter._id,
      referenceModel: 'BarterRequest',
    });

    await Notification.create({
      user: barter.receiver._id,
      type: 'barter_completed',
      title: 'Barter Completed Successfully! ⭐',
      message: `Barter exchange for "${barter.requestedItem?.title}" is complete. Leave a review for ${barter.proposer.name}!`,
      referenceId: barter._id,
      referenceModel: 'BarterRequest',
    });
  }

  const updated = await BarterRequest.findById(req.params.id)
    .populate('proposer', 'name college branch year profileImage trustScore')
    .populate('receiver', 'name college branch year profileImage trustScore')
    .populate('offeredSkill', 'name category')
    .populate('requestedItem', 'title category images pricePerDay securityDeposit location');

  sendSuccess(res, 200, `Barter status updated to ${status}`, { barter: updated });
});

/**
 * @desc    Cancel a sent barter proposal (Proposer only)
 * @route   PATCH /api/barter/:id/cancel
 * @access  Private
 */
exports.cancelBarter = asyncHandler(async (req, res, next) => {
  const barter = await BarterRequest.findById(req.params.id);

  if (!barter) {
    return next(new AppError('Barter proposal not found', 404));
  }

  if (String(barter.proposer) !== String(req.user._id)) {
    return next(new AppError('You can only cancel barter proposals you created.', 403));
  }

  if (barter.status !== 'pending') {
    return next(new AppError(`Cannot cancel barter that is already ${barter.status}.`, 400));
  }

  barter.status = 'cancelled';
  await barter.save();

  sendSuccess(res, 200, 'Barter proposal cancelled', { barter });
});
