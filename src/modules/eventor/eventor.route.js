const express = require("express");
const multer = require("multer");
const {
  eventorLogin,
  eventorSignup,
  eventorDelete,
  getEventorById,
  getEventor,
  updateEventorById,
} = require("./eventor.controller");
const routeEventor = express.Router();

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

routeEventor.post("/eventorSignup", eventorSignup);
routeEventor.post("/eventorLogin", eventorLogin);
routeEventor.get("/", getEventor);
routeEventor.get("/:id/profile", getEventorById);
routeEventor.patch(
  "/profile/:id/updateProfile",
  upload.array("image", 50),
  updateEventorById
);
routeEventor.delete("/eventorDelete/:id", eventorDelete);

module.exports = routeEventor;
