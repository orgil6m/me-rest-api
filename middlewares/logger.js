const moment = require("moment");

const logger = (req, res, next) => {
  const now = moment().format("YYYY-MM-DD HH:mm:ss");
  let method;
  switch (req.method) {
    case "GET":
      method = req.method.green;
      break;
    case "POST":
      method = req.method.yellow;
      break;
    case "PUT":
      method = req.method.blue;
      break;
    case "DELETE":
      method = req.method.red;
      break;
    default:
      break;
  }
  console.log(`[${now.italic}] ${method} :: ${req.originalUrl}`);
  next();
};

module.exports = logger;
