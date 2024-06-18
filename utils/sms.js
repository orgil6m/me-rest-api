const axios = require("axios");
const asyncHandler = require("express-async-handler");
require("dotenv").config();

exports.sendMessage = asyncHandler(async ({ number, message }) => {
  const token = process.env.MESSAGE_TOKEN;
  const response = await axios(
    `http://web2sms.skytel.mn/apiSend?token=${token}&sendto=${number}&message=${message}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
    }
  );
  const resJson = await response.json();
  return resJson;
});
