// Author : 0zyxel0
/**
 * 
 * The formResponse function provides a formatted json string for responses of http requests.
 * @param {*} statusName This will contain status like ["success", "fail","error"]
 * @param {*} payloadVal This will contain the payload data if process was successful.
 * @param {*} errorVal This will contain failed and error data if process was unsuccessful.
 * @returns {Object} Returns a formatted JSON Object.
 */
const logger = require("./../logger");
module.exports.formResponse = function (
  statusName = null,
  payloadVal = null,
  errorVal = null
) {
  let payload = {
    status: statusName || "default",
    payload: payloadVal || null,
    error: errorVal || null,
  };
  logger.info("[Response Formatter] Formatting Response");
  logger.info(JSON.stringify(payload));
  return payload;
};
