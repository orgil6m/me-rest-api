const {
  sendEmail,
  emailPaymentSuccess,
  emailDeliveryFeePaymentSuccess,
  emailTicketPaymentSuccess,
} = require("./email");
const { sendMessage } = require("./message");

const webUrl = process.env.WEB_URL;
const adminNumber = process.env.ADMIN_NUMBER;
const adminEmail = process.env.ADMIN_EMAIL;

const sendMerchOrderSuccessNotification = async (customer, order) => {
  const { name, email, number, emailVerified, numberVerified } = customer;
  if (email && emailVerified) {
    const { orderId } = order;
    const subject = `${orderId}-Payment Succesfully!`;
    const callBackUrl = webUrl + "/account/orders/" + orderId;
    const mailmessage = emailPaymentSuccess(name, callBackUrl);
    sendEmail({ to: email, subject, message: mailmessage });
  }
  if (number && numberVerified) {
    let message;
    if (order != "pickup") {
      message =
        "Tany zahialga batalgaajlaa. Ta club-ees irj zahialgaa avna uu! FatCat Jazz Club | (+976) 75098787";
    } else {
      message =
        "Tany zahialga batalgaajlaa. Hurguuleh hayagaas hamaarch hurgeltiin huls bodogdono! FatCat Jazz Club | (+976) 75098787";
    }
    sendMessage(number, message);
  }
  const type = order.type == "quick" ? "Yaraltai" : "Engiin";
  const adminCallBack = `https://fatcatjazzclub.com/admin/merch/orders/${order.orderId}`;
  sendEmail({
    to: adminEmail,
    subject: `${type} захиалга : ${number}`,
    message: `${type} zahialga: ${number} dugaartai hereglegchees hurgeltiin zahialga orj irlee. Холбоос:${adminCallBack}`,
  });
  if (order != "pickup") {
    let adminMessage = `${type} zahialga: ${number} dugaartai hereglegchees hurgeltiin zahialga orj irlee. Holboos:${adminCallBack}`;
    sendMessage(adminNumber, adminMessage);
  }
};

const sendTicketSuccessNotification = async (customer, order, tickets) => {
  const { name, email, emailVerified } = customer;
  if (email && emailVerified) {
    const { event } = order;
    const subject = `${event.title} - Payment Succesful!`;
    const callBackUrl = webUrl + "/account/tickets/";
    const myTickets = tickets.map(
      (ticket) => `
        <strong>
            <a target="_blank" href=${webUrl + "/tickets/" + ticket._id}>
                ${ticket.ticketId}
            </a>
        </strong>
      `
    );
    const mailmessage = emailTicketPaymentSuccess(
      event,
      name,
      callBackUrl,
      myTickets
    );
    sendEmail({ to: email, subject, message: mailmessage });
  }
};

const sendDeliveryNotification = async (customer, order) => {
  const { email, number, emailVerified, numberVerified } = customer;
  if (email && emailVerified) {
    const { orderId } = order;
    const subject = `${orderId} - Delivery Fee Paid Succesfully!`;
    const callBackUrl = webUrl + "/account/orders/" + orderId;

    const mailmessage = emailDeliveryFeePaymentSuccess(subject, callBackUrl);
    sendEmail({ to: email, subject, message: mailmessage });
  }

  if (number && numberVerified) {
    let message =
      "Tany hurgeltiin tulbur tulugdluu. Bid tun udahgui tany baraag hurgeh bolno! FatCat Jazz Club | (+976) 75098787";
    sendMessage(number, message);
  }
  const type = order.type == "quick" ? "Yaraltai" : "Engiin";
  const adminCallBack = `https://fatcatjazzclub.com/admin/merch/orders/${order.orderId}`;
  sendEmail({
    to: adminEmail,
    subject: `${type} hurgelt tulugdluu : ${number}`,
    message: `${type} hurgelt tulugdluu: ${number} dugaartai hereglegch hurgeltiin tulburuu tulluu. Holboos:${adminCallBack}`,
  });
  if (order != "pickup") {
    let adminMessage = `${type} hurgelt tulugdluu: ${number} dugaartai hereglegch hurgeltiin tulburuu tulluu. Holboos:${adminCallBack}`;
    sendMessage(adminNumber, adminMessage);
  }
};

module.exports = {
  sendTicketSuccessNotification,
  sendMerchOrderSuccessNotification,
  sendDeliveryNotification,
};
