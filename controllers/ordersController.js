const Order = require("../models/orders.models");
const Cart = require("../models/cart.models")
const mongoose = require("mongoose");
// Add a new order
exports.placeOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { products, totalAmount} = req.body;

    if (!userId || !products || !totalAmount ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = new Order({
      userId,
      products,
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

    const orders = await Order.find({ userId }).sort({ orderDate: -1 }); // Sort by most recent orders
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

    const order = await Order.findOne({
      userId: mongoose.Types.ObjectId(userId),
      _id: mongoose.Types.ObjectId(orderId),
    }).populate("products.productId");

    if (!order) {
      console.error("Order not found for user:", userId);
      return res.status(404).json({ error: "Order not found for this user" });
    }

    console.log("Order details found:", order);
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: error.message });
  }
};
