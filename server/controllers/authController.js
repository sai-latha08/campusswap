const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Helper to sign JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

/**
 * Helper to send token response + set cookie
 */
const sendTokenResponse = (user, statusCode, res, message = 'Success') => {
  const token = generateToken(user._id);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.cookie('token', token, cookieOptions);

  // Return user object without sensitive fields
  const userObj = user.toObject ? user.toObject() : { ...user };
  delete userObj.password;

  res.status(statusCode).json({
    success: true,
    message,
    data: {
      token,
      user: userObj,
    },
  });
};

/**
 * @desc    Register a new student user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password, college, branch, year, phone, location } = req.body;

  // Check if user with email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('A user with this email already exists.', 400));
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    college,
    branch: branch || '',
    year: year ? parseInt(year, 10) : undefined,
    phone: phone || '',
    location: location || '',
    isEmailVerified: true, // For campus portal demo convenience
    trustScore: 50, // Initial base trust score
  });

  sendTokenResponse(user, 201, res, 'Registration successful! Welcome to CampusSwap.');
});

/**
 * @desc    Login user with email and password
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide both email and password.', 400));
  }

  // Find user and explicitly select password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return next(new AppError('Invalid email or password.', 401));
  }

  // Check password
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new AppError('Invalid email or password.', 401));
  }

  // Check if suspended
  if (user.isSuspended) {
    return next(
      new AppError(
        `Your account has been suspended. Reason: ${user.suspensionReason || 'Violation of terms.'}`,
        403
      )
    );
  }

  sendTokenResponse(user, 200, res, 'Login successful!');
});

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private (Authenticated)
 */
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id)
    .populate('skillsToTeach.skill', 'name category icon')
    .populate('skillsToLearn', 'name category icon');

  if (!user) {
    return next(new AppError('User not found.', 404));
  }

  sendSuccess(res, 200, 'User profile retrieved', { user });
});

/**
 * @desc    Update current user profile
 * @route   PUT /api/auth/profile
 * @access  Private (Authenticated)
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const allowedFields = [
    'name',
    'college',
    'branch',
    'year',
    'bio',
    'location',
    'phone',
    'profileImage',
    'availability',
  ];

  const updates = {};
  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updates[field] = req.body[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  })
    .populate('skillsToTeach.skill', 'name category icon')
    .populate('skillsToLearn', 'name category icon');

  sendSuccess(res, 200, 'Profile updated successfully!', { user: updatedUser });
});

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private (Authenticated)
 */
exports.changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    return next(new AppError('Current password is incorrect.', 400));
  }

  user.password = newPassword;
  await user.save();

  sendSuccess(res, 200, 'Password changed successfully!');
});

/**
 * @desc    Logout user & clear cookie
 * @route   POST /api/auth/logout
 * @access  Public / Private
 */
exports.logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });

  sendSuccess(res, 200, 'Logged out successfully');
};
