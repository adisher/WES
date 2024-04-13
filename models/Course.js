const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    course_title: {
      type: String,
      required: true
    },
    course_description: {
      type: String,
      required: true
    },
    course_price: {
        type: String,
        required: true
    },
    course_credit: {
      type: String,
      required: true
    },
    course_discount: {
        type: String,
        required: false
    },
    course_module_title: {
        type: String,
        required: false
    },
    course_video_title: {
        type: String,
        required: false
    },
    course_video: {
        type: String,
        required: false
    },
    course_audio: {
        type: String,
        required: false
    },
    course_booklet: {
        type: String,
        required: false
    },
    enrolled_user: {
      type: String,
      required: false
    },
    status: {
      type: String,
      default: 'active',
      required: false
    }
  },
  { timestamps: true }
);

module.exports = model("course", UserSchema);