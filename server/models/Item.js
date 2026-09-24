const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Item title is required'],
      trim: true,
      maxlength: [200, 'Title too long'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description too long'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Books',
        'Electronics',
        'Calculator',
        'Lab Equipment',
        'Project Equipment',
        'Bicycle',
        'Camera',
        'Headphones',
        'Sports',
        'Furniture',
        'Other',
      ],
    },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String }, // Cloudinary public_id for deletion
      },
    ],
    pricePerDay: {
      type: Number,
      required: [true, 'Daily price is required'],
      min: [0, 'Price cannot be negative'],
    },
    pricePerWeek: {
      type: Number,
      default: 0,
    },
    securityDeposit: {
      type: Number,
      default: 0,
    },
    condition: {
      type: String,
      enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'],
      default: 'Good',
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'rented', 'unavailable'],
      default: 'available',
    },
    // Dates when the item is booked (for UI calendar blocking)
    bookedDates: [
      {
        startDate: Date,
        endDate: Date,
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'RentalBooking' },
      },
    ],
    tags: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// Full-text search index
itemSchema.index({ title: 'text', description: 'text', tags: 'text' });
itemSchema.index({ category: 1, availabilityStatus: 1 });
itemSchema.index({ owner: 1 });

module.exports = mongoose.model('Item', itemSchema);
