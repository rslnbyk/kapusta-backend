const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const { User } = require("../schema/usersMongooseSchema");

const googleUserLogin = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    await User.create({
      email,
      password: v4(),
      balance: null,
      verify: true,
      verificationToken: null,
    });
  }
  const storedUser = await User.findOne({ email });
  const token = jwt.sign({ id: storedUser._id }, process.env.JWT_SECRET, {
    expiresIn: "10h",
  });
  const googleAuthorizedUser = await User.findByIdAndUpdate(
    storedUser._id,
    { token },
    { new: true }
  );
  return googleAuthorizedUser;
};

module.exports = { googleUserLogin };
