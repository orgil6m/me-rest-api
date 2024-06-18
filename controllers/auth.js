const asyncHandler = require("express-async-handler");
const Otp = require("../models/otp");
const Customer = require("../models/customer");
const { sendEmail, emailMessage, otpEmailMessage } = require("../utils/email");
const { sendMessage } = require("../utils/sms");
const { getRandomCode } = require("../utils/tools");

const MyError = require("../utils/myError");
const { isValidEmail, isValidNumber } = require("../utils/validate");

const select = { createdAt: 0, updatedAt: 0, createdBy: 0, updatedBy: 0 };

// api/v1/auth/login :: POST
exports.login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;
  const user = await Customer.findOne({ username }, select);

  if (!user) throw new MyError("Бүртгэлгүй хэрэглэгч байна!", 404);

  if (user.password != password) {
    throw new MyError("Хэрэглэгчийн нууц үг буруу байна!", 404);
  }
  user.lastLogin = new Date();
  await user.save();
  res.status(200).json({ success: true, data: await buildUserObj(user) });
});

// api/v1/auth/req-otp :: POST
exports.reqOTP = asyncHandler(async (req, res) => {
  const { method, value } = req.body;

  let message;
  const code = getRandomCode(4);

  const otp = await Otp.create({ code, method, value: value.toLowerCase() });
  if (!otp) {
    throw new MyError("OTP үүсгэж чадсангүй.", 500);
  }

  switch (method) {
    case "email":
      if (isValidEmail(value)) {
        message = otpEmailMessage({ code: code });
        sendEmail({
          to: value,
          subject: `Verification Code`,
          message: emailMessage({ message }),
        });
      }
      break;
    case "number":
      if (isValidNumber(value)) {
        message = `FatCatJazzClub.com | Batalgaajuulah code  : ${code}`;
        sendMessage({ number: value, message });
      }
      break;
    default:
      throw new MyError("Method буруу байна.", 400);
  }

  res.status(200).json({ success: true });
});

// api/v1/auth/check-otp :: POST
exports.checkOTP = asyncHandler(async (req, res, next) => {
  const { value, code } = req.body;

  const otp = await Otp.findOne({ value: value.toLowerCase() }).sort({
    createdAt: -1,
  });

  if (!otp) throw new MyError("Код олдсонгүй.", 400);

  if (otp.code != code) throw new MyError("Код буруу байна.", 400);

  if (otp.isVerified) throw new MyError("Ашиглагдсан OTP байна.", 400);

  const query = value.includes("@")
    ? { email: value.toLowerCase() }
    : { number: value };

  const user = await Customer.findOne(query, select);
  if (!user) throw new MyError("Бүртгэлгүй хэрэглэгч байна!", 404);
  const method = value.includes("@") ? "email" : "number";

  let isUserUpdated = false;
  if (method == "number" && !user.numberVerified) {
    user.numberVerified = true;
    isUserUpdated = true;
  } else if (method == "email" && !user.emailVerified) {
    user.emailVerified = true;
    isUserUpdated = true;
  }

  if (isUserUpdated) await user.save();
  otp.isVerified = true;
  await otp.save();
  const userObj = await buildUserObj(user);
  res.status(200).json({ success: true, ...userObj });
});

const buildUserObj = async (user) => {
  const { token, tokenExpTime } = await user.getJsonWebToken();
  const userObj = user.toObject();
  delete userObj.updatedAt;
  delete userObj.id;
  const res = { customer: userObj, token, tokenExpTime };
  return res;
};
