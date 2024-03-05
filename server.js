require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
mongoose.set("strictQuery", false);

const { PORT } = process.env;
const { HOST_URI } = process.env;

(async function () {
  try {
    await mongoose.connect(HOST_URI);
    console.log("Database connection successful");
    app.listen(PORT, () => {
      console.log(`Server running. Use our API on port: ${PORT}`);
    });
  } catch (error) {
    console.error("error mongodb", error.message);
    process.exit(1);
  }
})();
