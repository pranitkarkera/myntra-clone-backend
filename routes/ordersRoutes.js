const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/ordersController");
const ensureAuthenticated = require("../middleware/AuthMiddleware");

router.post(
  "/:userId/place-order",
  ensureAuthenticated,
  ordersController.placeOrder
);
router.get(
  "/:userId/history",
  ensureAuthenticated,
  ordersController.getOrderHistory
);
router.get(
  "/:userId/details/:orderId",
  ensureAuthenticated,
  ordersController.getOrderDetails
);

module.exports = router;
