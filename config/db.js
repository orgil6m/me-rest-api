const mongoose = require("mongoose");
const { db, dbName } = require("./env");

const connectDB = async () => {
  await mongoose.connect(db, { dbName });
  console.log(`[MongoDB connected] : ${dbName}`.blue);
};

module.exports = connectDB;
