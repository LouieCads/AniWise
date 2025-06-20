import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';

const ProductPickup = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleMapPress = (e) => {
    setSelectedLocation(e.nativeEvent.coordinate);
  };

  const handlePickupConfirmed = () => {
    if (selectedLocation) {
      Alert.alert(
        'Pickup Confirmed',
        'Salamat! Ipinasa na ang iyong lokasyon bilang lugar ng pickup.',
        [
          { text: 'OK', onPress: () => router.back() }
        ]
      );
    } else {
      Alert.alert('Paalala', 'Pumili muna ng lokasyon sa mapa bago kumpirmahin.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />

      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="chevron-left" size={24} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Piliin ang Lugar ng Pickup</Text>
        <View style={{ width: 48 }} />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 14.5995,
            longitude: 120.9842,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          onPress={handleMapPress}
        >
          {selectedLocation && (
            <Marker coordinate={selectedLocation} />
          )}
        </MapView>
      </View>

      <View style={styles.detailsContainer}>
        {selectedLocation ? (
          <Text style={styles.selectedText}>
            Napiling Lugar: Lat {selectedLocation.latitude.toFixed(5)}, Lng {selectedLocation.longitude.toFixed(5)}
          </Text>
        ) : (
          <Text style={styles.selectPrompt}>Pindutin ang mapa upang pumili ng lugar. Siguraduhing ito ay malapit sa inyo at madaling puntahan.</Text>
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={handlePickupConfirmed}>
          <Icon name="check" size={20} color="#ffffff" />
          <Text style={styles.primaryButtonText}>Kumpirmahin ang Pickup</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

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
  mapContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  selectedText: {
    fontSize: 16,
    color: '#15803d',
    marginBottom: 16,
    fontWeight: '500',
  },
  selectPrompt: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: '#87BE42',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
});

export default ProductPickup;