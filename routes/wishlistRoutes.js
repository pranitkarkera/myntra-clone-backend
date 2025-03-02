const express = require("express");
const router = express.Router();
const wishlistController = require("../controllers/wishlistController");
const ensureAuthenticated = require("../middleware/AuthMiddleware");

router.get("/:userId", ensureAuthenticated, wishlistController.getWishlist);
router.post("/:userId/items", ensureAuthenticated, wishlistController.addItem);
router.delete(
  "/:userId/items/:productId",
  ensureAuthenticated,
  wishlistController.removeItem
);

module.exports = router;
