// const mongoose = require("mongoose");
const Address = require("../models/address.models");

// Add a new address
exports.addAddress = async (req, res) => {
  try {
    const {
      name,
      number,
      street,
      city,
      state,
      zipCode,
      country,
      addressType,
      defaultAddress: isDefault,
    } = req.body;

    if (
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
      name,
      number,
      street,
      city,
      state,
      zipCode,
      country,
      addressType,
      defaultAddress: isDefault || false, 
    });

    await address.save();
    res.status(201).json({ message: "Address added successfully", address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all addresses
exports.getAllAddresses = async (req, res) => {
  try {
    const addresses = await Address.find();
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get address by user id
exports.getAddressesByUser = async (req, res) => {
  try {
    const { number } = req.params;

    const addresses = await Address.find({ number });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const { number } = req.params;
    const {
      name,
      street,
      city,
      state,
      zipCode,
      country,
      addressType,
      defaultAddress: isDefault,
    } = req.body;

    const address = await Address.findOneAndUpdate(
      { number },
      {
        name,
        street,
        city,
        state,
        zipCode,
        country,
        addressType,
        defaultAddress: isDefault,
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
    const { number } = req.params;

    const address = await Address.findOneAndDelete({ number });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
