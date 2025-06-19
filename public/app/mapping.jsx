import React, { memo, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  FlatList, // Import FlatList for suggestions
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router, useLocalSearchParams } from 'expo-router'; // Import useLocalSearchParams
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing auth token

/**
 * Mapping Component with Backend Integration
 * 
 * This component integrates with the AniWise backend API to:
 * - Authenticate users using JWT tokens
 * - Store farm information (location, soil conditions, weather data)
 * - Check for existing farms at the same location
 * - Handle API errors and network connectivity issues
 * 
 * Backend API Endpoints Used:
 * - POST /api/farms - Create new farm
 * - POST /api/farms/check-location - Check if farm exists at location
 * - GET /api/farms/my - Get user's farms
 * - GET /api/health - Health check
 * 
 * Authentication:
 * - Uses AsyncStorage to persist JWT tokens
 * - Automatically redirects to sign-in if no token found
 * - Handles token expiration and network errors
 */

const { width, height } = Dimensions.get('window');

// Move API key to environment variables or secure storage
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '98bb67c7b4f0e326ccdfebd2e15577f3';

// Crop recommendation data structure
const CROP_RECOMMENDATIONS = {
  rice: {
    name: 'Palay (Rice)',
    tagalog: 'Palay',
    scientificName: 'Oryza sativa',
    icon: 'grass',
    conditions: {
      pH: { min: 5.5, max: 7.0, optimal: 6.5 },
      moisture: ['High', 'Medium'],
      temperature: { min: 20, max: 35, optimal: 28 },
      soilType: ['Clay', 'Loam'],
      season: ['Wet', 'Dry']
    },
    description: 'Main crop ng Pilipinas. Kailangan ng maraming tubig at mainit na panahon.',
    benefits: ['High yield potential', 'Staple food', 'Good market demand'],
    careTips: ['Regular irrigation', 'Fertilizer application', 'Pest management']
  },
  corn: {
    name: 'Mais (Corn)',
    tagalog: 'Mais',
    scientificName: 'Zea mays',
    icon: 'agriculture',
    conditions: {
      pH: { min: 5.8, max: 7.5, optimal: 6.5 },
      moisture: ['Medium', 'Low'],
      temperature: { min: 18, max: 32, optimal: 25 },
      soilType: ['Loam', 'Sandy Loam'],
      season: ['Wet', 'Dry']
    },
    description: 'Versatile crop na pwede sa iba\'t ibang soil conditions.',
    benefits: ['Drought tolerant', 'Multiple uses', 'Good for rotation'],
    careTips: ['Well-drained soil', 'Regular weeding', 'Proper spacing']
  },
  vegetables: {
    name: 'Gulay (Vegetables)',
    tagalog: 'Gulay',
    scientificName: 'Various',
    icon: 'local-florist',
    conditions: {
      pH: { min: 6.0, max: 7.5, optimal: 6.8 },
      moisture: ['Medium'],
      temperature: { min: 15, max: 30, optimal: 22 },
      soilType: ['Loam', 'Sandy Loam'],
      season: ['Cool', 'Wet']
    },
    description: 'Mga gulay tulad ng talong, kamatis, at iba pa.',
    benefits: ['High value', 'Quick harvest', 'Nutritional'],
    careTips: ['Organic matter', 'Regular watering', 'Pest control']
  },
  sugarcane: {
    name: 'Tubo (Sugarcane)',
    tagalog: 'Tubo',
    scientificName: 'Saccharum officinarum',
    icon: 'eco',
    conditions: {
      pH: { min: 5.5, max: 8.0, optimal: 6.5 },
      moisture: ['High', 'Medium'],
      temperature: { min: 20, max: 38, optimal: 30 },
      soilType: ['Clay', 'Loam'],
      season: ['Wet', 'Dry']
    },
    description: 'Crop para sa sugar production. Kailangan ng mainit at humid na panahon.',
    benefits: ['High sugar content', 'Long-term crop', 'Industrial use'],
    careTips: ['Heavy irrigation', 'Fertilizer needs', 'Harvest timing']
  },
  coconut: {
    name: 'Niyog (Coconut)',
    tagalog: 'Niyog',
    scientificName: 'Cocos nucifera',
    icon: 'park',
    conditions: {
      pH: { min: 5.0, max: 8.0, optimal: 6.5 },
      moisture: ['High', 'Medium'],
      temperature: { min: 20, max: 35, optimal: 28 },
      soilType: ['Sandy', 'Loam'],
      season: ['All year']
    },
    description: 'Tree crop na pwede sa coastal areas. Versatile at sustainable.',
    benefits: ['Multiple products', 'Drought resistant', 'Long lifespan'],
    careTips: ['Well-drained soil', 'Regular pruning', 'Pest monitoring']
  },
  coffee: {
    name: 'Kape (Coffee)',
    tagalog: 'Kape',
    scientificName: 'Coffea spp.',
    icon: 'local-cafe',
    conditions: {
      pH: { min: 5.5, max: 6.5, optimal: 6.0 },
      moisture: ['Medium'],
      temperature: { min: 15, max: 25, optimal: 20 },
      soilType: ['Loam', 'Sandy Loam'],
      season: ['Cool', 'Wet']
    },
    description: 'High-value crop para sa upland areas. Kailangan ng cool na panahon.',
    benefits: ['High market value', 'Shade tolerant', 'Sustainable'],
    careTips: ['Shade management', 'Pruning', 'Quality processing']
  },
  banana: {
    name: 'Saging (Banana)',
    tagalog: 'Saging',
    scientificName: 'Musa spp.',
    icon: 'spa', // Leafy icon to represent banana leaves
    conditions: {
      pH: { min: 5.5, max: 7.0, optimal: 6.0 },
      moisture: ['High'],
      temperature: { min: 26, max: 30, optimal: 28 },
      soilType: ['Loam', 'Sandy Loam'],
      season: ['All year']
    },
    description: 'Main fruit export ng Pilipinas. Kailangan ng moist na lupa at mainit na klima.',
    benefits: ['Export quality', 'Fast growing', 'Nutritious fruit'],
    careTips: ['Wind protection', 'Fertilizer use', 'Regular harvesting']
  },
  mango: {
    name: 'Mangga (Mango)',
    tagalog: 'Mangga',
    scientificName: 'Mangifera indica',
    icon: 'emoji-nature', // Nature-themed icon
    conditions: {
      pH: { min: 5.5, max: 7.5, optimal: 6.5 },
      moisture: ['Medium', 'Low'],
      temperature: { min: 24, max: 30, optimal: 27 },
      soilType: ['Loam', 'Sandy'],
      season: ['Dry']
    },
    description: 'National fruit. Mabenta sa lokal at internasyonal na market.',
    benefits: ['Sweet flavor', 'High market demand', 'Long shelf life'],
    careTips: ['Proper pruning', 'Sunlight exposure', 'Pest and disease control']
  }
};

export default function Mapping() {
  const [farmLocation, setFarmLocation] = useState('');
  const [coordinates, setCoordinates] = useState({
    latitude: 14.2393, // Default to Silang, Cavite, Philippines
    longitude: 120.9769,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: 14.2393,
    longitude: 120.9769,
  });
  const [isMapReady, setIsMapReady] = useState(false);
  const [soilData, setSoilData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoadingSoil, setIsLoadingSoil] = useState(false);
  const [showSoilModal, setShowSoilModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [placeSuggestions, setPlaceSuggestions] = useState([]); // State for place suggestions
  const [selectedFarmAddress, setSelectedFarmAddress] = useState(''); // Store the chosen farm address for post-confirm display
  const [cropRecommendations, setCropRecommendations] = useState([]);
  const [isSaving, setIsSaving] = useState(false); // State for saving farm data

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    const checkAuth = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        router.replace('/sign-in');
      }
    };
    checkAuth();
  }, []);

  // Function to get crop recommendations based on soil conditions
  const getCropRecommendations = useCallback((soilData) => {
    if (!soilData) return [];

    const recommendations = [];
    const soilTemp = parseFloat(soilData.temperature);
    const soilPH = parseFloat(soilData.pH);
    const soilMoisture = soilData.moisture;

    // Check each crop against soil conditions
    Object.entries(CROP_RECOMMENDATIONS).forEach(([cropKey, crop]) => {
      let score = 0;
      let reasons = [];

      // Check pH compatibility
      if (soilPH >= crop.conditions.pH.min && soilPH <= crop.conditions.pH.max) {
        score += 3;
        reasons.push(`pH ${soilPH} ay suitable (${crop.conditions.pH.min}-${crop.conditions.pH.max})`);
      } else {
        reasons.push(`pH ${soilPH} ay hindi suitable (kailangan ${crop.conditions.pH.min}-${crop.conditions.pH.max})`);
      }

      // Check moisture compatibility
      if (crop.conditions.moisture.includes(soilMoisture)) {
        score += 2;
        reasons.push(`Moisture level (${soilMoisture}) ay suitable`);
      } else {
        reasons.push(`Moisture level (${soilMoisture}) ay hindi suitable`);
      }

      // Check temperature compatibility
      if (soilTemp >= crop.conditions.temperature.min && soilTemp <= crop.conditions.temperature.max) {
        score += 3;
        reasons.push(`Temperature ${soilTemp}°C ay suitable (${crop.conditions.temperature.min}-${crop.conditions.temperature.max}°C)`);
      } else {
        reasons.push(`Temperature ${soilTemp}°C ay hindi suitable (kailangan ${crop.conditions.temperature.min}-${crop.conditions.temperature.max}°C)`);
      }

      // Determine recommendation level
      let recommendationLevel = 'Poor';
      if (score >= 7) recommendationLevel = 'Excellent';
      else if (score >= 5) recommendationLevel = 'Good';
      else if (score >= 3) recommendationLevel = 'Fair';

      recommendations.push({
        ...crop,
        key: cropKey,
        score,
        recommendationLevel,
        reasons,
        soilConditions: {
          pH: soilPH,
          moisture: soilMoisture,
          temperature: soilTemp
        }
      });
    });

    // Sort by score (highest first) and filter out poor recommendations
    return recommendations
      .filter(rec => rec.recommendationLevel !== 'Poor')
      .sort((a, b) => b.score - a.score);
  }, []);

  // Function to get recommendation level color
  const getRecommendationColor = (level) => {
    switch (level) {
      case 'Excellent': return '#15803d';
      case 'Good': return '#f59e0b';
      case 'Fair': return '#dc2626';
      default: return '#6b7280';
    }
  };

  // Function to get recommendation level icon
  const getRecommendationIcon = (level) => {
    switch (level) {
      case 'Excellent': return 'star';
      case 'Good': return 'thumb-up';
      case 'Fair': return 'warning';
      default: return 'help';
    }
  };

  // Function to fetch soil conditions from OpenWeather API
  const fetchSoilConditions = useCallback(async (lat, lon, placeName = '') => {
    setIsLoadingSoil(true);
    try {
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );

      if (!weatherResponse.ok) {
        throw new Error(`Weather API Error: ${weatherResponse.status}`);
      }

      const weatherResult = await weatherResponse.json();
      console.log('Weather data received:', weatherResult);

      setWeatherData(weatherResult);

      const soilConditions = calculateSoilConditions(weatherResult);
      // Add placeName to soilData, falling back to weatherResult.name if placeName is empty
      const soilDataWithPlace = { ...soilConditions, placeName: placeName || weatherResult.name || 'Unknown Place' };
      setSoilData(soilDataWithPlace);
      
      // Generate crop recommendations
      const recommendations = getCropRecommendations(soilDataWithPlace);
      setCropRecommendations(recommendations);
      
      setShowSoilModal(true);

      try {
        const uvResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
        );

        if (uvResponse.ok) {
          const uvResult = await uvResponse.json();
          console.log('UV data received:', uvResult);

          setSoilData(prev => ({
            ...prev,
            uvIndex: uvResult.value || 0
          }));
        }
      } catch (uvError) {
        console.warn('UV Index fetch failed:', uvError);
      }

    } catch (error) {
      console.error('Error fetching soil conditions:', error);

      let errorMessage = 'Hindi ma-fetch ang soil conditions.';
      if (error.message.includes('401')) {
        errorMessage = 'Invalid API key. Please check your OpenWeather API key.';
      } else if (error.message.includes('Network')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }

      Alert.alert('Error', errorMessage + ' Subukan ulit.');
    } finally {
      setIsLoadingSoil(false);
    }
  }, [getCropRecommendations]); // Added getCropRecommendations to useCallback dependencies

  // Function to calculate soil conditions based on weather data
  const calculateSoilConditions = (weather) => {
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const pressure = weather.main.pressure;
    const windSpeed = weather.wind?.speed || 0;

    const soilTemp = temp - 3;

    let soilMoisture = 'Medium';
    if (humidity > 80) soilMoisture = 'High';
    else if (humidity < 40) soilMoisture = 'Low';

    let soilCondition = 'Good';
    if (soilTemp < 10 || soilTemp > 35) soilCondition = 'Poor';
    else if (humidity < 30 || humidity > 90) soilCondition = 'Fair';

    const estimatedPH = 6.5 + (humidity - 50) * 0.02;

    return {
      temperature: soilTemp.toFixed(1),
      moisture: soilMoisture,
      condition: soilCondition,
      pH: Math.max(4.0, Math.min(8.5, estimatedPH)).toFixed(1),
      airTemp: temp.toFixed(1),
      humidity: humidity,
      pressure: pressure,
      windSpeed: windSpeed.toFixed(1),
      description: weather.weather[0].description,
      icon: weather.weather[0].icon
    };
  };

  // Function to get soil condition color
  const getSoilConditionColor = (condition) => {
    switch (condition) {
      case 'Good': return '#15803d';
      case 'Fair': return '#f59e0b';
      case 'Poor': return '#dc2626';
      default: return '#6b7280';
    }
  };

  // Function to get temperature color and indication
  const getTemperatureIndicator = (temp) => {
    if (temp < 15) {
      return { text: 'Malamig', color: '#0ea5e9' }; // Blue for cold
    } else if (temp >= 15 && temp < 25) {
      return { text: 'Katamtaman', color: '#15803d' }; // Green for moderate/warm
    } else if (temp >= 25 && temp < 35) {
      return { text: 'Mainit', color: '#f97316' }; // Orange for hot
    } else {
      return { text: 'Masyadong Mainit', color: '#dc2626' }; // Red for very hot
    }
  };

  // Geocoding function using OpenWeather Geocoding API with suggestions
  const geocodeAddress = async (address) => {
    try {
      const geocodeResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(address)}&limit=5&appid=${OPENWEATHER_API_KEY}` // Limit to 5 suggestions
      );

      if (!geocodeResponse.ok) {
        throw new Error(`Geocoding API Error: ${geocodeResponse.status}`);
      }

      const geocodeResult = await geocodeResponse.json();
      return geocodeResult.map(location => ({
        latitude: location.lat,
        longitude: location.lon,
        name: location.name + (location.state ? `, ${location.state}` : '') + (location.country ? `, ${location.country}` : '')
      }));
    } catch (error) {
      console.error('Geocoding error:', error);
      return [];
    }
  };

  const handleSearchLocation = async () => {
    if (!farmLocation.trim()) {
      Alert.alert('Error', 'Pakiinput ang farm location.');
      return;
    }

    setIsLoadingSoil(true);
    setPlaceSuggestions([]); // Clear suggestions on search
    const results = await geocodeAddress(farmLocation);

    if (results.length > 0) {
      const firstResult = results[0];
      const newRegion = {
        ...firstResult,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setCoordinates(newRegion);
      setMarkerCoordinate(firstResult);
      // Automatically fetch soil conditions for the first result and display modal
      await fetchSoilConditions(firstResult.latitude, firstResult.longitude, firstResult.name);
    } else {
      setIsLoadingSoil(false);
      Alert.alert('Error', 'Hindi mahanap ang location. Subukan ulit.');
    }
  };

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    console.log('Map pressed at:', coordinate);
    setMarkerCoordinate(coordinate);

    // Reverse geocode to get a place name for the marker
    try {
      const reverseGeocodeResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${coordinate.latitude}&lon=${coordinate.longitude}&limit=1&appid=${OPENWEATHER_API_KEY}`
      );
      let placeName = 'Piniling Lokasyon';
      if (reverseGeocodeResponse.ok) {
        const reverseGeocodeResult = await reverseGeocodeResponse.json();
        if (reverseGeocodeResult.length > 0) {
          const place = reverseGeocodeResult[0];
          placeName = place.name + (place.state ? `, ${place.state}` : '') + (place.country ? `, ${place.country}` : '');
          setFarmLocation(placeName); // Update farmLocation input with reverse geocoded name
        }
      }
      await fetchSoilConditions(coordinate.latitude, coordinate.longitude, placeName);
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      await fetchSoilConditions(coordinate.latitude, coordinate.longitude, 'Piniling Lokasyon'); // Fallback
    }
  };

  const handleConfirmLocation = async () => {
    if (!soilData) {
      Alert.alert('Error', 'Walang napiling lokasyon o walang soil data. Paki-input ang farm location o pumili sa map.');
      return;
    }
    
    // Use the place name from soilData if available, otherwise fallback to farmLocation
    const currentSelectedAddress = soilData.placeName || farmLocation || 'Map Selected Location';
    setSelectedFarmAddress(currentSelectedAddress); // Save chosen address

    Alert.alert(
      'Kumpirmahin ang Lokasyon',
      `Tama ba ang napili mong farm location?\n\nFarm: ${currentSelectedAddress}\nKalagayan ng Lupa: ${soilData.condition}`,
      [
        {
          text: 'Hindi',
          style: 'cancel',
        },
        {
          text: 'Oo, tama',
          onPress: async () => {
            setIsSaving(true); // Show loading state
            try {
              // Check if farm already exists at this location
              const existingFarm = await checkFarmExists(markerCoordinate.latitude, markerCoordinate.longitude);
              if (existingFarm) {
                Alert.alert('Error', 'Mayroong nasaang farm na nasa ganitong lokasyon. Pumili ng ibang lokasyon.');
                setIsSaving(false); // Hide loading state
                return;
              }

              // Save farm data to backend
              const farmData = {
                address: currentSelectedAddress,
                coordinates: markerCoordinate,
                soilConditions: soilData,
                weatherData: weatherData
              };
              await saveFarmData(farmData);

              console.log('Farm location saved:', farmData);
              Alert.alert('Tagumpay!', 'Matagumpay na naitala ang iyong farm location at kalagayan ng lupa!', [
                {
                  text: 'OK',
                  onPress: () => {
                    // Navigate to a new screen or update state to show confirmed details
                    router.push({
                      pathname: '/dashboard', // Assuming you have a route for confirmed farm details
                      params: {
                        farmAddress: currentSelectedAddress,
                        soilCondition: soilData.condition,
                        soilTemperature: soilData.temperature,
                        soilMoisture: soilData.moisture,
                        soilPH: soilData.pH,
                        uvIndex: soilData.uvIndex,
                        weatherDescription: soilData.description,
                        airTemp: soilData.airTemp,
                        humidity: soilData.humidity,
                        windSpeed: soilData.windSpeed,
                        pressure: soilData.pressure,
                        latitude: markerCoordinate.latitude,
                        longitude: markerCoordinate.longitude,
                      },
                    });
                  },
                },
              ]);
            } catch (error) {
              console.error('Error saving farm data:', error);
              Alert.alert('Error', 'Error saving farm data. Please try again.');
            } finally {
              setIsSaving(false); // Hide loading state
            }
          },
        },
      ]
    );
  };

  const getCurrentLocation = async () => {
    Alert.alert(
      'Kasalukuyang Lokasyon',
      'Kinukuha ang iyong kasalukuyang lokasyon...',
      [
        {
          text: 'Kanselahin',
          style: 'cancel',
        },
        {
          text: 'Sige',
          onPress: async () => {
            // In a real app, use Expo Location or react-native-geolocation-service
            const currentCoords = {
              latitude: 14.2393 + (Math.random() - 0.01), // Silang, Cavite
              longitude: 120.9769 + (Math.random() - 0.01), // Silang, Cavite
            };
            
            console.log('Current location:', currentCoords);
            setCoordinates({
              ...currentCoords,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
            setMarkerCoordinate(currentCoords);
            
            // Reverse geocode to get a place name for the current location
            try {
              const reverseGeocodeResponse = await fetch(
                `https://api.openweathermap.org/geo/1.0/reverse?lat=${currentCoords.latitude}&lon=${currentCoords.longitude}&limit=1&appid=${OPENWEATHER_API_KEY}`
              );
              let placeName = 'Kasalukuyang Lokasyon';
              if (reverseGeocodeResponse.ok) {
                const reverseGeocodeResult = await reverseGeocodeResponse.json();
                if (reverseGeocodeResult.length > 0) {
                  const place = reverseGeocodeResult[0];
                  placeName = place.name + (place.state ? `, ${place.state}` : '') + (place.country ? `, ${place.country}` : '');
                  setFarmLocation(placeName); // Update farmLocation input
                }
              }
              await fetchSoilConditions(currentCoords.latitude, currentCoords.longitude, placeName);
            } catch (error) {
              console.error('Reverse geocoding error for current location:', error);
              await fetchSoilConditions(currentCoords.latitude, currentCoords.longitude, 'Kasalukuyang Lokasyon'); // Fallback
            }
          },
        },
      ]
    );
  };

  // Handle text input changes for address suggestions
  const handleAddressInputChange = async (text) => {
    setFarmLocation(text);
    if (text.length > 2) { // Fetch suggestions after 2 characters
      const suggestions = await geocodeAddress(text);
      setPlaceSuggestions(suggestions);
    } else {
      setPlaceSuggestions([]);
    }
  };

  // Handle selecting a suggestion
  const handleSelectSuggestion = async (suggestion) => {
    setFarmLocation(suggestion.name);
    setPlaceSuggestions([]); // Clear suggestions after selection

    const newRegion = {
      ...suggestion,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setCoordinates(newRegion);
    setMarkerCoordinate(suggestion);
    await fetchSoilConditions(suggestion.latitude, suggestion.longitude, suggestion.name);
  };

  // Function to check if farm exists at given coordinates
  const checkFarmExists = async (lat, lon) => {
    try {
      const response = await fetch(`${getApiUrl()}/api/farms/check-location`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify({ latitude: lat, longitude: lon }),
      });

      if (!response.ok) {
        throw new Error(`Error checking farm existence: ${response.status}`);
      }

      const result = await response.json();
      return result.exists;
    } catch (error) {
      console.error('Error checking farm existence:', error);
      throw error;
    }
  };

  // Function to save farm data to backend
  const saveFarmData = async (farmData) => {
    try {
      const response = await fetch(`${getApiUrl()}/api/farms`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken()}`,
        },
        body: JSON.stringify(farmData),
      });

      if (!response.ok) {
        throw new Error(`Error saving farm data: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error saving farm data:', error);
      throw error;
    }
  };

  // Function to get API URL based on environment
  const getApiUrl = () => {
    if (__DEV__) {
      return 'http://192.168.254.169:3000'; // Local development server
    } else {
      return 'https://192.168.254.169:3000'; // Production server
    }
  };

  // Function to get authentication token from AsyncStorage
  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      return token;
    } catch (error) {
      console.error('Error getting authentication token:', error);
      throw error;
    }
  };

  // Function to handle token refresh and logout
  const handleTokenRefresh = async () => {
    try {
      const token = await getAuthToken();
      // Implement token refresh logic here
      console.log('Token refreshed:', token);
    } catch (error) {
      console.error('Error refreshing token:', error);
      // Handle token refresh error, e.g., redirect to sign-in
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      // Implement logout logic here
      console.log('Logged out');
      // Redirect to sign-in screen
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Function to test API connectivity
  const testApiConnectivity = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/api/health`);
      if (!response.ok) {
        throw new Error(`API health check failed: ${response.status}`);
      }
      const result = await response.json();
      console.log('API health check result:', result);
      return result.status === 'ok';
    } catch (error) {
      console.error('Error testing API connectivity:', error);
      return false;
    }
  };

  // This component will be used if you set up an Expo Router route named `/confirmed-farm`
  // You should move this to a separate file like app/confirmed-farm.js
  const ConfirmedFarmDetails = ({ route }) => {
    // Use useLocalSearchParams to get params directly
    const params = useLocalSearchParams(); 
    const {
      farmAddress,
      soilCondition,
      soilTemperature,
      soilMoisture,
      soilPH,
      uvIndex,
      weatherDescription,
      airTemp,
      humidity,
      windSpeed,
      pressure,
      latitude,
      longitude
    } = params;

    const getConditionColor = (condition) => {
      switch (condition) {
        case 'Good': return '#15803d';
        case 'Fair': return '#f59e0b';
        case 'Poor': return '#dc2626';
        default: return '#6b7280';
      }
    };

    const airTempIndicator = getTemperatureIndicator(parseFloat(airTemp));
    const soilTempIndicator = getTemperatureIndicator(parseFloat(soilTemperature));


    return (
      <SafeAreaView style={styles.confirmedContainer}>
        <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />
        <ScrollView contentContainerStyle={styles.confirmedContent}>
          <Text style={styles.confirmedTitle}>Iyong Napiling Farm</Text>
          <View style={styles.confirmedCard}>
            <Text style={styles.confirmedLabel}>Lokasyon ng Farm:</Text>
            <Text style={styles.confirmedValue}>{farmAddress}</Text>
          </View>

          <View style={[styles.confirmedCard, { borderColor: getConditionColor(soilCondition), borderLeftWidth: 8 }]}>
            <Text style={styles.confirmedLabel}>Kalagayan ng Lupa:</Text>
            <Text style={[styles.confirmedValue, { color: getConditionColor(soilCondition), fontSize: 28 }]}>{soilCondition}</Text>
          </View>

          <View style={styles.confirmedGrid}>
            <View style={styles.confirmedGridItem}>
              <Icon name="thermostat" size={24} color={soilTempIndicator.color} />
              <Text style={styles.confirmedGridLabel}>Temperatura ng Lupa</Text>
              <Text style={[styles.confirmedGridValue, { color: soilTempIndicator.color }]}>
                {soilTemperature}°C ({soilTempIndicator.text})
              </Text>
            </View>
            <View style={styles.confirmedGridItem}>
              <Icon name="water-drop" size={24} color="#3b82f6" />
              <Text style={styles.confirmedGridLabel}>Moisture ng Lupa</Text>
              <Text style={styles.confirmedGridValue}>{soilMoisture}</Text>
            </View>
            <View style={styles.confirmedGridItem}>
              <Icon name="science" size={24} color="#8b5cf6" />
              <Text style={styles.confirmedGridLabel}>Antas ng pH</Text>
              <Text style={styles.confirmedGridValue}>{soilPH}</Text>
            </View>
            {uvIndex !== undefined && (
              <View style={styles.confirmedGridItem}>
                <Icon name="wb-sunny" size={24} color="#f59e0b" />
                <Text style={styles.confirmedGridLabel}>UV Index</Text>
                <Text style={styles.confirmedGridValue}>{uvIndex}</Text>
              </View>
            )}
          </View>

          <View style={styles.weatherSummaryCard}>
            <Text style={styles.weatherSummaryTitle}>Kasalukuyang Panahon sa Farm:</Text>
            <Text style={styles.weatherSummaryText}>
              {weatherDescription} • <Text style={{ color: airTempIndicator.color }}>{airTemp}°C ({airTempIndicator.text})</Text> • {humidity}% humidity
            </Text>
            <Text style={styles.weatherSummaryText}>
              Lakas ng Hangin: {windSpeed} m/s • Presyon: {pressure} hPa
            </Text>
          </View>

          <TouchableOpacity
            style={styles.backToMapButton}
            onPress={() => router.replace('/mapping')} // Go back to the mapping screen
          >
            <Icon name="map" size={20} color="#ffffff" style={styles.confirmIcon} />
            <Text style={styles.backToMapButtonText}>Bumalik sa Map</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  };

  // Render ConfirmedFarmDetails only if farmAddress param is present
  const params = useLocalSearchParams();
  if (params.farmAddress) {
    return <ConfirmedFarmDetails route={{ params: params }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="chevron-left" size={24} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Lokasyon ng Farm</Text>

        <TouchableOpacity
          style={styles.currentLocationButton}
          onPress={getCurrentLocation}
        >
          <Icon name="my-location" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Tukuyin ang Inyong Farm</Text>
          <Text style={styles.welcomeSubtitle}>
            Para mas mapadali ang delivery at mga serbisyo, paki-input ang eksaktong lokasyon ng inyong farm.
          </Text>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsSection}>
          <View style={styles.instructionItem}>
            <Icon name="edit-location" size={20} color="#15803d" />
            <Text style={styles.instructionText}>
              I-type ang address sa input box at pindutin ang search
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Icon name="touch-app" size={20} color="#15803d" />
            <Text style={styles.instructionText}>
              O kaya i-tap ang eksaktong lokasyon sa map
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Icon name="my-location" size={20} color="#15803d" />
            <Text style={styles.instructionText}>
              Pindutin ang location icon para sa kasalukuyang lokasyon
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Icon name="eco" size={20} color="#15803d" />
            <Text style={styles.instructionText}>
              Makikita ang soil conditions sa bawat lokasyon
            </Text>
          </View>
        </View>

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Address ng Farm</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.addressInput}
              value={farmLocation}
              onChangeText={handleAddressInputChange} // Use new handler for suggestions
              placeholder="Ilagay ang address ng farm (Brgy, Municipality, Province)"
              placeholderTextColor="#9ca3af"
              multiline={true}
              numberOfLines={2}
            />
            <TouchableOpacity
              style={styles.searchButton}
              onPress={handleSearchLocation}
              disabled={isLoadingSoil}
            >
              {isLoadingSoil ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Icon name="search" size={20} color="#ffffff" />
              )}
            </TouchableOpacity>
          </View>
          {placeSuggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={placeSuggestions}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => handleSelectSuggestion(item)}
                  >
                    <Text style={styles.suggestionText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
                keyboardShouldPersistTaps="always"
              />
            </View>
          )}
          <Text style={styles.inputHint}>
            Pwede ring i-tap sa map ang eksaktong lokasyon
          </Text>
        </View>

        {/* Map Section */}
        <View style={styles.mapSection}>
          <Text style={styles.mapLabel}>Tukuyin sa Map</Text>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              region={coordinates}
              onPress={handleMapPress}
              onMapReady={() => setIsMapReady(true)}
              showsUserLocation={true}
              showsMyLocationButton={false}
              toolbarEnabled={false}
            >
              <Marker
                coordinate={markerCoordinate}
                title="Iyong Farm"
                description={farmLocation || "Lokasyon ng Farm"}
                pinColor="#15803d"
              />
            </MapView>

            {!isMapReady && (
              <View style={styles.mapLoadingOverlay}>
                <ActivityIndicator size="large" color="#87BE42" />
                <Text style={styles.mapLoadingText}>Nila-load ang mapa...</Text>
              </View>
            )}
          </View>

          <View style={styles.coordinatesContainer}>
            <Text style={styles.coordinatesLabel}>Coordinates:</Text>
            <Text style={styles.coordinatesText}>
              {markerCoordinate.latitude.toFixed(6)}, {markerCoordinate.longitude.toFixed(6)}
            </Text>
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[styles.confirmButton, isLoadingSoil && styles.confirmButtonDisabled]}
          onPress={handleConfirmLocation}
          disabled={isLoadingSoil || isSaving}
        >
          <Icon name="check-circle" size={20} color="#ffffff" style={styles.confirmIcon} />
          <Text style={styles.confirmButtonText}>
            {isLoadingSoil || isSaving ? 'Nila-load...' : 'Kumpirmahin ang Lokasyon ng Farm'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Soil Condition Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showSoilModal}
        onRequestClose={() => setShowSoilModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowSoilModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowSoilModal(false)}>
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>

              <View style={styles.soilHeader}>
                <Icon name="eco" size={28} color="#15803d" />
                <Text style={styles.modalTitle}>Mga Kondisyon ng Lupa</Text>
              </View>

              {/* Display Place Name in Modal */}
              {soilData?.placeName && (
                <Text style={styles.modalPlaceName}>{soilData.placeName}</Text>
              )}

              {soilData ? (
                <>
                  <View style={styles.soilGridModal}>
                    <View style={styles.soilCardModal}>
                      <Icon name="thermostat" size={24} color={getTemperatureIndicator(parseFloat(soilData.temperature)).color} />
                      <Text style={styles.soilLabelModal}>Temperatura ng Lupa</Text>
                      <Text style={[styles.soilValueModal, { color: getTemperatureIndicator(parseFloat(soilData.temperature)).color }]}>
                        {soilData.temperature}°C ({getTemperatureIndicator(parseFloat(soilData.temperature)).text})
                      </Text>
                    </View>

                    <View style={styles.soilCardModal}>
                      <Icon name="water-drop" size={24} color="#3b82f6" />
                      <Text style={styles.soilLabelModal}>Moisture</Text>
                      <Text style={styles.soilValueModal}>{soilData.moisture}</Text>
                    </View>

                    <View style={[styles.soilCardModal, { borderLeftColor: getSoilConditionColor(soilData.condition) }]}>
                      <Icon name="check-circle" size={24} color={getSoilConditionColor(soilData.condition)} />
                      <Text style={styles.soilLabelModal}>Kondisyon</Text>
                      <Text style={[styles.soilValueModal, { color: getSoilConditionColor(soilData.condition) }]}>
                        {soilData.condition}
                      </Text>
                    </View>

                    {/* <View style={styles.soilCardModal}>
                      <Icon name="science" size={24} color="#8b5cf6" />
                      <Text style={styles.soilLabelModal}>Antas ng pH</Text>
                      <Text style={styles.soilValueModal}>{soilData.pH}</Text>
                    </View> */}

                    {soilData.uvIndex !== undefined && ( // Check if uvIndex exists
                      <View style={styles.soilCardModal}>
                        <Icon name="wb-sunny" size={24} color="#f59e0b" />
                        <Text style={styles.soilLabelModal}>UV Index</Text>
                        <Text style={styles.soilValueModal}>{soilData.uvIndex}</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.weatherInfoModal}>
                    <Text style={styles.weatherDescriptionModal}>
                      Kasalukuyang Panahon: {soilData.description} • <Text style={{ color: getTemperatureIndicator(parseFloat(soilData.airTemp)).color }}>{soilData.airTemp}°C ({getTemperatureIndicator(parseFloat(soilData.airTemp)).text})</Text> • {soilData.humidity}% humidity
                    </Text>
                    <Text style={styles.weatherDescriptionModal}>
                      Lakas ng Hangin: {soilData.windSpeed} m/s • Presyon: {soilData.pressure} hPa
                    </Text>
                  </View>

                  {/* "Choose this Farm" Button */}
                  <TouchableOpacity
                    style={styles.chooseFarmButton}
                    onPress={() => {
                      setFarmLocation(soilData.placeName || farmLocation); // Set the input to the chosen name
                      setSelectedFarmAddress(soilData.placeName || farmLocation); // Store for confirmation
                      setMarkerCoordinate({ latitude: coordinates.latitude, longitude: coordinates.longitude }); // Ensure marker is set
                      setShowSoilModal(false); // Close the modal
                      // The confirm button will now use this pre-selected farm location
                    }}
                  >
                    <Text style={styles.chooseFarmButtonText}>Piliin itong Farm</Text>
                  </TouchableOpacity>

                  {/* Crop Recommendations Button */}
                  <TouchableOpacity
                    style={styles.cropRecommendationsButton}
                    onPress={() => {
                      setShowSoilModal(false);
                      setShowCropModal(true);
                    }}
                  >
                    <Text style={styles.cropRecommendationsButtonText}>Mga Rekomendasyon</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <Text style={styles.noDataText}>Walang available na soil data.</Text>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Crop Recommendations Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCropModal}
        onRequestClose={() => setShowCropModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowCropModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.cropModalContent}>
              <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowCropModal(false)}>
                <Icon name="close" size={24} color="#6b7280" />
              </TouchableOpacity>

              <View style={styles.cropHeader}>
                <Icon name="agriculture" size={28} color="#15803d" />
                <Text style={styles.cropModalTitle}>Crop Recommendations</Text>
              </View>

              {soilData?.placeName && (
                <Text style={styles.cropModalPlaceName}>{soilData.placeName}</Text>
              )}

              {cropRecommendations.length > 0 ? (
                <ScrollView style={styles.cropRecommendationsList} showsVerticalScrollIndicator={false}>
                  {cropRecommendations.map((crop, index) => (
                    <TouchableOpacity key={crop.key} style={styles.cropListItem}>
                      <View style={styles.cropListHeader}>
                        <View style={styles.cropListIconContainer}>
                          <Icon name={crop.icon} size={28} color="#15803d" />
                        </View>
                        <View style={styles.cropListInfo}>
                          <Text style={styles.cropListName}>{crop.name}</Text>
                          <Text style={styles.cropListTagalog}>{crop.tagalog}</Text>
                          <Text style={styles.cropListScientific}>{crop.scientificName}</Text>
                        </View>
                        <View style={[styles.recommendationBadge, { backgroundColor: getRecommendationColor(crop.recommendationLevel) + '20' }]}>
                          <Icon 
                            name={getRecommendationIcon(crop.recommendationLevel)} 
                            size={16} 
                            color={getRecommendationColor(crop.recommendationLevel)} 
                          />
                          <Text style={[styles.recommendationText, { color: getRecommendationColor(crop.recommendationLevel) }]}>
                            {crop.recommendationLevel}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.cropListDescription}>{crop.description}</Text>

                      <View style={styles.cropListDetails}>
                        <View style={styles.cropListDetailRow}>
                          <View style={styles.cropListDetailItem}>
                            <Icon name="star" size={14} color="#f59e0b" />
                            <Text style={styles.cropListDetailLabel}>Score:</Text>
                            <Text style={styles.cropListDetailValue}>{crop.score}/8</Text>
                          </View>
                          <View style={styles.cropListDetailItem}>
                            <Icon name="science" size={14} color="#8b5cf6" />
                            <Text style={styles.cropListDetailLabel}>pH:</Text>
                            <Text style={styles.cropListDetailValue}>{crop.conditions.pH.min}-{crop.conditions.pH.max}</Text>
                          </View>
                          <View style={styles.cropListDetailItem}>
                            <Icon name="thermostat" size={14} color="#dc2626" />
                            <Text style={styles.cropListDetailLabel}>Temp:</Text>
                            <Text style={styles.cropListDetailValue}>{crop.conditions.temperature.min}-{crop.conditions.temperature.max}°C</Text>
                          </View>
                        </View>
                      </View>

                      <View style={styles.cropListBenefits}>
                        <Text style={styles.cropListBenefitsTitle}>Mga Benepisyo:</Text>
                        <View style={styles.cropListBenefitsGrid}>
                          {crop.benefits.slice(0, 3).map((benefit, idx) => (
                            <View key={idx} style={styles.cropListBenefitItem}>
                              <Icon name="check-circle" size={12} color="#15803d" />
                              <Text style={styles.cropListBenefitText}>{benefit}</Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      <View style={styles.cropListCareTips}>
                        <Text style={styles.cropListCareTipsTitle}>Mga Tips:</Text>
                        <View style={styles.cropListCareTipsGrid}>
                          {crop.careTips.slice(0, 2).map((tip, idx) => (
                            <View key={idx} style={styles.cropListCareTipItem}>
                              <Icon name="lightbulb" size={12} color="#f59e0b" />
                              <Text style={styles.cropListCareTipText}>{tip}</Text>
                            </View>
                          ))}
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.noRecommendationsContainer}>
                  <Icon name="agriculture" size={48} color="#9ca3af" />
                  <Text style={styles.noRecommendationsText}>
                    Walang suitable na crops sa kasalukuyang soil conditions.
                  </Text>
                  <Text style={styles.noRecommendationsSubtext}>
                    Subukan ang ibang lokasyon o i-improve ang soil conditions.
                  </Text>
                </View>
              )}

              <TouchableOpacity
                style={styles.backToSoilButton}
                onPress={() => {
                  setShowCropModal(false);
                  setShowSoilModal(true);
                }}
              >
                <Icon name="arrow-back" size={20} color="#ffffff" style={styles.confirmIcon} />
                <Text style={styles.backToSoilButtonText}>Bumalik sa Soil Data</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: '#87BE42', // Green header for better visibility
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff', // White text for header title
  },
  currentLocationButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginVertical: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803d',
    textAlign: 'center',
    marginBottom: 12,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    zIndex: 10, // Ensure input and suggestions are above map
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#87BE42',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  addressInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#374151',
    textAlignVertical: 'top',
    minHeight: 56,
  },
  searchButton: {
    backgroundColor: '#87BE42',
    borderRadius: 12,
    padding: 12,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputHint: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  suggestionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginTop: 4,
    maxHeight: 200, // Limit height of suggestions list
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  suggestionText: {
    fontSize: 15,
    color: '#374151',
  },
  mapSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  mapLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    height: 300, // Fixed height for map
    width: '100%',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  mapLoadingText: {
    marginTop: 10,
    color: '#374151',
    fontSize: 16,
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  coordinatesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4b5563',
    marginRight: 6,
  },
  coordinatesText: {
    fontSize: 14,
    color: '#4b5563',
  },
  instructionsSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    paddingVertical: 24,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 10,
  },
  instructionText: {
    marginLeft: 10,
    fontSize: 14,
    color: '#374151',
    flexShrink: 1,
  },
  bottomSpacer: {
    height: 100, // Space for the fixed bottom button
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  confirmButton: {
    backgroundColor: '#15803d',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#15803d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  confirmButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowColor: 'transparent',
    elevation: 0,
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  confirmIcon: {
    marginRight: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20, // Reduced padding
    width: '90%', // Adjusted width
    maxHeight: '80%', // Adjusted maxHeight to fit more content
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 15,
  },
  closeModalButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    zIndex: 1,
    padding: 5,
  },
  soilHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  modalTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#15803d',
    marginLeft: 10,
  },
  modalPlaceName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  soilGridModal: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15, // Reduced margin
  },
  soilCardModal: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12, // Reduced padding
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%', // Adjusted width for two columns
    marginVertical: 6, // Reduced vertical margin
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  soilLabelModal: {
    fontSize: 12, // Smaller font size
    color: '#6b7280',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: '500',
  },
  soilValueModal: {
    fontSize: 16, // Smaller font size
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },
  weatherInfoModal: {
    backgroundColor: '#e0f2f7', // Light blue background
    borderRadius: 12,
    padding: 12, // Reduced padding
    width: '100%',
    marginBottom: 12, // Reduced margin
    borderWidth: 1,
    borderColor: '#bae6fd',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  weatherDescriptionModal: {
    fontSize: 14, // Smaller font size
    color: '#075985', // Darker blue for text
    textAlign: 'center',
    lineHeight: 20, // Reduced line height
  },
  chooseFarmButton: {
    backgroundColor: '#87BE42',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#6b7280',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  chooseFarmButtonText: {
    color: '#ffffff',
    fontSize: 15, // Slightly smaller font size
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cropRecommendationsButton: {
    backgroundColor: '#87BE42',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginTop: 8,
    shadowColor: '#6b7280',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  cropRecommendationsButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  cropModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 15,
  },
  cropHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  cropModalTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#15803d',
    marginLeft: 10,
  },
  cropModalPlaceName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 20,
    textAlign: 'center',
  },
  cropRecommendationsList: {
    width: '100%',
    maxHeight: 400,
    marginBottom: 15,
  },
  cropListItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  cropListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cropListIconContainer: {
    backgroundColor: '#e0f2f7',
    borderRadius: 8,
    padding: 8,
    marginRight: 12,
  },
  cropListInfo: {
    flex: 1,
  },
  cropListName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 2,
  },
  cropListTagalog: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  cropListScientific: {
    fontSize: 10,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
  cropListDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 10,
    lineHeight: 18,
  },
  cropListDetails: {
    marginBottom: 10,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
  },
  cropListDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cropListDetailItem: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  cropListDetailLabel: {
    fontSize: 10,
    color: '#6b7280',
    marginLeft: 4,
    marginRight: 2,
  },
  cropListDetailValue: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#374151',
  },
  cropListBenefits: {
    marginBottom: 10,
  },
  cropListBenefitsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  cropListBenefitsGrid: {
    flexDirection: 'column',
  },
  cropListBenefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cropListBenefitText: {
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 4,
    flex: 1,
  },
  cropListCareTips: {
    marginBottom: 8,
  },
  cropListCareTipsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
  },
  cropListCareTipsGrid: {
    flexDirection: 'column',
  },
  cropListCareTipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  cropListCareTipText: {
    fontSize: 11,
    color: '#6b7280',
    marginLeft: 4,
    flex: 1,
  },
  recommendationBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recommendationText: {
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  noRecommendationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRecommendationsText: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 10,
  },
  noRecommendationsSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  backToSoilButton: {
    backgroundColor: '#87BE42',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#87BE42',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  backToSoilButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  noDataText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 20,
  },

  // Confirmed Farm Details Styles
  confirmedContainer: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  confirmedContent: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  confirmedTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 30,
    textAlign: 'center',
  },
  confirmedCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    alignItems: 'center',
  },
  confirmedLabel: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 8,
    fontWeight: '500',
  },
  confirmedValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
  },
  confirmedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  confirmedGridItem: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    width: '48%', // Adjusted for two columns
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmedGridLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  confirmedGridValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    textAlign: 'center',
    marginTop: 4,
  },
  weatherSummaryCard: {
    backgroundColor: '#e0f2f7',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#bae6fd',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  weatherSummaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#075985',
    marginBottom: 10,
    textAlign: 'center',
  },
  weatherSummaryText: {
    fontSize: 16,
    color: '#075985',
    textAlign: 'center',
    lineHeight: 24,
  },
  backToMapButton: {
    backgroundColor: '#6b7280',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    shadowColor: '#6b7280',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  backToMapButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});