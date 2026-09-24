const Message = require('../models/Message');
const User = require('../models/User');
const Notification = require('../models/Notification');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Get list of all conversations for current user with latest message & unread count
 * @route   GET /api/messages/conversations
 * @access  Private
 */
exports.getConversations = asyncHandler(async (req, res) => {
  const currentUserId = String(req.user._id);

  // Find all messages involving current user
  const messages = await Message.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }],
  })
    .populate('sender', 'name profileImage college branch trustScore')
    .populate('receiver', 'name profileImage college branch trustScore')
    .sort({ createdAt: -1 });

  // Group by conversationId
  const conversationMap = new Map();

  for (const msg of messages) {
    if (!conversationMap.has(msg.conversationId)) {
      const isSender = String(msg.sender._id) === currentUserId;
      const partner = isSender ? msg.receiver : msg.sender;

      // Count unread messages where current user is the receiver
      const unreadCount = await Message.countDocuments({
        conversationId: msg.conversationId,
        receiver: req.user._id,
        read: false,
      });

      conversationMap.set(msg.conversationId, {
        conversationId: msg.conversationId,
        partner,
        latestMessage: msg.message,
        latestMessageTime: msg.createdAt,
        unreadCount,
      });
    }
  }

  const conversations = Array.from(conversationMap.values());

  sendSuccess(res, 200, 'Conversations fetched', { conversations });
});

/**
 * @desc    Get message history between current user and a partner
 * @route   GET /api/messages/:partnerId
 * @access  Private
 */
exports.getMessagesWithPartner = asyncHandler(async (req, res, next) => {
  const partnerId = req.params.partnerId;

  const partner = await User.findById(partnerId)
    .select('name profileImage college branch year trustScore bio location');

  if (!partner) {
    return next(new AppError('User not found', 404));
  }

  const conversationId = [String(req.user._id), String(partnerId)].sort().join('_');

  const messages = await Message.find({ conversationId })
    .populate('sender', 'name profileImage')
    .populate('receiver', 'name profileImage')
    .sort({ createdAt: 1 });

  // Mark unread messages as read
  await Message.updateMany(
    { conversationId, receiver: req.user._id, read: false },
    { $set: { read: true } }
  );

  sendSuccess(res, 200, 'Messages fetched', {
    partner,
    conversationId,
    messages,
  });
});

/**
 * @desc    Send a message via REST API
 * @route   POST /api/messages
 * @access  Private
 */
exports.sendMessage = asyncHandler(async (req, res, next) => {
  const { receiverId, message, attachments } = req.body;

  if (!receiverId || !message) {
    return next(new AppError('Receiver and message text are required.', 400));
  }

  if (String(receiverId) === String(req.user._id)) {
    return next(new AppError('You cannot send a message to yourself.', 400));
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    return next(new AppError('Receiver student not found.', 404));
  }

  const conversationId = [String(req.user._id), String(receiverId)].sort().join('_');

  const newMessage = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    conversationId,
    message: message.trim(),
    attachments: attachments || [],
    read: false,
  });

  const populated = await Message.findById(newMessage._id)
    .populate('sender', 'name profileImage college trustScore')
    .populate('receiver', 'name profileImage college trustScore');

  sendSuccess(res, 201, 'Message sent', { message: populated });
});

/**
 * @desc    Mark all messages in a conversation as read
 * @route   PATCH /api/messages/read/:partnerId
 * @access  Private
 */
exports.markAsRead = asyncHandler(async (req, res) => {
  const partnerId = req.params.partnerId;
  const conversationId = [String(req.user._id), String(partnerId)].sort().join('_');

  await Message.updateMany(
    { conversationId, receiver: req.user._id, read: false },
    { $set: { read: true } }
  );

  sendSuccess(res, 200, 'Messages marked as read');
});
