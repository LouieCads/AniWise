import React from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getApiUrl = () => {
  if (__DEV__) {
    return 'http://192.168.254.169:3000';
  } else {
    return 'https://192.168.254.169:3000';
  }
};

const statusColors = {
  'Pending': '#f59e42',
  'Approved': '#10b981',
  'Paid': '#22c55e',
  'Unpaid': '#ef4444',
  'Rejected': '#ef4444',
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Loans</Text>
      </View>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : loans.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No loans found.</Text>
        </View>
      ) : (
        <ScrollView style={styles.loansScrollView}>
          {loans.map((loan, idx) => (
            <View key={loan.id || idx} style={styles.loanItem}>
              <View style={styles.loanHeader}>
                <Text style={styles.loanAmount}>₱{loan.totalPrice != null ? loan.totalPrice : (loan.totalAmount || 'N/A')}</Text>
                <Text style={[styles.loanStatus, { color: statusColors[loan.status] || '#888' }]}> 
                  {loan.status}
                </Text>
              </View>
              {loan.cropName ? (
                <Text style={styles.loanPurpose}>{loan.cropName}</Text>
              ) : null}
              {loan.cropName ? (
                <Text style={styles.loanQuantity}>{loan.quantity}</Text>
              ) : null}
              <Text style={styles.loanDate}>
                {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}
              </Text>
            </View>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#f3f3f3',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 10,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  loansScrollView: {
    padding: 20,
  },
  loanItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f3f3f3',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loanAmount: {
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 2,
  },
  loanStatus: {
    fontWeight: 'bold',
  },
  loanDate: {
    color: '#666',
    fontSize: 13,
  },
  loanPurpose: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: 'bold',
  },
  loanQuantity: {
    color: '#888',
    fontSize: 13,
    marginTop: 2,
  },
});

export default LoansPage; 