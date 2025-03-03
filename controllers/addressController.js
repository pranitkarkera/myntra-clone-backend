const mongoose = require("mongoose");
const Address = require("../models/address.models");

// Add a new address
exports.addAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, number, street, city, state, zipCode, country, addressType } =
      req.body;

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

    const addressDoc = await Address.findOne({ userId });
    if (!addressDoc) {
      const newAddressDoc = new Address({
        userId,
        addresses: [
          {
            name,
            number,
            street,
            city,
            state,
            zipCode,
            country,
            addressType,
          },
        ],
      });
      await newAddressDoc.save();
      res
        .status(201)
        .json({ message: "Address added successfully", newAddressDoc });
    } else {
      addressDoc.addresses.push({
        name,
        number,
        street,
        city,
        state,
        zipCode,
        country,
        addressType,
      });
      await addressDoc.save();
      res
        .status(201)
        .json({ message: "Address added successfully", addressDoc });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all addresses for a user
exports.getAllAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    const addressDoc = await Address.findOne({ userId });
    if (!addressDoc) {
      return res.status(404).json({ message: "No addresses found" });
    }
    res.status(200).json(addressDoc.addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific address by ID for a user
exports.getAddressById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { addressId } = req.params;

    const addressDoc = await Address.findOne({ userId });
    if (!addressDoc) {
      return res.status(404).json({ message: "No addresses found" });
    }

    const address = addressDoc.addresses.find(
      (addr) => addr._id.toString() === addressId
    );
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }
    res.status(200).json(address);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { addressId } = req.params;
    const { name, street, city, state, zipCode, country, addressType } =
      req.body;

    const addressDoc = await Address.findOneAndUpdate(
      { userId, "addresses._id": mongoose.Types.ObjectId(addressId) },
      {
        $set: {
          "addresses.$[elem].name": name,
          "addresses.$[elem].street": street,
          "addresses.$[elem].city": city,
          "addresses.$[elem].state": state,
          "addresses.$[elem].zipCode": zipCode,
          "addresses.$[elem].country": country,
          "addresses.$[elem].addressType": addressType,
        },
      },
      {
        new: true,
        arrayFilters: [{ "elem._id": mongoose.Types.ObjectId(addressId) }],
      }
    );

    if (!addressDoc) {
      return res.status(404).json({ message: "Address not found" });
    }

    res
      .status(200)
      .json({ message: "Address updated successfully", addressDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const { addressId } = req.params;

    const addressDoc = await Address.findOneAndUpdate(
      { userId },
      {
        $pull: {
          addresses: { _id: mongoose.Types.ObjectId(addressId) },
        },
      },
      { new: true }
    );

    if (!addressDoc) {
      return res.status(404).json({ message: "Address not found" });
    }

    res
      .status(200)
      .json({ message: "Address deleted successfully", addressDoc });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
