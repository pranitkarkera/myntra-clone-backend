const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: { type: Number, required: true },
        productName: { type: String, required: true },
        brandName: { type: String, required: true },
        price: { type: Number, required: true },
        originalPrice: { type: Number, required: true },
        discountPercent: { type: Number, required: true, min: 0, max: 100 },
        quantity: { type: Number, default: 1 },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);
