const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Volunteer = require("./volunteer.model");
const saltRounds = 10;

exports.volunteerSignup = async (req, res) => {
  console.log(req.body);
  try {
    const user = await Volunteer.findOne({ username: req.body.username });
    const email = await Volunteer.findOne({ email: req.body.email });
    if (user) return res.status(400).send("user already exists");
    if (email) return res.status(400).send("email already exists");

    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      const newUser = new Volunteer({
        username: req.body.username,
        email: req.body.email,
        password: hash,
        role: req.body.role,
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

exports.volunteerLogin = async (req, res, next) => {
  try {
    const user = await Volunteer.findOne({ email: req.body.email });
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
      token: token,
      role: user.role,
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: "user logged is failed",
      error: error.message,
    });
  }
};

exports.getVolunteer = async (req, res, next) => {
  try {
    const blogs = await Volunteer.find({}).populate("events");

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

exports.getVolunteerById = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    const blog = await Volunteer.findById(blogId);

    return res.status(200).json({
      status: "success",
      message: "get by id successfully",
      blog: blog,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.updateVolunteerById = async (req, res, next) => {
  // console.log(req.files);
  const imageUrls = req.files.map((file) => `${file.filename}`);

  // console.log(req.body);
  try {
    const {
      fullname,
      description,
      education,
      address,
      hobby,
      skills,
      experience,
      interests,
      dateOfBirth,
    } = req.body;
    const blogId = req.params.id;
    const blog = await Volunteer.findByIdAndUpdate(blogId, {
      fullname,
      description,
      education,
      address,
      hobby,
      skills,
      experience,
      image: imageUrls,
      interests,
      dateOfBirth,
    });

    return res.status(200).json({
      status: "success",
      message: "update by id successfully",
      data: blog,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.volunteerDelete = async (req, res, next) => {
  try {
    const blogId = req.params.id;
    await Volunteer.findByIdAndRemove(blogId);

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
