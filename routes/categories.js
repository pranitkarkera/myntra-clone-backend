const express = require("express");
const Category = require("../models/categories.models");
const router = express.Router();

// const newCategories = [
//   {
//     categoryId: "0001", // Printed Shirt
//     categoryName: "Printed Shirt",
//   },
//   {
//     categoryId: "0002", // Checked Shirt
//     categoryName: "Checked Shirt",
//   },
//   {
//     categoryId: "0003", // Solid Shirt
//     categoryName: "Solid Shirt",
//   },
//   {
//     categoryId: "0004", // Floral Shirt
//     categoryName: "Floral Shirt",
//   },
//   {
//     categoryId: "0005", // Denim Shirt
//     categoryName: "Denim Shirt",
//   },
//   {
//     categoryId: "0006", // Cotton Shirt
//     categoryName: "Cotton Shirt",
//   },
//   {
//     categoryId: "0007", // Printed Top
//     categoryName: "Printed Top",
//   },
//   {
//     categoryId: "0008", // Striped Top
//     categoryName: "Striped Top",
//   },
//   {
//     categoryId: "0009", // Solid Top
//     categoryName: "Solid Top",
//   },
//   {
//     categoryId: "0010", // Floral Top
//     categoryName: "Floral Top",
//   },
//   {
//     categoryId: "0011", // Dusty Top
//     categoryName: "Dusty Top",
//   },
// ];

// Post categories in the database
async function createCategory(categories) {
  try {
    const savedCategories = await Category.insertMany(categories);
    return savedCategories;
  } catch (error) {
    console.error("Error creating categories:", error);
    throw error;
  }
}

// Route to create categories
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const savedCategories = await createCategory(req.body);
    res.status(200).json({ message: "New category created", savedCategories });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Failed to create a category" });
  }
});

// Get categories from the database
async function readAllCategories() {
  try {
    const allCategories = await Category.find();
    return allCategories;
  } catch (error) {
    throw error;
  }
}

// Route to get all categories
router.get("/", async (req, res) => {
  try {
    const categories = await readAllCategories();
    if (categories.length !== 0) {
      res.json({ data: { categories } });
    } else {
      res.status(404).json({ error: "Categories not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch categories" });
  }
});

// Get category by ID
async function getCategoryById(categoryId) {
  try {
    const categoryById = await Category.findOne({ categoryId });
    return categoryById;
  } catch (error) {
    throw error;
  }
}

// Route to get a category by ID
router.get("/:categoryId", async (req, res) => {
  try {
    const category = await getCategoryById(req.params.categoryId);
    if (category) {
      res.json({ data: { category } });
    } else {
      res.status(404).json({ error: "Category by ID not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch category by ID" });
  }
});

// createCategory(newCategories);

module.exports = router;
