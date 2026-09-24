const Review = require('../models/Review');
const User = require('../models/User');
const Notification = require('../models/Notification');
const SkillSession = require('../models/SkillSession');
const RentalBooking = require('../models/RentalBooking');
const BarterRequest = require('../models/BarterRequest');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { recalculateTrustScore } = require('../utils/trustScoreCalculator');

/**
 * @desc    Submit a review and rating for a completed transaction
 * @route   POST /api/reviews
 * @access  Private
 */
exports.createReview = asyncHandler(async (req, res, next) => {
  const { reviewedUserId, type, referenceId, rating, comment } = req.body;

  if (!reviewedUserId || !type || !referenceId || !rating) {
    return next(new AppError('Reviewed user, type, reference transaction, and rating (1-5) are required.', 400));
  }

  if (String(reviewedUserId) === String(req.user._id)) {
    return next(new AppError('You cannot review yourself.', 400));
  }

  if (rating < 1 || rating > 5) {
    return next(new AppError('Rating must be between 1 and 5 stars.', 400));
  }

  // Check duplicate review for this transaction
  const existingReview = await Review.findOne({
    reviewer: req.user._id,
    referenceId,
  });

  if (existingReview) {
    return next(new AppError('You have already submitted a review for this transaction.', 400));
  }

  // Verify transaction status is completed
  if (type === 'skill') {
    const session = await SkillSession.findById(referenceId);
    if (!session || session.status !== 'completed') {
      return next(new AppError('Skill session must be completed before leaving a review.', 400));
    }
  } else if (type === 'rental') {
    const booking = await RentalBooking.findById(referenceId);
    if (!booking || booking.status !== 'completed') {
      return next(new AppError('Rental booking must be completed before leaving a review.', 400));
    }
  } else if (type === 'barter') {
    const barter = await BarterRequest.findById(referenceId);
    if (!barter || barter.status !== 'completed') {
      return next(new AppError('Barter exchange must be completed before leaving a review.', 400));
    }
  }

  // Create review
  const review = await Review.create({
    reviewer: req.user._id,
    reviewedUser: reviewedUserId,
    type,
    referenceId,
    rating: Number(rating),
    comment: comment || '',
  });

  // Automatically recalculate reviewed user's Trust Score in MongoDB Atlas
  const updatedTrustScore = await recalculateTrustScore(reviewedUserId);

  // Notify reviewed user
  await Notification.create({
    user: reviewedUserId,
    type: 'new_review',
    title: `New ${rating}★ Review Received! ⭐`,
    message: `${req.user.name} rated you ${rating} stars: "${comment ? comment.substring(0, 50) : 'Great transaction!'}"`,
    referenceId: review._id,
    referenceModel: 'Review',
  });

  const populated = await Review.findById(review._id)
    .populate('reviewer', 'name profileImage college trustScore')
    .populate('reviewedUser', 'name profileImage college trustScore');

  sendSuccess(res, 201, 'Review submitted successfully!', {
    review: populated,
    updatedTrustScore,
  });
});

/**
 * @desc    Get all reviews received by a student
 * @route   GET /api/reviews/user/:userId
 * @access  Public / Authenticated
 */
exports.getUserReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ reviewedUser: req.params.userId })
    .populate('reviewer', 'name profileImage college branch year trustScore')
    .sort({ createdAt: -1 });

  const total = reviews.length;
  const averageRating = total > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / total).toFixed(1) : 0;

  sendSuccess(res, 200, 'User reviews fetched', {
    reviews,
    total,
    averageRating,
  });
});

/**
 * @desc    Get reviews written by current user
 * @route   GET /api/reviews/my-reviews
 * @access  Private
 */
exports.getMyGivenReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ reviewer: req.user._id })
    .populate('reviewedUser', 'name profileImage college branch trustScore')
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, 'Your submitted reviews fetched', { reviews });
});
