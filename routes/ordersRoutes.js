const express = require("express");
const ordersController = require("../controllers/ordersController");
const router = express.Router();

router.post("/place-order", ordersController.placeOrder);
router.get("/:email", ordersController.getOrderHistory);

module.exports = router;
