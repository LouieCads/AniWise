import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getApiUrl = () => process.env.EXPO_PUBLIC_API_URL || 'http://192.168.254.169:3000';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [credibilityScore, setCredibilityScore] = useState(null); // Now null by default
  const [loanableAmount, setLoanableAmount] = useState(null); // New state for loan offer
  const [loanProgress, setLoanProgress] = useState({
    totalAmount: 0,
    paidAmount: 0,
    remainingAmount: 0,
    progressPercentage: 0,
    nextPaymentDate: '',
    monthlyPayment: 0
  });
  const [soilInfo, setSoilInfo] = useState(null); // Will be set from backend
  const [weatherInfo, setWeatherInfo] = useState(null); // New: store weatherData

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

  // Helper: Calculate credibility score from soil conditions
  const calculateCredibilityScore = (soil) => {
    if (!soil) return 0;
    let score = 50; // Start at 50
    // Add points for good conditions
    if (soil.condition === 'Good') score += 30;
    else if (soil.condition === 'Fair') score += 10;
    else score -= 10;
    // Moisture: High = +10, Medium = +5, Low = -10
    if (soil.moisture === 'High') score += 10;
    else if (soil.moisture === 'Medium') score += 5;
    else score -= 10;
    // Temperature: 20-32°C ideal
    const temp = parseFloat(soil.temperature);
    if (!isNaN(temp)) {
      if (temp >= 20 && temp <= 32) score += 10;
      else if (temp >= 15 && temp <= 35) score += 5;
      else score -= 5;
    }
    // Humidity: 50-80% ideal
    const humidity = parseFloat(soil.humidity);
    if (!isNaN(humidity)) {
      if (humidity >= 50 && humidity <= 80) score += 5;
      else score -= 5;
    }
    // Clamp score
    return Math.max(50, Math.min(100, score));
  };

  // Helper: Determine loanable amount
  const getLoanableAmount = (score) => {
    if (score >= 91) return 50000;
    if (score >= 81) return 30000;
    if (score >= 71) return 20000;
    if (score >= 61) return 10000;
    if (score >= 50) return 5000;
    return 0;
  };

  // Fetch farm data and calculate everything
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) {
          router.replace('/sign-in');
          return;
        }
        // Fetch user profile (for greeting)
        const profileRes = await fetch(`${getApiUrl()}/api/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const profileData = await profileRes.json();
        if (profileData.success) setUser(profileData.user);
        // Fetch user's farms
        const farmRes = await fetch(`${getApiUrl()}/api/farms/my`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const farmData = await farmRes.json();
        if (farmData.success && farmData.farms.length > 0) {
          // Use the first (or latest) farm
          const farm = farmData.farms[0];
          const soil = farm.soilConditions;
          setSoilInfo({
            moisture: soil.moisture,
            temperature: soil.temperature + '°C',
            humidity: soil.humidity + '%',
            lastUpdated: farm.updatedAt ? new Date(farm.updatedAt).toLocaleString() : 'N/A',
            condition: soil.condition
          });
          // Store weather info if available
          if (farm.weatherData) {
            setWeatherInfo(farm.weatherData);
          } else {
            setWeatherInfo(null);
          }
          // Calculate credibility score
          const score = calculateCredibilityScore(soil);
          setCredibilityScore(score);
          // Determine loanable amount
          setLoanableAmount(getLoanableAmount(score));
          // Set loan progress (simulate, or use backend if available)
          setLoanProgress({
            totalAmount: getLoanableAmount(score),
            paidAmount: 0,
            remainingAmount: getLoanableAmount(score),
            progressPercentage: 0,
            nextPaymentDate: '',
            monthlyPayment: 0
          });
        } else {
          setSoilInfo(null);
          setCredibilityScore(null);
          setLoanableAmount(null);
        }
      } catch (error) {
        Alert.alert('Error', 'Could not load farm data. Please check your connection.');
        setSoilInfo(null);
        setCredibilityScore(null);
        setLoanableAmount(null);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Send credit score/limit to backend if they change
  useEffect(() => {
    const sendCreditInfo = async () => {
      if (credibilityScore === null || loanableAmount === null) return;
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (!token) return;
        await fetch(`${getApiUrl()}/api/profile/credit`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            creditScore: credibilityScore,
            creditLimit: loanableAmount
          })
        });
      } catch (err) {
        // Optionally show an alert or log
        // Alert.alert('Error', 'Failed to sync credit info');
      }
    };
    sendCreditInfo();
  }, [credibilityScore, loanableAmount]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
          isPreferred: true,
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem('authToken');
            router.replace('/');
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Updated to use only 3 categories
  const getCredibilityStatus = (score) => {
    if (score >= 67) return 'Good';
    if (score >= 34) return 'Fair';
    return 'Poor';
  };

  const getMeterColor = (score) => {
    if (score >= 67) return '#10b981'; // Green
    if (score >= 34) return '#f59e0b'; // Orange
    return '#ef4444'; // Red
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#14532d" />
      
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
            <View style={styles.headerLeft}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1710563849800-73af5bfc9f36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.greeting}>
                  Hello, {loading ? '...' : user?.name?.split(' ')[0] || 'User'}!
                </Text>
                <Text style={styles.subtitle}>Magandang araw!</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.menuButton}>
                <Icon name="trending-up" size={24} color="#ffffff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Icon name="logout" size={24} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Credibility Score Card with Meter */}
        <View style={styles.credibilityCard}>
          <View style={styles.credibilityHeader}>
            <View style={styles.credibilityTitleContainer}>
              <Icon name="verified-user" size={24} color="#10b981" />
              <Text style={styles.credibilityTitle}>Credibility Score</Text>
            </View>
          </View>
          <View style={styles.credibilityContent}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreNumber}>{credibilityScore !== null ? credibilityScore : '--'}</Text>
              <Text style={styles.scoreOutOf}>/100</Text>
            </View>
            <Text style={styles.scoreStatus}>{credibilityScore !== null ? getCredibilityStatus(credibilityScore) : 'No Data'}</Text>
            {/* Credit Score Meter */}
            <View style={styles.meterContainer}>
              <View style={styles.meterTrack}>
                <View style={[styles.meterSection, { backgroundColor: '#fee2e2' }]} />
                <View style={[styles.meterSection, { backgroundColor: '#fed7aa' }]} />
                <View style={[styles.meterSection, { backgroundColor: '#d1fae5' }]} />
              </View>
              <View 
                style={[
                  styles.scoreIndicator, 
                  { 
                    left: `${(credibilityScore !== null ? credibilityScore : 0)}%`,
                    backgroundColor: getMeterColor(credibilityScore || 0)
                  }
                ]} 
              />
              <View style={styles.meterLabels}>
                <Text style={styles.meterLabel}>Poor</Text>
                <Text style={styles.meterLabel}>Fair</Text>
                <Text style={styles.meterLabel}>Good</Text>
              </View>
            </View>
          </View>
          {/* Farmer-friendly loan offer */}
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: 16, color: '#0f172a', fontWeight: 'bold' }}>
              {loanableAmount ? `Pwede kang mag-loan ng hanggang ₱${loanableAmount.toLocaleString()}` : 'Walang loan offer sa ngayon.'}
            </Text>
            <Text style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
              Batay sa kalagayan ng iyong lupa
            </Text>
          </View>
        </View>

        {/* Loan Progress Card */}
        <View style={styles.loanCard}>
          <View style={styles.loanHeader}>
            <View style={styles.loanTitleContainer}>
              <Icon name="account-balance-wallet" size={24} color="#10b981" />
              <Text style={styles.loanTitle}>Loan Progress</Text>
            </View>
            <TouchableOpacity style={styles.loanDetailsButton}>
              <Text style={styles.loanDetailsText}>Details</Text>
              <Icon name="arrow-forward" size={16} color="#10b981" />
            </TouchableOpacity>
          </View>

          <View style={styles.loanAmountContainer}>
            <Text style={styles.loanLabel}>Total Loan Amount</Text>
            <Text style={styles.loanAmount}>₱{loanProgress.totalAmount.toLocaleString()}</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFillBar, { 
                width: `${loanProgress.progressPercentage}%` 
              }]} />
            </View>
            <Text style={styles.progressPercentage}>{loanProgress.progressPercentage}%</Text>
          </View>

          <View style={styles.loanDetails}>
            <View style={styles.loanDetailRow}>
              <View style={styles.loanDetailItem}>
                <Text style={styles.loanDetailLabel}>Paid Amount</Text>
                <Text style={styles.loanDetailValue}>₱{loanProgress.paidAmount.toLocaleString()}</Text>
              </View>
              <View style={styles.loanDetailItem}>
                <Text style={styles.loanDetailLabel}>Remaining</Text>
                <Text style={styles.loanDetailValue}>₱{loanProgress.remainingAmount.toLocaleString()}</Text>
              </View>
            </View>
            
            <View style={styles.nextPaymentContainer}>
              <View style={styles.nextPaymentInfo}>
                <Icon name="calendar-today" size={16} color="#64748b" />
                <Text style={styles.nextPaymentText}>Next Payment: {loanProgress.nextPaymentDate}</Text>
              </View>
              <Text style={styles.nextPaymentAmount}>₱{loanProgress.monthlyPayment.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Soil Information Card - Updated for real data */}
        <View style={styles.soilInfoCard}>
          <View style={styles.soilInfoHeader}>
            <Icon name="grass" size={24} color="#059669" />
            <Text style={styles.soilInfoTitle}>Kalagayan ng Lupa</Text>
          </View>
          <View style={styles.soilInfoContent}>
            {soilInfo ? (
              <>
                <View style={styles.soilInfoRow}>
                  <Text style={styles.soilInfoLabel}>Moisture:</Text>
                  <Text style={styles.soilInfoValue}>{soilInfo.moisture}</Text>
                </View>
                <View style={styles.soilInfoRow}>
                  <Text style={styles.soilInfoLabel}>Temperatura:</Text>
                  <Text style={styles.soilInfoValue}>{soilInfo.temperature}</Text>
                </View>
                <View style={styles.soilInfoRow}>
                  <Text style={styles.soilInfoLabel}>Humidity:</Text>
                  <Text style={styles.soilInfoValue}>{soilInfo.humidity}</Text>
                </View>
                <View style={styles.soilInfoRow}>
                  <Text style={styles.soilInfoLabel}>Kalagayan:</Text>
                  <Text style={styles.soilInfoValue}>{soilInfo.condition}</Text>
                </View>
                <Text style={styles.soilInfoLastUpdated}>Huling update: {soilInfo.lastUpdated}</Text>
              </>
            ) : (
              <Text style={styles.soilInfoLabel}>Wala pang naitalang farm o lupa.</Text>
            )}
          </View>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
      
      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.bottomNav}
        >
          <TouchableOpacity style={styles.navButton } onPress={() => router.push('/weather')}>
            <Icon name="cloud" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Weather</Text>
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
            <Text style={styles.navLabel} onPress={() => router.push('/catalog')}>Loan</Text>
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
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 38,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#10b981',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  menuButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 16,
  },

  iconBackground: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  temperature: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#64748b',
  },
  dateCard: {
    flex: 1.3,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  dateDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    backgroundColor: '#10b981',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  // Updated Credibility Score Styles with 3-section Meter
  credibilityCard: {
    margin: 20,
    borderRadius: 24,
    padding: 24,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  credibilityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  credibilityTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  credibilityTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginLeft: 8,
  },
  credibilityContent: {
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  scoreOutOf: {
    fontSize: 24,
    color: '#64748b',
    marginLeft: 4,
  },
  scoreStatus: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 24,
  },
  // Credit Score Meter Styles - Updated for 3 sections
  meterContainer: {
    width: '100%',
    maxWidth: 280,
    position: 'relative',
    marginBottom: 16,
  },
  meterTrack: {
    flexDirection: 'row',
    height: 12,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
  },
  meterSection: {
    flex: 1,
    height: '100%',
  },
  scoreIndicator: {
    position: 'absolute',
    top: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: -10,
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  meterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  meterLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
  },
  credibilityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  credibilityMetric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metricText: {
    color: '#64748b',
    fontSize: 12,
    marginLeft: 4,
  },
  // Loan Progress Styles
  loanCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  loanTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginLeft: 8,
  },
  loanDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  loanDetailsText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 4,
  },
  loanAmountContainer: {
    marginBottom: 20,
  },
  loanLabel: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 4,
  },
  loanAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFillBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10b981',
  },
  loanDetails: {
    marginTop: 12,
  },
  loanDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  loanDetailItem: {
    flex: 1,
  },
  loanDetailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
  },
  loanDetailValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  nextPaymentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  nextPaymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextPaymentText: {
    fontSize: 14,
    color: '#64748b',
    marginLeft: 6,
  },
  nextPaymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#10b981',
  },
  // Soil Information Card Styles
  soilInfoCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  soilInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  soilInfoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
    marginLeft: 8,
  },
  soilInfoContent: {
    // Styles for the content section of the soil info card
  },
  soilInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  soilInfoLabel: {
    fontSize: 16,
    color: '#64748b',
    fontWeight: '500',
  },
  soilInfoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  soilInfoLastUpdated: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 12,
    textAlign: 'right',
  },
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default Dashboard;