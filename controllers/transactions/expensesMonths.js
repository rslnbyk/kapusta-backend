const { Transactions } = require("../../schema/transactionsMongooseSchema");
const createError = require("http-errors");

const expensesMonths = async (req, res, next) => {
  if (!req.user) return next(createError(404, "No users found"));
  if (!req.user.token) return next(createError(401, "Not authorized"));
  const { currentMonth, year } = req.body;
  const userId = req.user._id.toString();

  const yearStarts = new Date(`Wed, 01 Jan ${year} 00:00:00 GMT`);
  const yearEnds = new Date(`Thu, 31 Dec ${year} 00:00:00 GMT`);

  const array = await Transactions.aggregate([
    {
      $match: {
        userId,
        income: false,
        dateTransaction: {
          $gte: yearStarts,
          $lte: yearEnds,
        },
      },
    },
    {
      $group: {
        _id: {
          month: {
            $month: "$dateTransaction",
          },
        },
        total: {
          $sum: "$sum",
        },
      },
    },
    {
      $addFields: {
        month: "$_id.month",
      },
    },
    {
      $unset: "_id",
    },
    {
      $sort: {
        month: 1,
      },
    },
  ]);
  if (array.length === 0) {
    return res
      .status(400)
      .json({ message: "There aren`t expenses in this year" });
  }
  const result = array.filter(({ month }) => month >= currentMonth);
  const length = result.length;

  if (length < 6) {
    for (
      let index = 0;
      index < 6 - array.length && result.length < array.length;
      index++
    ) {
      if (array[index]) {
        result.push(array[index]);
      }
    }
  }
  result.sort((a, b) => a.month - b.month);
  return res.status(200).json(result);
};
module.exports = expensesMonths;
