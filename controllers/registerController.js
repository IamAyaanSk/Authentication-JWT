const bcrypt = require("bcrypt");
const crypto = require("crypto");
const users = require("../models/users");

const registerController = async (req, res) => {
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

    const isUserExists = users.find((user) => user.userName === userName);

    if (isUserExists) {
      res.status(400);
      res.send({
        success: false,
        message: `Username already Exists! Login Instead`,
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    users.push({
      id: crypto.randomUUID(),
      userName,
      password: hashedPassword,
    });

    res.status(201);
    res.send({ success: true, message: `New user ${userName} Created!` });
  } catch (error) {
    res.status(500);
    res.send({ success: false, message: error.message });
  }
};

module.exports = registerController;
