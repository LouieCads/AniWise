const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const OpenAI = require("openai");
const config = require("../config/config");
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

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: config.OPENAI_API_KEY,
});

// Get all farms (for testing - remove in production)
// router.get("/farms", (req, res) => {
//   res.json({
//     success: true,
//     farms: getAllFarms(),
//     count: getFarmCount(),
//   });
// });

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

// Get crop recommendations using OpenAI (protected route)
router.post("/recommend-crops", authenticateToken, async (req, res) => {
  try {
    const { soilData, location } = req.body;

    if (!soilData) {
      return res.status(400).json({
        success: false,
        message: "Soil data is required",
      });
    }

    // Filipino/Taglish, simple, local crops, no question mark icons
    const prompt = `Ikaw ay isang agricultural expert na tumutulong sa mga magsasakang Pilipino. Batay sa mga sumusunod na soil at weather conditions ng isang farm sa Pilipinas, magbigay ng 6 pinaka-angkop na pananim (crops) na madaling maintindihan ng karaniwang magsasaka. Gamitin ang Tagalog o Taglish, iwasan ang technical terms, at mag-focus sa mga pananim na karaniwan at mabenta sa Pilipinas. Huwag gumamit ng question mark (?) na icon—kung walang icon, gamitin ang 'agriculture'.

      Soil at Weather Data:
      - Lokasyon: ${location || "Pilipinas"}
      - Temperatura ng Lupa: ${soilData.temperature}°C
      - Moisture ng Lupa: ${soilData.moisture}
      - pH ng Lupa: ${soilData.pH}
      - Temperatura ng Hangin: ${soilData.airTemp}°C
      - Humidity: ${soilData.humidity}%
      - Kondisyon ng Lupa: ${soilData.condition}
      - Lakas ng Hangin: ${soilData.windSpeed} m/s
      - UV Index: ${soilData.uvIndex || "N/A"}

      Ibigay ang sagot sa JSON na ito:
      {
        "recommendations": [
          {
            "cropName": "Pangalan ng pananim (English)",
            "tagalogName": "Pangalan ng pananim (Tagalog)",
            "scientificName": "Scientific Name",
            "suitabilityScore": "Excellent/Good/Fair/Basta simple lang",
            "reasoning": "Maikling paliwanag kung bakit ito angkop (Tagalog/Taglish)",
            "plantingSeason": "Kailan itanim (hal. Tag-ulan, Tag-init, buong taon)",
            "harvestTime": "Gaano katagal bago anihin (hal. 3 buwan)",
            "careTips": ["Tip 1", "Tip 2", "Tip 3"],
            "marketValue": "Mataas/Katamtaman/Mababa",
            "icon": "material-icon-name o 'agriculture' kung wala"
          }
        ]
      }

      Iwasan ang mahahabang sagot. Simplehan lang para madaling maintindihan ng magsasaka.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Ikaw ay isang agricultural consultant na tumutulong sa mga magsasakang Pilipino. Simple, praktikal, at madaling maintindihan ang mga sagot.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content;

    // Try to parse the JSON response
    let recommendedCrops;
    try {
      // Extract JSON from the response (in case there's additional text)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendedCrops = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Error parsing OpenAI response:", parseError);
      // Fallback: create a structured response from the text
      recommendedCrops = {
        recommendations: [
          {
            cropName: "Rice",
            tagalogName: "Palay",
            scientificName: "Oryza sativa",
            suitabilityScore: "Good",
            reasoning: "Based on the soil conditions provided",
            plantingSeason: "Wet season",
            harvestTime: "4-6 months",
            careTips: [
              "Regular irrigation",
              "Fertilizer application",
              "Pest management",
            ],
            marketValue: "High",
            icon: "grass",
          },
        ],
      };
    }

    res.json({
      success: true,
      recommendedCrops: recommendedCrops.recommendations || recommendedCrops,
      rawResponse: response,
    });
  } catch (error) {
    console.error("Error getting crop recommendations:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get crop recommendations",
      error: error.message,
    });
  }
});

module.exports = router;
