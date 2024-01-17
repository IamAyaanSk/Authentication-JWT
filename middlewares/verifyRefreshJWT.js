const jwt = require("jsonwebtoken");

const verifyRefreshJWT = (req, res, next) => {
  if (!req.cookies || !req.cookies.jwt) {
    res.status(401);
    res.send({
      success: false,
      message: "Invalid Token",
    });
    return;
  }

  const refreshToken = req.cookies.jwt;

  const decoded = jwt.verify(refreshToken, "refresh-secret-key");

  if (!decoded) {
    res.status(401);
    res.send({
      success: false,
      message: "Invalid Token",
    });
    return;
  }

  req.refreshjwt = decoded;
  next();
};

module.exports = verifyRefreshJWT;
