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
  Modal,
  TextInput,
  Alert,
  Dimensions,
  FlatList,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; 
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

// List of crop names from catalog.jsx
const cropOptions = [
  'Palay',
  'Moon Melon',
  'Kamatis',
  'Talong',
  'Sili',
  'Mais',
];

const ProductDetailsPage = ({ route }) => {
  // Modal state
  const [isLoanModalVisible, setIsLoanModalVisible] = useState(false);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [selectedSize, setSelectedSize] = useState('1 KG');
  const [loanFormData, setLoanFormData] = useState({
    pangalan: '',
    contactNumber: '',
    address: '',
    edad: '',
    trabaho: '',
    kita: '',
    dahilan: '',
  });
  const [quantity, setQuantity] = useState(1);
  const [pricePerUnit, setPricePerUnit] = useState(1500);
  const [totalPrice, setTotalPrice] = useState(1500);
  const [creditLimit, setCreditLimit] = useState(null);

  // Review state
  const [reviews, setReviews] = useState([
    {
      id: 1,
      userName: 'Maria Santos',
      rating: 5,
      comment: 'Napakaganda ng quality ng palay seeds! Mataas ang ani na nakuha namin. Highly recommended!',
      date: '2024-12-15',
      verified: true,
    },
    {
      id: 2,
      userName: 'Juan Dela Cruz',
      rating: 4,
      comment: 'Magandang produkto, pero medyo matagal ang delivery. Overall satisfied pa rin.',
      date: '2024-12-10',
      verified: true,
    },
    {
      id: 3,
      userName: 'Ana Reyes',
      rating: 5,
      comment: 'Sulit na sulit! Malaking tulong sa aming sakahan. Salamat!',
      date: '2024-12-05',
      verified: false,
    },
  ]);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: '',
  });
  const [currentUser, setCurrentUser] = useState({ name: '' });

  // Use product object from route params, fallback to default
  const defaultProduct = {
    id: 1,
    name: 'Buto ng Palay',
    category: 'Pananim',
    images: [
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&h=300&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format',
    ],
    description: 'Ang buto ng palay ay de-kalidad na butil na ginagamit para sa pagtatanim ng masaganang ani ng bigas. Nakakatulong ito sa pagpapaunlad ng kabuhayan ng mga magsasaka at sa pagtugon sa pangangailangan ng pagkain.',
    price: 500.00,
    sizes: ['500g', '1 KG', '2 KG', '5 KG', '10 KG', '25 KG'],
    averageRating: 4.7,
    totalReviews: 23,
  };
  const productData = { ...defaultProduct, ...(route?.params || {}) };

  const handleAddToCart = () => {
    console.log('Added to cart:', productData.name, 'Size:', selectedSize);
    Alert.alert('Idinagdag sa Cart', `${productData.name} (${selectedSize}) ay matagumpay na naidagdag sa inyong cart.`);
  };

  const handleLoan = () => {
    setIsLoanModalVisible(true);
  };

  const handleCloseLoanModal = () => {
    setIsLoanModalVisible(false);
    setLoanFormData({
      pangalan: '',
      contactNumber: '',
      address: '',
      edad: '',
      trabaho: '',
      kita: '',
      dahilan: '',
    });
    setQuantity(1);
    setPricePerUnit(1500);
    setTotalPrice(1500);
    setCreditLimit(null);
  };

  const handleOpenReviewModal = () => {
    setIsReviewModalVisible(true);
  };

  const handleCloseReviewModal = () => {
    setIsReviewModalVisible(false);
    setNewReview({
      rating: 5,
      comment: '',
    });
  };

  const handleSubmitReview = () => {
    if (!newReview.comment.trim()) {
      Alert.alert('Error', 'Pakilagay ang inyong review comment.');
      return;
    }

    const review = {
      id: reviews.length + 1,
      userName: currentUser.name || 'Anonymous User',
      rating: newReview.rating,
      comment: newReview.comment,
      date: new Date().toISOString().split('T')[0],
      verified: true,
    };

    setReviews([review, ...reviews]);
    Alert.alert('Salamat!', 'Ang inyong review ay naipadala na.', [
      {
        text: 'OK',
        onPress: handleCloseReviewModal,
      },
    ]);
  };

  const renderStars = (rating, size = 16, color = '#FFD700') => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Icon
            key={star}
            name={star <= rating ? 'star' : 'star-border'}
            size={size}
            color={color}
          />
        ))}
      </View>
    );
  };

  const renderInteractiveStars = (rating, onPress) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => onPress(star)}>
            <Icon
              name={star <= rating ? 'star' : 'star-border'}
              size={24}
              color="#FFD700"
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderReviewItem = ({ item }) => (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUserInfo}>
          <Text style={styles.reviewUserName}>{item.userName}</Text>
          {item.verified && (
            <Icon name="verified" size={16} color="#87BE42" style={styles.verifiedIcon} />
          )}
        </View>
        <Text style={styles.reviewDate}>{item.date}</Text>
      </View>
      <View style={styles.reviewRating}>
        {renderStars(item.rating, 14)}
      </View>
      <Text style={styles.reviewComment}>{item.comment}</Text>
    </View>
  );

  // Utility functions
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

  useEffect(() => {
    setTotalPrice(quantity * pricePerUnit);
  }, [quantity, pricePerUnit]);

  // Fetch user profile and credit limit
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await getAuthToken();
        const response = await fetch(`${getApiUrl()}/api/profile`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success && data.user) {
          setLoanFormData(prev => ({
            ...prev,
            pangalan: data.user.name || '',
            contactNumber: data.user.contactNumber || '',
            address: data.user.location || '',
          }));
          setCreditLimit(data.user.creditLimit || 5000);
          setCurrentUser({ name: data.user.name || '' });
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmitLoan = async () => {
    if (!loanFormData.pangalan || !loanFormData.contactNumber || !loanFormData.address) {
      Alert.alert('Error', 'Pakiompleto ang lahat ng kinakailangang impormasyon.');
      return;
    }
    if (!productData.name || !quantity) {
      Alert.alert('Error', 'Paki-fill out ang pangalan ng pananim at dami.');
      return;
    }
    if (totalPrice > (creditLimit || 0)) {
      Alert.alert('Loan exceeds your credit limit of ₱' + (creditLimit || 0));
      return;
    }
    try {
      const token = await getAuthToken();
      const response = await fetch(`${getApiUrl()}/api/loans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...loanFormData,
          cropName: productData.name,
          quantity,
          pricePerUnit,
          totalPrice,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        Alert.alert('Error', data.message || 'Nabigo ang loan application.');
        return;
      }
      Alert.alert(
        'Salamat!',
        'Ang inyong loan application ay naipadala na. Makakakuha kayo ng sagot sa loob ng 24 oras.',
        [
          {
            text: 'OK',
            onPress: () => {
              handleCloseLoanModal();
              router.push({
                pathname: '/product-status',
                params: {
                  orderNumber: data.loan?.orderNumber || 'ORD-' + Date.now(),
                  productName: productData.name,
                  quantity: quantity + ' ' + selectedSize,
                  currentStatus: 0, // Start at processing
                  estimatedDelivery: data.loan?.estimatedDelivery || 'Sa loob ng 2-3 araw',
                  deliveryTime: data.loan?.deliveryTime || '2-3 araw',
                  riderPhone: data.loan?.riderPhone || '0917-123-4567',
                  totalPrice,
                  pricePerUnit,
                }
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error('Loan application error:', error);
      Alert.alert('Error', 'May problema sa koneksyon. Pakitiyak na gumagana ang server.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#15803d" />
      {/* Header */}
      <LinearGradient
              colors={['#15803d', '#22c55e']}
              style={styles.header}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Icon name="chevron-left" size={24} color="#fff" />
          <View style={{ width: 40 }} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Detalye</Text>

        <TouchableOpacity style={styles.headerButton}>
          <Icon name="shopping-bag" size={24} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: productData.images[0] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          
          {/* Thumbnail Images */}
          <View style={styles.thumbnailContainer}>
            {productData.images.map((image, index) => (
              <TouchableOpacity key={index} style={styles.thumbnailWrapper}>
                <Image
                  source={{ uri: image }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          {/* Category Name, Name & Price Hierarchy */}
          <Text style={styles.category}>{productData.category}</Text>
          <View style={styles.namePriceContainer}>
            <Text style={styles.productName}>{productData.name}</Text>
            {/* Displaying price per kilo logic here, based on selectedSize or default */}
            <Text style={styles.price}>₱{productData.price.toFixed(0)} / {selectedSize}</Text>
          </View>

          {/* Rating Summary */}
          <View style={styles.ratingContainer}>
            <View style={styles.ratingInfo}>
              {renderStars(productData.averageRating, 18)}
              <Text style={styles.ratingText}>
                {productData.averageRating} ({productData.totalReviews} reviews)
              </Text>
            </View>
            <TouchableOpacity style={styles.writeReviewButton} onPress={handleOpenReviewModal}>
              <Text style={styles.writeReviewText}>Sumulat ng Review</Text>
            </TouchableOpacity>
          </View>

          {/* Quantity */}
          <Text style={styles.sectionTitle}>Bilang</Text>
          <View style={styles.sizesContainer}>
            {productData.sizes.map((size, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.sizeButton,
                  selectedSize === size && styles.selectedSizeButton
                ]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[
                  styles.sizeText,
                  selectedSize === size && styles.selectedSizeText
                ]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{productData.description}</Text>

          {/* Reviews Section */}
          <Text style={styles.sectionTitle}>Mga Review</Text>
          <View style={styles.reviewsContainer}>
            <FlatList
              data={reviews.slice(0, 3)} // Show only first 3 reviews
              renderItem={renderReviewItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.reviewSeparator} />}
            />
            {reviews.length > 3 && (
              <TouchableOpacity style={styles.viewAllReviewsButton}>
                <Text style={styles.viewAllReviewsText}>
                  Tignan ang lahat ng {reviews.length} reviews
                </Text>
                <Icon name="chevron-right" size={16} color="#87BE42" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Bypass Buttons */}
        <View style={styles.bypassButtonsContainer}>
          <TouchableOpacity style={styles.bypassButton} onPress={() => router.push('product-repayment')}>
            <Text style={styles.bypassButtonText}>Go to Product Repayment</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bypassButton} onPress={() => router.push('product-status')}>
            <Text style={styles.bypassButtonText}>Go to Product Status</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.bypassButton} onPress={() => router.push('product-pickup')}>
            <Text style={styles.bypassButtonText}>Go to Product Pickup</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={styles.bottomActions}>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Icon name="shopping-cart" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLoan}
          >
            <LinearGradient
              colors={['#15803d', '#22c55e']}
              style={styles.buyButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.buyButtonText}>I-Loan Ngayon</Text>
            <View style={{ width: 325 }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

      {/* Loan Application Modal */}
      <Modal
        visible={isLoanModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseLoanModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseLoanModal}>
              <Icon name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Aplikasyon sa Loan</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSubtitle}>
              Para sa {productData.name} (₱{pricePerUnit} bawat sako/kilo)
            </Text>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Pangalan *</Text>
                <TextInput
                  style={[styles.textInput, styles.disabledInput]}
                  value={loanFormData.pangalan}
                  onChangeText={(value) => setLoanFormData(prev => ({ ...prev, pangalan: value }))}
                  placeholder="Ilagay ang buong pangalan"
                  placeholderTextColor="#9ca3af"
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Contact Number *</Text>
                <TextInput
                  style={[styles.textInput, styles.disabledInput]}
                  value={loanFormData.contactNumber}
                  onChangeText={(value) => setLoanFormData(prev => ({ ...prev, contactNumber: value }))}
                  placeholder="09XXXXXXXXX"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  maxLength={11}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Address *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea, styles.disabledInput]}
                  value={loanFormData.address}
                  onChangeText={(value) => setLoanFormData(prev => ({ ...prev, address: value }))}
                  placeholder="Ilagay ang kumpletong address"
                  placeholderTextColor="#9ca3af"
                  multiline={true}
                  numberOfLines={3}
                  editable={false}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Edad</Text>
                <TextInput
                  style={styles.textInput}
                  value={loanFormData.edad}
                  onChangeText={(value) => setLoanFormData(prev => ({ ...prev, edad: value }))}
                  placeholder="Ilagay ang edad"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Trabaho</Text>
                <TextInput
                  style={styles.textInput}
                  value={loanFormData.trabaho}
                  onChangeText={(value) => setLoanFormData(prev => ({ ...prev, trabaho: value }))}
                  placeholder="Anong trabaho ninyo?"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Buwanang Kita</Text>
                <TextInput
                  style={styles.textInput}
                  value={loanFormData.kita}
                  onChangeText={(value) => setLoanFormData(prev => ({ ...prev, kita: value }))}
                  placeholder="PHP 0.00"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Dahilan ng Pag-loan</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={loanFormData.dahilan}
                  onChangeText={(value) => setLoanFormData(prev => ({ ...prev, dahilan: value }))}
                  placeholder="Bakit kailangan ninyo ng loan?"
                  placeholderTextColor="#9ca3af"
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Pangalan ng Pananim *</Text>
                {/* Display productData.name as read-only */}
                <Text style={[styles.textInput, styles.disabledInput]}>{productData.name}</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Dami (kilo/sako) *</Text>
                <TextInput
                  style={styles.textInput}
                  value={quantity.toString()}
                  onChangeText={v => setQuantity(Number(v.replace(/[^0-9]/g, '')) || '')}
                  placeholder="1"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Presyo bawat kilo/sako</Text>
                <Text style={styles.textInput} editable={false}>₱{pricePerUnit}</Text>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Kabuuang Halaga</Text>
                <Text style={styles.textInput} editable={false}>₱{totalPrice.toLocaleString()}</Text>
              </View>

              {creditLimit !== null && (
                <Text style={{ color: '#888', marginBottom: 10 }}>
                  Credit Limit: ₱{creditLimit.toLocaleString()}
                </Text>
              )}

              <Text style={styles.requiredNote}>
                * Mga kinakailangang impormasyon
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCloseLoanModal}
            >
              <Text style={styles.cancelButtonText}>Kanselahin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSubmitLoan}
            >
              <LinearGradient
                colors={['#15803d', '#22c55e']}
                style={styles.submitButton}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.submitButtonText}>Isumite</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Review Modal */}
      <Modal
        visible={isReviewModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={handleCloseReviewModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseReviewModal}>
              <Icon name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Magsulat ng Review</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSubtitle}>
              Para sa {productData.name}
            </Text>

            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Rating *</Text>
                <View style={styles.ratingInputContainer}>
                  {renderInteractiveStars(newReview.rating, (rating) => 
                    setNewReview(prev => ({ ...prev, rating }))
                  )}
                  <Text style={styles.ratingLabel}>
                    {newReview.rating === 1 ? 'Napakasama' :
                     newReview.rating === 2 ? 'Masama' :
                     newReview.rating === 3 ? 'Okay lang' :
                     newReview.rating === 4 ? 'Maganda' : 'Napakaganda'}
                  </Text>
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Inyong Review *</Text>
                <TextInput
                  style={[styles.textInput, styles.reviewTextArea]}
                  value={newReview.comment}
                  onChangeText={(value) => setNewReview(prev => ({ ...prev, comment: value }))}
                  placeholder="Isulat ang inyong karanasan sa produktong ito..."
                  placeholderTextColor="#9ca3af"
                  multiline={true}
                  numberOfLines={5}
                />
              </View>

              <Text style={styles.requiredNote}>
                * Mga kinakailangang impormasyon
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleCloseReviewModal}
            >
              <Text style={styles.cancelButtonText}>Kanselahin</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitReview}
            >
              <Text style={styles.submitButtonText}>Ipadala</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  headerButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
},
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  mainImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  thumbnailContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  thumbnailWrapper: {
    width: (width - 60) / 4,
    height: 80,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    paddingHorizontal: 20,
  },
  category: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  namePriceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    flexShrink: 1,
    marginRight: 10,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  ratingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  writeReviewButton: {
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#87BE42',
  },
  writeReviewText: {
    fontSize: 14,
    color: '#87BE42',
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
    marginTop: 15,
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    gap: 10,
  },
  sizeButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#15803d',
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  selectedSizeButton: {
    backgroundColor: '#15803d',
  },
  sizeText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  selectedSizeText: {
    color: '#fff',
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    marginBottom: 20,
  },
  reviewsContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  reviewItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewUserName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 4,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  reviewDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  reviewRating: {
    marginBottom: 8,
  },
  reviewComment: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  reviewSeparator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  viewAllReviewsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#87BE42',
  },
  viewAllReviewsText: {
    fontSize: 14,
    color: '#87BE42',
    fontWeight: '500',
    marginRight: 4,
  },
  ratingInputContainer: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  ratingLabel: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginTop: 8,
  },
  reviewTextArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  bypassButtonsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  bypassButton: {
    backgroundColor: '#ADD8E6',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  bypassButtonText: {
    color: '#00008B',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 100,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  addToCartButton: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buyButton: {
    flex: 1,
    borderRadius: 15,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#15803d',
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 16,
  },
  formContainer: {
    paddingBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#ffffff',
  },
  disabledInput: {
    backgroundColor: '#f9f9f9',
    color: '#999',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  requiredNote: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 16,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  submitButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default ProductDetailsPage;