const { Transactions } = require("../../schema/transactionsMongooseSchema");
const createError = require("http-errors");
const fullStatistics = async (req, res, next) => {
  if (!req.user) return next(createError(404, "No users found"));
  if (!req.user.token) return next(createError(401, "Not authorized"));
  const { currentMonth, year } = req.body;
  const userId = req.user._id.toString();
  let incomeTotal;
  let expenseTotal;
  let incomesData;
  let expensesData;
  function getMonthName(monthNumber) {
    const date = new Date();
    date.setMonth(monthNumber - 1);

    return date.toLocaleString("en-US", {
      month: "long",
    });
  }

  const dataStarts = new Date(
    `Wed, 01 ${getMonthName(currentMonth)} ${year} 00:00:00 GMT`
  );
  const dataEnds = new Date(
    `Thu, 31  ${getMonthName(currentMonth)} ${year} 00:00:00 GMT`
  );

  const startedRes = await Transactions.aggregate([
    {
      $match: {
        userId: userId,
        dateTransaction: {
          $gte: dataStarts,
          $lte: dataEnds,
        },
      },
    },
    {
      $group: {
        _id: "$income",
        transactions: {
          $push: {
            sum: "$sum",
            description: "$description",
            category: "$category",
          },
        },
        totalSum: {
          $sum: "$sum",
        },
      },
    },
    {
      $addFields: {
        type: {
          $cond: {
            if: {
              $eq: ["$_id", true],
            },
            then: "income",
            else: "expenses",
          },
        },
      },
    },
    {
      $unset: "_id",
    },
    {
      $sort: {
        type: -1,
      },
    },
  ]);
  console.log("startedRes",startedRes)
  if (startedRes.length === 0) {
    // return res
    //   .status(400)
    //   .json({ message: "There isn`t any income and expenses in this month" });
    return res.status(200).json({ income: {}, expenses: {} });
  }
  let definer = "both";
  if (startedRes.length === 1) {
    const { type } = startedRes[0];
    definer = type;

  }
  if (definer === "both" || definer === "income") {
    const income = startedRes[0];
    const incomeTransactions = income.transactions;
    const arr = [];

    incomeTransactions.forEach((v) => arr.push(v.category));

    const arrOfCategories = [...new Set(arr)];

    const incomeCategories = [];

    arrOfCategories.forEach(function (v) {
      const obj = {};
      obj.category = v;
      obj.sum = 0;
      obj.descriptions = [];
      incomeTransactions.forEach((el) =>
        v === el.category
          ? obj.descriptions.push({ description: el.description, sum: el.sum })
          : 8
      );
      incomeCategories.push(obj);
    });
    incomeCategories.forEach((v) =>
      incomeTransactions.forEach((c) =>
        c.category === v.category ? (v.sum += c.sum) : v
      )
    );

    incomeCategories.forEach((el) =>
      el.descriptions.sort((first, second) =>
        first.description.localeCompare(second.description)
      )
    );
    incomeCategories.forEach((line) => {
      for (let i = 0; i < line.descriptions.length - 1; i++) {
        if (
          line.descriptions[i].description ===
          line.descriptions[i + 1].description
        ) {
          line.descriptions[i].sum += line.descriptions[i + 1].sum;
          line.descriptions.splice(i + 1, 1);
        }
      }
    });
    incomeTotal = income.totalSum;
    incomesData = incomeCategories;
  }
  //
  if (definer === "both" || definer === "expenses") {
    let expenses = startedRes[1];
    if(definer === "expenses")
    {
      expenses=startedRes[0]
    }
    const expensesTransactions = expenses.transactions;

    const arr2 = [];

    expensesTransactions.forEach((v) => arr2.push(v.category));

    const arrOfCategories2 = [...new Set(arr2)];

    const expenseCategories = [];

    arrOfCategories2.forEach(function (v) {
      const obj = {};
      obj.category = v;
      obj.sum = 0;
      obj.descriptions = [];
      expensesTransactions.forEach((el) =>
        v === el.category
          ? obj.descriptions.push({ description: el.description, sum: el.sum })
          : 8
      );
      expenseCategories.push(obj);
    });
    expenseCategories.forEach((v) =>
      expensesTransactions.forEach((c) =>
        c.category === v.category ? (v.sum += c.sum) : v
      )
    );

    expenseCategories.forEach((el) =>
      el.descriptions.sort((first, second) =>
        first.description.localeCompare(second.description)
      )
    );
    expenseCategories.forEach((line) => {
      for (let i = 0; i < line.descriptions.length - 1; i++) {
        if (
          line.descriptions[i].description ===
          line.descriptions[i + 1].description
        ) {
          line.descriptions[i].sum += line.descriptions[i + 1].sum;
          line.descriptions.splice(i + 1, 1);
        }
      }
      expenseTotal = expenses.totalSum;
    });
    expenseTotal = expenses.totalSum;
    expensesData = expenseCategories;
  }
  return res.status(200).json({
    income: {
      totalSum: incomeTotal,
      categories: incomesData,
    },
    expenses: {
      totalSum: expenseTotal,
      categories: expensesData,
    },
  });
};
module.exports = fullStatistics;
