const Order = require("../models/orders.models");

// Add a new order
exports.placeOrder = async (req, res) => {
  try {
    const { userId } = req.params;
    const { products, totalAmount, deliveryAddress } = req.body;

    if (!userId || !products || !totalAmount || !deliveryAddress) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const order = new Order({
      userId,
      products,
      totalAmount,
      deliveryAddress,
    });
    await order.save();

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get order history for a user
exports.getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params;

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
    const { userId } = req.params;
    const { orderId } = req.params;

    if (!userId || !orderId) {
      return res.status(400).json({ error: "Invalid user ID or order ID" });
    }

    const order = await Order.findOne({ userId, _id: orderId });
    if (!order) {
      return res.status(404).json({ error: "Order not found for this user" });
    }

    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

