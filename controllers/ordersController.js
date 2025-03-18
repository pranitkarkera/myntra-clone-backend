const Order = require("../models/orders.models");
const Cart = require("../models/cart.models")
const Product = require("../models/products.models")
const mongoose = require("mongoose");

exports.placeOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { products, totalAmount } = req.body;

    if (!userId || !products || !totalAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    // Convert productId to ObjectId (if needed)
    const formattedProducts = products.map((product) => ({
      ...product,
      productId: product.productId, // Keep as number (no conversion needed)
    }));

    const order = new Order({
      userId: new mongoose.Types.ObjectId(userId), // Use `new` keyword
      products: formattedProducts,
      totalAmount,
    });

    await order.save();

    // Clear cart items after placing the order
    await Cart.updateOne({ userId }, { $set: { items: [] } });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order history for a user
exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const orders = await Order.find({ userId })
      .sort({ orderDate: -1 })
      .populate("products.productId"); // Populate product details if needed

    if (orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get specific order details by order ID
exports.getOrderDetails = async (req, res) => {
  try {
    console.log("Incoming request params:", req.params);
    console.log("Decoded JWT user:", req.user);

    const { userId, orderId } = req.params;

    if (!userId || !orderId) {
      console.error("Missing parameters:", { userId, orderId });
      return res.status(400).json({ error: "Invalid user ID or order ID" });
    }

    // Validate userId and orderId
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const order = await Order.findOne({
      userId: mongoose.Types.ObjectId(userId), // Use `new` keyword
      _id: mongoose.Types.ObjectId(orderId), // Use `new` keyword
    });

    if (!order) {
      console.error("Order not found for user:", userId);
      return res.status(404).json({ error: "Order not found for this user" });
    }

    // Fetch product details for each product in the order
    const productsWithDetails = await Promise.all(
      order.products.map(async (product) => {
        const productDetails = await Product.findOne({
          productId: product.productId,
        });
        return {
          ...product.toObject(),
          productDetails, // Add product details to the response
        };
      })
    );

    // Replace products array with products containing details
    order.products = productsWithDetails;

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: error.message });
  }
};