const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");

// Address routes
router.post("/add", addressController.addAddress);
router.get("/alladdress", addressController.getAllAddresses);
router.get("/:number", addressController.getAddressesByUser);
router.put("/:number", addressController.updateAddress);
router.delete("/:number", addressController.deleteAddress);

module.exports = router;