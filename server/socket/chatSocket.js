const Message = require('../models/Message');
const Notification = require('../models/Notification');
const User = require('../models/User');

// In-memory map of active connected users: userId -> Set of socketIds
const onlineUsers = new Map();

function initChatSocket(io) {
  io.on('connection', (socket) => {
    let currentUserId = null;

    // ─── 1. User Authentication & Online Status ─────────────────────────────
    socket.on('authenticate', (userId) => {
      if (!userId) return;
      currentUserId = String(userId);

      if (!onlineUsers.has(currentUserId)) {
        onlineUsers.set(currentUserId, new Set());
      }
      onlineUsers.get(currentUserId).add(socket.id);

      // Join a personal user room for direct user notifications
      socket.join(`user_${currentUserId}`);

      // Broadcast list of currently online user IDs
      io.emit('online_users', Array.from(onlineUsers.keys()));
    });

    // ─── 2. Join Conversation Room ──────────────────────────────────────────
    socket.on('join_conversation', ({ conversationId }) => {
      if (conversationId) {
        socket.join(conversationId);
      }
    });

    // Leave conversation room
    socket.on('leave_conversation', ({ conversationId }) => {
      if (conversationId) {
        socket.leave(conversationId);
      }
    });

    // ─── 3. Send Real-time Message ──────────────────────────────────────────
    socket.on('send_message', async (data) => {
      try {
        const { senderId, receiverId, message, attachments } = data;
        if (!senderId || !receiverId || !message) return;

        const conversationId = [String(senderId), String(receiverId)].sort().join('_');

        // Save to MongoDB Atlas
        const newMessage = await Message.create({
          sender: senderId,
          receiver: receiverId,
          conversationId,
          message: message.trim(),
          attachments: attachments || [],
          read: false,
        });

        const populated = await Message.findById(newMessage._id)
          .populate('sender', 'name profileImage college trustScore')
          .populate('receiver', 'name profileImage college trustScore');

        // Emit to everyone in the conversation room
        io.to(conversationId).emit('new_message', populated);

        // Also emit a conversation update to receiver's private room
        io.to(`user_${receiverId}`).emit('message_received', {
          conversationId,
          message: populated,
        });

        // Create notification if receiver is not in the room
        const isReceiverOnline = onlineUsers.has(String(receiverId));
        if (!isReceiverOnline) {
          const senderUser = await User.findById(senderId).select('name');
          await Notification.create({
            user: receiverId,
            type: 'new_message',
            title: `New message from ${senderUser?.name || 'a student'}`,
            message: message.length > 50 ? `${message.substring(0, 50)}...` : message,
            referenceId: newMessage._id,
            referenceModel: 'Message',
          });
        }
      } catch (err) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // ─── 4. Typing Indicators ───────────────────────────────────────────────
    socket.on('typing', ({ conversationId, userId, userName }) => {
      socket.to(conversationId).emit('user_typing', { userId, userName, conversationId });
    });

    socket.on('stop_typing', ({ conversationId, userId }) => {
      socket.to(conversationId).emit('user_stop_typing', { userId, conversationId });
    });

    // ─── 5. Read Receipt ───────────────────────────────────────────────────
    socket.on('mark_read', async ({ conversationId, userId }) => {
      try {
        await Message.updateMany(
          { conversationId, receiver: userId, read: false },
          { $set: { read: true } }
        );
        socket.to(conversationId).emit('messages_read', { conversationId, readBy: userId });
      } catch (_) {}
    });

    // ─── 6. Disconnect Handler ──────────────────────────────────────────────
    socket.on('disconnect', () => {
      if (currentUserId && onlineUsers.has(currentUserId)) {
        const userSockets = onlineUsers.get(currentUserId);
        userSockets.delete(socket.id);
        if (userSockets.size === 0) {
          onlineUsers.delete(currentUserId);
        }
        io.emit('online_users', Array.from(onlineUsers.keys()));
      }
    });
  });
}

module.exports = { initChatSocket, onlineUsers };
