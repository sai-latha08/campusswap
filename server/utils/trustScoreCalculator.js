const User = require('../models/User');
const Review = require('../models/Review');
const Report = require('../models/Report');

/**
 * Re-computes and saves a student's un-tamperable Trust Score (0 - 100)
 * 
 * Formula:
 * - Base = 50
 * - Email Verified = +10
 * - College Domain Verified = +10
 * - Completed Skill Sessions = +2 per session (up to +15)
 * - Completed Rentals = +2 per rental (up to +15)
 * - Completed Barters = +3 per barter (up to +15)
 * - Ratings bonus/penalty:
 *     - If user has reviews: (AverageRating - 3.0) * 8
 * - Reports penalty = -15 per resolved/actionable report
 * 
 * Clamped between 0 and 100.
 */
async function recalculateTrustScore(userId) {
  try {
    const user = await User.findById(userId);
    if (!user) return 50;

    let score = 50;

    // 1. Verification
    if (user.isEmailVerified) score += 10;
    if (user.isVerified) score += 10;

    // 2. Completed Transaction Metrics
    const skillSessions = user.stats?.completedSkillSessions || 0;
    const rentals = user.stats?.completedRentals || 0;
    const barters = user.stats?.completedBarters || 0;

    score += Math.min(15, skillSessions * 2);
    score += Math.min(15, rentals * 2);
    score += Math.min(15, barters * 3);

    // 3. Average Rating
    const reviews = await Review.find({ reviewedUser: userId });
    if (reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      const avg = sum / reviews.length;
      user.stats.totalRatingsReceived = reviews.length;
      user.stats.sumOfRatings = sum;

      const ratingDelta = (avg - 3.0) * 8; // e.g. 5.0 -> +16, 4.0 -> +8, 2.0 -> -8
      score += Math.round(ratingDelta);
    }

    // 4. Reports Penalty
    const reportsCount = await Report.countDocuments({
      reportedUser: userId,
      status: { $in: ['resolved', 'under_review'] },
    });
    user.stats.reportsReceived = reportsCount;
    score -= reportsCount * 15;

    // Clamp between 0 and 100
    const finalScore = Math.max(0, Math.min(100, Math.round(score)));
    user.trustScore = finalScore;

    await user.save();
    return finalScore;
  } catch (error) {
    console.error('Error recalculating trust score:', error.message);
    return 50;
  }
}

module.exports = { recalculateTrustScore };
