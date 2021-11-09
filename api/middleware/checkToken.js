/**
 * The Check Token Parameter checks the JWT token if the user is authenticated for the features to be used.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
module.exports.checkToken = function (req, res, next) {
  if (req.user === "admin") {
    next();
  } else {
    return res.status(409).json("Unauthorized!");
  }
};
