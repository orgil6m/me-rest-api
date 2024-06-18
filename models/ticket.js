const mongoose = require("mongoose");
const { Schema } = mongoose;

const TicketSchema = new Schema(
  {
    ticketId: {
      type: String,
      required: [true, "Ticket CustomerId required!"],
    },
    customerId: {
      type: Schema.ObjectId,
      ref: "User",
      // required: [true, "Ticket CustomerId required!"],
    },
    eventId: {
      type: Schema.ObjectId,
      ref: "Event",
      // required: [true, "Ticket EventId required!"],
    },
    orderId: {
      type: Schema.ObjectId,
      ref: "Order",
      // required: [true, "Ticket OrderId required!"],
    },
    tableId: {
      type: String,
      // required: [true, "Ticket TableId required!"],
    },
    status: {
      type: String,
      enum: ["used", "active"],
      default: "active",
      required: [true, "Ticket status required!"],
    },
    checkedAt: Date,
    checkedBy: { type: Schema.ObjectId, ref: "User" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Ticket", TicketSchema);
