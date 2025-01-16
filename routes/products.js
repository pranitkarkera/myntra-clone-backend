const mongoose = require("mongoose");
const express = require("express");
const Product = require("../models/products.models");
const router = express.Router();

// Category ID mapping
const categoryId = {
  1: "60c72b2f9b1e8a001f8e4ea1",
  2: "60c72b2f9b1e8a001f8e4ea2",
  3: "60c72b2f9b1e8a001f8e4ea3",
  4: "60c72b2f9b1e8a001f8e4ea4",
  5: "60c72b2f9b1e8a001f8e4ea5",
  6: "60c72b2f9b1e8a001f8e4ea6",
  7: "60c72b2f9b1e8a001f8e4ea7",
  8: "60c72b2f9b1e8a001f8e4ea8",
  9: "60c72b2f9b1e8a001f8e4ea9",
  10: "60c72b2f9b1e8a001f8e4eaa", // Ensure this is a valid ObjectId
  11: "60c72b2f9b1e8a001f8e4eab", // Ensure this is a valid ObjectId
};

// Post products in the database
async function createProducts(products) {
  try {
    const updatedProducts = products.map((product) => {
      const mappedCategoryId = categoryId[product.categoryId];
      if (!mappedCategoryId) {
        throw new Error(`Invalid categoryId: ${product.categoryId}`);
      }
      product.categoryId = new mongoose.Types.ObjectId(mappedCategoryId);
      return product;
    });
    const savedProducts = await Product.insertMany(updatedProducts);
    return savedProducts;
  } catch (error) {
    console.error("Error creating products:", error);
    throw error;
  }
}

// Route to create products
router.post("/products", async (req, res) => {
  try {
    console.log(req.body);
    const savedProducts = await createProducts(req.body);
    res.status(200).json({ message: "New Product created", savedProducts });
  } catch (error) {
    res.status(500).json({ error: "Failed to create a product" });
  }
});

// Test route
router.get("/", (req, res) => {
  res.json({ message: "Api is working!" });
});

// Get all products from the database
async function readAllProducts() {
  try {
    const allProducts = await Product.find();
    return allProducts;
  } catch (error) {
    throw error;
  }
}

// Route to get all products
router.get("/products", async (req, res) => {
  try {
    const products = await readAllProducts();
    if (products.length !== 0) {
      res.json({ data: { products } });
    } else {
      res.status(404).json({ error: "No products found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// Get product by productID
async function getProductByID(productId) {
  try {
    const productByID = await Product.findById(productId);
    return productByID;
  } catch (error) {
    throw error;
  }
}

// Route to get a product by ID
router.get("/products/:productId", async (req, res) => {
  try {
    const product = await getProductByID(req.params.productId);
    if (product) {
      res.json({ data: { product } });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Uncomment to create initial products
// createProducts(newProducts);

module.exports = router;
