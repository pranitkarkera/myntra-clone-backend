const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    unique: true,
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
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  discountPercent: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  images: {
    type: [String],
    required: true,
  },
  postedAt: {
    type: Number,
    required: true,
    min: 0,
  },
  numberOfReviews: {
    type: Number,
    required: true,
    min: 0,
  },
  rating: {
    type: Number,
    required: true,
    min: 0,
    max: 5,
  },
  color: {
    type: [String],
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["MALE", "FEMALE", "BOYS", "GIRLS"],
  },
  size: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model('Product', productSchema)