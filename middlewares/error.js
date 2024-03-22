const { logger } = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  let error = {
    ...err,
    message: err.message,
    statusCode: err.statusCode,
  };

  // JWT authentication error
  if (err.message === "jwt malformed") {
    error.message = "Your session is not valid. Please log in again.";
    error.statusCode = 401;
  }

  // CastError: Invalid ID format
  if (err.name === "CastError") {
    error.message = "The provided identifier is not in the correct format.";
    error.statusCode = 400;
  }

  // Handling Mongoose duplicate key errors (e.g., for unique email or number)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    error.message = `An entry already exists with the same ${field}.`;
    error.statusCode = 400;
  }

  // Ensure there's a status code and message for all errors
  error.statusCode = error.statusCode || 500;
  error.message = error.message || "An unexpected error occurred.";

  logger.error(error.message);

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

module.exports = errorHandler;
