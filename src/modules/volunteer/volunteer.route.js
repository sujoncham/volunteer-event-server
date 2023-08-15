const express = require("express");
const multer = require("multer");
const {
  volunteerLogin,
  volunteerSignup,
  getVolunteer,
  volunteerDelete,
  getVolunteerById,
  updateVolunteerById,
} = require("./volunteer.controller");
const routeVolunteer = express.Router();

const imgconfig = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },
  filename: (req, file, callback) => {
    callback(null, `image-${Date.now()}-${file.originalname}`);
  },
});

// img filter
const isImage = (req, file, callback) => {
  if (file.mimetype.startsWith("image")) {
    callback(null, true);
  } else {
    callback(new Error("only images is allowd"));
  }
};

const upload = multer({
  storage: imgconfig,
  fileFilter: isImage,
});

routeVolunteer.get("/", getVolunteer);
routeVolunteer.post("/volunteerSignup", volunteerSignup);
routeVolunteer.post("/volunteerLogin", volunteerLogin);
routeVolunteer.get("/:id/profile", getVolunteerById);
routeVolunteer.patch(
  "/profile/:id/profileUpdate",
  upload.array("image", 50),
  updateVolunteerById
);
routeVolunteer.delete("/volunteerDelete/:id", volunteerDelete);

module.exports = routeVolunteer;
