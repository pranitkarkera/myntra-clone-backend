const Order = require("../models/orders.models");

// Add a new order
exports.placeOrder = async (req, res) => {
  try {
    const { userId, email, products, totalAmount } = req.body;

    if (!userId || !email || !products || !totalAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = new Order({ userId, email, products, totalAmount });
    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order history for a user
exports.getOrderHistory = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: "Invalid email id" });
    }

    const orders = await Order.find({ email });
    if (orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
