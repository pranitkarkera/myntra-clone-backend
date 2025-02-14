const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const authMiddleware = require("../auth/authMiddlerware"); // Import the middleware

// Address routes
router.post("/add", authMiddleware, addressController.addAddress); // No need for userId in params
router.get("/user", authMiddleware, addressController.getAddresses); // No need for userId in params
router.put("/:addressId", authMiddleware, addressController.updateAddress); // No need for userId in params
router.delete("/:addressId", authMiddleware, addressController.removeAddress); // No need for userId in params

module.exports = router; // Ensure you are exporting the router
