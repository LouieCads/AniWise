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
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const getApiUrl = () => process.env.EXPO_PUBLIC_API_URL || 'http://192.168.254.169:3000';

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
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        router.replace('/sign-in');
        return;
      }
      // Fetch user's farms
      const farmRes = await fetch(`${getApiUrl()}/api/farms/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const farmData = await farmRes.json();
      if (farmData.success && farmData.farms.length > 0) {
        const farm = farmData.farms[0];
        if (farm.weatherData) {
          setCurrentWeather(farm.weatherData.current || farm.weatherData);
          setForecast(farm.weatherData.forecast || []);
        } else {
          setCurrentWeather(null);
          setForecast([]);
          setError('Walang datos ng panahon para sa inyong bukid.');
        }
      } else {
        setCurrentWeather(null);
        setForecast([]);
        setError('Walang nakitang bukid.');
      }
    } catch (err) {
      console.error('Error fetching weather data:', err);
      setError(err.message || 'Hindi makuha ang datos ng panahon. Subukan ulit.');
      Alert.alert('May Mali sa Panahon', err.message || 'Hindi makuha ang datos ng panahon.');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (iconCode) => {
    switch (iconCode) {
      case '01d': return 'wb-sunny';
      case '01n': return 'nightlight-round';
      case '02d': return 'wb-cloudy';
      case '02n': return 'nights-stay';
      case '03d':
      case '03n': return 'cloud';
      case '04d':
      case '04n': return 'cloud-queue';
      case '09d':
      case '09n': return 'grain';
      case '10d':
      case '10n': return 'umbrella';
      case '11d':
      case '11n': return 'flash-on';
      case '13d':
      case '13n': return 'ac-unit';
      case '50d':
      case '50n': return 'visibility';
      default: return 'cloud';
    }
  };

  const getDayName = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const days = ['Lin', 'Lun', 'Mar', 'Miy', 'Huw', 'Biy', 'Sab'];
    return days[date.getDay()];
  };

  const getFullDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    const months = ['Enero', 'Pebrero', 'Marso', 'Abril', 'Mayo', 'Hunyo', 
                   'Hulyo', 'Agosto', 'Setyembre', 'Oktubre', 'Nobyembre', 'Disyembre'];
    return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
  };

  // Simplified weather explanations for farmers
  const getSimpleWeatherAdvice = (description, temp, humidity, wind) => {
    if (!description) return '';
    const desc = description.toLowerCase();
    
    let advice = '';
    
    // Weather condition advice
    if (desc.includes('clear')) {
      advice = '☀️ Magandang araw para sa lahat ng gawain sa bukid.';
    } else if (desc.includes('few clouds') || desc.includes('scattered clouds')) {
      advice = '⛅ Magandang panahon. Pwede magtrabaho sa bukid.';
    } else if (desc.includes('broken clouds') || desc.includes('overcast')) {
      advice = '☁️ Makulimlim. Pwede pa rin magtrabaho pero bantayan ang ulan.';
    } else if (desc.includes('rain')) {
      if (desc.includes('light')) {
        advice = '🌧️ Mahinang ulan. Mag-ingat sa putik.';
      } else {
        advice = '🌧️ Maulan. Huwag muna magtrabaho sa labas.';
      }
    } else if (desc.includes('thunderstorm')) {
      advice = '⛈️ May kulog at kidlat. Manatili sa bahay.';
    } else if (desc.includes('fog') || desc.includes('mist')) {
      advice = '🌫️ Malabo. Mag-ingat sa paglalakad.';
    } else {
      advice = '🌤️ Tingnan muna ang panahon bago lumabas.';
    }

    // Add temperature advice
    if (temp !== undefined && temp !== null) {
      if (temp < 20) {
        advice += ' Malamig ngayon - magsuot ng makapal.';
      } else if (temp >= 35) {
        advice += ' Sobrang init - uminom ng maraming tubig.';
      }
    }

    return advice;
  };

  // Simple temperature category
  const getTemperatureCategory = (temp) => {
    if (temp === undefined || temp === null) return 'Hindi alam';
    if (temp < 20) return 'Malamig';
    if (temp >= 20 && temp < 28) return 'Maayos';
    if (temp >= 28 && temp < 35) return 'Mainit';
    return 'Sobrang Init';
  };

  // Simple humidity category
  const getHumidityCategory = (humidity) => {
    if (humidity === undefined || humidity === null) return 'Hindi alam';
    if (humidity < 40) return 'Tuyo';
    if (humidity >= 40 && humidity <= 70) return 'Maayos';
    return 'Basa';
  };

  // Simple wind category
  const getWindCategory = (wind) => {
    if (wind === undefined || wind === null) return 'Hindi alam';
    if (wind < 2) return 'Walang hangin';
    if (wind < 6) return 'Mahinang hangin';
    return 'Malakas na hangin';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <LinearGradient
          colors={['#15803d', '#22c55e']}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loadingText}>Tinitingnan ang panahon...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (error || !currentWeather) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <LinearGradient
          colors={['#ef4444', '#dc2626']}
          style={styles.errorGradient}
        >
          <Icon name="error-outline" size={60} color="#ffffff" />
          <Text style={styles.errorText}>Walang datos ng panahon. Subukan ulit.</Text>
          <TouchableOpacity onPress={fetchWeatherData} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Subukan Ulit</Text>
          </TouchableOpacity>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#15803d" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#15803d', '#22c55e']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Icon name="chevron-left" size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Panahon Ngayon</Text>
            <View style={{ width: 40 }} />
          </View>
        </LinearGradient>

        {/* Main Weather Card */}
        <View style={styles.mainWeatherCard}>
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.weatherCardGradient}
          >
            <View style={styles.dateContainer}>
              <Text style={styles.dateText}>{getFullDate(currentWeather.dt)}</Text>
              <View style={styles.dateDot} />
            </View>
            
            <View style={styles.weatherMainSection}>
              <View style={styles.iconContainer}>
                <Icon name={getWeatherIcon(currentWeather.weather && currentWeather.weather[0]?.icon)} size={100} color="#10b981" />
              </View>
              <View style={styles.tempSection}>
                <Text style={styles.temperature}>
                  {currentWeather.main && currentWeather.main.temp !== undefined ? Math.round(currentWeather.main.temp) : '--'}°
                </Text>
                <Text style={styles.tempCategory}>
                  {getTemperatureCategory(currentWeather.main && currentWeather.main.temp !== undefined ? Math.round(currentWeather.main.temp) : undefined)}
                </Text>
              </View>
            </View>

            {/* Weather Advice */}
            <LinearGradient
              colors={['#d1fae5', '#ecfdf5']}
              start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              style={styles.adviceSection}
            >
              <Text style={styles.adviceText}>
                {getSimpleWeatherAdvice(
                  currentWeather.weather && currentWeather.weather[0]?.description,
                  currentWeather.main && currentWeather.main.temp !== undefined ? Math.round(currentWeather.main.temp) : undefined,
                  currentWeather.main && currentWeather.main.humidity,
                  currentWeather.wind && currentWeather.wind.speed
                )}
              </Text>
            </LinearGradient>

            {/* Enhanced Details */}
            <View style={styles.detailsSection}>
              <View style={styles.detailItem}>
                <LinearGradient
                  colors={['#fee2e2', '#fecaca']}
                  style={styles.detailIconContainer}
                >
                  <Text style={styles.detailIcon}>🌡️</Text>
                </LinearGradient>
                <Text style={styles.detailLabel}>Temperatura</Text>
                <Text style={styles.detailValue}>
                  {getTemperatureCategory(currentWeather.main && currentWeather.main.temp !== undefined ? Math.round(currentWeather.main.temp) : undefined)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <LinearGradient
                  colors={['#dbeafe', '#bfdbfe']}
                  style={styles.detailIconContainer}
                >
                  <Text style={styles.detailIcon}>💧</Text>
                </LinearGradient>
                <Text style={styles.detailLabel}>Tubig-Singaw</Text>
                <Text style={styles.detailValue}>
                  {getHumidityCategory(currentWeather.main && currentWeather.main.humidity)}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <LinearGradient
                  colors={['#f3e8ff', '#e9d5ff']}
                  style={styles.detailIconContainer}
                >
                  <Text style={styles.detailIcon}>💨</Text>
                </LinearGradient>
                <Text style={styles.detailLabel}>Hangin</Text>
                <Text style={styles.detailValue}>
                  {getWindCategory(currentWeather.wind && currentWeather.wind.speed)}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Enhanced 7-Day Forecast */}
        {forecast.length > 0 && (
          <View style={styles.forecastSection}>
            <Text style={styles.forecastTitle}>Susunod na 7 Araw</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.forecastContainer}>
                {forecast.map((day, index) => (
                  <LinearGradient
                    key={index}
                    colors={['#ffffff', '#f8fafc']}
                    style={styles.forecastCard}
                  >
                    <Text style={styles.forecastDay}>{getDayName(day.dt)}</Text>
                    <View style={styles.forecastIconContainer}>
                      <Icon name={getWeatherIcon(day.weather && day.weather[0]?.icon)} size={40} color="#10b981" />
                    </View>
                    <Text style={styles.forecastTemp}>
                      {day.temp && day.temp.day !== undefined ? Math.round(day.temp.day) : '--'}°
                    </Text>
                    <Text style={styles.forecastCondition}>
                      {getTemperatureCategory(day.temp && day.temp.day !== undefined ? Math.round(day.temp.day) : undefined)}
                    </Text>
                  </LinearGradient>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Enhanced Farming Tips */}
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.tipsCard}
        >
          <View style={styles.tipsHeader}>
            <LinearGradient
              colors={['#fef3c7', '#fcd34d']}
              style={styles.tipsBulb}
            >
              <Text style={styles.tipsBulbIcon}>💡</Text>
            </LinearGradient>
            <Text style={styles.tipsTitle}>Payo para sa Magsasaka</Text>
          </View>
          
          <View style={styles.tipsContent}>
            <View style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>
                Kung makulimlim, ihanda ang mga plastic cover para sa mga halaman
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>
                Kung mainit, mag-water ng hapon o umaga
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>
                Kung maulan, huwag mag-spray ng pesticide
              </Text>
            </View>
            <View style={styles.tipItem}>
              <View style={styles.tipDot} />
              <Text style={styles.tipText}>
                Kung malakas ang hangin, bantayan ang mga puno
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.bottomNav}
        >
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/weather')}>
            <Icon name="cloud" size={24} color="#6b7280" />
            <Text style={[styles.navLabel, { color: '#6b7280' }]}>Weather</Text>
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
            <Icon name="payments" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Loan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/journal')}>
            <Icon name="book" size={24} color="#6b7280" />
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
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 38,
    paddingBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
  },
  // Loading styles
  loadingContainer: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
  // Error styles
  errorContainer: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  errorGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: '600',
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Main weather card styles
  mainWeatherCard: {
    margin: 20,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  weatherCardGradient: {
    borderRadius: 28,
    padding: 28,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dateText: {
    fontSize: 18,
    color: '#64748b',
    fontWeight: '600',
  },
  dateDot: {
    width: 8,
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
    marginLeft: 8,
  },
  weatherMainSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 20,
  },
  iconContainer: {
    padding: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 24,
  },
  tempSection: {
    alignItems: 'center',
  },
  temperature: {
    fontSize: 72,
    fontWeight: '800',
    color: '#0f172a',
    lineHeight: 80,
  },
  tempCategory: {
    fontSize: 24,
    color: '#10b981',
    fontWeight: '700',
    marginTop: 4,
  },
  adviceSection: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  adviceText: {
    fontSize: 18,
    color: '#065f46',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 24,
  },
  detailsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailIcon: {
    fontSize: 24,
  },
  detailLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
    fontWeight: '600',
  },
  detailValue: {
    fontSize: 16,
    color: '#0f172a',
    fontWeight: '700',
    textAlign: 'center',
  },
  // Forecast styles
  forecastSection: {
    marginBottom: 20,
  },
  forecastTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0f172a',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  forecastContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  forecastCard: {
    width: 90,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  forecastDay: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 12,
  },
  forecastIconContainer: {
    marginBottom: 12,
  },
  forecastTemp: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: 4,
  },
  forecastCondition: {
    fontSize: 12,
    color: '#10b981',
    fontWeight: '600',
    textAlign: 'center',
  },
  // Tips card
  tipsCard: {
    borderRadius: 24,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  tipsBulb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipsBulbIcon: {
    fontSize: 24,
  },
  tipsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0f172a',
  },
  tipsContent: {
    gap: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipDot: {
    width: 8,
    height: 8,
    backgroundColor: '#10b981',
    borderRadius: 4,
    marginRight: 12,
    marginTop: 6,
  },
  tipText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 22,
    flex: 1,
    fontWeight: '500',
  },
  // Bottom navigation
  bottomSpacer: {
    height: 110,
  },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
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