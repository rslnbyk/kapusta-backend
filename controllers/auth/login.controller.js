const { User } = require("../../schema/usersMongooseSchema");
const createError = require("http-errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const storedUser = await User.findOne({ email });
  if (!storedUser) {
    return next(createError(401, "email or password is not valid"));
  }

  if (!storedUser.verify) {
    return next(createError(401, "email is not verify"));
  }
  const isPasswordValid = await bcrypt.compare(password, storedUser.password);
  if (!isPasswordValid) {
    return next(createError(401, "email or password is not valid"));
  }
  const token = jwt.sign({ id: storedUser._id }, process.env.JWT_SECRET, {
    expiresIn: "10h",
  });
  const user = await User.findByIdAndUpdate(
    storedUser._id,
    { token },
    { new: true }
  );

  return res.status(200).json({
    email: user.email,
    balance: user.balance,
    token: user.token,
  });
};

module.exports = login;
