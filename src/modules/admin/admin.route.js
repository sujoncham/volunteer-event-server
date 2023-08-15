const express = require("express");
const {
  adminSignup,
  adminLogin,
  adminDelete,
  getAdmin,
  getAdminById,
} = require("./admin.controller");
const routeAdmin = express.Router();

routeAdmin.get("/", getAdmin);
routeAdmin.post("/adminSignup", adminSignup);
routeAdmin.post("/adminLogin", adminLogin);
routeAdmin.get("/:id", getAdminById);
routeAdmin.delete("/:id", adminDelete);

module.exports = routeAdmin;
