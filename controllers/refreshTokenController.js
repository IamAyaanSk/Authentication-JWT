const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const blacklistedJWT = require("../models/JWTblacklist");
const users = require("../models/users");

const refrshTokenController = (req, res) => {
  try {
    const isBlacklisted = blacklistedJWT.find(
      (token) => token.split(":")[1] === req.refreshjwt.jti
    );

    if (isBlacklisted) {
      res.status(403);
      res.send({ success: false, message: "Invalid Token" });
      return;
    }

    const findUser = users.find((user) => user.id === req.refreshjwt.id);

    if (!findUser) {
      res.status(401);
      res.send({ success: false, message: "User not found" });
      return;
    }

    const toBlacklist = `blacklist:${req.refreshjwt.jti}`;
    blacklistedJWT.push(toBlacklist);

    const accessJWTPayload = {
      id: findUser.id,
      jti: crypto.randomUUID(),
    };

    const refreshJWTPayload = {
      id: findUser.id,
      jti: crypto.randomUUID(),
    };

    const accessToken = jwt.sign(accessJWTPayload, "secret-key", {
      expiresIn: "20m",
    });
    const refreshToken = jwt.sign(refreshJWTPayload, "refresh-secret-key", {
      expiresIn: "7d",
    });

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.send({
      success: true,
      message: accessToken,
    });
  } catch (error) {
    res.status(500);
    res.send({ success: false, message: error.message });
  }
};

module.exports = refrshTokenController;
