const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    date: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'active',
        required: true
    },
  },
  { timestamps: true }
);

module.exports = model("webinar", UserSchema);