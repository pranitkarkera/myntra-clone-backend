const express = require("express");
const router = express.Router();
const addressController = require("../controllers/addressController");
const ensureAuthenticated = require("../middleware/AuthMiddleware");

router.post("/:userId/add", ensureAuthenticated, addressController.addAddress);
router.get(
  "/:userId/alladdress",
  ensureAuthenticated,
  addressController.getAllAddresses
);
router.get(
  "/:userId/addresses/:addressId",
  ensureAuthenticated,
  addressController.getAddressById
);
router.put(
  "/:userId/addresses/:addressId",
  ensureAuthenticated,
  addressController.updateAddress
);
router.delete(
  "/:userId/addresses/:addressId",
  ensureAuthenticated,
  addressController.deleteAddress
);

module.exports = router;
