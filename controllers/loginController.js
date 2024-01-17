const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../models/users");
const crypto = require("crypto");

const loginController = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!(userName || password)) {
      res.status(400);
      res.send({
        success: false,
        message: `Please Enter Username and Password`,
      });
      return;
    }

    const user = users.find((user) => user.userName === userName);
    const passwordCompareResult = await bcrypt.compare(password, user.password);

    if (!passwordCompareResult) {
      res.status(401);
      res.send({
        success: false,
        message: `Invalid Password`,
      });
      return;
    }

    const accessJWTPayload = {
      id: user.id,
      jti: crypto.randomUUID(),
    };

    const refreshJWTPayload = {
      id: user.id,
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

module.exports = loginController;
