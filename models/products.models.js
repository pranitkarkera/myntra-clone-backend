const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
  },
  brandName: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  categoryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Category", 
    required: true 
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  images: {
    type: [String],
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5
  },
  gender: {
    type: String,
    required: true,
    enum: ["MALE", "FEMALE", "BOYS", "GIRLS"],
  },
});

module.exports = mongoose.model('product', productSchema)