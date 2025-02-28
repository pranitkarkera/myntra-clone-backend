const express = require("express");
const wishlistController = require("../controllers/wishlistController");
const router = express.Router();

router.get("/:userId", wishlistController.getWishlist);
router.post("/:userId/items", wishlistController.addItem);
router.delete("/:userId/items/:productId", wishlistController.removeItem); 

module.exports = router;
