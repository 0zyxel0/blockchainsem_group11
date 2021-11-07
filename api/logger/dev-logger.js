require("dotenv").config();
const { format, createLogger, transports } = require("winston");
const { timestamp, combine, printf, errors } = format;

// Create A logger function
function buildDevLogger() {
  const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `[${timestamp}] [${level}] - ${stack || message}`;
  });
  return createLogger({
    format: combine(
      format.colorize(),
      timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      errors({ stack: true }),
      logFormat
    ),
    transports: [
      new transports.Console(),
    ],
    exitOnError: false,
  });
}

module.exports = buildDevLogger;
