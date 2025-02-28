const express = require("express");
const ordersController = require("../controllers/ordersController");
const router = express.Router();

// Place a new order
router.post("/place-order", ordersController.placeOrder);

// Get all orders for a user by email
router.get("/history/:email", ordersController.getOrderHistory);

// Get specific order details by order ID
router.get("/:orderId", ordersController.getOrderDetails);

module.exports = router;
