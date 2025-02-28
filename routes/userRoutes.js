const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/:email", userController.getUser);
router.put("/:email", userController.updateUser);
router.delete("/:email", userController.deleteUser);

module.exports = router;
