const jwt = require("jsonwebtoken");
const ErrorHandler = require("./errorHandler");

//to be added to private routes (routes that you should be logged in to access)
module.exports = function auth(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) next(new ErrorHandler(401, "Unauthorized"));
  const token = authHeader.split(" ")[1];
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    next(new ErrorHandler(401, "Unauthorized"));
  }
};
