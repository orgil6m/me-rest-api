const Invoice = require("../models/invoice");
const asyncHandler = require("express-async-handler");
const MyError = require("../utils/myError");
const { createQpayInvoice, checkQpayInvoice } = require("../utils/qpay");
const { HOST, PORT } = process.env;
const { v4: uuid } = require("uuid");
const { createGolomtInvoice, checkGolomtInvoice } = require("../utils/golomt");
const { approveInvoiceObj } = require("../utils/invoices");
const API_URL = `${HOST}:${PORT}`;

// api/v1/invoices :: POST
exports.createInvoice = asyncHandler(async (req, res, next) => {
  const { body } = req;
  const { method, amount, description } = body;
  const code = uuid().replace(/-/gi, "");
  const callback_url = `${API_URL}/invoice/approve/${code}`;
  body.callback_url = callback_url;
  body.code = code;

  const invoice = await Invoice.create(body);

  let response;
  switch (method) {
    case "qpay":
      response = await createQpayInvoice({
        amount,
        description,
        callback_url,
      });
      invoice.qpay = response;
      break;
    case "socialpay" || "card":
      const { id } = invoice;
      response = await createGolomtInvoice({ amount, id, callback_url });
      invoice.socialpay = response;
      break;
    default:
      throw new MyError("Method дамжуулна уу", 400);
  }

  await invoice.save();

  res.status(200).json({
    success: true,
    data: { id: invoice.id, ...response },
  });
});

// api/v1/invoices/check/:id :: POST
exports.checkInvoice = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const invoice = await Invoice.findById(id);
  if (!invoice) throw new MyError(id + "ID-тай Invoice байхгүй", 404);
  const response = await checkInvoiceHandler(invoice);
  if (response != 200) throw new MyError("Төлбөр хүлээгдэж байна!", response);
  res.status(200).json({
    ...response,
    invoice: {
      status: invoice.status,
      method: invoice.method,
      amount: invoice.amount,
      description: invoice.description,
    },
  });
});

const checkInvoiceHandler = asyncHandler(async (invoice) => {
  const { id, method } = invoice;
  let res;
  switch (method) {
    case "qpay":
      const qpayId = invoice.qpay.invoice_id;
      res = await checkQpayInvoice(id, qpayId);
      break;
    case "socialpay" || "card":
      res = await checkGolomtInvoice(id);
    default:
      throw new MyError("Method дамжуулна уу", 400);
  }

  if (res.status === 200 || invoice.status === "Paid") {
    return 200;
  } else {
    return 402;
  }
});

// api/v1/invoices/approve/:code :: GET
exports.approveInvoice = asyncHandler(async (req, res, next) => {
  const webUrl = process.env.WEB_URL;
  const { code } = req.params;
  const invoice = await Invoice.findOne({ code });
  if (!invoice) throw new MyError("Invoice олдсонгүй.", 404);

  if (invoice.status == "Paid")
    throw new MyError("Invoice аль хэдий нь төлөгдсөн байна.", 400);
  const check = await checkInvoiceHandler(invoice);

  if (check != 200) {
    return res.redirect(301, `${webUrl}/account`);
  }

  invoice.status = "Paid";
  const { refType, refId, type, createdBy } = invoice;
  await approveInvoiceObj({ refType, refId, type, createdBy });
  await invoice.save();
  res.status(200).json({
    success: true,
  });
});
