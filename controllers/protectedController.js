const users = require("../models/users");

const protectedController = (req, res) => {
  try {
    const findUser = users.find((user) => user.id === req.accessjwt.id);

    if (!findUser) {
      res.status(401);
      res.send({ success: false, message: "User not Found" });
    }

    res.send({ success: true, message: `Hello ${findUser.userName}` });
  } catch (error) {
    res.status(500);
    res.send({ success: false, message: error.message });
  }
};

module.exports = protectedController;
