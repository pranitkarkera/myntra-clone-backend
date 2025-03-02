// userController.js
const User = require("../models/users.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({
        message: "User already exists, you can login",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    // Save the new user
    const savedUser = await newUser.save();

    res.status(201).json({ message: "Signup successfully", user: savedUser });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};

// Login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Regular user login logic
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(403).json({
        message: "Auth failed: email or password is wrong",
        success: false,
      });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        message: "Auth failed: email or password is wrong",
        success: false,
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.status(200).json({
      message: "Login Success",
      success: true,
      jwtToken,
      email,
      name: user.name,
      user: user
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(400).json({ error: err.message });
  }
};

// Get user by userId
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};


// Update user by userId
exports.updateUser = async (req, res) => {
  try {
    const { name, username } = req.body;
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    if (!name || !username) {
      return res.status(400).json({ error: "Name and username are required" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name, username },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};


// Delete a user and their associated addresses
exports.deleteUser = async (req, res) => {
  console.log("Delete User endpoint called");
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    await Address.deleteMany({ userId: userId });
    await Cart.deleteMany({ userId: userId });
    await Wishlist.deleteMany({ userId: userId });
    await Order.deleteMany({ userId: userId });

    console.log(`User with ID ${userId} deleted successfully`);
    res
      .status(200)
      .json({ message: "User and associated data deleted successfully" });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: error.message });
  }
};
