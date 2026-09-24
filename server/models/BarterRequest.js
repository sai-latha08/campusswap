const mongoose = require('mongoose');

const barterRequestSchema = new mongoose.Schema(
  {
    proposer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    offeredSkill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    numberOfSessions: {
      type: Number,
      required: true,
      min: 1,
    },
    requestedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    duration: {
      type: Number, // days
      required: [true, 'Duration in days is required'],
      min: 1,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    message: {
      type: String,
      maxlength: [1000, 'Message too long'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    proposerReviewed: {
      type: Boolean,
      default: false,
    },
    receiverReviewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BarterRequest', barterRequestSchema);
