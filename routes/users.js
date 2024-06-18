const express = require("express");
const router = express.Router();

const { isAuth, authorize } = require("../middlewares/auth.js");

const {
  getUser,
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users.js");

router
  .route("/")
  .get(isAuth, authorize("admin", "manager"), getUsers)
  .post(isAuth, authorize("admin", "manager"), createUser);

router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
