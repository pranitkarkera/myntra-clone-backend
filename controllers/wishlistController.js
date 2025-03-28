const Wishlist = require("../models/wishlist.models");
const mongoose = require("mongoose");

// Add item to wishlist
exports.addItem = async (req, res) => {
  const { userId } = req.params;
  const {
    productId,
    productName,
    brandName,
    price,
    originalPrice,
    discountPercent,
    images,
  } = req.body;

  // Validate input
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

  // Validate ObjectId for userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
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
      images,
    });

    await wishlist.save();

    res.status(201).json({ message: "Item added to wishlist", wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove item from wishlist
exports.removeItem = async (req, res) => {
  const { userId, productId } = req.params;

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

    const itemIndex = wishlist.items.findIndex(
      (item) => item.productId === parseInt(productId)
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in wishlist" });
    }

    wishlist.items.splice(itemIndex, 1);
    await wishlist.save();

    res.status(200).json({ message: "Item removed from wishlist", wishlist });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get wishlist for a user
exports.getWishlist = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    res.status(200).json(wishlist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
