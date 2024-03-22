const express = require("express");
const xss = require("xss-clean");
const hpp = require("hpp");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const cookieParser = require("cookie-parser");
const { host, port } = require("./config/config");
const corsOptions = require("./utils/cors");
const connectDB = require("./config/db");
const logger = require("./utils/logger");
require("colors");

// import Middlewares
const errorHandler = require("./middleware/error");

const app = express();
const URL = `${host}:${port}`;

// Connect Mongoose/MongoDB
// connectDB();

// Middlewares
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);
app.use(logger);
app.use(helmet());
app.use(hpp());
app.use(cookieParser());
app.use(express.json());
app.use(xss());
app.use(corsOptions);
app.use(mongoSanitize());

// Use Routes
app.use(errorHandler);

const server = app.listen(port, () => {
  console.log(`[App running] : ${URL}`.blue);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Алдаа гарлаа : ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});
