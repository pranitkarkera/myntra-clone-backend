const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");
const ensureAuthenticated = require("../middleware/AuthMiddleware");

router.post(
  "/place-order",
  ensureAuthenticated,
  ordersController.placeOrder
);
router.get(
  "/history",
  ensureAuthenticated,
  ordersController.getOrderHistory
);
router.get(
  "/details/:orderId",
  ensureAuthenticated,
  ordersController.getOrderDetails
);

module.exports = router;
