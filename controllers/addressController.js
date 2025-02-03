const Address = require("../models/address.models");

// Add a new address
exports.addAddress = async (req, res) => {
  try {
    const { userId, street, city, state, zipCode, country } = req.body;
    const address = new Address({
      userId,
      street,
      city,
      state,
      zipCode,
      country,
    });
    await address.save();
    res.status(201).json({ message: "Address added successfully", address });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get addresses by user ID
exports.getAddressesByUser = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an address
exports.updateAddress = async (req, res) => {
  try {
    const { street, city, state, zipCode, country } = req.body;
    const address = await Address.findByIdAndUpdate(
      req.params.addressId,
      { street, city, state, zipCode, country },
      { new: true }
    );

    // if (!address) {
    //   return res.status(404).json({ success: false, message: "Address not found" });
    // }

    res.status(200).json({ success: true, message: "Address updated successfully", address });
  } catch (error) {
    // console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    await Address.findByIdAndDelete(req.params.addressId);
    res.status(200).json({ message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
