const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const {
  findFarmById,
  findFarmByUserId,
  findFarmByLocation,
  createFarm,
  updateFarm,
  deleteFarm,
  getAllFarms,
  getFarmCount,
  getFarmsByUserId,
} = require("../models/farm");

// Get all farms (for testing - remove in production)
router.get("/farms", (req, res) => {
  res.json({
    success: true,
    farms: getAllFarms(),
    count: getFarmCount(),
  });
});

// Get user's farms (protected route)
router.get("/farms/my", authenticateToken, (req, res) => {
  const userFarms = getFarmsByUserId(req.user.userId);
  res.json({
    success: true,
    farms: userFarms,
    count: userFarms.length,
  });
});

// Get specific farm by ID (protected route)
router.get("/farms/:id", authenticateToken, (req, res) => {
  const farm = findFarmById(parseInt(req.params.id));

  if (!farm) {
    return res.status(404).json({
      success: false,
      message: "Farm not found",
    });
  }

  // Check if user owns this farm
  if (farm.userId !== req.user.userId) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only view your own farms.",
    });
  }

  res.json({
    success: true,
    farm: farm,
  });
});

// Create new farm (protected route)
router.post("/farms", authenticateToken, (req, res) => {
  const {
    address,
    coordinates,
    soilConditions,
    weatherData,
    cropRecommendations,
  } = req.body;

  // Validate required fields
  if (!address || !coordinates || !soilConditions) {
    return res.status(400).json({
      success: false,
      message:
        "Missing required fields: address, coordinates, and soilConditions are required",
    });
  }

  // Check if farm already exists at this location for this user
  const existingFarm = findFarmByLocation(
    coordinates.latitude,
    coordinates.longitude
  );
  if (existingFarm && existingFarm.userId === req.user.userId) {
    return res.status(409).json({
      success: false,
      message: "Farm already exists at this location",
      farmExists: true,
      existingFarm: existingFarm,
    });
  }

  const farmData = {
    userId: req.user.userId,
    address,
    coordinates,
    soilConditions: {
      temperature: soilConditions.temperature,
      moisture: soilConditions.moisture,
      condition: soilConditions.condition,
      pH: soilConditions.pH,
      airTemp: soilConditions.airTemp,
      humidity: soilConditions.humidity,
      pressure: soilConditions.pressure,
      windSpeed: soilConditions.windSpeed,
      uvIndex: soilConditions.uvIndex || 0,
      description: soilConditions.description,
      icon: soilConditions.icon,
    },
    weatherData: weatherData || null,
    cropRecommendations: cropRecommendations || [],
    isActive: true,
  };

  const newFarm = createFarm(farmData);

  res.status(201).json({
    success: true,
    message: "Farm created successfully",
    farm: newFarm,
  });
});

// Update farm (protected route)
router.put("/farms/:id", authenticateToken, (req, res) => {
  const farmId = parseInt(req.params.id);
  const farm = findFarmById(farmId);

  if (!farm) {
    return res.status(404).json({
      success: false,
      message: "Farm not found",
    });
  }

  // Check if user owns this farm
  if (farm.userId !== req.user.userId) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only update your own farms.",
    });
  }

  const updatedFarm = updateFarm(farmId, req.body);

  res.json({
    success: true,
    message: "Farm updated successfully",
    farm: updatedFarm,
  });
});

// Delete farm (protected route)
router.delete("/farms/:id", authenticateToken, (req, res) => {
  const farmId = parseInt(req.params.id);
  const farm = findFarmById(farmId);

  if (!farm) {
    return res.status(404).json({
      success: false,
      message: "Farm not found",
    });
  }

  // Check if user owns this farm
  if (farm.userId !== req.user.userId) {
    return res.status(403).json({
      success: false,
      message: "Access denied. You can only delete your own farms.",
    });
  }

  const deleted = deleteFarm(farmId);

  if (deleted) {
    res.json({
      success: true,
      message: "Farm deleted successfully",
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Failed to delete farm",
    });
  }
});

// Check if farm exists at location (protected route)
router.post("/farms/check-location", authenticateToken, (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({
      success: false,
      message: "Latitude and longitude are required",
    });
  }

  const existingFarm = findFarmByLocation(latitude, longitude);
  const userOwnsFarm = existingFarm && existingFarm.userId === req.user.userId;

  res.json({
    success: true,
    farmExists: !!existingFarm,
    userOwnsFarm: userOwnsFarm,
    farm: userOwnsFarm ? existingFarm : null,
  });
});

module.exports = router;
