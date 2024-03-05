const queryString = require("query-string");
const axios = require("axios");
const createError = require("http-errors");
const { googleUserLogin } = require("../../services/googleAuth");

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, BACK_URL, FRONT_URL } =
  process.env;

const googleAuthController = async (req, res, next) => {
  const stringifiedParams = queryString.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BACK_URL}/api/auth/google-redirect`,
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });
  return res.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`
  );
};

const googleRedirectController = async (req, res, next) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = queryString.parse(urlObj.search);
  const code = urlParams.code;

  if (!code) return next(createError(401, "google authorization error"));

  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BACK_URL}/api/auth/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });
  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });

  const { email, balance, token } = await googleUserLogin(userData.data.email);

  return res.redirect(
    `${FRONT_URL}?email=${email}&token=${token}&balance=${balance}`
  );
};

module.exports = { googleAuthController, googleRedirectController };
