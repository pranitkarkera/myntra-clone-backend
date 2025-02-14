const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId for registered users
      required: true, // userId is now always required
      ref: "User", // Reference to the User model
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        productName: { type: String, required: true },
        brandName: { type: String, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number, required: true },
        discountPercent: { type: Number, required: true, min: 0, max: 100 },
        quantity: { type: Number, default: 1 }, // Default quantity is 1
      },
    ],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);

module.exports = mongoose.model("Cart", cartSchema);
