const express = require("express");
const categoriesController = require("../controllers/categoriesController");
const router = express.Router();

router.post("/", categoriesController.createCategory);

router.get("/", categoriesController.getCategories);

router.post("/:categoryId", categoriesController.getByCategoryId);

module.exports = router;
