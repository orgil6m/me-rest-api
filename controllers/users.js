const Users = require("../models/user");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");
const paginate = require("../utils/paginate");

// api/v1/users :: GET
exports.getUsers = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sort = req.query.sort;
  const select = req.query.select;
  ["select", "sort", "page", "limit"].forEach((el) => delete req.query[el]);
  const pagination = await paginate(page, limit, Users);
  const query = {
    // createdBy: req.userId,
    ...req.query,
  };

  const users = await Users.find(query, select)
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    data: users,
    pagination,
  });
});

// api/v1/users/:id :: GET
exports.getUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const select = { createdAt: 0, updatedAt: 0 };
  const user = await Users.findById(id, select).lean();
  if (!user) throw new MyError(id + " ID-тэй хэрэглэгч байхгүй.", 404);
  res.status(200).json({ success: true, data: user });
});

// api/v1/users :: POST
exports.createUser = asyncHandler(async (req, res, next) => {
  const { body } = req;
  body.createdBy = req.userId;
  const user = await Users.create(body);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// api/v1/users/:id :: PUT
exports.updateUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await Users.findById(id);
  if (!user) {
    throw new MyError(id + " ID-тэй хэрэглэгч байхгүй.", 404);
  }

  if (!(id === req.userId || req.userRole === "admin")) {
    throw new MyError("Та зөвхөн өөрийн мэдээллийг засах эрхтэй!", 403);
  }
  for (let attr in req.body) {
    user[attr] = req.body[attr];
  }
  await user.save();

  res.status(200).json({
    success: true,
    data: user,
  });
});

// api/v1/users/:id :: DELETE
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const user = await Users.findById(id);

  if (!user) {
    throw new MyError(id + " ID-тэй хэрэглэгч байхгүй.", 404);
  }
  if (!(id === req.userId || req.userRole === "admin")) {
    throw new MyError("Та зөвхөн өөрийн мэдээллийг устгах эрхтэй!", 403);
  }
  await user.deleteOne();

  res.status(200).json({
    success: true,
    data: user,
  });
});
