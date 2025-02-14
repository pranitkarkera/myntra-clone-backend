const express = require("express");
const categoryController = require("../controllers/categoriesController");

const router = express.Router();

// Create a new category (protected route)
router.post("/", categoryController.createCategory);

// Get all categories (protected route)
router.get("/", categoryController.getCategories);

// Get category by ID (protected route)
router.get("/:categoryId", categoryController.getByCategoryId);

module.exports = router;
