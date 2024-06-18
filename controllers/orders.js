const asyncHandler = require("express-async-handler");
const Order = require("../models/order");
const Ticket = require("../models/ticket");

const MyError = require("../utils/myError");
const { getRandomCode } = require("../utils/tools");
const { isAvailable } = require("../utils/seats");
const {
  generateTableTickets,
  generateStandingTickets,
} = require("../utils/orders");
const { sendTicketSuccessNotification } = require("../utils/notifications");

// api/v1/orders :: POST
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { body } = req;
  const { eventId, seats, customerId } = body;

  const available = await isAvailable(Order, eventId, seats, customerId);

  if (!available)
    throw new MyError(
      `The chosen tables have been reserved by another customer!`,
      400
    );

  const code = getRandomCode(6);
  body.code = code;

  const order = await Order.create(body);
  res.status(200).json({
    success: true,
    data: { orderId: order._id },
  });
});

exports.approveOrder = asyncHandler(async (id) => {
  const order = await Order.findOne({ _id: id, status: "pending" }).populate({
    path: "eventId",
    select: "type",
  });

  if (!order) throw new MyError("Order not found!", 404);
  const { seats, customerId, eventId, quantity } = order;
  const { type } = eventId;
  const tickets = [];
  const ticket = {
    customerId,
    eventId,
    orderId: id,
  };
  switch (type) {
    case "table":
      generateTableTickets({ seats, tickets, ticket });
      break;
    case "standing":
      generateStandingTickets({ quantity, tickets, ticket });
      break;
    default:
      break;
  }

  await Ticket.create(tickets);
  order.status = "success";
  // sendTicketSuccessNotification(order.customerId, order, tickets);
  await order.save();

  return { status: 200, message: "Success" };
});
