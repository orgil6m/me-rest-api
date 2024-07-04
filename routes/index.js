const express = require("express");
const errorRoutes = require("./error");
const router = express.Router();

router.use("*", errorRoutes);

module.exports = router;
