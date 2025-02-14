const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
      unique: true,
      sparse: true, // Allows multiple `null` emails without duplicate errors
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email address"],
    },
    password: {
      type: String,
      required: function () {
        return this.isRegistered;
      },
      minlength: 8,
    },
    username: {
      type: String,
      unique: true,
      required: function () {
        return this.isRegistered;
      },
      minlength: 3,
      trim: true,
      lowercase: true,
    },
    isRegistered: { type: Boolean, default: true }, // Flag to indicate if the user is registered
  },
  { timestamps: true, strict: "throw" }
);

// Pre-save hook to hash the password for registered users
userSchema.pre("save", async function (next) {
  if (this.isRegistered && this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Static method to create a guest user
userSchema.statics.createGuestUser = async function () {
  const existingGuestUser = await this.findOne({ email: "guest@gmail.com" });
  if (existingGuestUser) {
    return existingGuestUser; // Return existing guest user if found
  }

  const guestUser = new this({
    email: "guest@gmail.com",
    password: "guest123", // This will not be hashed since it's a guest login
    isRegistered: false,
  });
  return await guestUser.save();
};

module.exports = mongoose.model("User", userSchema);
