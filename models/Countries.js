const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    Code: {
      type: String,
      required: false
    },
    Name: {
        type: String,
      required: false
    },
    
  },
  { timestamps: true }
);

module.exports = model("countries", UserSchema);