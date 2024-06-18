require("colors");
const express = require("express");
const connectDB = require("./config/db");
const middlewares = require("./middlewares/common");
const errorHandler = require("./middlewares/error");
const { host, port } = require("./config/config");

// import Routes
const authRoutes = require("./routes/auth");
const invoicesRoutes = require("./routes/invoices");
const usersRoutes = require("./routes/users");
const eventsRoutes = require("./routes/events");
const ordersRoutes = require("./routes/orders");
const errorRoutes = require("./routes/error");

const app = express();
const URL = `${host}:${port}`;

// Connect to the Database
connectDB();

// Middlewares
app.use(middlewares);

// Routes
app.use("/images", express.static("public/images"));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/events", eventsRoutes);
app.use("/api/v1/orders", ordersRoutes);
app.use("/api/v1/invoices", invoicesRoutes);
app.use("*", errorRoutes);
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`[App running] : ${URL}`.blue);
});

process.on("unhandledRejection", (err, promise) => {
  console.error(`Unhandled Rejection: ${err.message}`.red);
  server.close(() => process.exit(1));
});
