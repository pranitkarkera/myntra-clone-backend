const mongoose = require("mongoose");
const User = require("../models/users.models");
const Address = require("../models/address.models");
const bcrypt = require("bcryptjs"); // Ensure bcryptjs is installed

// Register a new user

exports.register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body; // Include username
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, username }); // Include username
    await user.save();
    res.status(201).json({ message: "User  registered successfully", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user by ID
exports.getUser = async (req, res) => {
  try {
    const email = req.params.email;

    // Check if userId is a valid ObjectId
    if (!email) {
      return res.status(400).json({ error: "Invalid email id" });
    }

    const user = await User.findByOne({email});
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a user and their associated addresses
exports.deleteUser = async (req, res) => {
  console.log("Delete User endpoint called");
  try {
    const email = req.params.email;

    // Delete the user
    const user = await User.findByOneAndDelete({email});
    if (!user) return res.status(404).json({ message: "User not found" });

    // Delete all addresses associated with the user (cascading delete)
    await Address.deleteMany({ email });

    res
      .status(200)
      .json({ message: "User and associated addresses deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
