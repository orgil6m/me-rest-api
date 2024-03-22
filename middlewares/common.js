const express = require("express");
const helmet = require("helmet");
const hpp = require("hpp");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");
const loggerMiddleware = require("./logger");
const corsOptions = require("../utils/cors");

// Rate limiting configuration
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

// const useMiddlewares = (app) => {
//   app.use(helmet());
//   app.use(hpp());
//   app.use(xssClean());
//   app.use(mongoSanitize());
//   app.use(cookieParser());
//   app.use(express.json());
//   app.use(limiter);
//   app.use(corsOptions);
//   app.use(loggerMiddleware);
// };

const middlewares = [
  helmet(),
  hpp(),
  xssClean(),
  mongoSanitize(),
  cookieParser(),
  express.json(),
  limiter,
  corsOptions,
  loggerMiddleware,
];

module.exports = middlewares;
