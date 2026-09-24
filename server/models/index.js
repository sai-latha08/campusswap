// Load and register all Mongoose models
const User = require('./User');
const Skill = require('./Skill');
const SkillRequest = require('./SkillRequest');
const SkillSession = require('./SkillSession');
const Item = require('./Item');
const RentalBooking = require('./RentalBooking');
const BarterRequest = require('./BarterRequest');
const Review = require('./Review');
const Message = require('./Message');
const Notification = require('./Notification');
const Report = require('./Report');

module.exports = {
  User,
  Skill,
  SkillRequest,
  SkillSession,
  Item,
  RentalBooking,
  BarterRequest,
  Review,
  Message,
  Notification,
  Report,
};
