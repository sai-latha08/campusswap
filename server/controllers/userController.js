const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * @desc    Get public profile of a student
 * @route   GET /api/users/:id
 * @access  Public / Authenticated
 */
exports.getUserProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select('-password -phone') // hide private fields for public view
    .populate('skillsToTeach.skill', 'name category icon')
    .populate('skillsToLearn', 'name category icon');

  if (!user) {
    return next(new AppError('Student profile not found.', 404));
  }

  sendSuccess(res, 200, 'Student profile fetched', { user });
});

/**
 * @desc    Search students by name, college, skill
 * @route   GET /api/users
 * @access  Public / Authenticated
 */
exports.getUsers = asyncHandler(async (req, res) => {
  const { search, college, page = 1, limit = 20 } = req.query;
  const query = { isSuspended: false };

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { college: { $regex: search, $options: 'i' } },
      { branch: { $regex: search, $options: 'i' } },
    ];
  }

  if (college) {
    query.college = { $regex: college, $options: 'i' };
  }

  const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);
  const users = await User.find(query)
    .select('-password -phone')
    .populate('skillsToTeach.skill', 'name category icon')
    .populate('skillsToLearn', 'name category icon')
    .skip(skip)
    .limit(parseInt(limit, 10))
    .sort({ trustScore: -1 });

  const total = await User.countDocuments(query);

  sendSuccess(res, 200, 'Students fetched', {
    users,
    total,
    page: parseInt(page, 10),
    pages: Math.ceil(total / parseInt(limit, 10)),
  });
});
