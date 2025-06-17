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
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

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
    } else {
      Alert.alert('Error', 'Hindi mahanap ang location. Subukan ulit.');
    }
  };

  const handleMapPress = (event) => {
    const { coordinate } = event.nativeEvent;
    setMarkerCoordinate(coordinate);
  };

  const handleConfirmLocation = () => {
    if (!farmLocation.trim()) {
      Alert.alert('Error', 'Pakiinput ang farm location.');
      return;
    }

    Alert.alert(
      'Confirm Location',
      `Tama ba ang inyong farm location?\n\nAddress: ${farmLocation}\nCoordinates: ${markerCoordinate.latitude.toFixed(6)}, ${markerCoordinate.longitude.toFixed(6)}`,
      [
        {
          text: 'Hindi',
          style: 'cancel',
        },
        {
          text: 'Oo, tama',
          onPress: () => {
            // Save location data and navigate to next screen
            console.log('Farm location saved:', {
              address: farmLocation,
              coordinates: markerCoordinate,
            });
            Alert.alert('Success', 'Farm location successfully saved!', [
              {
                text: 'OK',
                onPress: () => {
                  // Navigate to next screen or dashboard
                  // router.push('/dashboard');
                },
              },
            ]);
          },
        },
      ]
    );
  };

  const getCurrentLocation = () => {
    // In a real app, you would use Geolocation API
    Alert.alert(
      'Current Location',
      'Getting your current location...',
      [
        {
          text: 'OK',
          onPress: () => {
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
          },
        },
      ]
    );
  };

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
            >
              <Icon name="search" size={20} color="#ffffff" />
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
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirmLocation}
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
  confirmIcon: {
    marginRight: 8,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default Mapping;