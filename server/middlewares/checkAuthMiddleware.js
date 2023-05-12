const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    let tokenHeader = req.headers.authorization;
    let token = tokenHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.body = decoded;
    next();
  } catch (error) {
    res.status(401).send({
      message: "Not authorized",
      data: error,
      success: false,
    });
  }
};
