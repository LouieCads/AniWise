import React, { memo, useState, useEffect } from 'react';
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
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

// Replace with your OpenWeather API key
const OPENWEATHER_API_KEY = '98bb67c7b4f0e326ccdfebd2e15577f3';

function Mapping() {
  const [farmLocation, setFarmLocation] = useState('');
  const [coordinates, setCoordinates] = useState({
    latitude: 14.5176, // Default to Manila, Philippines
    longitude: 121.0509,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: 14.5176,
    longitude: 121.0509,
  });
  const [isMapReady, setIsMapReady] = useState(false);
  const [soilData, setSoilData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoadingSoil, setIsLoadingSoil] = useState(false);

  // Fetch soil conditions from OpenWeather API
  const fetchSoilConditions = async (lat, lon) => {
    setIsLoadingSoil(true);
    try {
      // Fetch current weather data for soil temperature estimation
      const weatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      const weatherResult = await weatherResponse.json();

      if (weatherResponse.ok) {
        setWeatherData(weatherResult);
        
        // Calculate estimated soil conditions based on weather data
        const soilConditions = calculateSoilConditions(weatherResult);
        setSoilData(soilConditions);
      } else {
        throw new Error(weatherResult.message || 'Failed to fetch weather data');
      }

      // Optional: Fetch UV Index for additional soil analysis
      const uvResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`
      );
      const uvResult = await uvResponse.json();

      if (uvResponse.ok && soilData) {
        setSoilData(prev => ({
          ...prev,
          uvIndex: uvResult.value
        }));
      }

    } catch (error) {
      console.error('Error fetching soil conditions:', error);
      Alert.alert('Error', 'Hindi ma-fetch ang soil conditions. Subukan ulit.');
    } finally {
      setIsLoadingSoil(false);
    }
  };

  // Calculate soil conditions based on weather data
  const calculateSoilConditions = (weather) => {
    const temp = weather.main.temp;
    const humidity = weather.main.humidity;
    const pressure = weather.main.pressure;
    const windSpeed = weather.wind?.speed || 0;
    
    // Estimate soil temperature (usually 2-5°C lower than air temperature)
    const soilTemp = temp - 3;
    
    // Estimate soil moisture based on humidity and recent precipitation
    let soilMoisture = 'Medium';
    if (humidity > 80) soilMoisture = 'High';
    else if (humidity < 40) soilMoisture = 'Low';
    
    // Determine soil condition based on various factors
    let soilCondition = 'Good';
    if (soilTemp < 10 || soilTemp > 35) soilCondition = 'Poor';
    else if (humidity < 30 || humidity > 90) soilCondition = 'Fair';
    
    // pH estimation (simplified - would need actual soil data for accuracy)
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

  // Get soil condition color
  const getSoilConditionColor = (condition) => {
    switch (condition) {
      case 'Good': return '#15803d';
      case 'Fair': return '#f59e0b';
      case 'Poor': return '#dc2626';
      default: return '#6b7280';
    }
  };

  // Simulate geocoding function (in real app, use actual geocoding service)
  const geocodeAddress = async (address) => {
    try {
      // This is a placeholder - replace with actual geocoding service
      // For demo purposes, we'll just move the marker to a sample location
      if (address.toLowerCase().includes('manila')) {
        return {
          latitude: 14.5995,
          longitude: 120.9842,
        };
      } else if (address.toLowerCase().includes('cebu')) {
        return {
          latitude: 10.3157,
          longitude: 123.8854,
        };
      } else if (address.toLowerCase().includes('davao')) {
        return {
          latitude: 7.1907,
          longitude: 125.4553,
        };
      } else {
        // Random location in Philippines for demo
        return {
          latitude: 14.5176 + (Math.random() - 0.5) * 0.1,
          longitude: 121.0509 + (Math.random() - 0.5) * 0.1,
        };
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  };

  const handleSearchLocation = async () => {
    if (!farmLocation.trim()) {
      Alert.alert('Error', 'Pakiinput ang farm location.');
      return;
    }

    const coords = await geocodeAddress(farmLocation);
    if (coords) {
      const newRegion = {
        ...coords,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setCoordinates(newRegion);
      setMarkerCoordinate(coords);
      
      // Fetch soil conditions for the new location
      await fetchSoilConditions(coords.latitude, coords.longitude);
    } else {
      Alert.alert('Error', 'Hindi mahanap ang location. Subukan ulit.');
    }
  };

  const handleMapPress = async (event) => {
    const { coordinate } = event.nativeEvent;
    setMarkerCoordinate(coordinate);
    
    // Fetch soil conditions for the selected coordinate
    await fetchSoilConditions(coordinate.latitude, coordinate.longitude);
  };

  const handleConfirmLocation = () => {
    if (!farmLocation.trim()) {
      Alert.alert('Error', 'Paki-input ang farm location.');
      return;
    }

    const locationData = {
      address: farmLocation,
      coordinates: markerCoordinate,
      soilConditions: soilData,
      weatherData: weatherData
    };

    Alert.alert(
      'Confirm Location',
      `Tama ba ang inyong farm location?\n\nAddress: ${farmLocation}\nCoordinates: ${markerCoordinate.latitude.toFixed(6)}, ${markerCoordinate.longitude.toFixed(6)}${soilData ? `\nSoil Condition: ${soilData.condition}` : ''}`,
      [
        {
          text: 'Hindi',
          style: 'cancel',
        },
        {
          text: 'Oo, tama',
          onPress: () => {
            console.log('Farm location saved:', locationData);
            Alert.alert('Success', 'Farm location at soil conditions successfully saved!', [
              {
                text: 'OK',
                onPress: () => {
                  router.push('/dashboard');
                },
              },
            ]);
          },
        },
      ]
    );
  };

  const getCurrentLocation = async () => {
    Alert.alert(
      'Current Location',
      'Getting your current location...',
      [
        {
          text: 'OK',
          onPress: async () => {
            // Simulate current location
            const currentCoords = {
              latitude: 14.5176 + (Math.random() - 0.5) * 0.05,
              longitude: 121.0509 + (Math.random() - 0.5) * 0.05,
            };
            setCoordinates({
              ...currentCoords,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            });
            setMarkerCoordinate(currentCoords);
            
            // Fetch soil conditions for current location
            await fetchSoilConditions(currentCoords.latitude, currentCoords.longitude);
          },
        },
      ]
    );
  };

  // Fetch initial soil conditions
  useEffect(() => {
    fetchSoilConditions(markerCoordinate.latitude, markerCoordinate.longitude);
  }, []);

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
        
        <Text style={styles.headerTitle}>Farm Location</Text>
        
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
            Para mas mapadali ang delivery at mga serbisyo, pakiinput ang eksaktong location ng inyong farm.
          </Text>
        </View>

        {/* Soil Conditions Section */}
        {soilData && (
          <View style={styles.soilSection}>
            <View style={styles.soilHeader}>
              <Icon name="eco" size={24} color="#15803d" />
              <Text style={styles.soilTitle}>Soil Conditions</Text>
              {isLoadingSoil && <ActivityIndicator size="small" color="#87BE42" />}
            </View>
            
            <View style={styles.soilGrid}>
              <View style={styles.soilCard}>
                <Icon name="thermostat" size={20} color="#87BE42" />
                <Text style={styles.soilLabel}>Soil Temp</Text>
                <Text style={styles.soilValue}>{soilData.temperature}°C</Text>
              </View>
              
              <View style={styles.soilCard}>
                <Icon name="water-drop" size={20} color="#3b82f6" />
                <Text style={styles.soilLabel}>Moisture</Text>
                <Text style={styles.soilValue}>{soilData.moisture}</Text>
              </View>
              
              <View style={[styles.soilCard, { borderLeftColor: getSoilConditionColor(soilData.condition) }]}>
                <Icon name="check-circle" size={20} color={getSoilConditionColor(soilData.condition)} />
                <Text style={styles.soilLabel}>Condition</Text>
                <Text style={[styles.soilValue, { color: getSoilConditionColor(soilData.condition) }]}>
                  {soilData.condition}
                </Text>
              </View>
              
              <View style={styles.soilCard}>
                <Icon name="science" size={20} color="#8b5cf6" />
                <Text style={styles.soilLabel}>pH Level</Text>
                <Text style={styles.soilValue}>{soilData.pH}</Text>
              </View>
            </View>
            
            <View style={styles.weatherInfo}>
              <Text style={styles.weatherDescription}>
                Current: {soilData.description} • {soilData.airTemp}°C • {soilData.humidity}% humidity
              </Text>
            </View>
          </View>
        )}

        {/* Input Section */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Farm Address</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.addressInput}
              value={farmLocation}
              onChangeText={setFarmLocation}
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
          <Text style={styles.inputHint}>
            Pwede ring i-tap sa map ang eksaktong location
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
                title="Inyong Farm"
                description={farmLocation || "Farm Location"}
                pinColor="#15803d"
              />
            </MapView>
            
            {!isMapReady && (
              <View style={styles.mapLoadingOverlay}>
                <Text style={styles.mapLoadingText}>Loading map...</Text>
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
              O kaya i-tap ang eksaktong location sa map
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Icon name="my-location" size={20} color="#15803d" />
            <Text style={styles.instructionText}>
              Pindutin ang location icon para sa current location
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <Icon name="eco" size={20} color="#15803d" />
            <Text style={styles.instructionText}>
              Makikita ang soil conditions sa bawat location
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
          disabled={isLoadingSoil}
        >
          <Icon name="check-circle" size={20} color="#ffffff" style={styles.confirmIcon} />
          <Text style={styles.confirmButtonText}>Confirm Farm Location</Text>
        </TouchableOpacity>
      </View>
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
  },
  backButton: {
    width: 48,
    height: 48,
    backgroundColor: '#87BE42',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  currentLocationButton: {
    width: 48,
    height: 48,
    backgroundColor: '#87BE42',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  soilSection: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  soilHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  soilTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15803d',
    marginLeft: 8,
    flex: 1,
  },
  soilGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  soilCard: {
    width: '48%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#87BE42',
    alignItems: 'center',
  },
  soilLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  soilValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 2,
    textAlign: 'center',
  },
  weatherInfo: {
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#3b82f6',
  },
  weatherDescription: {
    fontSize: 14,
    color: '#1e40af',
    textAlign: 'center',
  },
  inputSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  map: {
    width: '100%',
    height: 300,
  },
  mapLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapLoadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  coordinatesContainer: {
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  coordinatesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  coordinatesText: {
    fontSize: 14,
    color: '#15803d',
    fontFamily: 'monospace',
  },
  instructionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 100,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    backgroundColor: '#f1f5f9',
  },
  confirmButton: {
    backgroundColor: '#87BE42',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  confirmButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  confirmIcon: {
    marginRight: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});