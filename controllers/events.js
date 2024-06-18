const Events = require("../models/event");
const Halls = require("../models/hall");
const Tickets = require("../models/ticket");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");
const { parseQuery, setFilters } = require("../utils/events");
const paginate = require("../utils/paginate");
const { calcSeats } = require("../utils/seats");

const publicSelect = { createdAt: 0, updatedAt: 0, createdBy: 0, updatedBy: 0 };

// api/v1/events :: GET
exports.getEvents = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const { parsedQuery, select, date, search } = parseQuery(req.query);
  const pagination = await paginate(page, limit, Events);
  const { query, sort } = setFilters(parsedQuery, date, search);

  const events = await Events.find(query, { ...publicSelect, ...select })
    .sort(sort)
    .skip(pagination.start - 1)
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    data: events,
  });
});

// api/v1/events/:id :: GET
exports.getEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const event = await Events.findById(id, publicSelect).lean();
  if (!event) throw new MyError(`${id} ID-тэй Event байхгүй.`, 404);

  const [tickets, hall] = await Promise.all([
    Tickets.find({ eventId: id }).lean(),
    Halls.findById(event.hall._id).lean(),
  ]);

  const { maxSeats, minSeats } = calcSeats({ seats: hall.seats, tickets });
  Object.assign(event, {
    maxSeats: maxSeats,
    minSeats: minSeats,
    hall: {
      ...event.hall,
      type: hall.type,
      width: hall.width,
      height: hall.height,
    },
  });

  res.status(200).json({ success: true, data: event });
});

// api/v1/events :: POST
exports.createEvent = asyncHandler(async (req, res, next) => {
  const { body } = req;
  body.createdBy = req.eventId;
  const event = await Events.create(body);
  res.status(200).json({
    success: true,
    data: event,
  });
});

// api/v1/events/:id :: PUT
exports.updateEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const event = await Events.findById(id);
  if (!event) {
    throw new MyError(id + " ID-тэй Event байхгүй.", 404);
  }

  if (!(id === req.eventId || req.eventRole === "admin")) {
    throw new MyError("Та зөвхөн өөрийн мэдээллийг засах эрхтэй!", 403);
  }
  for (let attr in req.body) {
    event[attr] = req.body[attr];
  }
  await event.save();

  res.status(200).json({
    success: true,
    data: event,
  });
});

// api/v1/events/:id :: DELETE
exports.deleteEvent = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const event = await Events.findById(id);

  if (!event) {
    throw new MyError(id + " ID-тэй Event байхгүй.", 404);
  }
  if (!(id === req.eventId || req.eventRole === "admin")) {
    throw new MyError("Та зөвхөн өөрийн мэдээллийг устгах эрхтэй!", 403);
  }
  await event.deleteOne();

  res.status(200).json({
    success: true,
    data: event,
  });
});

// api/v1/events/:id/hall:: GET
exports.getEventHall = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const [event, tickets] = await Promise.all([
    Events.findById(id, publicSelect).lean(),
    Tickets.find({ eventId: id }).lean(),
  ]);

  if (!event) throw new MyError(`${id} ID-тэй Event байхгүй.`, 404);

  const hallData = await Halls.findById(event.hall._id).lean();
  const { seats, objects, labels, type } = hallData;
  const { areas } = event.hall;

  const areaMap = new Map(areas.map((area) => [area.id, area.fee]));

  const ticketMap = new Map(
    tickets.map((ticket) => [ticket.tableId, ticket.createdAt])
  );

  const updatedSeats = seats.map((seat) => {
    if (areaMap.has(seat.area)) {
      seat.fee = areaMap.get(seat.area);
    }
    if (ticketMap.has(seat.seatId)) {
      seat.isReserved = true;
      seat.reservedDate = ticketMap.get(seat.seatId);
    }
    return seat;
  });

  const hallResponse = {
    ...event.hall,
    seats: updatedSeats,
    objects,
    labels,
    type,
  };

  res.status(200).json({ success: true, data: hallResponse });
});

// exports.getEventHall = asyncHandler(async (req, res, next) => {
//   const { id } = req.params;

//   const [event, tickets] = await Promise.all([
//     Events.findById(id, publicSelect).lean(),
//     Tickets.find({ eventId: id }).lean(),
//   ]);

//   if (!event) throw new MyError(id + " ID-тэй Event байхгүй.", 404);

//   const { hall } = event;

//   const { seats, objects, labels, type } = await Halls.findById(
//     event.hall._id
//   ).lean();

//   const { areas } = hall;

//   areas.map((area) => {
//     seats.map((seat) => {
//       if (area.id == seat.area) {
//         seat.fee = area.fee;
//       }
//     });
//   });

//   seats.map((seat) => {
//     tickets.map((ticket) => {
//       if (ticket.tableId == seat.seatId) {
//         seat.isReserved = true;
//         seat.reservedDate = ticket.purchasedDate;
//       }
//     });
//   });
//   hall.seats = seats;
//   hall.objects = objects;
//   hall.labels = labels;
//   hall.type = type;
//   res.status(200).json({ success: true, data: hall });
// });
