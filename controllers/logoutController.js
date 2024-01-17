const blacklistedJWT = require("../models/JWTblacklist");

const logoutController = (req, res) => {
  try {
    const accessjti = req.accessjwt.jti;
    const refreshjti = req.refreshjwt.jti;

    blacklistedJWT.push(`blacklist:${accessjti}`);
    blacklistedJWT.push(`blacklist:${refreshjti}`);

    res.clearCookie("jwt");

    res.status(200).send({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500);
    res.send({ success: false, message: error.message });
  }
};

module.exports = logoutController;
