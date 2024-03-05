const createError = require("http-errors");
const {
  addTransaction,
  deleteTransaction,
  getAllTransactions,
} = require("../../services/transactionsService");

const getAllTransactionsController = async (req, res, next) => {
  if (!req.user) return next(createError(404, "No users found"));
  if (!req.user.token) return next(createError(401, "Not authorized"));
  const { _id: owner } = req.user;
  let { page, limit } = req.query;

  limit = limit > 20 ? (limit = 20) : limit;
  page = page * limit - limit;

  const userTransactions = await getAllTransactions(owner, page, limit);

  return res.status(200).json(userTransactions);
};

const addTransactionController = async (req, res, next) => {
  if (!req.user) return next(createError(404, "No users found"));
  if (!req.user.token) return next(createError(401, "Not authorized"));

  const { _id: owner } = req.user;

  const { userId, _id, dateTransaction, income, sum, category, description } =
    await addTransaction(req.body, owner);

  return res.status(201).json({
    userId: userId.toString(),
    _id: _id.toString(),
    dateTransaction,
    income,
    sum,
    category,
    description,
  });
};

const deleteTransactionController = async (req, res, next) => {
  if (!req.user) return next(createError(404, "No users found"));
  if (!req.user.token) return next(createError(401, "Not authorized"));

  const { transactionId } = req.params;
  const { _id: owner } = req.user;

  const isTransactionDeleted = await deleteTransaction(
    transactionId,
    owner,
    next
  );
  if (!isTransactionDeleted) return;
  res.status(200).json({
    message: "The transaction is successfully deleted!",
    userId: owner,
  });
};

module.exports = {
  addTransactionController,
  deleteTransactionController,
  getAllTransactionsController,
};
