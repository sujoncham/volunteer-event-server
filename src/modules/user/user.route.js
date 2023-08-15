const express = require("express");
const { userLogin, userSignup, userAll } = require("./user.controller");
const routeUser = express.Router();

routeUser.post("/userSignup", userSignup);
routeUser.post("/userLogin", userLogin);
routeUser.get("/", userAll);

module.exports = routeUser;
