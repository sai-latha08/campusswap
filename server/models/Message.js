const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // conversationId = sorted join of sender+receiver ObjectIds (ensures uniqueness)
    conversationId: {
      type: String,
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Message cannot be empty'],
      maxlength: [2000, 'Message too long'],
    },
    attachments: [
      {
        url: String,
        type: { type: String, enum: ['image', 'file'] },
        name: String,
      },
    ],
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
