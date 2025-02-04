const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    // userId: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   required: true,
    // },
    name: { type: String, required: true },
    number: { type: Number, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true },
    addressType: {
      type: String,
      required: true,
      enum: ["Home", "Work"],
    },
    defaultAddress: {type: Boolean}
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
