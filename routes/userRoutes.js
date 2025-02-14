const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User routes
router.post("/register", userController.register); // Register a new user
router.post("/login", userController.login); // Login a user
router.get("/:userId", userController.getUser); // Get user by ID
router.put("/:userId", userController.updateUser); // Update user by ID
router.delete("/:userId", userController.deleteUser); // Delete user by ID

module.exports = router;
