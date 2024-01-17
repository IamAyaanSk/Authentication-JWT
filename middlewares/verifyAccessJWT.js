const jwt = require("jsonwebtoken");
const blacklistedJWT = require("../models/JWTblacklist");

const verifyAccessJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401);
    res.send({
      success: false,
      message: "Invalid Token",
    });
    return;
  }

  const accessToken = authHeader.split(" ")[1];

  const decoded = jwt.verify(accessToken, "secret-key");

  const isBlacklisted = blacklistedJWT.find(
    (token) => token.split(":")[1] === decoded.jti
  );

  if (isBlacklisted) {
    res.status(401);
    res.send({
      success: false,
      message: "Blacklisted Token",
    });
    return;
  }

  if (!decoded) {
    res.status(401);
    res.send({
      success: false,
      message: "Please Login",
    });
    return;
  }

  req.accessjwt = decoded;
  next();
};

module.exports = verifyAccessJWT;
