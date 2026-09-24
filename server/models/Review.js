const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['skill', 'rental', 'barter'],
      required: true,
    },
    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      // Points to SkillSession, RentalBooking, or BarterRequest depending on type
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      maxlength: [1000, 'Comment too long'],
      default: '',
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews for the same transaction by the same reviewer
reviewSchema.index({ reviewer: 1, referenceId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
