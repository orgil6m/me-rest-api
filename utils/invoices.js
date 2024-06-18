const Customers = require("../models/customer");
const asyncHandler = require("express-async-handler");
const MyError = require("./myError");
const { approveOrder } = require("../controllers/orders");

exports.approveInvoiceObj = asyncHandler(async ({ refType, refId }) => {
  switch (refType) {
    case "order":
      await approveOrder(refId);
      break;
    case "merchOrder":
      await approveMerchOrder();
      break;
    case "deliveryOrder":
      await approveDeliveryOrder();
      break;
    case "donationOrder":
      await approveDonationOrder();
      break;
    default:
      break;
  }
});

const approveMerchOrder = asyncHandler(async () => {});
const approveDeliveryOrder = asyncHandler(async () => {});
const approveDonationOrder = asyncHandler(async () => {});
