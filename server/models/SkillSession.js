const mongoose = require('mongoose');

const skillSessionSchema = new mongoose.Schema(
  {
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    skill: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skill',
      required: true,
    },
    skillRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SkillRequest',
    },
    date: {
      type: Date,
      required: [true, 'Session date is required'],
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
    },
    mode: {
      type: String,
      enum: ['online', 'in-person'],
      default: 'online',
    },
    meetingLink: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['scheduled', 'ongoing', 'completed', 'cancelled', 'no-show'],
      default: 'scheduled',
    },
    notes: {
      type: String,
      default: '',
    },
    teacherReviewed: {
      type: Boolean,
      default: false,
    },
    learnerReviewed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for overlap checking: teacher + date + time
skillSessionSchema.index({ teacher: 1, date: 1 });
skillSessionSchema.index({ learner: 1, date: 1 });

module.exports = mongoose.model('SkillSession', skillSessionSchema);
