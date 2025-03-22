const Order = require("../models/orders.models");
const Cart = require("../models/cart.models")
const Product = require("../models/products.models")
const mongoose = require("mongoose");

exports.placeOrder = async (req, res) => {
  try {
    const { products, totalAmount } = req.body;
    const userId = req.user._id; // Get userId from decoded JWT

    if (!products || !totalAmount) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Validate userId (no need for this check if using req.user)
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
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const userId = req.user._id; // Get userId from decoded JWT

    const orders = await Order.find({ userId })
      .sort({ orderDate: -1 })
      .populate("products.productId");

    if (orders.length === 0) {
      return res.status(404).json({ error: "No orders found" });
    }

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { orderId } = req.params; // Only get orderId from params
    const userId = req.user._id; // Get userId from decoded JWT

    if (!orderId) {
      return res.status(400).json({ error: "Invalid order ID" });
    }

    if (!mongoose.isValidObjectId(orderId)) {
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
    res.status(500).json({ error: error.message });
  }
};
