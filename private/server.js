const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const farmRoutes = require("./routes/farm");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", farmRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "AniWise API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Start server
app.listen(config.PORT, () => {
  console.log(
    `🌱 FarmWise API server running on http://localhost:${config.PORT}`
  );
  console.log(`📱 For Expo Go, use your local IP address instead of localhost`);
  console.log(`🔧 Health check: http://localhost:${config.PORT}/api/health`);
  console.log(`👀 View all users: http://localhost:${config.PORT}/api/users`);
  console.log(`🌾 View all farms: http://localhost:${config.PORT}/api/farms`);
});
