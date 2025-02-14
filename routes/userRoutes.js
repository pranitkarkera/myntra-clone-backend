const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware"); // Import the middleware

// User routes
router.post("/register", userController.register); // Register a new user
router.post("/login", userController.login); // Login a user
router.get("/:userId", authMiddleware, userController.getUser); // Get user by ID
router.put("/:userId", authMiddleware, userController.updateUser); // Update user by ID
router.delete("/:userId", authMiddleware, userController.deleteUser); // Delete user by ID

module.exports = router;
