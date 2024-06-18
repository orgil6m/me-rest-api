const mongoose = require("mongoose");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/config");

const CustomerSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    number: {
      type: "String",
    },
    emailVerified: { type: Boolean, default: false },
    numberVerified: { type: Boolean, default: false },
    name: String,
    country: String,
    lastLogin: Date,
    address1: String,
    address2: String,
    city: String,
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

CustomerSchema.methods.getJsonWebToken = function () {
  const jwtSecret = JWT_SECRET;
  const expiresIn = JWT_EXPIRES_IN;
  const token = jwt.sign({ id: this._id, role: this.role }, jwtSecret, {
    expiresIn,
  });
  const expirationTimeInMinutes = parseInt(expiresIn);
  const tokenExpTime = new Date();
  tokenExpTime.setMinutes(tokenExpTime.getMinutes() + expirationTimeInMinutes);
  return { token, tokenExpTime };
};

module.exports = mongoose.model("customer", CustomerSchema);
