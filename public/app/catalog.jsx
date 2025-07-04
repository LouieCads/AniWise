import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Image,
  StatusBar, SafeAreaView, TouchableOpacity, TextInput, Modal, ActivityIndicator, Alert, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// --- Enhanced Dummy Data ---
const shopByCategories = [
  { 
    id: 'buto', 
    name: 'Buto', 
    image: 'https://images.unsplash.com/photo-1613500788522-89c4d55bdd0e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gradient: ['#10b981', '#059669']
  },
  { 
    id: 'materyales', 
    name: 'Materyales', 
    image: 'https://plus.unsplash.com/premium_photo-1678677947273-47497a96ae1c?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gradient: ['#3b82f6', '#2563eb']
  },
  { 
    id: 'pataba', 
    name: 'Pataba', 
    image: 'https://plus.unsplash.com/premium_photo-1678371209833-b9aff08ff327?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZlcnRpbGl6ZXJzfGVufDB8fDB8fHww',
    gradient: ['#f59e0b', '#d97706']
  },
  { 
    id: 'makinarya', 
    name: 'Makinarya', 
    image: 'https://images.unsplash.com/photo-1666706210261-a57ea3793fc0?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    gradient: ['#8b5cf6', '#7c3aed']
  },
];

const productsData = [
  {
    id: 1,
    name: 'Premium Palay',
    brand: 'Local Harvest',
    description: 'Sariwa at de-kalidad na palay',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format',
    price: '₱1,500',
    originalPrice: '₱1,800',
    discount: '17%',
    rating: 4.8,
    reviews: 124,
    inStock: true,
    badge: 'Best Seller'
  },
  {
    id: 2,
    name: 'Moon Melon Seeds',
    brand: 'Vicari\'s Farm',
    description: 'Rare hybrid melon variety',
    image: 'https://static.wikia.nocookie.net/growagarden/images/7/7a/MoonMelon.png/revision/latest?cb=20250519094623',
    price: '₱850',
    originalPrice: null,
    discount: null,
    rating: 4.9,
    reviews: 89,
    inStock: true,
    badge: 'New'
  },
  {
    id: 3,
    name: 'Kamatis Premium',
    brand: 'Garden Fresh',
    description: 'Mainam itanim ngayong buwan',
    image: 'https://plus.unsplash.com/premium_photo-1671395501275-630ae5ea02c4?q=80&w=677&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: '₱450',
    originalPrice: '₱550',
    discount: '18%',
    rating: 4.6,
    reviews: 67,
    inStock: true,
    badge: null
  },
  {
    id: 4,
    name: 'Talong Hybrid',
    brand: 'Farm Connect',
    description: 'Patok sa tag-init',
    image: 'https://images.unsplash.com/photo-1683543122945-513029986574?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: '₱320',
    originalPrice: null,
    discount: null,
    rating: 4.7,
    reviews: 45,
    inStock: false,
    badge: null
  },
  {
    id: 5,
    name: 'Siling Labuyo',
    brand: 'Spice Master',
    description: 'Maanghang at masarap',
    image: 'https://images.unsplash.com/photo-1526179969422-e92255a5f223?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    price: '₱280',
    originalPrice: null,
    discount: null,
    rating: 4.5,
    reviews: 78,
    inStock: true,
    badge: 'Hot'
  },
  {
    id: 6,
    name: 'Sweet Corn',
    brand: 'Green Farms',
    description: 'Premium quality corn seeds',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop&auto=format',
    price: '₱680',
    originalPrice: '₱750',
    discount: '9%',
    rating: 4.8,
    reviews: 156,
    inStock: true,
    badge: null
  }
];

const getApiUrl = () => {
  if (__DEV__) {
    return 'http://192.168.100.2:3000';
  } else {
    return 'https://192.168.100.2:3000';
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

const badgeColors = {
  'Best Seller': '#ef4444',
  'New': '#10b981',
  'Hot': '#f59e0b',
};

const CatalogPage = () => {
  const [activeCategory, setActiveCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [loanModalVisible, setLoanModalVisible] = React.useState(false);
  const [loans, setLoans] = React.useState([]);
  const [loadingLoans, setLoadingLoans] = React.useState(false);
  const [favorites, setFavorites] = React.useState(new Set());

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

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
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
    router.push({ pathname: '/product-details', params: { ...productsData[0] } });
  };

  const filteredProducts = productsData.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Icon key={i} name="star" size={12} color="#fbbf24" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Icon key="half" name="star-half" size={12} color="#fbbf24" />);
    }
    
    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* --- Enhanced Header --- */}
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.header}
        >
          <View style={styles.headerTop}>
            <View style={styles.greetingContainer}>
              <Text style={styles.greeting}>Kumusta!</Text>
              <Text style={styles.subGreeting}>Ano ang hanap mo ngayon?</Text>
            </View>
            <TouchableOpacity style={styles.notificationButton}>
              <Icon name="notifications" size={24} color="#374151" />
              <View style={styles.notificationBadge} />
            </TouchableOpacity>
          </View>

          {/* --- Enhanced Search Bar --- */}
          <View style={styles.searchContainer}>
            <Icon name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Hanapin ang produkto..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <TouchableOpacity style={styles.voiceSearchButton}>
              <Icon name="mic" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* --- Quick Action Buttons --- */}
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity
              style={[styles.quickActionButton, styles.repaymentButton]}
              onPress={() => router.push('/product-repayment')}
            >
              <LinearGradient
                colors={['#15803d', '#22c55e']}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Icon name="payment" size={20} color="#ffffff" />
                <Text style={styles.quickActionText}>Repayment</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickActionButton, styles.loansButton]}
              onPress={() => router.push('/loans')}
            >
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.quickActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Icon name="account-balance" size={20} color="#ffffff" />
                <Text style={styles.quickActionText}>Mga Loans</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* --- Enhanced Category Section --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mga Kategorya</Text>
            <TouchableOpacity style={styles.seeAllButton}>
              <Text style={styles.seeAllText}>Tingnan lahat</Text>
              <Icon name="arrow-forward" size={16} color="#10b981" />
            </TouchableOpacity>
          </View>
          
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {shopByCategories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryCard}
                onPress={() => setActiveCategory(category.id)}
              >
                <LinearGradient
                  colors={category.gradient}
                  style={styles.categoryImageContainer}
                >
                  <Image source={{ uri: category.image }} style={styles.categoryImage} />
                  <View style={styles.categoryOverlay} />
                </LinearGradient>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- Enhanced Products Section --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pinili para sa iyo</Text>
            <TouchableOpacity style={styles.filterButton}>
              <Icon name="tune" size={20} color="#6b7280" />
              <Text style={styles.filterText}>Filter</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.productGrid}>
            {filteredProducts.reduce((rows, item, index) => {
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
                    onPress={() => router.push({ pathname: '/product-details', params: { ...product } })}
                    activeOpacity={0.8}
                  >
                    <View style={styles.productImageContainer}>
                      <Image source={{ uri: product.image }} style={styles.productImage} />
                      
                      {/* Badge */}
                      {product.badge && (
                        <View style={[styles.productBadge, { backgroundColor: badgeColors[product.badge] || '#6b7280' }]}>
                          <Text style={styles.productBadgeText}>{product.badge}</Text>
                        </View>
                      )}
                      
                      {/* Discount */}
                      {product.discount && (
                        <View style={styles.discountBadge}>
                          <Text style={styles.discountText}>-{product.discount}</Text>
                        </View>
                      )}
                      
                      {/* Favorite Button */}
                      <TouchableOpacity
                        style={styles.favoriteButton}
                        onPress={() => toggleFavorite(product.id)}
                      >
                        <Icon
                          name={favorites.has(product.id) ? "favorite" : "favorite-border"}
                          size={20}
                          color={favorites.has(product.id) ? "#ef4444" : "#ffffff"}
                        />
                      </TouchableOpacity>
                      
                      {/* Stock Status */}
                      {!product.inStock && (
                        <View style={styles.outOfStockOverlay}>
                          <Text style={styles.outOfStockText}>Out of Stock</Text>
                        </View>
                      )}
                    </View>
                    
                    <View style={styles.productInfo}>
                      <Text style={styles.productBrand}>{product.brand}</Text>
                      <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
                      <Text style={styles.productDescription} numberOfLines={1}>{product.description}</Text>
                      
                      {/* Rating */}
                      <View style={styles.ratingContainer}>
                        <View style={styles.starsContainer}>
                          {renderStars(product.rating)}
                        </View>
                        <Text style={styles.ratingText}>({product.reviews})</Text>
                      </View>
                      
                      {/* Price */}
                      <View style={styles.priceContainer}>
                        <Text style={styles.currentPrice}>{product.price}</Text>
                        {product.originalPrice && (
                          <Text style={styles.originalPrice}>{product.originalPrice}</Text>
                        )}
                      </View>
                      
                      {/* Add to Cart Button */}
                      <TouchableOpacity
                        style={[styles.addToCartButton, !product.inStock && styles.addToCartButtonDisabled]}
                        disabled={!product.inStock}
                      >
                        <Icon name="add-shopping-cart" size={16} color="#ffffff" />
                        <Text style={styles.addToCartText}>
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* --- Enhanced Bottom Navigation --- */}
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

      {/* --- Enhanced Loan Modal --- */}
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
              <TouchableOpacity onPress={closeLoanModal} style={styles.closeButton}>
                <Icon name="close" size={24} color="#374151" />
              </TouchableOpacity>
            </View>
            
            {loadingLoans ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#10b981" />
                <Text style={styles.loadingText}>Loading loans...</Text>
              </View>
            ) : loans.length === 0 ? (
              <View style={styles.emptyLoansContainer}>
                <Icon name="account-balance-wallet" size={64} color="#d1d5db" />
                <Text style={styles.emptyLoansTitle}>No loans found</Text>
                <Text style={styles.emptyLoansSubtitle}>You don't have any loans yet. Start by applying for one!</Text>
              </View>
            ) : (
              <ScrollView style={styles.loansScrollView}>
                {loans.map((loan, idx) => (
                  <View key={loan.id || idx} style={styles.loanItem}>
                    <View style={styles.loanHeader}>
                      <Text style={styles.loanAmount}>₱{loan.totalPrice != null ? loan.totalPrice : (loan.totalAmount || 'N/A')}</Text>
                      <View style={[styles.loanStatusBadge, { backgroundColor: statusColors[loan.status] || '#888' }]}>
                        <Text style={styles.loanStatus}>{loan.status}</Text>
                      </View>
                    </View>
                    {loan.cropName && (
                      <Text style={styles.loanPurpose}>{loan.cropName}</Text>
                    )}
                    {loan.quantity && (
                      <Text style={styles.loanQuantity}>Quantity: {loan.quantity}</Text>
                    )}
                    <Text style={styles.loanDate}>
                      {loan.createdAt ? new Date(loan.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }) : ''}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            )}
            
            <TouchableOpacity
              style={styles.loanAgainButton}
              onPress={handleLoanAgain}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.loanAgainGradient}
              >
                <Icon name="add" size={20} color="#ffffff" />
                <Text style={styles.loanAgainButtonText}>Apply for New Loan</Text>
              </LinearGradient>
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
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  
  // --- Enhanced Header ---
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: '#6b7280',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  
  // --- Enhanced Search ---
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  voiceSearchButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // --- Quick Actions ---
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  quickActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 8,
  },
  quickActionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // --- Sections ---
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  
  // --- Enhanced Categories ---
  categoriesContainer: {
    paddingRight: 20,
    gap: 16,
  },
  categoryCard: {
    alignItems: 'center',
    width: 90,
  },
  categoryImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  categoryOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
  },
  
  // --- Enhanced Products ---
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  filterText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  productGrid: {
    gap: 16,
  },
  productRow: {
    flexDirection: 'row',
    gap: 16,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  productImageContainer: {
    height: 160,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  productBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ef4444',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  productInfo: {
    padding: 16,
  },
  productBrand: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
    fontWeight: '500',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
    lineHeight: 20,
  },
  productDescription: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#6b7280',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#9ca3af',
    textDecorationLine: 'line-through',
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 6,
  },
  addToCartButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  addToCartText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // --- Bottom Navigation ---
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
  navIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
  
  // --- Enhanced Modal ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingTop: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyLoansContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  emptyLoansTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyLoansSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  loansScrollView: {
    maxHeight: 400,
  },
  loanItem: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  loanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  loanAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  loanStatusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loanStatus: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  loanPurpose: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  loanQuantity: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  loanDate: {
    fontSize: 14,
    color: '#9ca3af',
  },
  loanAgainButton: {
    margin: 24,
    borderRadius: 16,
    overflow: 'hidden',
  },
  loanAgainGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  loanAgainButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CatalogPage;