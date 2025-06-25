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
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

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

  // Utility functions
  const getApiUrl = () => {
    if (__DEV__) {
      return 'http://192.168.254.169:3000';
    } else {
      return 'https://192.168.254.169:3000';
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
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Icon name="chevron-left" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerButton}>
          <Icon name="shopping-bag" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

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
          style={styles.buyButton}
          onPress={handleLoan}
        >
          <Text style={styles.buyButtonText}>I-Loan Ngayon</Text>
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
              style={styles.submitButton}
              onPress={handleSubmitLoan}
            >
              <Text style={styles.submitButtonText}>Isumite</Text>
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
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerButton: {
    width: 48,
    height: 48,
    backgroundColor: '#87BE42',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    marginBottom: 10, // Adjusted for hierarchy
  },
  productName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    flexShrink: 1, // Allow text to wrap
    marginRight: 10, // Space between name and price
  },
  price: {
    fontSize: 24, // Adjusted font size for side-by-side
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right', // Align price to the right
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 15,
    marginTop: 15, // Added some top margin for sections
  },
  sizesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20, // Adjusted for hierarchy
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
    marginBottom: 20, // Adjusted for new bypass buttons
  },
  bypassButtonsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  bypassButton: {
    backgroundColor: '#ADD8E6', // Light blue for bypass buttons
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10, // Space between bypass buttons
  },
  bypassButtonText: {
    color: '#00008B', // Dark blue text
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 100,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 15,
  },
  addToCartButton: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  buyButton: {
    flex: 1,
    backgroundColor: '#87BE42',
    borderRadius: 25,
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
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#87BE42',
    borderRadius: 8,
    paddingVertical: 12,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  statusContainer: {
    margin: 16,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default ProductDetailsPage;