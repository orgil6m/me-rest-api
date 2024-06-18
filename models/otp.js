const mongoose = require("mongoose");
const { Schema } = mongoose;

const OtpSchema = new Schema(
  {
    method: {
      type: String,
      required: [true, "otp.method  дамжуулна уу"],
      index: true,
    },
    value: {
      type: String,
      required: [true, "otp.value  дамжуулна уу"],
      index: true,
    },
    code: {
      type: String,
      required: [true, "otp.code  дамжуулна уу"],
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expireAt: {
      type: Date,
      default: Date.now,
      expires: 300,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedDate: { type: Date },
  },
  {
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    minimize: false,
  }
);

module.exports = mongoose.model("Otp", OtpSchema);
