const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

// Address routes
router.post("/add", addressController.addAddress);
router.get("/:userId", addressController.getAddressesByUser);
router.put("/:addressId", addressController.updateAddress);
router.delete("/:addressId", addressController.deleteAddress);

module.exports = router;
