const Wishlist = require("../models/wishlist.models");
const User = require("../models/users.models"); // Import the User model

// Add item to wishlist
exports.addItem = async (req, res) => {
  const {
    productId,
    productName,
    brandName,
    price,
    originalPrice,
    discountPercent,
  } = req.body; // Assuming these fields are sent in the request body
  const userId = req.params.userId; // Get userId from the route parameters

  try {
    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: "User  ID must be provided." });
    }

    // Find the wishlist by userId
    let wishlist = await Wishlist.findOne({ userId });

    // If no wishlist exists, create a new one
    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    // Check if the item already exists in the wishlist
    const existingItem = wishlist.items.find(
      (item) => item.productId.toString() === productId
    );

    if (!existingItem) {
      // Add new item to the wishlist
      wishlist.items.push({
        productId,
        productName,
        brandName,
        price,
        originalPrice,
        discountPercent,
      });
    }

    await wishlist.save();
    res.status(200).json({ message: "Item added to wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get wishlist by userId
exports.getWishlist = async (req, res) => {
  const userId = req.params.userId; // Get userId from the route parameters

  try {
    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: "User  ID must be provided." });
    }

    // Find the wishlist by userId
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item from wishlist
exports.removeItem = async (req, res) => {
  const { productId } = req.params; // Get productId from the route parameters
  const userId = req.params.userId; // Get userId from the route parameters

  try {
    // Check if userId is provided
    if (!userId) {
      return res.status(400).json({ error: "User  ID must be provided." });
    }

    // Find the wishlist by userId
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Remove the item from the wishlist
    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();
    res.status(200).json({ message: "Item removed from wishlist", wishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

