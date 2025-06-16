const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { findUserByName, createUser } = require("../models/user");

// Sign-up endpoint
router.post("/signup", async (req, res) => {
  try {
    const { name, contactNumber, organization, location, password } = req.body;

    // Log incoming signup request
    console.log("\n🆕 NEW SIGNUP REQUEST:");
    console.log("📝 Name:", name);
    console.log("📞 Contact:", contactNumber);
    console.log("🏢 Organization:", organization);
    console.log("📍 Location:", location);
    console.log("🔐 Password:", password ? "***PROVIDED***" : "NOT PROVIDED");

    // Validation
    if (!name || !contactNumber || !organization || !location || !password) {
      console.log("❌ Validation failed - missing fields");
      return res.status(400).json({
        success: false,
        message: "Lahat ng fields ay kailangan",
      });
    }

    // Check if user already exists
    const existingUser = findUserByName(name);
    if (existingUser) {
      console.log("❌ User already exists:", name);
      return res.status(400).json({
        success: false,
        message: "May user na may ganitong pangalan",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, config.SALT_ROUNDS);

    // Create new user
    const newUser = createUser({
      name,
      contactNumber,
      organization,
      location,
      password: hashedPassword,
    });

    console.log("✅ User created successfully!");
    console.log("👤 User ID:", newUser.id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, name: newUser.name },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      success: true,
      message: "Account successfully created!",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("❌ Sign-up error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Sign-in endpoint
router.post("/signin", async (req, res) => {
  try {
    const { name, password } = req.body;

    // Log incoming signin request
    console.log("\n🔐 SIGNIN ATTEMPT:");
    console.log("👤 Name:", name);
    console.log("🔑 Password:", password ? "***PROVIDED***" : "NOT PROVIDED");

    // Validation
    if (!name || !password) {
      console.log("❌ Validation failed - missing credentials");
      return res.status(400).json({
        success: false,
        message: "Pangalan at password ay kailangan",
      });
    }

    // Find user
    const user = findUserByName(name);
    if (!user) {
      console.log("❌ User not found:", name);
      return res.status(400).json({
        success: false,
        message: "Mali ang pangalan o password",
      });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("❌ Invalid password for user:", name);
      return res.status(400).json({
        success: false,
        message: "Mali ang pangalan o password",
      });
    }

    console.log("✅ Sign-in successful for:", user.name);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, name: user.name },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN }
    );

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: "Successfully signed in!",
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error("❌ Sign-in error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = router; 