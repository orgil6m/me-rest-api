const axios = require("axios");

async function sendMessage(number, message) {
  try {
    const response = await axios(
      `http://web2sms.skytel.mn/apiSend?token=${process.env.MESSAGE_TOKEN}&sendto=${number}&message=${message}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
      }
    );
    return response;
  } catch (error) {
    return error;
  }
}

module.exports = {
  sendMessage,
};
