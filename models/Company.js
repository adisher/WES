const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    company_name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: false
    },
    status: {
      type: String,
      default: 'active',
      required: false
    },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: "course"
    }]
  },
  { timestamps: true }
);

module.exports = model("company", UserSchema);