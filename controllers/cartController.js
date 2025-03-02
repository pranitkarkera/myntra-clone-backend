const Cart = require("../models/cart.models");

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
  } = req.body;

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

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity || 1;
    } else {
      cart.items.push({
        productId,
        productName,
        brandName,
        price,
        originalPrice,
        discountPercent,
        quantity: quantity || 1,
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
      (item) => item.productId.toString() !== productId
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
