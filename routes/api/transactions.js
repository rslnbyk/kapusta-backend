const express = require("express");
const router = express.Router();
const isAuth = require("../../middlewares/isAuth");
const {
  addTransactionController,
  deleteTransactionController,
  getAllTransactionsController,
} = require("../../controllers/transactions/transactions.controller");
const {
  expensesMonths,
  incomeMonths,
  fullStatistics,
} = require("../../controllers/transactions/index");
const ctrlWrapper = require("../../helpers/ctrlWrapper");
const {
  addTransactionValitation,
  addIdValitation,
  mothsResultsValidation,
} = require("../../middlewares/transactionsValidation");

router.use(ctrlWrapper(isAuth));

router.get("/", ctrlWrapper(getAllTransactionsController));
router.post(
  "/expenses",
  addTransactionValitation,
  ctrlWrapper(addTransactionController)
);
router.post(
  "/income",
  addTransactionValitation,
  ctrlWrapper(addTransactionController)
);
router.delete(
  "/:transactionId",
  addIdValitation,
  ctrlWrapper(deleteTransactionController)
);

router.post("/incomeMonths", mothsResultsValidation, ctrlWrapper(incomeMonths));

router.post(
  "/expensesMonths",
  mothsResultsValidation,
  ctrlWrapper(expensesMonths)
);

router.post(
  "/fullStatistics",
  mothsResultsValidation,
  ctrlWrapper(fullStatistics)
);

module.exports = router;
