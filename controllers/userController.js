const mongoose = require("mongoose");
const User = require("../models/users.models");
const Cart = require("../models/cart.models");
const Wishlist = require("../models/wishlist.models");
const Address = require("../models/address.models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Your existing login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if the user is logging in as a guest
  if (email === "guest@gmail.com" && password === "guest123") {
    try {
      // Create or retrieve the guest user
      let guestUser = await User.findOne({ email: "guest@gmail.com" });

      if (!guestUser) {
        // Create a new guest user if it doesn't exist
        guestUser = new User({
          name: "Guest User",
          email: "guest@gmail.com",
          password: "guest123", // This will not be hashed since it's a guest login
          isRegistered: false,
        });
        await guestUser.save();
      }

      // Create associated data if it doesn't exist
      await Promise.all([
        Cart.findOneAndUpdate(
          { userId: guestUser._id },
          { $setOnInsert: { items: [] } },
          { upsert: true }
        ),
        Wishlist.findOneAndUpdate(
          { userId: guestUser._id },
          { $setOnInsert: { items: [] } },
          { upsert: true }
        ),
        Address.findOneAndUpdate(
          { userId: guestUser._id },
          { $setOnInsert: { addressDetails: [] } },
          { upsert: true }
        ),
      ]);

      // Generate JWT for guest user
      const token = jwt.sign(
        { id: guestUser._id, email: guestUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      return res.status(200).json({
        message: "Logged in as guest",
        user: {
          id: guestUser._id,
          email: guestUser.email,
          isRegistered: guestUser.isRegistered,
        },
        token, // Send the token back to the client
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  // Normal login logic for registered users
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Store user ID in local storage
    localStorage.setItem("userId", user._id);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
      token, // Send the token back to the client
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Register a new user
exports.register = async (req, res) => {
  try {
    const { name, email, password, username } = req.body;

    // Validate input
    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if the email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or username already exists" });
    }

    // Create the user
    const user = new User({
      name,
      email,
      password, // Password will be hashed in the pre-save hook
      username,
      isRegistered: true,
    });

    // Save the user to the database
    await user.save();

    // Create associated data
    await Promise.all([
      new Cart({ userId: user._id, items: [] }).save(),
      new Wishlist({ userId: user._id, items: [] }).save(),
      new Address({ userId: user._id, addressDetails: [] }).save(),
    ]);

    res.status(201).json({
      message: "User  registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login a user
// exports.login = async (req, res) => {
//   const { email, password } = req.body;

//   // Check if the user is logging in as a guest
//   if (email === "guest@gmail.com" && password === "guest123") {
//     try {
//       // Create or retrieve the guest user
//       let guestUser  = await User.createGuestUser ();

//       // Check if associated data already exists for the guest user
//       let cart = await Cart.findOne({ userId: guestUser ._id });
//       let wishlist = await Wishlist.findOne({ userId: guestUser ._id });
//       let address = await Address.findOne({ userId: guestUser ._id });

//       // If associated data does not exist, create it
//       if (!cart) {
//         cart = new Cart({ userId: guestUser ._id, items: [] });
//         await cart.save();
//       }
//       if (!wishlist) {
//         wishlist = new Wishlist({ userId: guestUser ._id, items: [] });
//         await wishlist.save();
//       }
//       if (!address) {
//         address = new Address({ userId: guestUser ._id, addressDetails: [] });
//         await address.save();
//       }

//       return res.status(200).json({
//         message: "Logged in as guest",
//         user: {
//           id: guestUser ._id,
//           email: guestUser .email,
//           isRegistered: guestUser .isRegistered,
//         },
//       });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: "Internal server error" });
//     }
//   }

//   // Normal login logic for registered users
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid email or password" });
//     }

//     res.status(200).json({
//       message: "Login successful",
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         username: user.username,
//       },
//     });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };

// Get user by ID or email
exports.getUser = async (req, res) => {
  const { userId } = req.params;

  try {
    if (mongoose.Types.ObjectId.isValid(userId)) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User  not found" });
      }
      return res.status(200).json({ user });
    } else {
      const user = await User.findOne({ email: userId });
      if (!user) {
        return res.status(404).json({ message: "User  not found" });
      }
      return res.status(200).json({ user });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update user by ID
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  try {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    res.status(200).json({ message: "User  updated successfully", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete user by ID
exports.deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    await Promise.all([
      Cart.deleteOne({ userId: user._id }),
      Wishlist.deleteOne({ userId: user._id }),
      Address.deleteOne({ userId: user._id }),
    ]);

    res.status(200).json({ message: "User  deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};
