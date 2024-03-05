const Joi = require("joi");

const addTransactionValitation = (req, res, next) => {
  const schema = Joi.object({
    dateTransaction: Joi.date().required(),
    income: req.originalUrl.includes("income")
      ? Joi.boolean().valid(true).required()
      : Joi.boolean().valid(false).required(),
    sum: Joi.number().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
  });
  const validationResult = schema.validate(req.body);
  if (validationResult.error)
    return res.status(400).json({ message: validationResult.error.message });
  next();
};

const addIdValitation = (req, res, next) => {
  const schema = Joi.string().min(24).max(24);
  const validationResult = schema.validate(req.params.transactionId);
  if (validationResult.error)
    return res.status(400).json({ message: validationResult.error.message });
  next();
};
const mothsResultsValidation = (req, res, next) => {
  const mothsResultsSchema = Joi.object({
    year: Joi.number().required(),
    currentMonth: Joi.number().min(1).max(12).required(),
  });
  const { error } = mothsResultsSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.message });
  }
  next();
};
module.exports = {
  addTransactionValitation,
  addIdValitation,
  mothsResultsValidation,
};
