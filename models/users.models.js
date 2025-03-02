const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true},
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    password: { type: String, required: true},
  },
  { timestamps: true, strict: "throw" }
);

module.exports = mongoose.model("User", userSchema);
