const mongoose = require('mongoose');

const skillRequestSchema = new mongoose.Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    skillOffered: {
      // Optional: the skill the requester offers in return
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
    },
    preferredMode: {
      type: String,
      enum: ['online', 'in-person', 'both'],
      default: 'both',
    },
    preferredTime: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      maxlength: [1000, 'Description too long'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'pending',
    },
    rejectionReason: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

// Prevent duplicate pending requests for the same requester/teacher/skill
skillRequestSchema.index(
  { requester: 1, teacher: 1, skill: 1, status: 1 },
  { unique: false }
);

module.exports = mongoose.model('SkillRequest', skillRequestSchema);
