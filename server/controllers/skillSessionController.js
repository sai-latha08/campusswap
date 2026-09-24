const SkillSession = require('../models/SkillSession');
const SkillRequest = require('../models/SkillRequest');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Schedule a 1-on-1 skill session with anti-overlap check
 * @route   POST /api/skill-sessions
 * @access  Private
 */
exports.scheduleSession = asyncHandler(async (req, res, next) => {
  const {
    skillRequestId,
    teacherId,
    learnerId,
    skillId,
    date,
    startTime,
    endTime,
    mode,
    meetingLink,
    location,
    notes,
  } = req.body;

  if (!skillId || !date || !startTime || !endTime) {
    return next(new AppError('Skill, Date, Start Time, and End Time are required.', 400));
  }

  // Derive teacher and learner IDs
  let actualTeacher = teacherId;
  let actualLearner = learnerId;

  if (skillRequestId) {
    const request = await SkillRequest.findById(skillRequestId);
    if (!request) {
      return next(new AppError('Skill request not found', 404));
    }
    actualTeacher = request.teacher;
    actualLearner = request.requester;
  } else {
    // Current user is either teacher or learner
    if (!actualTeacher && !actualLearner) {
      return next(new AppError('Both teacher and learner must be specified.', 400));
    }
  }

  // Parse session date to start-of-day for overlap querying
  const sessionDate = new Date(date);
  const startOfDay = new Date(sessionDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(sessionDate.setHours(23, 59, 59, 999));

  // ─── ANTI-OVERLAP VALIDATION ──────────────────────────────────────────────
  // Check if teacher already has a conflicting scheduled session at this date & time
  const teacherConflict = await SkillSession.findOne({
    teacher: actualTeacher,
    status: 'scheduled',
    date: { $gte: startOfDay, $lte: endOfDay },
    $or: [
      // Starts during another session
      { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
      // Ends during another session
      { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
      // Encompasses another session
      { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
    ],
  });

  if (teacherConflict) {
    return next(
      new AppError(
        `Scheduling conflict: The mentor already has a scheduled session between ${teacherConflict.startTime} and ${teacherConflict.endTime} on this day.`,
        400
      )
    );
  }

  // Check if learner already has a conflicting scheduled session
  const learnerConflict = await SkillSession.findOne({
    learner: actualLearner,
    status: 'scheduled',
    date: { $gte: startOfDay, $lte: endOfDay },
    $or: [
      { startTime: { $lte: startTime }, endTime: { $gt: startTime } },
      { startTime: { $lt: endTime }, endTime: { $gte: endTime } },
      { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
    ],
  });

  if (learnerConflict) {
    return next(
      new AppError(
        `Scheduling conflict: The student already has another session between ${learnerConflict.startTime} and ${learnerConflict.endTime} on this day.`,
        400
      )
    );
  }

  // Create session
  const session = await SkillSession.create({
    teacher: actualTeacher,
    learner: actualLearner,
    skill: skillId,
    skillRequest: skillRequestId || undefined,
    date: new Date(date),
    startTime,
    endTime,
    mode: mode || 'online',
    meetingLink: meetingLink || (mode === 'online' ? 'https://meet.google.com/new' : ''),
    location: location || '',
    notes: notes || '',
    status: 'scheduled',
  });

  // Notify the other party
  const recipientId = String(req.user._id) === String(actualTeacher) ? actualLearner : actualTeacher;
  await Notification.create({
    user: recipientId,
    type: 'skill_session_scheduled',
    title: 'Skill Session Scheduled 📅',
    message: `${req.user.name} scheduled a 1-on-1 session for ${startTime} on ${new Date(date).toLocaleDateString()}.`,
    referenceId: session._id,
    referenceModel: 'SkillSession',
  });

  const populated = await SkillSession.findById(session._id)
    .populate('teacher', 'name college branch year profileImage trustScore')
    .populate('learner', 'name college branch year profileImage trustScore')
    .populate('skill', 'name category');

  sendSuccess(res, 201, 'Skill session successfully scheduled!', { session: populated });
});

/**
 * @desc    Get user's skill sessions (as teacher or learner)
 * @route   GET /api/skill-sessions
 * @access  Private
 */
exports.getMySessions = asyncHandler(async (req, res) => {
  const { status, type } = req.query;
  const query = {
    $or: [{ teacher: req.user._id }, { learner: req.user._id }],
  };

  if (status) {
    query.status = status;
  }

  if (type === 'teaching') {
    query.teacher = req.user._id;
    delete query.$or;
  } else if (type === 'learning') {
    query.learner = req.user._id;
    delete query.$or;
  }

  const sessions = await SkillSession.find(query)
    .populate('teacher', 'name college branch year profileImage trustScore bio')
    .populate('learner', 'name college branch year profileImage trustScore bio')
    .populate('skill', 'name category')
    .sort({ date: 1, startTime: 1 });

  sendSuccess(res, 200, 'Skill sessions fetched', { sessions });
});

/**
 * @desc    Update session status (complete or cancel)
 * @route   PATCH /api/skill-sessions/:id/status
 * @access  Private
 */
exports.updateSessionStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  if (!['completed', 'cancelled', 'no-show'].includes(status)) {
    return next(new AppError('Invalid status update.', 400));
  }

  const session = await SkillSession.findById(req.params.id)
    .populate('skill', 'name')
    .populate('teacher', 'name')
    .populate('learner', 'name');

  if (!session) {
    return next(new AppError('Session not found', 404));
  }

  // Must be participant
  const isTeacher = String(session.teacher._id) === String(req.user._id);
  const isLearner = String(session.learner._id) === String(req.user._id);

  if (!isTeacher && !isLearner) {
    return next(new AppError('You are not a participant in this session.', 403));
  }

  session.status = status;
  await session.save();

  // If marked completed, update teacher & learner stats and trust score
  if (status === 'completed') {
    await User.findByIdAndUpdate(session.teacher._id, {
      $inc: { 'stats.completedSkillSessions': 1, trustScore: 2 },
    });
    await User.findByIdAndUpdate(session.learner._id, {
      $inc: { trustScore: 1 },
    });

    // Notify both parties to leave a review
    const otherUser = isTeacher ? session.learner : session.teacher;
    await Notification.create({
      user: otherUser._id,
      type: 'skill_session_completed',
      title: 'Session Completed 🎉',
      message: `Your session on ${session.skill?.name} is complete. Rate your peer to build campus trust!`,
      referenceId: session._id,
      referenceModel: 'SkillSession',
    });
  }

  const updated = await SkillSession.findById(req.params.id)
    .populate('teacher', 'name college branch year profileImage trustScore')
    .populate('learner', 'name college branch year profileImage trustScore')
    .populate('skill', 'name category');

  sendSuccess(res, 200, `Session marked as ${status}`, { session: updated });
});
