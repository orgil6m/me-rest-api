require("colors");
const moment = require("moment");

exports.timestamp = () => {
  const now = moment().format("YYYY-MM-DD HH:mm:ss");
  return `[${now.italic}]`;
};

exports.colorize = (method) => {
  const colorMethodMap = {
    get: "green",
    SUCCESS: "green",
    post: "yellow",
    WARNING: "yellow",
    put: "blue",
    INFO: "blue",
    delete: "red",
    ERROR: "red",
  };
  return colorMethodMap[method];
};

class Logger {
  constructor() {}

  info(message) {
    console.info(formatMessage("INFO", message));
  }

  error(message) {
    console.error(formatMessage("ERROR", message));
  }

  success(message) {
    console.log(formatMessage("SUCCESS", message));
  }

  warning(message) {
    console.warn(formatMessage("WARNING", message));
  }
}

const formatMessage = (level, message) => {
  const color = this.colorize(level);
  const now = this.timestamp();
  return `${now} ${level[color]} :: ${message} `;
};

exports.myLogger = new Logger();
