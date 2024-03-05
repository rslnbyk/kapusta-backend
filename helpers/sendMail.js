const nodemailer = require("nodemailer");

const config = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: "kapustat@ukr.net",
    pass: process.env.IMAP_KEY,
  },
};

const sendMail = async ({ to, subject, text }) => {
  const email = {
    from: "kapustat@ukr.net",
    to,
    subject,
    text,
  };

  const transporter = nodemailer.createTransport(config);

  await transporter.sendMail(email);
};
module.exports = {
  sendMail,
};
