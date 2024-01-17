const express = require("express");
const cookieParser = require("cookie-parser");

const registerController = require("./controllers/registerController");
const loginController = require("./controllers/loginController");
const refrshTokenController = require("./controllers/refreshTokenController");
const protectedController = require("./controllers/protectedController");
const logoutController = require("./controllers/logoutController");

const verifyRefreshJWT = require("./middlewares/verifyRefreshJWT");
const verifyAccessJWT = require("./middlewares/verifyAccessJWT");

const users = require("./models/users");
const blacklistedJWT = require("./models/JWTblacklist");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ users, blacklistedJWT });
});

app.post("/register", registerController);

app.post("/login", loginController);

app.get("/refresh-token", verifyRefreshJWT, refrshTokenController);

app.get("/protected", verifyAccessJWT, protectedController);

app.get("/logout", verifyAccessJWT, verifyRefreshJWT, logoutController);

app.listen("3000", () => {
  console.log("Server Listening at port 3000");
});
