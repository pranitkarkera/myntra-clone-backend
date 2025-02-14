const express = require("express");
const wishlistController = require("../controllers/wishlistController");

const router = express.Router();

// Get wishlist for a user or guest
router.get("/:userId", wishlistController.getWishlist); // Get the wishlist for the logged-in user or guest

// Add item to wishlist
router.post("/:userId/items", wishlistController.addItem); // Add item to the logged-in user's or guest's wishlist

// Remove item from wishlist
router.delete("/:userId/items/:productId", wishlistController.removeItem); // Remove a specific item from the logged-in user's or guest's wishlist

module.exports = router;
