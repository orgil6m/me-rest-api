const mongoose = require("mongoose");
const { Schema } = mongoose;

const SeatSchema = new Schema(
  {
    seatId: { type: String, required: true },
    selectedSeats: { type: Number, required: true },
    fee: { type: Number, required: true },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["customer", "admin", "walkin"],
      required: [true, "Order type required!"],
    },
    customerId: {
      type: Schema.ObjectId,
      ref: "Customer",
      required: [true, "Order customerId required!"],
    },
    eventId: {
      type: Schema.ObjectId,
      ref: "Event",
      required: [true, "Order eventId required!"],
    },
    country: String,
    vat: {
      type: Boolean,
      required: [true, "Order vat required!"],
      default: false,
    },
    status: {
      type: String,
      enum: ["pending", "success"],
      default: "pending",
    },
    quantity: {
      type: Number,
      min: 1,
      required: [true, "Order quantity required!"],
    },
    amount: {
      type: Number,
      min: 1000,
      required: [true, "Order amount required!"],
    },
    seats: [SeatSchema],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Order", OrderSchema);
