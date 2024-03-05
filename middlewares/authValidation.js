const createError = require("http-errors");
const Joi = require("joi");

const authValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    return next(createError(400, validation.error.message));
  }
  next();
};

const userBalanceValidation = (req, res, next) => {
  const schema = Joi.object({
    balance: Joi.number().required(),
  });
  const validation = schema.validate(req.body);
  if (validation.error) {
    return next(createError(400, validation.error.message));
  }
  next();
};

module.exports = { authValidation, userBalanceValidation };
