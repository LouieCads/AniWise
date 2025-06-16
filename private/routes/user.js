const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { findUserById, getAllUsers, getUserCount } = require("../models/user");

// Get user profile (protected route)
router.get("/profile", authenticateToken, (req, res) => {
  const user = findUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const { password: _, ...userWithoutPassword } = user;
  res.json({
    success: true,
    user: userWithoutPassword,
  });
});

// Get all users (for testing)
router.get("/users", (req, res) => {
  res.json({
    success: true,
    users: getAllUsers(),
    count: getUserCount(),
  });
});

module.exports = router;
