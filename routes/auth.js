const express = require("express");
const { reqOTP, checkOTP, login } = require("../controllers/auth");
const { isAuth } = require("../middlewares/auth");
const router = express.Router({ mergeParams: true });

router.route("/login").post(login);
router.route("/req-otp").post(reqOTP);
router.route("/check-otp").post(checkOTP);

module.exports = router;
