const express = require("express");
const cartController = require("../controllers/cartController");
const router = express.Router();

router.post("/items", cartController.addItem);
router.delete("/items", cartController.removeItem);
router.get("/:userId", cartController.getCart);

module.exports = router;
