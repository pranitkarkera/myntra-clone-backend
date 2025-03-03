const Address = require("../models/address.models");

// Add a new address
exports.addAddress = async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      name,
      number,
      street,
      city,
      state,
      zipCode,
      country,
      addressType,
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
      userId,
      name,
      number,
      street,
      city,
      state,
      zipCode,
      country,
      addressType,
    });

    await address.save();
    res.status(201).json({ message: "Address added successfully", address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all addresses for a user
exports.getAllAddresses = async (req, res) => {
  try {
    const { userId } = req.params;

    const addresses = await Address.find({ userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a specific address by ID for a user
exports.getAddressById = async (req, res) => {
  try {
    const { userId } = req.params;
    const { addressId } = req.params;

    const address = await Address.findOne({ userId, _id: addressId });
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
    const { addressId } = req.params; // Assuming you pass addressId as a param
    const {
      name,
      street,
      city,
      state,
      zipCode,
      country,
      addressType,
    } = req.body;

    const address = await Address.findOneAndUpdate(
      { userId, _id: addressId },
      {
        name,
        street,
        city,
        state,
        zipCode,
        country,
        addressType,
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
    const { userId } = req.params;
    const { addressId } = req.params; // Assuming you pass addressId as a param

    const address = await Address.findOneAndDelete({ userId, _id: addressId });

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
