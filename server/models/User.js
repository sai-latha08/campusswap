const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // never returned in queries by default
    },
    college: {
      type: String,
      required: [true, 'College is required'],
      trim: true,
    },
    branch: {
      type: String,
      trim: true,
      default: '',
    },
    year: {
      type: Number,
      min: 1,
      max: 6,
    },
    profileImage: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    // Skills the user can teach — references to Skill documents
    skillsToTeach: [
      {
        skill: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
        experienceYears: { type: Number, default: 0 },
        description: { type: String, default: '' },
      },
    ],
    // Skills the user wants to learn
    skillsToLearn: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Skill',
      },
    ],
    // Weekly availability slots
    availability: [
      {
        day: {
          type: String,
          enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        startTime: String, // "09:00"
        endTime: String,   // "17:00"
      },
    ],
    isVerified: {
      type: Boolean,
      default: false,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    trustScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    // Aggregated stats used for trust score calculation
    stats: {
      completedSkillSessions: { type: Number, default: 0 },
      completedRentals: { type: Number, default: 0 },
      completedBarters: { type: Number, default: 0 },
      totalRatingsReceived: { type: Number, default: 0 },
      sumOfRatings: { type: Number, default: 0 },
      reportsReceived: { type: Number, default: 0 },
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspensionReason: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare entered password with hashed password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual: average rating
userSchema.virtual('averageRating').get(function () {
  if (this.stats.totalRatingsReceived === 0) return 0;
  return (this.stats.sumOfRatings / this.stats.totalRatingsReceived).toFixed(1);
});

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);
