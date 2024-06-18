const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");

exports.isAuth = asyncHandler(async (req, res, next) => {
  if (!req.headers.authorization) {
    throw new MyError("Токен байхгүй байна!", 401);
  }
  const token = req.headers.authorization.split(" ")[1];
  if (!token) {
    throw new MyError("Токен байхгүй байна!", 401);
  }
  const jwtSecret = process.env.JWT_SECRET;
  const tokenObj = jwt.verify(token, jwtSecret);

  req.userId = tokenObj.id;
  req.userRole = tokenObj.role;
  next();
});

exports.authorize = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(...req.userRole)) {
      throw new MyError("Таны эрх хүрэхгүй байна!", 403);
    }
    next();
  });
};
