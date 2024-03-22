const { colorize, timestamp } = require("../utils/logger");

const loggerMiddleware = (req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    let method = req.method.toLowerCase();
    const color = colorize(method);
    method = req.method[color];
    const url = req.originalUrl;
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    console.log(`${timestamp()} ${ip} ${method} :: ${url} [${duration}ms]`);
  });
  next();
};

module.exports = loggerMiddleware;
