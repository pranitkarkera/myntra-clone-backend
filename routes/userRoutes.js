const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {
  signupValidation,
  loginValidation,
} = require("../middleware/AuthValidation");
const ensureAuthenticated = require("../middleware/AuthMiddleware");

router.post("/signup", signupValidation, userController.signup);
router.post("/login", loginValidation, userController.login);
router.get("/:userId", ensureAuthenticated, userController.getUser);
router.put("/:userId", ensureAuthenticated, userController.updateUser);
router.delete("/:userId", ensureAuthenticated, userController.deleteUser);

module.exports = router;
