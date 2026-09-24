const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      enum: [
        'Spam',
        'Inappropriate Content',
        'Fake Listing',
        'Scam',
        'Harassment',
        'Misleading Information',
        'Item Damage',
        'Non-delivery',
        'Other',
      ],
    },
    description: {
      type: String,
      maxlength: [2000, 'Description too long'],
      default: '',
    },
    status: {
      type: String,
      enum: ['open', 'under_review', 'resolved', 'dismissed'],
      default: 'open',
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    resolutionNote: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Report', reportSchema);
