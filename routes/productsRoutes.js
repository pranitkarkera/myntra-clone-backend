const express = require("express");
const productsController = require("../controllers/productsController");
const authMiddleware = require("../auth/authMiddlerware"); // Import the middleware

const router = express.Router();

// Create product (protected route)
router.post("/", authMiddleware, productsController.createProducts); // Only authenticated users can create products

// Get all products (public route)
router.get("/", productsController.getProducts);

// Get product by ID (public route)
router.get("/:productId", productsController.getByProductId);

module.exports = router;
