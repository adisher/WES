const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    question: {
      type: Array,
      required: false
    },
    correct: {
        type: Array,
      required: false
    },
    wrong: {
        type: Array,
        required: false
    },
    courses: {
      type: Schema.Types.ObjectId,
      ref: "course"
    },
    users: [{
      type: Schema.Types.ObjectId,
      ref: "users"
    }]
  },
  { timestamps: true }
);

module.exports = model("quiz", UserSchema);