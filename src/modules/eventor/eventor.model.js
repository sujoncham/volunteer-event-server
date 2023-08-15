const mongoose = require("mongoose");

const eventorSchema = new mongoose.Schema(
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
    description: {
      type: String,
      default: "",
    },
    mission: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },

    image: [{ type: Array, default: "" }],
    role: {
      type: String,
      default: "eventor",
    },
    password: {
      type: String,
      required: true,
    },
    events: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Eventor = mongoose.model("Eventor", eventorSchema);

module.exports = Eventor;
