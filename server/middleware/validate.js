const { validationResult } = require('express-validator');
const { sendError } = require('../utils/apiResponse');

/**
 * validate — runs after express-validator rules.
 * Returns 400 with the first validation error if any exist.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array()[0];
    return sendError(res, 400, firstError.msg);
  }
  next();
};

module.exports = validate;
