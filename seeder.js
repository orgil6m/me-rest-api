const fs = require("fs");
const mongoose = require("mongoose");
const User = require("./models/user");
const Event = require("./models/event");
const Ticket = require("./models/ticket");
const Customer = require("./models/customer");
const Hall = require("./models/hall");
const { db, dbName } = require("./config/config");

const users = JSON.parse(
  fs.readFileSync(__dirname + "/data/new_users.json", "utf-8")
);

const events = JSON.parse(
  fs.readFileSync(__dirname + "/data/new_events_4.json", "utf-8")
);

const tickets = JSON.parse(
  fs.readFileSync(__dirname + "/data/new_tickets.json", "utf-8")
);

const customers = JSON.parse(
  fs.readFileSync(__dirname + "/data/new_customers.json", "utf-8")
);

const halls = JSON.parse(
  fs.readFileSync(__dirname + "/data/new_halls.json", "utf-8")
);

const importData = async () => {
  try {
    // await Customer.create(customers);
    // await Hall.create(halls);
    // await Ticket.create(tickets);
    await Hall.create(halls);
    console.log("Data imported successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Hall.deleteMany();
    // await User.deleteMany();
    console.log("Data deleted successfully");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

const connectDBAndImportData = async () => {
  try {
    await mongoose.connect(db, { dbName });
    console.log("Connected to MongoDB");
    if (process.argv[2] === "-i") {
      console.log("Importing data...");
      await importData();
    } else if (process.argv[2] === "-d") {
      console.log("Deleting data...");
      await deleteData();
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDBAndImportData();
