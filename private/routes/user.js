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

// Update user credit score and credit limit (protected route)
router.put("/profile/credit", authenticateToken, (req, res) => {
  const user = findUserById(req.user.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const { creditScore, creditLimit } = req.body;
  if (typeof creditScore !== "undefined") user.creditScore = creditScore;
  if (typeof creditLimit !== "undefined") user.creditLimit = creditLimit;
  const { password: _, ...userWithoutPassword } = user;
  res.json({
    success: true,
    user: userWithoutPassword,
    message: "Credit info updated successfully.",
  });
});

module.exports = router;
