const Cart = require("../models/cart.models");
const mongoose = require("mongoose");

// Add item to cart
exports.addItem = async (req, res) => {
  const { userId } = req.params;
  const {
    productId,
    productName,
    brandName,
    price,
    originalPrice,
    discountPercent,
    quantity,
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
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Validate ObjectId for userId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId === parseInt(productId)
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({
        productId: parseInt(productId),
        productName,
        brandName,
        price,
        originalPrice,
        discountPercent,
        quantity: quantity || 1,
        images,
      });
    }

    await cart.save();
    res.status(201).json({ message: "Item added to cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  const { userId, productId } = req.params;

  if (!userId || !productId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (item) => item.productId !== parseInt(productId)
    );
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get cart for a user
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "Missing userId" });
  }

  try {
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
