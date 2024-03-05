const mongoose = require("mongoose");
const schema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "userId is required"],
    },

    dateTransaction: {
      type: Date,
      require: [true, "dateTransaction is required"],
    },
    income: {
      type: Boolean,
      require: [true, "income is required"],
    },
    sum: {
      type: Number,
      require: [true, "sum is required"],
    },
    category: {
      type: String,
      require: [true, "category is required"],
    },
    description: {
      type: String,
      require: [true, "description is required"],
    },
  },
  { versionKey: false, timestamps: true }
);
const Transactions = mongoose.model("transactions", schema);
module.exports = {
  Transactions,
};
