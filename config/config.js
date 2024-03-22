const dotenv = require("dotenv");

dotenv.config({ path: ".env" });

module.exports = {
  host: process.env.HOST,
  port: process.env.PORT,
  db: process.env.DB_CONNECTION_URL,
  dbName: process.env.DB_NAME,
};
