const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const { protect } = require('../middleware/auth');

router.use(protect); // All rental booking operations require auth

router.post('/', rentalController.createBooking);
router.get('/owner-bookings', rentalController.getOwnerBookings);
router.get('/my-bookings', rentalController.getMyBookings);
router.patch('/:id/status', rentalController.updateBookingStatus);

module.exports = router;
