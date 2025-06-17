import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'; // Using MaterialCommunityIcons for weather icons
import { router } from 'expo-router';

const WEATHER_API_KEY = 'YOUR_OPENWEATHER_API_KEY'; // Replace with your actual API key
const CITY_NAME = 'Silang'; // Specify the city
const LATITUDE = 14.2384; // Latitude for Silang, Calabarzon, Philippines
const LONGITUDE = 120.9757; // Longitude for Silang, Calabarzon, Philippines

const WeatherPage = () => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeatherData();
  }, []);

  const fetchWeatherData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch current weather
      const currentWeatherResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${WEATHER_API_KEY}`
      );
      const currentWeatherData = await currentWeatherResponse.json();

      if (currentWeatherResponse.ok) {
        setCurrentWeather(currentWeatherData);
      } else {
        throw new Error(currentWeatherData.message || 'Failed to fetch current weather.');
      }

      // Fetch 7-day forecast (using One Call API for daily forecast)
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall?lat=${LATITUDE}&lon=${LONGITUDE}&exclude=current,minutely,hourly,alerts&units=metric&appid=${WEATHER_API_KEY}`
      );
      const forecastData = await forecastResponse.json();

      if (forecastResponse.ok) {
        // Take the next 7 days, excluding the current day if it's included in 'daily'
        setForecast(forecastData.daily.slice(1, 8)); 
      } else {
        throw new Error(forecastData.message || 'Failed to fetch forecast.');
      }

    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err.message || 'Could not load weather data. Please try again.');
      Alert.alert('Weather Error', err.message || 'Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    // Map OpenWeatherMap icon codes to MaterialCommunityIcons names
    // This is a simplified mapping; you might need a more comprehensive one.
    switch (iconCode) {
      case '01d': return 'weather-sunny';
      case '01n': return 'weather-night';
      case '02d': return 'weather-partly-cloudy';
      case '02n': return 'weather-night-partly-cloudy';
      case '03d':
      case '03n': return 'weather-cloudy';
      case '04d':
      case '04n': return 'weather-cloudy-alert';
      case '09d':
      case '09n': return 'weather-rainy';
      case '10d':
      case '10n': return 'weather-pouring';
      case '11d':
      case '11n': return 'weather-lightning-rainy';
      case '13d':
      case '13n': return 'weather-snowy';
      case '50d':
      case '50n': return 'weather-fog';
      default: return 'weather-cloudy';
    }
  };

  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getFullDate = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Fetching weather data...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={50} color="#ef4444" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={fetchWeatherData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Tap to Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#14532d" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with City Name */}
        <LinearGradient
          colors={['#14532d', '#166534', '#15803d']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Icon name="arrow-left" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{CITY_NAME} Weather</Text>
            <View style={{ width: 24 }} /> {/* Spacer for symmetry */}
          </View>
        </LinearGradient>

        {/* Current Weather Card */}
        {currentWeather && (
          <View style={styles.currentWeatherCard}>
            <Text style={styles.currentWeatherDate}>{getFullDate(currentWeather.dt)}</Text>
            <View style={styles.currentWeatherMain}>
              <Icon name={getWeatherIcon(currentWeather.weather[0].icon)} size={80} color="#10b981" />
              <View style={styles.currentWeatherTempContainer}>
                <Text style={styles.currentTemperature}>{Math.round(currentWeather.main.temp)}°C</Text>
                <Text style={styles.weatherDescription}>{currentWeather.weather[0].description}</Text>
              </View>
            </View>
            <View style={styles.currentWeatherDetails}>
              <View style={styles.detailItem}>
                <Icon name="water-percent" size={20} color="#64748b" />
                <Text style={styles.detailText}>Humidity: {currentWeather.main.humidity}%</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="weather-windy" size={20} color="#64748b" />
                <Text style={styles.detailText}>Wind: {currentWeather.wind.speed} m/s</Text>
              </View>
              <View style={styles.detailItem}>
                <Icon name="thermometer-lines" size={20} color="#64748b" />
                <Text style={styles.detailText}>Feels like: {Math.round(currentWeather.main.feels_like)}°C</Text>
              </View>
            </View>
          </View>
        )}

        {/* 7-Day Forecast */}
        <Text style={styles.forecastTitle}>7-Day Forecast</Text>
        <View style={styles.forecastContainer}>
          {forecast.map((day, index) => (
            <LinearGradient
              key={index}
              colors={['#ffffff', '#f8fafc']}
              style={styles.forecastCard}
            >
              <Text style={styles.forecastDay}>{getDayName(day.dt)}</Text>
              <Icon name={getWeatherIcon(day.weather[0].icon)} size={40} color="#10b981" />
              <Text style={styles.forecastTemp}>{Math.round(day.temp.day)}°C</Text>
              <Text style={styles.forecastDescription}>{day.weather[0].main}</Text>
            </LinearGradient>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Navigation - Re-used from Dashboard */}
      <View style={styles.bottomNavContainer}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.bottomNav}
        >
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/weather')}>
            <Icon name="cloud" size={24} color="#10b981" />
            <Text style={[styles.navLabel, { color: '#10b981', fontWeight: '600' }]}>Weather</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/calendar')}>
            <Icon name="calendar-today" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/dashboard')}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.homeButtonGradient}
            >
              <Icon name="home" size={28} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/catalog')}>
            <Icon name="shopping-cart" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/journal')}>
            <Icon name="bell" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Journal</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748b',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Current Weather Card
  currentWeatherCard: {
    margin: 20,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'center',
  },
  currentWeatherDate: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 16,
  },
  currentWeatherMain: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  currentWeatherTempContainer: {
    marginLeft: 20,
    alignItems: 'flex-start',
  },
  currentTemperature: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#0f172a',
    lineHeight: 64, // Adjust line height to prevent clipping
  },
  weatherDescription: {
    fontSize: 18,
    color: '#64748b',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  currentWeatherDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 6,
  },
  // Forecast Styles
  forecastTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  forecastContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center', // Center items horizontally
    gap: 12, // Gap between forecast cards
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  forecastCard: {
    width: '30%', // Approximately 3 cards per row
    aspectRatio: 0.8, // Maintain aspect ratio for height
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  forecastDay: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 4,
  },
  forecastTemp: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
  },
  forecastDescription: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
    textTransform: 'capitalize',
    marginTop: 4,
  },
  // Re-used from Dashboard for consistency
  bottomSpacer: {
    height: 100,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  homeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default WeatherPage;