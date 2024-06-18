const asyncHandler = require("express-async-handler");
const axios = require("axios");
var crypto = require("crypto");

const golomtURL = process.env.GOLOMT_URL;
const golomtToken = process.env.GOLOMT_TOKEN;
const golomtKey = process.env.GOLOMT_KEY;

const checkSumConvertor = ({ key, message }) => {
  let hash = crypto.createHmac("sha256", key).update(message);
  return hash.digest("hex");
};

exports.createGolomtInvoice = asyncHandler(
  async ({ amount, id: transactionId, callback_url }) => {
    const returnType = "GET";
    const checkSum = checkSumConvertor({
      key: golomtKey,
      message: transactionId + amount + returnType + callback_url,
    });

    const body = {
      amount: amount,
      callback: callback_url,
      checksum: checkSum,
      genToken: "N",
      returnType: returnType,
      transactionId,
      socialDeeplink: "Y",
    };

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: `${golomtURL}/api/invoice`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${golomtToken}`,
      },
      data: JSON.stringify(body),
    };

    const res = await axios.request(config);
    return res.data;
  }
);

exports.checkGolomtInvoice = asyncHandler(async (invoiceId) => {
  const checkSum = checkSumConvertor({
    key: golomtKey,
    message: invoiceId + invoiceId,
  });
  const body = {
    checksum: checkSum,
    transactionId: invoiceId,
  };

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url: `${golomtURL}/api/inquiry`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${golomtToken}`,
    },
    data: JSON.stringify(body),
  };
  const res = await axios.request(config);
  const { data } = res;
  if (data.errorCode == "000") {
    return {
      status: 200,
      message: data.errorDesc,
    };
  } else {
    return {
      status: data.errorCode,
      message: data.errorDesc,
    };
  }
});
