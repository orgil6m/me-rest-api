const express = require("express");

const { errorPage } = require("../controllers/error");
const router = express.Router();

router.route("/").get(errorPage);

module.exports = router;
