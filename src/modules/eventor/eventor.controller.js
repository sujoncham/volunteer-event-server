const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Eventor = require("./eventor.model");
const saltRounds = 10;

exports.eventorSignup = async (req, res) => {
  console.log(req.body);
  try {
    const user = await Eventor.findOne({ username: req.body.username });
    const email = await Eventor.findOne({ email: req.body.email });
    if (user) return res.status(400).send("user already exists");
    if (email) return res.status(400).send("email already exists");

    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      const newUser = new Eventor({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });

      await newUser
        .save()
        .then((user) => {
          return res.status(200).json({
            status: "success",
            message: "user is created successfully",
            user: {
              id: user._id,
              username: user.username,
            },
          });
        })
        .catch((error) => {
          return res.send({
            status: "failed",
            message: "user is not created",
            error: error,
          });
        });
    });
  } catch (error) {
    return res.send({
      status: "failed",
      message: "user is not created",
      error: error,
    });
  }
};

exports.eventorLogin = async (req, res, next) => {
  try {
    const user = await Eventor.findOne({ email: req.body.email });
    // console.log(user)
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "email not found",
      });
    }

    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(401).send({
        success: false,
        message: "Incorrect password",
      });
    }

    const payload = {
      id: user._id,
      username: user.username,
    };

    const token = jwt.sign(payload, process.env.SECRET_TOKEN_KEY, {
      expiresIn: "2d",
    });

    return res.status(200).send({
      success: true,
      message: "user is logged in successfully",
      token: ("Bearer " + token).split(" ")[1],
      username: user.username,
      id: user._id,
      email: user.email,
      role: user.role,
      token: token,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "user logged is failed",
      error: error.message,
    });
  }
};

exports.getEventor = async (req, res, next) => {
  try {
    const blogs = await Eventor.find().populate("events");

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

exports.getEventorById = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await Eventor.findById(blogId).populate("events");

    return res.status(200).json({
      status: "success",
      message: "get by id successfully",
      blog: blog,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateEventorById = async (req, res, next) => {
  try {
    console.log(req.files);
    const imageUrls = req.files.map((file) => `${file.filename}`);

    console.log(req.body);
    const { fullname, description, address, mission, phone, website } =
      req.body;
    const eventorId = req.params.id;

    // Update the Eventor entry
    const updatedEventor = await Eventor.findByIdAndUpdate(
      eventorId,
      {
        fullname,
        description,
        address,
        mission,
        image: imageUrls,
        phone,
        website,
      },
      { new: true } // Return the updated document
    );

    if (!updatedEventor) {
      return res.status(404).json({
        status: "error",
        message: "Eventor not found",
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Update by ID successful",
      data: updatedEventor,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

exports.eventorDelete = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    await Eventor.findByIdAndRemove(blogId);

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
