const jwt = require("jsonwebtoken");

//to be added to private routes (routes that you should be logged in to access)
module.exports = function auth(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader) return res.status(403).json({ message: "Access Denied" });
  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid token" });
  }
};
