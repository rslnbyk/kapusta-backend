const { User } = require("../schema/usersMongooseSchema");
const createError = require("http-errors");
const jwt = require("jsonwebtoken");

async function isAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const [type, token] = authHeader.split(" ");

  try {
    if (type !== "Bearer") {
      throw createError(401, "token type is not valid");
    }

    if (!token) {
      throw createError(401, "no token provided");
    }
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user || !user.token) {
      throw createError(409, "user not authorized");
    }
    req.token = token;
    req.user = user;
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError"
    ) {
      throw createError(401, "jwt token is not valid");
    }
    throw error;
  }

  next();
}
module.exports = isAuth;
