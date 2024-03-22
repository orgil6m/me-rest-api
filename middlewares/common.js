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

const securityMiddlewares = [helmet(), hpp(), xssClean(), mongoSanitize()];

const utilMiddlewares = [
  cookieParser(),
  express.json(),
  limiter,
  corsOptions,
  loggerMiddleware,
];

const middlewares = [...securityMiddlewares, ...utilMiddlewares];

module.exports = middlewares;
