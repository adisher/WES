const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    },
    pdf: {
        type: String,
        required: true
    },
  },
  { timestamps: true }
);

module.exports = model("booklet", UserSchema);