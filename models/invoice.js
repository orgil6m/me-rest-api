const mongoose = require("mongoose");
const { Schema } = mongoose;

const allowedInvoiceRefTypes = [
  "order",
  "merchOrder",
  "donationOrder",
  "deliveryOrder",
];

const qpayUrlSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const socialpaySchema = new Schema(
  {
    socialDeeplink: {
      type: String,
      required: true,
    },
    checksum: {
      type: String,
      required: true,
    },
    invoice: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const qpaySchema = new Schema(
  {
    invoice_id: {
      type: String,
      required: true,
    },
    qr_text: {
      type: String,
      required: true,
    },
    qr_image: {
      type: String,
      required: true,
    },
    qPay_shortUrl: {
      type: String,
      required: true,
    },
    urls: [qpayUrlSchema],
  },
  { _id: false }
);

const InvoiceSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      required: [true, "Төлбөрийн хэрэгсэл дамжуулна уу"],
      enum: ["qpay", "socialpay", "card"],
    },
    description: {
      type: String,
      required: [true, "Гүйлгээний утга дамжуулна уу"],
    },
    type: {
      type: String,
      enum: ["customer", "admin"],
      required: [true, "Invoice type дамжуулна уу"],
    },
    amount: {
      type: Number,
      required: [true, "Гүйлгээний дүн дамжуулна уу"],
      min: [100, "Гүйлгээний дүн хамгийн багадаа 100 байх боломжтой"],
    },
    refType: {
      type: String,
      enum: allowedInvoiceRefTypes,
      required: [true, "Ref Type дамжуулна уу"],
    },
    refId: {
      type: Schema.Types.ObjectId,
      required: [true, "Ref Id дамжуулна уу"],
      refPath: "refType",
    },
    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },
    code: {
      type: String,
      index: true,
      required: [true, "Invoice code дамжуулна уу."],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: [true, "Invoice creator дамжуулна уу."],
      refPath: "type",
    },
    qpay: qpaySchema,
    socialpay: socialpaySchema,
  },
  {
    timestamps: true,
    toObject: {
      virtuals: true,
    },
    toJSON: {
      virtuals: true,
    },
    minimize: false,
  }
);

module.exports = mongoose.model("Invoice", InvoiceSchema);
