const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

// Add item to cart
router.post("/:userId/items", cartController.addItem); // Specify userId in the route

// Remove item from cart
router.delete("/:userId/items/:productId", cartController.removeItem);

// Get cart for a user
router.get("/:userId", cartController.getCart); // Specify userId in the route

module.exports = router;
