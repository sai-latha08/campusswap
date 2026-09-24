const express = require('express');
const router = express.Router();
const skillController = require('../controllers/skillController');
const { protect } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Optional auth middleware for getSkillTeachers (so we calculate personalized match % if logged in)
const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
    } catch (_) {}
  }
  next();
};

router.get('/', skillController.getSkills);
router.post('/', protect, skillController.createSkill);
router.get('/:id/teachers', optionalAuth, skillController.getSkillTeachers);

// My skills management
router.post('/my-skills/teach', protect, skillController.addSkillToTeach);
router.delete('/my-skills/teach/:skillId', protect, skillController.removeSkillToTeach);
router.post('/my-skills/learn', protect, skillController.addSkillToLearn);
router.delete('/my-skills/learn/:skillId', protect, skillController.removeSkillToLearn);

module.exports = router;
