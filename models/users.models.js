const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 3 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    password: { type: String, required: true, minlength: 8 },
    username: {
      type: String,
      unique: true,
      required: true,
      minlength: 3,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true, strict: "throw" }
);


module.exports = mongoose.model("User", userSchema);
