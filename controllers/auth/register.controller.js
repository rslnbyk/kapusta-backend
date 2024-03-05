const { User } = require("../../schema/usersMongooseSchema");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const { v4 } = require("uuid");
const { sendMail } = require("../../helpers/sendMail");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const salt = await bcrypt.genSalt();

  const storedUser = await User.findOne({ email });
  if (storedUser) {
    return next(createError(409, "Email in use"));
  }

  try {
    const hashedPassword = bcrypt.hash(password, salt);
    const verificationToken = v4();
    await User.create({
      email,
      password: await hashedPassword,
      verificationToken,
    });
    await sendMail({
      to: email,
      subject: "Please confirm your email",
      text: `Confirm your email: https://kapusta-dvde.onrender.com/api/auth/verify/${verificationToken}`,
    });
    res.status(201).json({
      user: email,
    });
  } catch (error) {
    next(createError(409, error.message));
  }
};

module.exports = register;
