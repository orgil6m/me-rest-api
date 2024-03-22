const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");

exports.errorPage = asyncHandler(async (req, res, next) => {
  throw new MyError(
    `The requested endpoint ${req.originalUrl} is not available.`,
    404
  );
});
