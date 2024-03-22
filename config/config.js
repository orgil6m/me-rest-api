const dotenv = require("dotenv");

dotenv.config({
  path: ".env",
});

module.exports = {
  host: process.env.HOST,
  port: process.env.PORT,
};
