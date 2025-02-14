const express = require("express");
const wishlistController = require("../controllers/wishlistController");
const authMiddleware = require("../middleware/authMiddleware"); // Import the middleware

const router = express.Router();

// Get wishlist for a user
router.get("/", authMiddleware, wishlistController.getWishlist); // No need for userId in params

// Add item to wishlist
router.post("/items", authMiddleware, wishlistController.addItem); // No need for userId in params

// Remove item from wishlist
router.delete(
  "/items/:productId",
  authMiddleware,
  wishlistController.removeItem
); // No need for userId in params

module.exports = router;
