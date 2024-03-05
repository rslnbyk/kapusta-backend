const express = require("express");
const login = require("../../controllers/auth/login.controller");
const logout = require("../../controllers/auth/logout.controller");
const register = require("../../controllers/auth/register.controller");
const {
  updateUserBalance,
  getCurrentUser,
} = require("../../controllers/auth/user.controller");
const verifyEmail = require("../../controllers/auth/verifyEmail");
const {
  authValidation,
  userBalanceValidation,
} = require("../../middlewares/authValidation");
const ctrlWrapper = require("../../helpers/ctrlWrapper");
const isAuth = require("../../middlewares/isAuth");
const {
  googleAuthController,
  googleRedirectController,
} = require("../../controllers/auth/googleAuthController");

const authRouter = express.Router();

authRouter.post("/register", ctrlWrapper(authValidation), register);
authRouter.post("/login", ctrlWrapper(authValidation), ctrlWrapper(login));
authRouter.get("/verify/:verificationToken", ctrlWrapper(verifyEmail));
authRouter.post("/logout", ctrlWrapper(isAuth), ctrlWrapper(logout));
authRouter.get("/google", ctrlWrapper(googleAuthController));
authRouter.get("/google-redirect", ctrlWrapper(googleRedirectController));

authRouter.patch(
  "/users/balance",
  ctrlWrapper(isAuth),
  ctrlWrapper(userBalanceValidation),
  ctrlWrapper(updateUserBalance)
);
authRouter.get(
  "/users/current",
  ctrlWrapper(isAuth),
  ctrlWrapper(getCurrentUser)
);

module.exports = authRouter;
