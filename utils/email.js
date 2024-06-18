const asyncHandler = require("express-async-handler");
const { createTransport } = require("nodemailer");
const { email, email_pass } = require("../config/config");

exports.sendEmail = asyncHandler(async ({ to, subject, message }) => {
  const mailData = {
    from: `Fat Cat Jazz Club Ulaanbaatar <${email}>`,
    to,
    subject,
    html: message,
  };

  const auth = {
    user: email,
    pass: email_pass,
  };

  const transporter = createTransport({ service: "gmail", auth });
  await transporter.sendMail(mailData);
  console.log(`Email OTP | successfully sent to ${to}!`);
});

exports.emailMessage = ({ message }) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: Arial, sans-serif; color: #343434; }
      .table {width: 100%; max-width: 600px; margin: auto; border-spacing:0px; background-color:#f2f2f2; }
      .container { background-color:white; }
      .header { display:flex; font-weight:bold; text-align: left; padding: 12px; border-bottom:1px solid #00000010;}
      .content { background: white; padding: 0px 12px; text-align: left;}
      .footer { padding: 12px; text-align: center; font-size: 12px; border-top:1px solid #00000010;}
    </style>
  </head>
  <body>
    <table class="table">
    <tbody class="container">
      <tr>
        <td>
          <div class="header">
            <img src="https://images.squarespace-cdn.com/content/v1/5b8424290dbda3e6230d8bca/1535387521077-4E7HPF4EMTWFQO48HHM9/Heesco+-+Fat+Cat+Jazz+Club+logo.png?format=150w" alt="" style="width: 48px; height:48px; margin-right:12px;"/>
            <span style="font-weight:bold; font-size:24px; margin: auto 0px;">Fatcatjazzclub.com</span>
          </div>
        </td>
      </tr
      ${message}
      <tr>
        <td class="footer">
          &copy; FatcatJazzClub.com | All Rights Reserved
        </td>
      </tr>
      </tbody>
    </table>
  </body>
  </html>
  `;
};

exports.otpEmailMessage = ({ code }) => {
  return `
  <tr>
    <td class="content">
      <p>Hi there,</p>
      <p>Thank you for approaching Fat Cat Jazz Club, where the cool cats go!</p>
    </td>
  </tr>
  <tr>
  <td class="content" style="padding-bottom:12px">
  <p style="margin-block-start:0em;">We want to make sure it's really you. Please enter the following verification code. If you didn't want to sign into your account, ignore this email.
  </p>
    <div
      style="
        border: 2px dashed #B91313;
        border-radius: 0px;
        padding: 10px;
        background-color:#b913131f;
        text-align: center; 
      ">  
      <span>Verification code:</span>
      <br>
      <span style="
        font-size: 40px;
        letter-spacing: 4px;
        color: #B91313;
        font-weight:bold;
      ">
        ${code}
      </span>
    </div>
  </td>
</tr>`;
};

exports.emailTicketPaymentSuccess = (event, username, callBackUrl, tickets) => {
  return `
  <tr>
    <td>
      <span style="font-size: 24px; font-weight: bold; line-height: 32px; text-align: center;">Congratulations ${username}!</span><br>
      <span style="font-size: 16px">Your order has been successfully paid.</span>
    </td>
  </tr>
  <tr>
    <td>
      <p>Event: <strong>${event.title}</strong></p>
      <p>Tickets: ${tickets}</p>
      <p>Date: <strong>${event.time}, ${event.date}</strong></p>
      <p>Date & Location: <strong><a href="${event.venue.link}">${event.venue.label}</a></strong></p>
    </td>
  </tr>
  <tr>
    <td>
      <a href="${callBackUrl}" target="_blank" style="background-color: #b91313; color: #ffffff; padding: 15px 30px; text-decoration: none; text-transform: uppercase; font-weight: bold; border-radius: 4px; display: inline-block;">Show Tickets</a>
    </td>
  </tr>
  <tr>
    <td style="font-size: 12px; color: #666;">
      Thank you for choosing Fat Cat Jazz Club!
    </td>
  </tr>
  `;
};
