const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const ensureAuthenticated = require("../middleware/AuthMiddleware");

router.post("/:userId/items", ensureAuthenticated, cartController.addItem);
router.delete(
  "/:userId/items/:productId",
  ensureAuthenticated,
  cartController.removeItem
);
router.get("/:userId", ensureAuthenticated, cartController.getCart);

module.exports = router;
