const express = require("express");
const router = express.Router();

const { isAuth, authorize } = require("../middlewares/auth.js");
const {
  getEvents,
  createEvent,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventHall,
} = require("../controllers/events.js");

router.route("/").get(getEvents).post(isAuth, authorize("admin"), createEvent);

router
  .route("/:id")
  .get(getEvent)
  .put(isAuth, authorize("admin", "manager"), updateEvent)
  .delete(isAuth, authorize("admin", "manager"), deleteEvent);

router.route("/:id/hall").get(getEventHall);

module.exports = router;
