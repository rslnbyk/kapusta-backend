const { User } = require("../../schema/usersMongooseSchema");

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json({
    message: "No content",
  });
};

module.exports = logout;
