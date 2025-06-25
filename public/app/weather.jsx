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
import AsyncStorage from '@react-native-async-storage/async-storage';

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
      const farmRes = await fetch('http://192.168.254.169:3000/api/farms/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const farmData = await farmRes.json();
      if (farmData.success && farmData.farms.length > 0) {
        const farm = farmData.farms[0];
        if (farm.weatherData) {
          setCurrentWeather(farm.weatherData.current || farm.weatherData); // support both {current, forecast} and flat
          setForecast(farm.weatherData.forecast || []);
        } else {
          setCurrentWeather(null);
          setForecast([]);
          setError('No weather data available for your farm.');
        }
      } else {
        setCurrentWeather(null);
        setForecast([]);
        setError('No farm data found.');
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

  const getWeatherExplanation = (description) => {
    if (!description) return '';
    const desc = description.toLowerCase();
    if (desc.includes('clear')) return 'Malinaw ang langit, walang ulap. Magandang panahon para sa pagtatanim at pag-ani.';
    if (desc.includes('few clouds')) return 'May kaunting ulap, pero maaraw pa rin. Pwedeng magtrabaho sa bukid.';
    if (desc.includes('scattered clouds')) return 'May mga ulap, pero may sikat ng araw pa rin. Magandang panahon para sa gawain.';
    if (desc.includes('broken clouds')) return 'Medyo makulimlim, may mga ulap na nagtatakip sa araw.';
    if (desc.includes('overcast')) return 'Makulimlim, halos natatakpan ng ulap ang langit. Maaaring umulan.';
    if (desc.includes('rain') && desc.includes('light')) return 'Mahinang ulan. Mag-ingat sa madulas na lupa.';
    if (desc.includes('rain') && desc.includes('heavy')) return 'Malakas na ulan. Iwasan muna ang pagtatrabaho sa labas.';
    if (desc.includes('rain')) return 'Ulan na maaaring mahina o malakas. Mag-ingat sa pagbaha at putik.';
    if (desc.includes('thunderstorm')) return 'May kulog, kidlat, at malakas na ulan. Mag-ingat at huwag magtago sa ilalim ng puno.';
    if (desc.includes('fog') || desc.includes('mist')) return 'Malabo ang paligid dahil sa hamog o ulap. Mag-ingat sa paglalakad o pagmamaneho.';
    return 'Tingnan ang kondisyon ng panahon at mag-ingat sa bukid.';
  };

  const interpretTemperature = (temp) => {
    if (temp === undefined || temp === null) return '';
    if (temp < 20) return 'Malamig: Maghanda ng panangga sa lamig.';
    if (temp >= 20 && temp < 28) return 'Katamtaman: Magandang panahon para sa gawain.';
    if (temp >= 28 && temp < 35) return 'Mainit: Uminom ng maraming tubig at magpahinga kapag tirik ang araw.';
    return 'Sobrang init: Mag-ingat sa heat stroke, iwasan ang matagal na trabaho sa labas.';
  };

  const interpretHumidity = (humidity) => {
    if (humidity === undefined || humidity === null) return '';
    if (humidity < 40) return 'Mababa ang halumigmig: Pwedeng matuyo agad ang lupa.';
    if (humidity >= 40 && humidity <= 80) return 'Katamtamang halumigmig: Magandang kondisyon para sa halaman.';
    return 'Mataas ang halumigmig: Mag-ingat sa sakit ng halaman at amag.';
  };

  const interpretWind = (wind) => {
    if (wind === undefined || wind === null) return '';
    if (wind < 2) return 'Mahina ang hangin: Ligtas para sa karamihan ng gawain.';
    if (wind < 6) return 'Katamtamang hangin: Mag-ingat sa pag-spray ng abono o pestisidyo.';
    return 'Malakas ang hangin: Mag-ingat sa paglipad ng gamit at pinsala sa pananim.';
  };

  const interpretFeelsLike = (feels, temp) => {
    if (feels === undefined || feels === null || temp === undefined || temp === null) return '';
    const diff = Math.abs(feels - temp);
    if (diff < 2) return 'Pakiramdam ay halos kapareho ng aktwal na temperatura.';
    if (feels > temp) return 'Mas mainit ang pakiramdam kaysa aktwal na temperatura.';
    return 'Mas malamig ang pakiramdam kaysa aktwal na temperatura.';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Kinukuha ang datos ng panahon...</Text>
      </SafeAreaView>
    );
  }

  if (error || !currentWeather) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={50} color="#ef4444" />
        <Text style={styles.errorText}>Walang datos ng panahon sa inyong bukid. Subukang muli mamaya.</Text>
        <TouchableOpacity onPress={fetchWeatherData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Subukang Muli</Text>
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
            <Text style={styles.headerTitle}>Panahon</Text>
            <View style={{ width: 24 }} /> {/* Spacer for symmetry */}
          </View>
        </LinearGradient>

        {/* Current Weather Card */}
        <View style={styles.currentWeatherCard}>
          <Text style={styles.currentWeatherDate}>{getFullDate(currentWeather.dt)}</Text>
          <View style={styles.currentWeatherMain}>
            <Icon name={getWeatherIcon(currentWeather.weather && currentWeather.weather[0]?.icon)} size={90} color="#10b981" />
            <View style={styles.currentWeatherTempContainer}>
              <Text style={styles.currentTemperature}>
                {currentWeather.main && currentWeather.main.temp !== undefined ? Math.round(currentWeather.main.temp) : '--'}°C
              </Text>
              <Text style={styles.weatherDescription}>
                {currentWeather.weather && currentWeather.weather[0]?.description 
                  ? currentWeather.weather[0].description.charAt(0).toUpperCase() + currentWeather.weather[0].description.slice(1) 
                  : 'N/A'}
              </Text>
            </View>
          </View>
          <View style={styles.currentWeatherDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Temperatura:</Text>
              <Text style={styles.detailValue}>
                {currentWeather.main && currentWeather.main.temp !== undefined ? Math.round(currentWeather.main.temp) + '°C' : '--'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Halumigmig:</Text>
              <Text style={styles.detailValue}>
                {currentWeather.main && currentWeather.main.humidity !== undefined ? currentWeather.main.humidity + '%' : '--'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Hangin:</Text>
              <Text style={styles.detailValue}>
                {currentWeather.wind && currentWeather.wind.speed !== undefined ? currentWeather.wind.speed + ' m/s' : '--'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Pakiramdam:</Text>
              <Text style={styles.detailValue}>
                {currentWeather.main && currentWeather.main.feels_like !== undefined ? Math.round(currentWeather.main.feels_like) + '°C' : '--'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Kondisyon:  </Text>
              <Text style={styles.detailValue}>
                {currentWeather.weather && currentWeather.weather[0]?.description 
                  ? currentWeather.weather[0].description.charAt(0).toUpperCase() + currentWeather.weather[0].description.slice(1) 
                  : '--'}
              </Text>
            </View>
          </View>
        </View>

        {/* 7-Day Forecast */}
        {forecast.length > 0 && <Text style={styles.forecastTitle}>7-Day Forecast</Text>}
        <View style={styles.forecastContainer}>
          {forecast.map((day, index) => (
            <LinearGradient
              key={index}
              colors={['#ffffff', '#f8fafc']}
              style={styles.forecastCard}
            >
              <Text style={styles.forecastDay}>{getDayName(day.dt)}</Text>
              <Icon name={getWeatherIcon(day.weather && day.weather[0]?.icon)} size={40} color="#10b981" />
              <Text style={styles.forecastTemp}>
                {day.temp && day.temp.day !== undefined ? Math.round(day.temp.day) : '--'}°C
              </Text>
              <Text style={styles.forecastDescription}>
                {day.weather && day.weather[0]?.main ? day.weather[0].main : 'N/A'}
              </Text>
            </LinearGradient>
          ))}
        </View>

        {/* Weather Condition Explanations for Farmers */}
        <View style={styles.weatherExplanationCard}>
          <Text style={styles.weatherExplanationTitle}>📋 <Text style={{fontWeight:'bold'}}>Paliwanag ng Panahon</Text></Text>
          {/* Main weather condition explanation */}
          <Text style={[styles.weatherExplanationItem, {marginBottom: 8}]}>
            <Text style={{fontWeight:'bold', color:'#15803d'}}>
              {currentWeather.weather && currentWeather.weather[0]?.description
                ? currentWeather.weather[0].description.charAt(0).toUpperCase() + currentWeather.weather[0].description.slice(1)
                : ''}
            </Text>{' '}
            {getWeatherExplanation(currentWeather.weather && currentWeather.weather[0]?.description)}
          </Text>

          {/* Temperature */}
          <Text style={[styles.weatherExplanationItem, {fontWeight:'bold', color:'#d97706', marginTop: 4}]}>🌡️ Temperatura:</Text>
          <Text style={styles.weatherExplanationItem}>
            <Text style={{fontWeight:'bold'}}>
              {currentWeather.main && currentWeather.main.temp !== undefined ? Math.round(currentWeather.main.temp) + '°C' : '--'}
            </Text>{' – '}
            {interpretTemperature(currentWeather.main && currentWeather.main.temp !== undefined ? Math.round(currentWeather.main.temp) : undefined)}
          </Text>

          {/* Humidity */}
          <Text style={[styles.weatherExplanationItem, {fontWeight:'bold', color:'#2563eb', marginTop: 4}]}>💧 Halumigmig:</Text>
          <Text style={styles.weatherExplanationItem}>
            <Text style={{fontWeight:'bold'}}>
              {currentWeather.main && currentWeather.main.humidity !== undefined ? currentWeather.main.humidity + '%' : '--'}
            </Text>{' – '}
            {interpretHumidity(currentWeather.main && currentWeather.main.humidity !== undefined ? currentWeather.main.humidity : undefined)}
          </Text>

          {/* Wind */}
          <Text style={[styles.weatherExplanationItem, {fontWeight:'bold', color:'#0ea5e9', marginTop: 4}]}>💨 Hangin:</Text>
          <Text style={styles.weatherExplanationItem}>
            <Text style={{fontWeight:'bold'}}>
              {currentWeather.wind && currentWeather.wind.speed !== undefined ? currentWeather.wind.speed + ' m/s' : '--'}
            </Text>{' – '}
            {interpretWind(currentWeather.wind && currentWeather.wind.speed !== undefined ? currentWeather.wind.speed : undefined)}
          </Text>

          {/* Feels Like */}
          <Text style={[styles.weatherExplanationItem, {fontWeight:'bold', color:'#f43f5e', marginTop: 4}]}>🤲 Pakiramdam:</Text>
          <Text style={styles.weatherExplanationItem}>
            <Text style={{fontWeight:'bold'}}>
              {currentWeather.main && currentWeather.main.feels_like !== undefined ? Math.round(currentWeather.main.feels_like) + '°C' : '--'}
            </Text>{' – '}
            {interpretFeelsLike(
              currentWeather.main && currentWeather.main.feels_like !== undefined ? Math.round(currentWeather.main.feels_like) : undefined,
              currentWeather.main && currentWeather.main.temp !== undefined ? Math.round(currentWeather.main.temp) : undefined
            )}
          </Text>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Navigation */}
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
            <View>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.homeButtonGradient}
              >
                <Icon name="home" size={28} color="#ffffff" />
              </LinearGradient>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/catalog')}>
            <Icon name="cash-multiple" size={24} color="#6b7280" />
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
    paddingBottom: 120, // Prevent overlap with bottom nav
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
    paddingTop: 40,
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
    marginLeft: 10,
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
    marginTop: 18,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 18,
    width: '100%',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 18,
    color: '#14532d',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 17,
    color: '#0f172a',
    fontWeight: 'bold',
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
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  forecastCard: {
    flexBasis: '45%',
    maxWidth: '45%',
    margin: 6,
    aspectRatio: 0.9,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    backgroundColor: '#fff',
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
    height: 120,
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
  weatherExplanationCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  weatherExplanationTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#14532d',
    marginBottom: 8,
  },
  weatherExplanationItem: {
    fontSize: 15,
    color: '#334155',
    marginBottom: 6,
  },
});

export default WeatherPage;