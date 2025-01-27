const mongoose = require("mongoose");
const express = require("express");
const Product = require("../models/products.models");
const router = express.Router();

// This file contains the list of shirts and their properties
// ----------------------------------------------------------------------------
// Product properties:
// - productId: unique id of the product
// - brandName: brandName of the product
// - productName: name of the product
// - categoryName: name of the category
// - categoryId: unique id of th cartegory
// - images: list of product images
// - rating: rating of the product
// - gender: gender to which the shirt belong



// Post products in the database

async function createProducts(products) {
  try {
    if (!Array.isArray(products)) {
      throw new TypeError("Expected products to be an array");
    }

    // No need to convert categoryId to ObjectId if they are strings
    const updatedProducts = products.map((product) => {
      // Ensure categoryId is a string
      product.categoryId = product.categoryId.toString();
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
router.post("/", async (req, res) => {
  try {
    console.log("Request Body:", req.body); // Log the request body
    const savedProducts = await createProducts(req.body);
    res.status(200).json({ message: "New Product created", savedProducts });
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to create a product" });
  }
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
router.get("/", async (req, res) => {
  try {
    const products = await readAllProducts();
    if (products.length !== 0) {
      res.json({ data: { products } });
    } else {
      res.status(404).json({ error: "No products found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Failed to fetch products" });
  }
});

// Get product by productID
async function getProductByID(productId) {
  try {
    // Find product by custom productId
    const productByID = await Product.findOne({ productId: productId });
    return productByID;
  } catch (error) {
    throw error;
  }
}

// Route to get a product by ID
router.get("/:productId", async (req, res) => {
  try {
    const product = await getProductByID(req.params.productId);
    if (product) {
      res.json({ data: { product } });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message || "Failed to fetch product" });
  }
});

// createProducts(newProducts);

module.exports = router;
