const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

// Address routes
router.post("/add/:userId", addressController.addAddress);
router.get("/user/:userId", addressController.getAddresses);
router.put("/:userId/:addressId", addressController.updateAddress);
router.delete("/:userId/:addressId", addressController.removeAddress);

module.exports = router; // Ensure you are exporting the router
