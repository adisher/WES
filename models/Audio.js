const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    audio: {
      type: String,
      required: true
    },
    duration: {
        type: String,
        required: false
    },
  },
  { timestamps: true }
);

module.exports = model("audio", UserSchema);