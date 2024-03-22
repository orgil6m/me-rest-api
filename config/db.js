const mongoose = require("mongoose");

const connectDB = async () => {
  const db = process.env.DB_CONNECTION_URL;
  const dbName = process.env.DB_NAME;
  await mongoose.connect(db, { dbName });
  console.log(`[MongoDB connected] : ${dbName}`.blue);
};

module.exports = connectDB;
