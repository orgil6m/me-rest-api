const express = require("express");
const router = express.Router();

const { isAuth } = require("../middlewares/auth.js");
const {
  createInvoice,
  approveInvoice,
  checkInvoice,
} = require("../controllers/invoices.js");

router.route("/").post(createInvoice);
router.route("/check/:id").post(checkInvoice);
router.route("/approve/:code").get(approveInvoice);

module.exports = router;
