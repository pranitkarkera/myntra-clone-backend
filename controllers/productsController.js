const Product = require("../models/products.models");

async function createProducts(products) {
  try {
    if (!Array.isArray(products)) {
      throw new TypeError("Expected products to be an array");
    }

    const updatedProducts = products.map((product) => {
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

exports.createProducts = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const savedProducts = await createProducts(req.body);
    res.status(200).json({ message: "New Product created", savedProducts });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message || "Failed to create a product" });
  }
}


async function readAllProducts() {
  try {
    const allProducts = await Product.find();
    return allProducts;
  } catch (error) {
    throw error;
  }
}

exports.getProducts = async (req, res) => {
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
}

async function getProductByID(productId) {
  try {
    const productByID = await Product.findOne({ productId: productId });
    return productByID;
  } catch (error) {
    throw error;
  }
}

exports.getByProductId = async (req, res) => {
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
}

// createProducts(newProducts);


