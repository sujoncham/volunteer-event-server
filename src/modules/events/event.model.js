const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    vacancy: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    requirement: {
      type: String,
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    startingDate: {
      type: String,
      required: true,
    },
    endingDate: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "completed", "posponded"],
      default: "active",
    },
    image: {
      type: String,
      required: true,
    },
    eventor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Eventor",
      required: true,
    },
    volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Volunteer",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model("Event", EventSchema);

module.exports = Event;
