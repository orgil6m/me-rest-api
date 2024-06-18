const mongoose = require("mongoose");
const { userRoles } = require("../lib/constants");
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config/config");

const UserSchema = new Schema(
  {
    username: { type: String, required: "Username is required", unique: true },
    password: { type: String, required: "Password is required" },
    role: {
      type: [String],
      required: "Role is required",
      enum: userRoles,
    },
    createdBy: {
      type: Schema.ObjectId,
      ref: "User",
    },
    lastLogin: Date,
    updatedBy: {
      type: Schema.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

UserSchema.methods.getJsonWebToken = function () {
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

module.exports = mongoose.model("User", UserSchema);
