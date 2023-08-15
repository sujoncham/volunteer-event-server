const mongoose = require("mongoose");

const volunteerSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      default: "",
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "volunteer",
    },
    password: {
      type: String,
      required: true,
    },
    description: { type: String, default: "" },
    dateOfBirth: { type: String, default: "" },
    education: { type: String, default: "" },
    address: { type: String, default: "" },
    hobby: { type: String, default: "" },
    interests: { type: String, default: "" },
    profession: { type: String, default: "student" },
    studyType: { type: String, default: "history" },
    image: [String],
    skills: { type: String, default: "" },
    experience: { type: String, default: "" },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Volunteer = mongoose.model("Volunteer", volunteerSchema);

module.exports = Volunteer;
