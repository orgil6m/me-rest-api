const asyncHandler = require("express-async-handler");

exports.calcSeats = ({ seats, tickets }) => {
  const ticketMap = new Map();

  tickets.forEach((ticket) => {
    ticketMap.set(ticket.tableId, ticket);
  });

  let minSeats = 0;
  let maxSeats = 0;

  seats.forEach((seat) => {
    if (ticketMap.has(seat.seatId)) {
      const ticket = ticketMap.get(seat.seatId);
      seat.isReserved = true;
      seat.reservedDate = ticket.purchasedDate;
    } else {
      minSeats += seat.min;
      maxSeats += seat.max;
    }
  });

  return { seats, minSeats, maxSeats };
};

exports.isAvailable = asyncHandler(
  async (Order, eventId, seats, customerId) => {
    const seatIds = seats.map((seat) => seat.seatId);

    const query = {
      eventId,
      status: "pending",
      "seats.seatId": { $in: seatIds },
    };

    const order = await Order.findOne(query)
      .sort({ createdAt: -1 })
      .select("createdAt status customerId");

    if (!order) return true;

    const isMyOrder = customerId == order.customerId;
    const isOnHold = !isMyOrder && isWithinLast15Minutes(order.createdAt);
    if (order.status === "success" || isOnHold) return false;

    return true;
  }
);

const isWithinLast15Minutes = (createdAt) => {
  const currentTime = new Date();
  const fifteenMinutesAgo = new Date(currentTime.getTime() - 15 * 60000);
  const result = createdAt >= fifteenMinutesAgo;
  return result;
};
