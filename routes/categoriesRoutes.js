const express = require("express");
const categoryController = require("../controllers/categories.controller");
const authMiddleware = require("../middleware/authMiddleware"); // Import the middleware

const router = express.Router();

// Create a new category (protected route)
router.post("/", authMiddleware, categoryController.createCategory);

// Get all categories (protected route)
router.get("/", authMiddleware, categoryController.getCategories);

// Get category by ID (protected route)
router.get("/:categoryId", authMiddleware, categoryController.getByCategoryId);

module.exports = router;
