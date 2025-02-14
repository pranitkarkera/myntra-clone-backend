const Address = require("../models/address.models");

exports.addAddress = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from the JWT token
    const addressData = req.body;

    // Find the existing address document for the user
    const existingAddress = await Address.findOne({ userId });

    if (existingAddress) {
      // Check if the address already exists in the addressDetails array
      const addressExists = existingAddress.addressDetails.some(
        (detail) =>
          detail.number === addressData.number &&
          detail.street === addressData.street &&
          detail.city === addressData.city &&
          detail.state === addressData.state &&
          detail.zipCode === addressData.zipCode &&
          detail.country === addressData.country &&
          detail.addressType === addressData.addressType
      );

      if (addressExists) {
        return res
          .status(400)
          .json({ message: "This address already exists for this user." });
      }

      // Add the new address to the addressDetails array
      existingAddress.addressDetails.push(addressData);
      await existingAddress.save();
      return res
        .status(200)
        .json({ message: "Address added successfully", existingAddress });
    } else {
      // If no existing address document, create a new one
      const newAddress = new Address({
        userId,
        addressDetails: [addressData], // Wrap in an array
      });

      await newAddress.save();
      return res
        .status(201)
        .json({ message: "Address added successfully", newAddress });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding address", error: error.message });
  }
};

// Get all addresses for a user
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from the JWT token

    // Find addresses for the user
    const addresses = await Address.find({ userId });

    if (!addresses.length) {
      return res
        .status(404)
        .json({ message: "No addresses found for this user." });
    }

    res.status(200).json(addresses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving addresses", error: error.message });
  }
};

// Update a specific address
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from the JWT token
    const { addressId } = req.params;
    const updatedData = req.body;

    // Find the address document for the user
    const address = await Address.findOneAndUpdate(
      { userId, "addressDetails._id": addressId },
      { $set: { "addressDetails.$": updatedData } }, // Use $ to update the specific address
      { new: true, runValidators: true } // Return the updated document and run validators
    );

    if (!address) {
      return res.status(404).json({
        message: "Address not found or does not belong to this user.",
      });
    }

    res.status(200).json({ message: "Address updated successfully", address });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating address", error: error.message });
  }
};

// Remove a specific address
exports.removeAddress = async (req, res) => {
  try {
    const userId = req.userId; // Get userId from the JWT token
    const { addressId } = req.params;

    // Find the address document for the user and remove the specific address
    const address = await Address.findOneAndUpdate(
      { userId },
      { $pull: { addressDetails: { _id: addressId } } }, // Use $pull to remove the address
      { new: true } // Return the updated document
    );

    if (!address) {
      return res.status(404).json({
        message: "Address not found or does not belong to this user.",
      });
    }

    res.status(200).json({ message: "Address removed successfully", address });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error removing address", error: error.message });
  }
};
