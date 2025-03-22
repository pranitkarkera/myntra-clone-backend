const Order = require("../models/orders.models");
const Cart = require("../models/cart.models");
const Product = require("../models/products.models");
const mongoose = require("mongoose");

exports.placeOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const { userId } = req.params; // Get userId from params

    if (!Array.isArray(products) || !products.length || !totalAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const formattedProducts = products.map((product) => ({
      ...product,
      productId: product.productId,
    }));

    const order = new Order({
      userId: new mongoose.Types.ObjectId(userId),
      products: formattedProducts,
      totalAmount,
    });

    await order.save();

    // Clear cart items after placing the order
    await Cart.updateOne({ userId }, { $set: { items: [] } });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Error placing order:", error);
    res
      .status(500)
      .json({ error: "An error occurred while placing the order." });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.params; // Get userId from params

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const orders = await Order.find({ userId })
      .sort({ orderDate: -1 })
      .populate("products.productId");

    if (!orders.length) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching order history:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching order history." });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId, userId } = req.params; // Get orderId and userId from params

    // Validate userId and orderId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    const order = await Order.findOne({
      userId: mongoose.Types.ObjectId(userId),
      _id: mongoose.Types.ObjectId(orderId),
    });

    if (!order) {
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
          productDetails,
        };
      })
    );

    order.products = productsWithDetails;

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order details:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching order details." });
  }
};
