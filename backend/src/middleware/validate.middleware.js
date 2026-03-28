// src/middleware/validate.middleware.js
const { validationResult } = require('express-validator');
const { AppError } = require('./error.middleware');

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors.array().map((e) => e.msg).join('. ');
    return next(new AppError(message, 422));
  }
  next();
};

module.exports = validate;
