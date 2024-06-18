const mongoose = require("mongoose");
const { Schema } = mongoose;

const EventSchema = new Schema(
  {
    title: { type: String, required: [true, "Event title is required"] },
    description: {
      type: String,
      required: [true, "Event description is required"],
    },
    contact: { type: String, required: [true, "Event Contact is required"] },
    venue: {
      label: {
        type: String,
        required: [true, "Event venue label is required"],
      },
      link: { type: String, required: [true, "Event Venue link is required"] },
    },
    type: {
      type: String,
      required: [true, "Event type is required"],
      enum: ["table", "standing"],
    },
    hall: {
      _id: { type: Schema.ObjectId, ref: "Hall", required: true },
      areas: [
        {
          id: {
            type: String,
            required: [true, "Event Hall Area ID is required"],
          },
          fee: {
            type: Number,
            required: [true, "Event Hall Area Fee is required"],
          },
        },
      ],
    },
    image: {
      path: { type: String, required: [true, "Event Image path is required"] },
      min: {
        type: String,
        required: [true, "Event Minimized image path is required"],
      },
    },
    duration: { type: String, required: [true, "Event Duration is required"] },
    date: { type: String, required: [true, "Event Date is required"] },
    time: { type: String, required: [true, "Ecent Time is required"] },
    artists: [
      {
        type: Schema.ObjectId,
        ref: "User",
      },
    ],
    isVisible: {
      type: Boolean,
      required: [true, "Event Visibility status is required"],
    },
    isReservable: {
      type: Boolean,
      required: [true, "Event Reservable status is required"],
    },
    createdBy: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "Event CreatedBy is required"],
    },
    updatedBy: {
      type: Schema.ObjectId,
      ref: "User",
      required: [true, "Event UpdatedBy is required"],
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

// EventSchema.pre("find", function () {
//   this.populate("createdBy", "username");
// });

EventSchema.pre("findOne", function () {
  this.populate("hall", "type");
});

module.exports = mongoose.model("Event", EventSchema);
