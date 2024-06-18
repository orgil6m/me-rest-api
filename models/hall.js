const mongoose = require("mongoose");
const { Schema } = mongoose;

const AreaSchema = new Schema(
  {
    id: { type: String, required: [true, "Area ID is required"] },
  },
  { _id: false }
);

const ObjectSchema = new Schema(
  {
    label: { type: String, required: [true, "Object label is required"] },
    x: { type: Number, required: [true, "X coordinate is required"] },
    y: { type: Number, required: [true, "Y coordinate is required"] },
    height: { type: Number, required: [true, "Object height is required"] },
    width: { type: Number, required: [true, "Object width is required"] },
    svg: { type: String },
  },
  { _id: false }
);

const SeatSchema = new Schema(
  {
    label: { type: String, required: [true, "Seat label is required"] },
    seatId: { type: String, required: [true, "Seat ID is required"] },
    min: { type: Number, required: [true, "Minimum seats are required"] },
    max: { type: Number, required: [true, "Maximum seats are required"] },
    x: { type: Number, required: [true, "X coordinate is required"] },
    y: { type: Number, required: [true, "Y coordinate is required"] },
    width: { type: Number, required: [true, "Table width is required"] },
    height: { type: Number, required: [true, "Table height is required"] },
    area: { type: String, required: [true, "Area is required"] },
    row: { type: Number },
    col: { type: Number },
    number: { type: Number, required: [true, "Seat number is required"] },
    svg: { type: String },
  },
  { _id: false }
);

const HallSchema = new Schema(
  {
    type: { type: String, required: [true, "Type is required"] },
    height: { type: Number, required: [true, "Height is required"] },
    width: { type: Number, required: [true, "Width is required"] },
    areas: [AreaSchema],
    objects: [ObjectSchema],
    label: { type: String, required: [true, "Label is required"] },
    seats: [SeatSchema],
    svg: { type: String },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

module.exports = mongoose.model("Hall", HallSchema);
