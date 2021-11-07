require("dotenv").config();
const { format, createLogger, transports } = require('winston');
const { timestamp, combine, errors, json } = format;

function buildProdLogger() {
    return createLogger({
      format: combine(timestamp(), errors({ stack: true }), json()),
      defaultMeta: { service: process.env.PROJECT_NAME || 'Service Name' },
      transports: [new transports.Console()],
    });
  }
  
  module.exports = buildProdLogger;