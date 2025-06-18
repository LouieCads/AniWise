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

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [credibilityScore, setCredibilityScore] = useState(50); // Example score
  const [loanProgress, setLoanProgress] = useState({
    totalAmount: 50000,
    paidAmount: 32000,
    remainingAmount: 18000,
    progressPercentage: 50,
    nextPaymentDate: 'May 15, 2025',
    monthlyPayment: 5000
  });

  // New state for static soil information
  const [soilInfo, setSoilInfo] = useState({
    moisture: '65%',
    temperature: '28°C',
    humidity: '78%',
    lastUpdated: 'June 17, 2025, 10:00 AM' // Static date, adjust as needed
  });

  useEffect(() => {
    fetchUserProfile();
    // You can add API calls here to fetch credibility score and loan data
    // If you want to fetch dynamic soil data, this is where you'd add the API call.
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        console.log('No token found, redirecting to sign in');
        router.replace('/sign-in');
        return;
      }

      const response = await fetch('http://192.168.254.169:3000/api/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
      } else {
        console.log('Failed to fetch profile:', data.message);
        if (data.message === 'Invalid or expired token') {
          await AsyncStorage.removeItem('token');
          router.replace('/sign-in');
        } else {
          Alert.alert('Error', data.message);
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (error.message.includes('Network')) {
        Alert.alert('Error', 'Network error. Please check your connection.');
      } else {
        Alert.alert('Error', 'Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

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
            await AsyncStorage.removeItem('token');
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
          colors={['#14532d', '#166534', '#15803d']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&auto=format'
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.greeting}>
                  Hello, {loading ? '...' : user?.name?.split(' ')[0] || 'User'}! 👋
                </Text>
                <Text style={styles.subtitle}>Ready to grow today?</Text>
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

        {/* Temperature and Date Cards */}
        <View style={styles.cardRow}>
          {/* Temperature Card */}
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.temperatureCard}
          >
            <View style={styles.iconBackground}>
              <Icon name="trending-up" size={28} color="#10b981" />
            </View>
            <Text style={styles.temperature}>39°C</Text>
            <Text style={styles.time}>1:00 AM</Text>
            <View style={styles.cardAccent} />
          </LinearGradient>

          {/* Date Card */}
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.dateCard}
          >
            <View style={styles.dateHeader}>
              <Text style={styles.dateTitle}>Abr. 20-26</Text>
              <Icon name="schedule" size={20} color="#10b981" />
            </View>
            <Text style={styles.dateDescription}>
              ang pinakamainom na petsa para anihin ang inyong mga pananim.
            </Text>
            <View style={styles.cardAccent} />
          </LinearGradient>
        </View>

        {/* Credibility Score Card with Meter */}
        <View style={styles.credibilityCard}>
          <View style={styles.credibilityHeader}>
            <View style={styles.credibilityTitleContainer}>
              <Icon name="verified-user" size={24} color="#10b981" />
              <Text style={styles.credibilityTitle}>Credibility Score</Text>
            </View>
            <TouchableOpacity style={styles.infoButton}>
              <Icon name="info-outline" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.credibilityContent}>
            <View style={styles.scoreContainer}>
              <Text style={styles.scoreNumber}>{credibilityScore}</Text>
              <Text style={styles.scoreOutOf}>/100</Text>
            </View>
            <Text style={styles.scoreStatus}>{getCredibilityStatus(credibilityScore)}</Text>
            
            {/* Credit Score Meter - Updated for 3 sections */}
            <View style={styles.meterContainer}>
              <View style={styles.meterTrack}>
                {/* Poor Section (0-33) */}
                <View style={[styles.meterSection, { backgroundColor: '#fee2e2' }]} />
                {/* Fair Section (34-66) */}
                <View style={[styles.meterSection, { backgroundColor: '#fed7aa' }]} />
                {/* Good Section (67-100) */}
                <View style={[styles.meterSection, { backgroundColor: '#d1fae5' }]} />
              </View>
              
              {/* Score Indicator */}
              <View 
                style={[
                  styles.scoreIndicator, 
                  { 
                    left: `${(credibilityScore / 100) * 100}%`,
                    backgroundColor: getMeterColor(credibilityScore)
                  }
                ]} 
              />
              
              {/* Meter Labels - Updated for 3 labels */}
              <View style={styles.meterLabels}>
                <Text style={styles.meterLabel}>Poor</Text>
                <Text style={styles.meterLabel}>Fair</Text>
                <Text style={styles.meterLabel}>Good</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.credibilityFooter}>
            <View style={styles.credibilityMetric}>
              <Icon name="payment" size={16} color="#64748b" />
              <Text style={styles.metricText}>Payment History</Text>
            </View>
            <View style={styles.credibilityMetric}>
              <Icon name="account-balance" size={16} color="#64748b" />
              <Text style={styles.metricText}>Credit Usage</Text>
            </View>
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

        {/* Soil Information Card - Added Here */}
        <View style={styles.soilInfoCard}>
          <View style={styles.soilInfoHeader}>
            <Icon name="grass" size={24} color="#059669" />
            <Text style={styles.soilInfoTitle}>Soil Conditions</Text>
          </View>
          <View style={styles.soilInfoContent}>
            <View style={styles.soilInfoRow}>
              <Text style={styles.soilInfoLabel}>Moisture:</Text>
              <Text style={styles.soilInfoValue}>{soilInfo.moisture}</Text>
            </View>
            <View style={styles.soilInfoRow}>
              <Text style={styles.soilInfoLabel}>Temperature:</Text>
              <Text style={styles.soilInfoValue}>{soilInfo.temperature}</Text>
            </View>
            <View style={styles.soilInfoRow}>
              <Text style={styles.soilInfoLabel}>Humidity:</Text>
              <Text style={styles.soilInfoValue}>{soilInfo.humidity}</Text>
            </View>
            <Text style={styles.soilInfoLastUpdated}>Last Updated: {soilInfo.lastUpdated}</Text>
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
            <Icon name="shopping-cart" size={24} color="#6b7280" />
            <Text style={styles.navLabel} onPress={() => router.push('/catalog')}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/journal')}>
            <Icon name="notifications" size={24} color="#6b7280" />
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
  temperatureCard: {
    flex: 1,
    borderRadius: 20,
    padding: 15,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
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
  infoButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
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