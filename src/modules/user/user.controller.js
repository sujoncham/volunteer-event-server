const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./user.model");
const saltRounds = 10;

exports.userSignup = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findOne({ username: req.body.username });
    const email = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("user already exists");
    if (email) return res.status(400).send("email already exists");

    bcrypt.hash(req.body.password, saltRounds, async (err, hash) => {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        role: req.body.role,
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

exports.userLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
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

exports.userAll = async (req, res, next) => {
  try {
    const result = await User.find({});

    return res.status(200).json({
      status: "success",
      message: "deleted blog by id successfully",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      status: "failed",
      message: "not deleted blog",
      error: error.message,
    });
  }
};
