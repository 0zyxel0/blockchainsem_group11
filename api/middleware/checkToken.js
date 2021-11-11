
require("dotenv").config();
// This Middleware verifies the token passed is true or not.
const jwt = require("jsonwebtoken");
const PUB_KEY = process.env.JWT_TOKEN_SECRET;
/**
* The Check Token Parameter checks the JWT token if the user is authenticated for the features to be used.
* @param {*} req 
* @param {*} res 
* @param {*} next 
* @returns 
*/
module.exports.checkToken = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  // Get only the part of the payload after the Bearer word
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.status(401).json({
      status: "error",
      payload: null,
      error: "Invalid Token Provided or Token has already Expired."

    });
  }

  if (!PUB_KEY) {
    return res.status(500).json({ error: "Identification key not found" });
  }

  jwt.verify(token, PUB_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({
        status: "error",
        payload: "Invalid Token Provided or Token has already Expired.",
        error: err.message
      });
    }
    req.user = user;
    next();
  });
};
