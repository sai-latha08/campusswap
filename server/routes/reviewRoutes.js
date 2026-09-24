const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/user/:userId', reviewController.getUserReviews);
router.get('/my-reviews', protect, reviewController.getMyGivenReviews);
router.post('/', protect, reviewController.createReview);

module.exports = router;
