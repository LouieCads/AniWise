import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar, Alert, Platform, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const getApiUrl = () => process.env.EXPO_PUBLIC_API_URL || 'http://192.168.254.169:3000';

const statusColors = {
  'Pending': '#f59e42',
  'Approved': '#10b981',
  'Paid': '#22c55e',
  'Unpaid': '#ef4444',
  'Rejected': '#ef4444',
};

const statusIcons = {
  'Pending': 'schedule',
  'Approved': 'check-circle',
  'Paid': 'paid',
  'Unpaid': 'cancel',
  'Rejected': 'cancel',
};

const getAuthToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    if (!token) throw new Error('No authentication token found');
    return token;
  } catch (error) {
    console.error('Error getting authentication token:', error);
    throw error;
  }
};

const LoansPage = () => {
  const [loans, setLoans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const token = await getAuthToken();
      const response = await fetch(`${getApiUrl()}/api/loans/my/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setLoans(data.loans);
      } else {
        setLoans([]);
      }
    } catch (error) {
      setLoans([]);
      Alert.alert('Error', 'Failed to fetch loans.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchLoans();
  }, []);

  const formatCurrency = (amount) => {
    if (amount == null) return 'N/A';
    return `₱${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyImageContainer}>
        <Image 
          source={{ uri: 'https://img.icons8.com/color/200/000000/agriculture.png' }} 
          style={styles.emptyImage}
        />
      </View>
      <Text style={styles.emptyTitle}>No Loans Yet</Text>
      <Text style={styles.emptySubtitle}>You haven't applied for any loans yet. Start your agricultural journey with us!</Text>
      <TouchableOpacity style={styles.emptyButton} onPress={() => router.push('/catalog')}>
        <LinearGradient
          colors={['#15803d', '#22c55e']}
          style={styles.emptyButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Icon name="add" size={20} color="#fff" />
          <Text style={styles.emptyButtonText}>Apply for Loan</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#15803d" />
      <LinearGradient
          colors={['#15803d', '#22c55e']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Loans</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
          <Text style={styles.loadingText}>Loading your loans...</Text>
        </View>
      ) : loans.length === 0 ? (
        renderEmptyState()
      ) : (
        <ScrollView style={styles.loansScrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <Icon name="assessment" size={24} color="#15803d" />
              <Text style={styles.summaryTitle}>Loan Summary</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Loans:</Text>
              <Text style={styles.summaryValue}>{loans.length}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Active Loans:</Text>
              <Text style={styles.summaryValue}>
                {loans.filter(loan => loan.status === 'Approved' || loan.status === 'Unpaid').length}
              </Text>
            </View>
          </View>

          {loans.map((loan, idx) => (
            <TouchableOpacity key={loan.id || idx} style={styles.loanItem} activeOpacity={0.8}>
              <View style={styles.loanCard}>
                <View style={styles.loanHeader}>
                  <View style={styles.loanAmountContainer}>
                    <Icon name="monetization-on" size={24} color="#15803d" />
                    <Text style={styles.loanAmount}>
                      {formatCurrency(loan.totalPrice != null ? loan.totalPrice : loan.totalAmount)}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: statusColors[loan.status] || '#888' }]}>
                    <Icon name={statusIcons[loan.status] || 'help'} size={24} color="#fff" />
                    <Text style={styles.statusText}>{loan.status}</Text>
                  </View>
                </View>
                
                <View style={styles.loanDetails}>
                  {loan.cropName && (
                    <View style={styles.detailRow}>
                      <Icon name="eco" size={24} color="#666" />
                      <Text style={styles.cropName}>{loan.cropName}</Text>
                    </View>
                  )}
                  
                  {loan.quantity && (
                    <View style={styles.detailRow}>
                      <Icon name="inventory" size={24} color="#666" />
                      <Text style={styles.quantity}>{loan.quantity}</Text>
                    </View>
                  )}
                  
                  <View style={styles.detailRow}>
                    <Icon name="schedule" size={24} color="#666" />
                    <Text style={styles.loanDate}>
                      {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                      }) : 'Date not available'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.loanFooter}>
                  <Text style={styles.loanId}>ID: {loan.id || `LOAN-${idx + 1}`}</Text>
                  <Icon name="chevron-right" size={20} color="#ccc" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          <View style={styles.bottomSpacing} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    color: '#666',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyImageContainer: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f9ff',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyImage: {
    width: 80,
    height: 80,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  emptyButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  emptyButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loansScrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  summaryCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803d',
  },
  loanItem: {
    marginBottom: 16,
  },
  loanCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#15803d',
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  loanAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loanAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  loanDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  quantity: {
    fontSize: 14,
    color: '#6b7280',
  },
  loanDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  loanFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  loanId: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '500',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default LoansPage;