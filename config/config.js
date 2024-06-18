const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

module.exports = {
  host: process.env.HOST,
  port: process.env.PORT,
  db: process.env.DB_CONNECTION_URL,
  dbName: process.env.DB_NAME,
  email: process.env.EMAIL,
  email_pass: process.env.EMAIL_PASS,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
  QPAY_HOST: process.env.QPAY_HOST,
  QPAY_USER: process.env.QPAY_USER,
  QPAY_PASS: process.env.QPAY_PASS,
  QPAY_INVOICE_CODE: process.env.QPAY_INVOICE_CODE,
  GOLOMT_URL: process.env.GOLOMT_URL,
  GOLOMT_TOKEN: process.env.GOLOMT_TOKEN,
  GOLOMT_KEY: process.env.GOLOMT_KEY,
};
