import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Image,
  StatusBar, SafeAreaView, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Dummy Data ---
const shopByCategories = [
  { id: 'women', name: 'Buto', image: 'https://images.unsplash.com/photo-1613500788522-89c4d55bdd0e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'men', name: 'Materyales', image: 'https://plus.unsplash.com/premium_photo-1678677947273-47497a96ae1c?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'kids', name: 'Pataba', image: 'https://plus.unsplash.com/premium_photo-1678371209833-b9aff08ff327?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZlcnRpbGl6ZXJzfGVufDB8fDB8fHww' },
  { id: 'beauty', name: 'Makinarya', image: 'https://images.unsplash.com/photo-1666706210261-a57ea3793fc0?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const productsData = [
  {
    id: 1,
    name: 'Palay',
    brand: 'Local Harvest',
    description: 'Sariwa at de-kalidad',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format',
    rating: '1500 php / sako'
  },
  {
    id: 2,
    name: 'Moon Melon',
    brand: 'Vicari\'s farm',
    description: 'Sariwa at de-kalidad',
    image: 'https://static.wikia.nocookie.net/growagarden/images/7/7a/MoonMelon.png/revision/latest?cb=20250519094623',
    rating: '1500 php / sako'
  },
  {
    id: 3,
    name: 'Kamatis',
    brand: 'Garden Fresh',
    description: 'Mainam itanim ngayong buwan',
    image: 'https://plus.unsplash.com/premium_photo-1671395501275-630ae5ea02c4?q=80&w=677&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: '1500 php / sako'
  },
  {
    id: 4,
    name: 'Talong',
    brand: 'Farm Connect',
    description: 'Patok sa tag-init',
    image: 'https://images.unsplash.com/photo-1683543122945-513029986574?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: '1500 php / sako'
  },
  {
    id: 5,
    name: 'Sili',
    brand: 'Spice Master',
    description: 'Maanghang at masarap',
    image: 'https://images.unsplash.com/photo-1526179969422-e92255a5f223?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: '1500 php / sako'
  },
  {
    id: 6,
    name: 'Mais',
    brand: 'Green Farms',
    description: 'Maanghang at masarap',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop&auto=format',
    rating: '1500 php / sako'
  }
];

const getApiUrl = () => {
  if (__DEV__) {
    return 'http://192.168.100.134:3000';
  } else {
    return 'https://192.168.100.134:3000';
  }
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

const statusColors = {
  'Pending': '#f59e42',
  'Approved': '#10b981',
  'Paid': '#22c55e',
  'Unpaid': '#ef4444',
  'Rejected': '#ef4444',
};

const CatalogPage = () => {
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [loanModalVisible, setLoanModalVisible] = React.useState(false);
  const [loans, setLoans] = React.useState([]);
  const [loadingLoans, setLoadingLoans] = React.useState(false);

  const fetchLoans = async () => {
    setLoadingLoans(true);
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
      setLoadingLoans(false);
    }
  };

  const openLoanModal = () => {
    fetchLoans();
    setLoanModalVisible(true);
  };

  const closeLoanModal = () => {
    setLoanModalVisible(false);
  };

  const handleLoanAgain = () => {
    setLoanModalVisible(false);
    router.push('/product-details');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* --- Search Header --- */}
        <View style={styles.searchHeader}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={24} color="#A0A0A0" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#A0A0A0"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="tune" size={24} color="#808080" />
          </TouchableOpacity>
        </View>

        {/* --- Product Repayment and Loans Buttons --- */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 12 }}>
          <TouchableOpacity
            style={styles.repaymentButton}
            onPress={() => router.push('/product-repayment')}
          >
            <Text style={styles.repaymentButtonText}>Repayment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loansButton}
            onPress={() => router.push('/loans')}
          >
            <Text style={styles.loansButtonText}>Mga Loans</Text>
          </TouchableOpacity>
        </View>

        {/* --- Shop By Category Section --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mamili ayon sa kategorya</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Tingnan lahat</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.shopByCategoriesScroll}
          >
            {shopByCategories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.shopByCategoryItem}>
                <Image source={{ uri: cat.image }} style={styles.shopByCategoryImage} />
                <Text style={styles.shopByCategoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- Curated For You --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pinili para sa iyo</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Tingnan lahat</Text>
            </TouchableOpacity>
          </View>

          {/* --- Product Grid --- */}
          <View style={styles.productGrid}>
            {productsData.reduce((rows, item, index) => {
              if (index % 2 === 0) {
                rows.push([item]);
              } else {
                rows[rows.length - 1].push(item);
              }
              return rows;
            }, []).map((row, rowIndex) => (
              <View style={styles.productRow} key={rowIndex}>
                {row.map(product => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.productCard}
                    onPress={() => router.push({ pathname: '/product-details', params: { cropName: product.name } })}
                    activeOpacity={0.7}
                  >
                    <View style={styles.productImageContainer}>
                      <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productBrand}>{product.brand}</Text>
                      <Text style={styles.productName}>{product.name}</Text>
                      <View style={styles.productRatingContainer}>
                        <Text style={styles.productRating}>{product.rating}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* --- Bottom Spacer --- */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* --- Bottom Navigation --- */}
      <View style={styles.bottomNavContainer}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.bottomNav}
        >
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/weather')}>
            <Icon name="cloud" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Weather</Text>
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
          <TouchableOpacity style={styles.navButton} onPress={openLoanModal}>
            <Icon name="payments" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Loan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/journal')}>
            <Icon name="book" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Journal</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* --- Loan Modal --- */}
      <Modal
        visible={loanModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeLoanModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>My Loans</Text>
              <TouchableOpacity onPress={closeLoanModal}>
                <Icon name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            {loadingLoans ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#10b981" />
              </View>
            ) : loans.length === 0 ? (
              <View style={styles.emptyLoansContainer}>
                <Text style={styles.emptyLoansText}>No loans found.</Text>
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
            <TouchableOpacity
              style={styles.loanAgainButton}
              onPress={handleLoanAgain}
            >
              <Text style={styles.loanAgainButtonText}>Loan Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  scrollView: {
    flex: 1,
  },
  // --- Search Header ---
  searchHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 43,
    paddingBottom: 8,
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    height: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 0,
  },
  filterButton: {
    width: 50,
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  // --- Section Headers ---
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeAll: {
    fontSize: 14,
    color: '#A0A0A0',
    fontWeight: '600',
  },

  // --- Shop By Category ---
  shopByCategoriesScroll: {
    gap: 15,
  },
  shopByCategoryItem: {
    alignItems: 'center',
    width: 80,
  },
  shopByCategoryImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    marginBottom: 8,
  },
  shopByCategoryText: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
    textAlign: 'center',
  },

  // --- Product Grid ---
  productGrid: {
    gap: 16,
  },
  productRow: {
    flexDirection: 'row',
    gap: 16,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  productImageContainer: {
    height: 140,
    width: '100%',
    backgroundColor: '#F8F8F8',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 12,
    alignItems: 'flex-start',
  },
  productBrand: {
    fontSize: 12,
    color: '#A0A0A0',
    marginBottom: 4,
    fontWeight: '500',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  productRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productRating: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },

  bottomSpacer: {
    height: 100,
  },

  // --- Bottom Navigation ---
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
    color: '#6b7280',
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

  // --- Modal Styles ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderColor: '#f3f3f3',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  loadingContainer: {
    margin: 30,
  },
  emptyLoansContainer: {
    alignItems: 'center',
    margin: 30,
  },
  emptyLoansText: {
    color: '#888',
    fontSize: 16,
  },
  loansScrollView: {
    maxHeight: 350,
  },
  loanItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#f3f3f3',
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
  loanAgainButton: {
    backgroundColor: '#10b981',
    margin: 20,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  loanAgainButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  repaymentButton: {
    backgroundColor: '#059669',
    marginHorizontal: 0,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginTop: 12
  },
  repaymentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loansButton: {
    backgroundColor: '#2563eb',
    marginHorizontal: 0,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    marginTop: 12
  },
  loansButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CatalogPage;