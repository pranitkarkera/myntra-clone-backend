const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
    },
    name: { type: String, required: true, trim: true, minlength: 3 },
    number: { type: String, required: true, trim: true },
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    zipCode: {
      type: String,
      required: true,
      match: [/^\d{5,6}$/, "Invalid Zip Code"],
    },
    country: { type: String, required: true, trim: true },
    addressType: {
      type: String,
      required: true,
      enum: ["Home", "Work"],
      trim: true,
    },
    defaultAddress: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
