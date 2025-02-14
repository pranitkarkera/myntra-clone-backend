const Cart = require("../models/cart.models");
const User = require("../models/users.models"); // Import the User model

// Add item to cart
exports.addItem = async (req, res) => {
  const {
    productId,
    productName,
    brandName,
    price,
    originalPrice,
    discountPercent,
    quantity,
  } = req.body; // Assuming you send these fields in the request body
  const userId = req.params.userId; // Get userId from the route parameters

  try {
    // Find or create the cart for the user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // Check if the item already exists in the cart
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (existingItem) {
      // Update the quantity if the item already exists
      existingItem.quantity += quantity;
    } else {
      // Add new item to the cart
      cart.items.push({
        productId,
        productName,
        brandName,
        price,
        originalPrice,
        discountPercent,
        quantity,
      });
    }

    await cart.save();
    res.status(200).json({ message: "Item added to cart", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  const { productId } = req.params; // Get productId from the route parameters
  const userId = req.params.userId; // Get userId from the route parameters

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Remove the item from the cart
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();

    res.status(200).json({ message: "Item removed from cart", cart });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get cart for a user
exports.getCart = async (req, res) => {
  const userId = req.params.userId; // Get userId from the route parameters

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
