const express = require("express");
const wishlistController = require("../controllers/wishlistController");

const router = express.Router();

// Get wishlist for a user
router.get("/:userId", wishlistController.getWishlist);

// Add item to wishlist
router.post("/:userId/items", wishlistController.addItem); // Add item to a specific user's wishlist

// Remove item from wishlist
router.delete("/:userId/items/:productId", wishlistController.removeItem); // Remove a specific item from a user's wishlist

module.exports = router;
