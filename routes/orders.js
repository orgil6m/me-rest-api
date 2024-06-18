const express = require("express");
const { createOrder } = require("../controllers/orders");
const { isAuth } = require("../middlewares/auth");
const router = express.Router();

router.route("/").post(isAuth, createOrder);

module.exports = router;
