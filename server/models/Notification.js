const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'skill_request',
        'skill_request_accepted',
        'skill_request_rejected',
        'skill_session_scheduled',
        'skill_session_reminder',
        'skill_session_completed',
        'rental_request',
        'rental_approved',
        'rental_rejected',
        'rental_active',
        'rental_completed',
        'rental_ending_soon',
        'barter_request',
        'barter_accepted',
        'barter_rejected',
        'barter_completed',
        'new_message',
        'new_review',
        'trust_score_updated',
        'account_suspended',
        'report_resolved',
      ],
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    referenceModel: {
      type: String,
      enum: ['SkillRequest', 'SkillSession', 'RentalBooking', 'BarterRequest', 'Message', 'Review', 'Report'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
