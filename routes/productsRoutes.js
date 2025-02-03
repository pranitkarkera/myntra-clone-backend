const express = require("express");
const productsController = require("../controllers/productsController");
const router = express.Router();

router.post('/', productsController.createProducts);

router.get("/", productsController.getProducts);

router.get("/:productId", productsController.getByProductId);

module.exports = router;
