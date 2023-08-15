const express = require("express");
const routeEvent = express.Router();
const multer = require("multer");
const {
  addEvent,
  getEvents,
  eventDelete,
  getEventById,
  postApply,
  updateEventById,
} = require("./event.controller");
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
// upload.single("image"),

routeEvent.get("/", getEvents);
routeEvent.post("/addEvent", upload.single("image"), addEvent);
routeEvent.get("/getEventById/:id", getEventById);
routeEvent.put("/:id/apply", postApply);
routeEvent.patch(
  "/updateEventById/:id",
  upload.single("image"),
  updateEventById
);
routeEvent.delete("/eventDelete/:id", eventDelete);

module.exports = routeEvent;
