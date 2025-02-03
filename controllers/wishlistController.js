const Wishlist = require("../models/wishlist.models");
const mongoose = require("mongoose");

// Add item to wishlist
exports.addItem = async (req, res) => {
  const {
    userId,
    productId,
    productName,
    brandName,
    price,
    originalPrice,
    discountPercent,
  } = req.body;

  // Basic validation
  if (
    !userId ||
    !productId ||
    !productName ||
    !brandName ||
    !price ||
    !originalPrice ||
    !discountPercent
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    const itemExists = wishlist.items.some(
      (item) => item.productId === productId
    );
    if (itemExists) {
      return res.status(400).json({ message: "Item already in wishlist" });
    }

    wishlist.items.push({
      productId,
      productName,
      brandName,
      price,
      originalPrice,
      discountPercent,
    });
    await wishlist.save();

    res.status(201).json({ message: "Item added to wishlist", wishlist });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove item from wishlist
exports.removeItem = async (req, res) => {
  const { userId } = req.params; // Get userId from route parameters
  const { productId } = req.params; // Get productId from route parameters

  // Basic validation
  if (!userId || !productId) {
    return res
      .status(400)
      .json({ message: "userId and productId are required" });
  }

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Log the wishlist to see its contents
    console.log("Current Wishlist:", wishlist);

    // Convert productId to ObjectId for comparison
    const productObjectId = new mongoose.Types.ObjectId(productId); // Use 'new' keyword

    // Check if the item exists in the wishlist
    const itemIndex = wishlist.items.findIndex(
      (item) => item.productId.equals(productObjectId) // Use equals for ObjectId comparison
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    // Remove the item
    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    res.status(200).json({ message: "Item removed from wishlist", wishlist });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get wishlist for a user
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json(wishlist);
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
