const Skill = require('../models/Skill');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');
const { sendSuccess } = require('../utils/apiResponse');
const { calculateSkillMatch } = require('../utils/skillMatcher');

/**
 * @desc    Get all available skills with search and category filters
 * @route   GET /api/skills
 * @access  Public / Authenticated
 */
exports.getSkills = asyncHandler(async (req, res) => {
  const { search, category } = req.query;
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }

  if (category && category !== 'All') {
    query.category = category;
  }

  const skills = await Skill.find(query).sort({ name: 1 });

  // Count how many students teach each skill
  const skillsWithCounts = await Promise.all(
    skills.map(async (skill) => {
      const teacherCount = await User.countDocuments({
        'skillsToTeach.skill': skill._id,
        isSuspended: false,
      });
      return {
        ...skill.toObject(),
        teacherCount,
      };
    })
  );

  sendSuccess(res, 200, 'Skills fetched', { skills: skillsWithCounts });
});

/**
 * @desc    Create a new skill if not already present
 * @route   POST /api/skills
 * @access  Private
 */
exports.createSkill = asyncHandler(async (req, res, next) => {
  const { name, category, description, icon } = req.body;

  if (!name || !category) {
    return next(new AppError('Skill name and category are required.', 400));
  }

  const existing = await Skill.findOne({ name: { $regex: new RegExp(`^${name.trim()}$`, 'i') } });
  if (existing) {
    return next(new AppError('This skill is already listed.', 400));
  }

  const skill = await Skill.create({
    name: name.trim(),
    category,
    description: description || '',
    icon: icon || '',
    createdBy: req.user._id,
  });

  sendSuccess(res, 201, 'Skill created successfully', { skill });
});

/**
 * @desc    Find all students teaching a specific skill, with computed rule-based match %
 * @route   GET /api/skills/:id/teachers
 * @access  Public / Authenticated
 */
exports.getSkillTeachers = asyncHandler(async (req, res, next) => {
  const skillId = req.params.id;

  const skill = await Skill.findById(skillId);
  if (!skill) {
    return next(new AppError('Skill not found', 404));
  }

  // Find users teaching this skill, excluding the requesting user if logged in
  const query = {
    'skillsToTeach.skill': skillId,
    isSuspended: false,
  };

  if (req.user) {
    query._id = { $ne: req.user._id };
  }

  const teachers = await User.find(query)
    .select('-password -phone')
    .populate('skillsToTeach.skill', 'name category icon')
    .populate('skillsToLearn', 'name category icon');

  // Compute rule-based match score for each teacher
  const requestingUser = req.user
    ? await User.findById(req.user._id).populate('skillsToTeach.skill').populate('skillsToLearn')
    : null;

  const teachersWithScores = teachers.map((teacher) => {
    const matchScore = requestingUser
      ? calculateSkillMatch(requestingUser, teacher, skillId)
      : Math.min(95, Math.max(50, Math.round(50 + ((teacher.trustScore || 50) / 2))));

    const skillEntry = teacher.skillsToTeach.find(
      (item) => String(item.skill?._id || item.skill) === String(skillId)
    );

    return {
      _id: teacher._id,
      name: teacher.name,
      college: teacher.college,
      branch: teacher.branch,
      year: teacher.year,
      bio: teacher.bio,
      location: teacher.location,
      trustScore: teacher.trustScore || 50,
      averageRating: teacher.averageRating,
      experienceYears: skillEntry?.experienceYears || 0,
      skillDescription: skillEntry?.description || '',
      availability: teacher.availability || [],
      skillsToLearn: teacher.skillsToLearn || [],
      matchScore,
    };
  });

  // Sort by matchScore descending
  teachersWithScores.sort((a, b) => b.matchScore - a.matchScore);

  sendSuccess(res, 200, 'Teachers fetched for skill', {
    skill,
    teachers: teachersWithScores,
  });
});

/**
 * @desc    Add a skill to teach to user profile
 * @route   POST /api/skills/my-skills/teach
 * @access  Private
 */
exports.addSkillToTeach = asyncHandler(async (req, res, next) => {
  const { skillId, experienceYears, description } = req.body;

  if (!skillId) {
    return next(new AppError('Skill ID is required', 400));
  }

  const user = await User.findById(req.user._id);

  // Check if already in teach list
  const exists = user.skillsToTeach.some(
    (item) => String(item.skill) === String(skillId)
  );

  if (exists) {
    return next(new AppError('You have already added this skill to teach.', 400));
  }

  user.skillsToTeach.push({
    skill: skillId,
    experienceYears: parseInt(experienceYears, 10) || 0,
    description: description || '',
  });

  await user.save();

  const updatedUser = await User.findById(req.user._id)
    .populate('skillsToTeach.skill', 'name category icon')
    .populate('skillsToLearn', 'name category icon');

  sendSuccess(res, 200, 'Skill added to your teachable list', { user: updatedUser });
});

/**
 * @desc    Remove a skill from teach list
 * @route   DELETE /api/skills/my-skills/teach/:skillId
 * @access  Private
 */
exports.removeSkillToTeach = asyncHandler(async (req, res) => {
  const { skillId } = req.params;

  const user = await User.findById(req.user._id);
  user.skillsToTeach = user.skillsToTeach.filter(
    (item) => String(item.skill) !== String(skillId)
  );
  await user.save();

  const updatedUser = await User.findById(req.user._id)
    .populate('skillsToTeach.skill', 'name category icon')
    .populate('skillsToLearn', 'name category icon');

  sendSuccess(res, 200, 'Skill removed from teach list', { user: updatedUser });
});

/**
 * @desc    Add a skill to learn to user profile
 * @route   POST /api/skills/my-skills/learn
 * @access  Private
 */
exports.addSkillToLearn = asyncHandler(async (req, res, next) => {
  const { skillId } = req.body;

  if (!skillId) {
    return next(new AppError('Skill ID is required', 400));
  }

  const user = await User.findById(req.user._id);
  if (user.skillsToLearn.some((s) => String(s) === String(skillId))) {
    return next(new AppError('You have already added this skill to your learning list.', 400));
  }

  user.skillsToLearn.push(skillId);
  await user.save();

  const updatedUser = await User.findById(req.user._id)
    .populate('skillsToTeach.skill', 'name category icon')
    .populate('skillsToLearn', 'name category icon');

  sendSuccess(res, 200, 'Skill added to your learning goals', { user: updatedUser });
});

/**
 * @desc    Remove a skill from learn list
 * @route   DELETE /api/skills/my-skills/learn/:skillId
 * @access  Private
 */
exports.removeSkillToLearn = asyncHandler(async (req, res) => {
  const { skillId } = req.params;

  const user = await User.findById(req.user._id);
  user.skillsToLearn = user.skillsToLearn.filter((s) => String(s) !== String(skillId));
  await user.save();

  const updatedUser = await User.findById(req.user._id)
    .populate('skillsToTeach.skill', 'name category icon')
    .populate('skillsToLearn', 'name category icon');

  sendSuccess(res, 200, 'Skill removed from learning goals', { user: updatedUser });
});
