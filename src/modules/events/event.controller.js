const mongoose = require("mongoose");
const Event = require("./event.model");
const Eventor = require("../eventor/eventor.model");
// const Volunteer = require("../volunteer/volunteer.model");

exports.addEvent = async (req, res) => {
  const { filename } = req.file;
  console.log(req.file);
  const {
    title,
    vacancy,
    address,
    requirement,
    qualification,
    startingDate,
    endingDate,
    eventor,
  } = req.body;

  let existUser;
  try {
    existUser = await Eventor.findById(eventor);
    console.log(existUser);
  } catch (error) {
    return console.log(error);
  }
  if (!existUser) {
    return res.status(400).json({ message: "user not found" });
  }

  const newBlog = new Event({
    title,
    vacancy,
    address,
    requirement,
    qualification,
    eventor,
    image: filename,
    startingDate,
    endingDate,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await newBlog.save({ session });
    existUser.events.push(newBlog);
    await existUser.save({ session });
    await session.commitTransaction();
  } catch (error) {
    return res.send({
      status: "failed",
      message: "blog is not created",
      error: error,
    });
  }
  return res.status(200).json({
    status: "success",
    message: "blog created successfully",
    data: newBlog,
  });
};

exports.getEvents = async (req, res, next) => {
  try {
    const blogs = await Event.find()
      .populate("volunteers", {
        email: 1,
        address: 1,
        fullname: 1,
      })
      .populate("eventor", {
        email: 1,
        address: 1,
        fullname: 1,
      });

    return res.status(200).json({
      status: "success",
      message: "blog is created successfully",
      data: blogs,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "blog is not found",
      error: error,
    });
  }
};

exports.getEventById = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await Event.findById(blogId)
      .populate("volunteers", {
        email: 1,
        address: 1,
        fullname: 1,
      })
      .populate("eventor", {
        email: 1,
        address: 1,
        fullname: 1,
      });

    return res.status(200).json({
      status: "success",
      message: "get by id successfully",
      blog: blog,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.postApply = async (req, res, next) => {
  try {
    const eventId = req.params.id;
    console.log(eventId);

    const result = await Event.findByIdAndUpdate(
      eventId,
      { $push: { volunteers: req.body.volunteers } },
      { new: true }
    );

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ error: "Could not create the comment." });
  }
};

exports.updateEventById = async (req, res, next) => {
  console.log(req.body);
  try {
    const {
      title,
      vacancy,
      address,
      requirement,
      qualification,
      startingDate,
      endingDate,
    } = req.body;
    const eventId = req.params.id;

    // Update the Eventor entry
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      {
        title,
        vacancy,
        address,
        requirement,
        qualification,
        startingDate,
        endingDate,
      },
      { new: true } // Return the updated document
    );

    if (!updatedEvent) {
      return res.status(404).json({
        status: "error",
        message: "Event not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Update by ID successful",
      data: updatedEvent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.eventDelete = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    await Event.findByIdAndRemove(blogId);

    return res.status(200).json({
      status: "success",
      message: "deleted blog by id successfully",
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "not deleted blog",
      error: error.message,
    });
  }
};
