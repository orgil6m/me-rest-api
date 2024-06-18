const asyncHandler = require("express-async-handler");
const axios = require("axios");
const MyError = require("./myError");
const { getRandomCode } = require("./tools");

const { QPAY_USER, QPAY_PASS, QPAY_INVOICE_CODE, QPAY_HOST } = process.env;

const createQpayInvoice = asyncHandler(
  async ({
    amount,
    description: invoice_description,
    invoice_receiver_code = "terminal",
    callback_url,
  }) => {
    const { access_token } = await getQpayToken();

    const url = `${QPAY_HOST}/v2/invoice`;
    const invoice_code = QPAY_INVOICE_CODE;
    if (!access_token) throw new MyError("Qpay token амжилтгүй!", 500);
    const sender_invoice_no = getRandomCode(8);
    const Authorization = `Bearer ${access_token}`;
    let config = {
      method: "post",
      url,
      data: {
        invoice_code,
        sender_invoice_no,
        invoice_description,
        invoice_receiver_code,
        amount,
        callback_url,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization,
      },
    };
    const response = await axios.request(config);
    if (response.status === 200) {
      return response.data;
    } else throw new MyError("Qpay амжилтгүй!", 500);
  }
);

const checkQpayInvoice = asyncHandler(async (invoice_id) => {
  const { access_token } = await getQpayToken();
  const Authorization = `Bearer ${access_token}`;
  if (!access_token) throw new MyError("Qpay token амжилтгүй!", 500);

  const url = `${QPAY_HOST}/v2/payment/check`;
  let config = {
    method: "post",
    url,
    data: {
      object_type: "INVOICE",
      object_id: invoice_id,
      offset: {
        page_number: 1,
        page_limit: 100,
      },
    },
    headers: {
      "Content-Type": "application/json",
      Authorization,
    },
  };
  const { data } = await axios.request(config);
  if (data.count === 1) {
    return {
      status: 200,
      message: "Төлбөр төлөгдсөн байна.",
      data: data.rows,
    };
  } else {
    return {
      status: 401,
      message: "Төлбөр хүлээгдэж байна.",
    };
  }
});

const getQpayToken = asyncHandler(async () => {
  const url = `${process.env.QPAY_HOST}/v2/auth/token`;
  const Authorization = `Basic ${Buffer.from(
    `${QPAY_USER}:${QPAY_PASS}`
  ).toString("base64")}`;

  let config = {
    method: "post",
    maxBodyLength: Infinity,
    url,
    headers: {
      "Content-Type": "application/json",
      Authorization,
    },
  };
  const response = await axios.request(config);
  if (response.data.status === 401) {
    console.log("GET QPAY TOKEN FAILED!".red);
  }
  return response.data;
});

module.exports = {
  createQpayInvoice,
  checkQpayInvoice,
  getQpayToken,
};
