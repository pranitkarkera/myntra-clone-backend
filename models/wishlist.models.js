const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId for registered users
      required: true, // Make userId optional
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
      },
    ],
  },
  { timestamps: true } // Automatically manage createdAt and updatedAt
);


module.exports = mongoose.model("Wishlist", wishlistSchema);
