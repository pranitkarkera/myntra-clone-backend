const mongoose = require("mongoose");
const Address = require("../models/address.models");

// Add a new address
exports.addAddress = async (req, res) => {
  try {
    const {
      userId,
      name,
      number,
      street,
      city,
      state,
      zipCode,
      country,
      addressType,
      default: isDefault,
    } = req.body;

    // Validate required fields
    if (
      !userId ||
      !name ||
      !number ||
      !street ||
      !city ||
      !state ||
      !zipCode ||
      !country ||
      !addressType
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const address = new Address({
      userId,
      name,
      number,
      street,
      city,
      state,
      zipCode,
      country,
      addressType,
      default: isDefault || false, // Default to false if not provided
    });

    await address.save();
    res.status(201).json({ message: "Address added successfully", address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get address by user id

exports.getAddressesByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const addresses = await Address.find({ userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const {
      name,
      number,
      street,
      city,
      state,
      zipCode,
      country,
      addressType,
      default: isDefault,
    } = req.body;

    // Validate addressId
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    const address = await Address.findByIdAndUpdate(
      addressId,
      {
        name,
        number,
        street,
        city,
        state,
        zipCode,
        country,
        addressType,
        default: isDefault,
      },
      { new: true }
    );

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address updated successfully", address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    // Validate addressId
    if (!mongoose.Types.ObjectId.isValid(addressId)) {
      return res.status(400).json({ message: "Invalid address ID" });
    }

    const address = await Address.findByIdAndDelete(addressId);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
