const express = require("express");
const wishlistController = require("../controllers/wishlistController");

const router = express.Router();

// Get wishlist for a user
router.get("/:userId", wishlistController.getWishlist);

// Add item to wishlist
router.post("/:userId/items", wishlistController.addItem);

// Remove item from wishlist
router.delete("/:userId/items/:productId", wishlistController.removeItem); 

module.exports = router;
