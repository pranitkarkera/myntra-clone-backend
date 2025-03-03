const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      productId: { type: Number, required: true },
      productName: { type: String, required: true },
      brandName: { type: String, required: true },
      price: { type: Number, required: true },
      originalPrice: { type: Number, required: true },
      discountPercent: { type: Number, required: true, min: 0, max: 100 },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
  status: {
    type: String,
    required: true,
    enum: ["pending", "shipped", "delivered"],
    default: "pending"
  },
});

module.exports = mongoose.model("Order", orderSchema);
