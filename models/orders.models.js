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
    default: "pending",
  },
  deliveryAddress: {
    name: { type: String, required: true },
    number: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    addressType: { type: String, required: true },
  },
});

module.exports = mongoose.model("Order", orderSchema);
