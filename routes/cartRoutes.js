const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

// Add item to cart
router.post("/items", cartController.addItem);

// Remove item from cart
router.delete("/items", cartController.removeItem); // Changed to DELETE

// Get cart for a user
router.get("/:userId", cartController.getCart);

module.exports = router;
