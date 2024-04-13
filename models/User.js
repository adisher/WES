const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: false
    },
    email: {
      type: String,
      required: false
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "superadmin", "company"]
    },
    username: {
      type: String,
      required: false
    },
    phone: {
      type: String,
      required: false
    },
    location: {
      type: String,
      required: false
    },
    company_name: {
      type: String,
      required: false
    },
    password: {
      type: String,
      required: false
    },
    interest: {
        type: String,
        required: false
    },
    learn: {
        type: String,
        required: false
    },
    tos: {
        type: String,
        required: false
    },
    newsletter: {
        type: String,
        required: false
    },
    company_name: {
        type: String,
        required: false
    },
    job: {
        type: String,
        required: false
    },
    department: {
        type: String,
        required: false
    },
    address: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    },
    zip_code: {
      type: String,
      required: false
    },
    state: {
      type: String,
      required: false
    },
    status: {
      type: String,
      default: 'active',
      required: false
    },
    otp: {
      type: String,
      default: '12345',
      required: false
    },
    enrolled_courses: [{
      type: Schema.Types.ObjectId,
      ref: "course"
    }],
    enrolled_users: [{
      type: Schema.Types.ObjectId,
      ref: "users"
    }]
  },
  { timestamps: true }
);

module.exports = model("users", UserSchema);