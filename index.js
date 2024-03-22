require("colors");
const express = require("express");
const connectDB = require("./config/db");
const middlewares = require("./middlewares/common");
const errorHandler = require("./middlewares/error");
const { host, port } = require("./config/config");

// import Routes
const errorRoutes = require("./routes/error");

const app = express();
const URL = `${host}:${port}`;

// Connect to the Database
// connectDB();

// Middlewares
app.use(middlewares);

// Routes
app.use("*", errorRoutes);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`[App running] : ${URL}`.blue);
});

process.on("unhandledRejection", (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`.red);
  server.close(() => process.exit(1));
});
