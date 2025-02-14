const express = require("express");
const cartController = require("../controllers/cartController");
const authMiddleware = require("../middleware/authMiddleware"); // Import the middleware

const router = express.Router();

// Add item to cart
router.post("/items", authMiddleware, cartController.addItem); // No need for userId in params

// Remove item from cart
router.delete("/items/:productId", authMiddleware, cartController.removeItem); // No need for userId in params

// Get cart for a user
router.get("/", authMiddleware, cartController.getCart); // No need for userId in params

module.exports = router;
