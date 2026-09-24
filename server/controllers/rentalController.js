const RentalBooking = require('../models/RentalBooking');
const Item = require('../models/Item');
const Notification = require('../models/Notification');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Request a new rental booking with anti-overlap date validation
 * @route   POST /api/rentals
 * @access  Private
 */
exports.createBooking = asyncHandler(async (req, res, next) => {
  const { itemId, startDate, endDate, renterNote } = req.body;

  if (!itemId || !startDate || !endDate) {
    return next(new AppError('Item ID, start date, and end date are required.', 400));
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start >= end) {
    return next(new AppError('End date must be after start date.', 400));
  }

  // Verify item exists
  const item = await Item.findById(itemId);
  if (!item || !item.isActive) {
    return next(new AppError('Item not available for rent.', 404));
  }

  // Prevent renting own item
  if (String(item.owner) === String(req.user._id)) {
    return next(new AppError('You cannot rent your own item.', 400));
  }

  // ─── CRITICAL: ANTI-OVERLAP BOOKING ENGINE ────────────────────────────────
  // Check if there is already an approved or active booking overlapping these dates
  const overlappingBooking = await RentalBooking.findOne({
    item: itemId,
    status: { $in: ['approved', 'active'] },
    $or: [
      // Starts during an existing booking
      { startDate: { $lte: start }, endDate: { $gt: start } },
      // Ends during an existing booking
      { startDate: { $lt: end }, endDate: { $gte: end } },
      // Encompasses an existing booking
      { startDate: { $gte: start }, endDate: { $lte: end } },
    ],
  });

  if (overlappingBooking) {
    return next(
      new AppError(
        `Dates unavailable: This item is already booked from ${new Date(overlappingBooking.startDate).toLocaleDateString()} to ${new Date(overlappingBooking.endDate).toLocaleDateString()}. Please select different dates.`,
        400
      )
    );
  }

  // Calculate pricing
  const totalDays = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
  let totalAmount = 0;

  if (totalDays >= 7 && item.pricePerWeek > 0) {
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;
    totalAmount = weeks * item.pricePerWeek + remDays * item.pricePerDay;
  } else {
    totalAmount = totalDays * item.pricePerDay;
  }

  const booking = await RentalBooking.create({
    item: itemId,
    owner: item.owner,
    renter: req.user._id,
    startDate: start,
    endDate: end,
    totalDays,
    totalAmount,
    securityDeposit: item.securityDeposit || 0,
    status: 'requested',
    renterNote: renterNote || '',
  });

  // Send notification to owner
  await Notification.create({
    user: item.owner,
    type: 'rental_request',
    title: 'New Rental Booking Request 📦',
    message: `${req.user.name} requested to rent "${item.title}" for ${totalDays} day(s).`,
    referenceId: booking._id,
    referenceModel: 'RentalBooking',
  });

  const populated = await RentalBooking.findById(booking._id)
    .populate('item', 'title category images pricePerDay securityDeposit location')
    .populate('owner', 'name college branch year profileImage trustScore')
    .populate('renter', 'name college branch year profileImage trustScore');

  sendSuccess(res, 201, 'Rental request submitted to owner!', { booking: populated });
});

/**
 * @desc    Get bookings made on items owned by current user
 * @route   GET /api/rentals/owner-bookings
 * @access  Private
 */
exports.getOwnerBookings = asyncHandler(async (req, res) => {
  const bookings = await RentalBooking.find({ owner: req.user._id })
    .populate('item', 'title category images pricePerDay pricePerWeek securityDeposit location condition')
    .populate('renter', 'name college branch year profileImage trustScore bio phone')
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, 'Owner rental bookings fetched', { bookings });
});

/**
 * @desc    Get bookings requested by current user (as renter)
 * @route   GET /api/rentals/my-bookings
 * @access  Private
 */
exports.getMyBookings = asyncHandler(async (req, res) => {
  const bookings = await RentalBooking.find({ renter: req.user._id })
    .populate('item', 'title category images pricePerDay pricePerWeek securityDeposit location condition')
    .populate('owner', 'name college branch year profileImage trustScore bio phone')
    .sort({ createdAt: -1 });

  sendSuccess(res, 200, 'My rental bookings fetched', { bookings });
});

/**
 * @desc    Update rental booking status (Approve, Reject, Active, Complete, Cancel)
 * @route   PATCH /api/rentals/:id/status
 * @access  Private
 */
exports.updateBookingStatus = asyncHandler(async (req, res, next) => {
  const { status, rejectionReason, ownerNote } = req.body;

  const validStatuses = ['approved', 'rejected', 'active', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid booking status update.', 400));
  }

  const booking = await RentalBooking.findById(req.params.id)
    .populate('item')
    .populate('owner', 'name')
    .populate('renter', 'name');

  if (!booking) {
    return next(new AppError('Rental booking not found', 404));
  }

  const isOwner = String(booking.owner._id) === String(req.user._id);
  const isRenter = String(booking.renter._id) === String(req.user._id);

  if (!isOwner && !isRenter && req.user.role !== 'admin') {
    return next(new AppError('You are not authorized to update this booking.', 403));
  }

  // If approving, re-verify that no conflicting booking became active in the meantime
  if (status === 'approved' && isOwner) {
    const conflict = await RentalBooking.findOne({
      _id: { $ne: booking._id },
      item: booking.item._id,
      status: { $in: ['approved', 'active'] },
      $or: [
        { startDate: { $lte: booking.startDate }, endDate: { $gt: booking.startDate } },
        { startDate: { $lt: booking.endDate }, endDate: { $gte: booking.endDate } },
        { startDate: { $gte: booking.startDate }, endDate: { $lte: booking.endDate } },
      ],
    });

    if (conflict) {
      return next(
        new AppError(
          'Cannot approve: Another approved booking already occupies these dates for this item.',
          400
        )
      );
    }
  }

  booking.status = status;
  if (rejectionReason) booking.rejectionReason = rejectionReason;
  if (ownerNote) booking.ownerNote = ownerNote;
  if (status === 'active') booking.pickupStatus = 'confirmed';
  if (status === 'completed') booking.returnStatus = 'returned';

  await booking.save();

  // Notifications & Trust Score Updates
  if (status === 'approved') {
    await Notification.create({
      user: booking.renter._id,
      type: 'rental_approved',
      title: 'Rental Request Approved! 🎉',
      message: `${req.user.name} approved your rental for "${booking.item.title}". Contact them to arrange pickup.`,
      referenceId: booking._id,
      referenceModel: 'RentalBooking',
    });
  } else if (status === 'rejected') {
    await Notification.create({
      user: booking.renter._id,
      type: 'rental_rejected',
      title: 'Rental Request Declined',
      message: `Your rental request for "${booking.item.title}" was declined.`,
      referenceId: booking._id,
      referenceModel: 'RentalBooking',
    });
  } else if (status === 'completed') {
    // Reward both owner and renter with completed rental stats and trust score boost
    await User.findByIdAndUpdate(booking.owner._id, {
      $inc: { 'stats.completedRentals': 1, trustScore: 2 },
    });
    await User.findByIdAndUpdate(booking.renter._id, {
      $inc: { 'stats.completedRentals': 1, trustScore: 2 },
    });

    // Notify to leave a review
    await Notification.create({
      user: booking.renter._id,
      type: 'rental_completed',
      title: 'Rental Completed & Returned ✅',
      message: `Your rental of "${booking.item.title}" is complete. Leave a review for ${booking.owner.name}!`,
      referenceId: booking._id,
      referenceModel: 'RentalBooking',
    });

    await Notification.create({
      user: booking.owner._id,
      type: 'rental_completed',
      title: 'Rental Return Confirmed ✅',
      message: `Item "${booking.item.title}" returned. Leave a review for ${booking.renter.name}!`,
      referenceId: booking._id,
      referenceModel: 'RentalBooking',
    });
  }

  const updated = await RentalBooking.findById(req.params.id)
    .populate('item', 'title category images pricePerDay securityDeposit location condition')
    .populate('owner', 'name college branch year profileImage trustScore')
    .populate('renter', 'name college branch year profileImage trustScore');

  sendSuccess(res, 200, `Booking status updated to ${status}`, { booking: updated });
});
