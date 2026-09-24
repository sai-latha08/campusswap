const mongoose = require('mongoose');

const rentalBookingSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    totalDays: {
      type: Number,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['requested', 'approved', 'rejected', 'active', 'completed', 'cancelled'],
      default: 'requested',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded', 'failed'],
      default: 'pending',
    },
    // Payment reference — for future Razorpay integration
    paymentId: {
      type: String,
      default: '',
    },
    pickupStatus: {
      type: String,
      enum: ['pending', 'confirmed'],
      default: 'pending',
    },
    returnStatus: {
      type: String,
      enum: ['pending', 'returned', 'disputed'],
      default: 'pending',
    },
    renterNote: {
      type: String,
      default: '',
    },
    ownerNote: {
      type: String,
      default: '',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
    ownerReviewed: {
      type: Boolean,
      default: false,
    },
    renterReviewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre-save: auto-calculate totalDays
rentalBookingSchema.pre('save', function () {
  if (this.startDate && this.endDate) {
    const ms = this.endDate - this.startDate;
    this.totalDays = Math.ceil(ms / (1000 * 60 * 60 * 24));
  }
});

module.exports = mongoose.model('RentalBooking', rentalBookingSchema);
