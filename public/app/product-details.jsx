import React, { useState } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

const ProductDetailsPage = ({ route }) => {
  // Modal state
  const [isLoanModalVisible, setIsLoanModalVisible] = useState(false);
  const [loanFormData, setLoanFormData] = useState({
    pangalan: '',
    contactNumber: '',
    address: '',
    edad: '',
    trabaho: '',
    kita: '',
    dahilan: '',
  });

  // You can get product data from route params
  // const { productId, productName } = route?.params || {};
  
  // For now, using static data - you can make this dynamic based on the selected product
  const productData = {
    id: 1,
    name: 'Binhi ng palay',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format',
    description: 'Ang binhi ng palay ay de-kalidad na butil na ginagamit para sa pagtatanim ng masaganang ani ng bigas. Sa paggamit ng maaasahang binhi, nakatutulong ito sa pagpapaunlad ng kabuhayan ng mga magsasaka at sa pagtugon sa pangangailangan ng pagkain sa bawat tahanan.',
    price: 50.00,
    priceUnit: 'KG',
    bulkPrice: 100.00,
    bulkUnit: 'KG',
    bulkLabel: 'Benta ng palay ngayon'
  };

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Added to cart:', productData.name);
  };

  const handleLoan = () => {
    setIsLoanModalVisible(true);
  };

  const handleCloseLoanModal = () => {
    setIsLoanModalVisible(false);
    // Reset form data
    setLoanFormData({
      pangalan: '',
      contactNumber: '',
      address: '',
      edad: '',
      trabaho: '',
      kita: '',
      dahilan: '',
    });
  };

  const handleSubmitLoan = () => {
    // Validate required fields
    if (!loanFormData.pangalan || !loanFormData.contactNumber || !loanFormData.address) {
      Alert.alert('Error', 'Pakiompleto ang lahat ng kinakailangang impormasyon.');
      return;
    }

    // Process loan application
    console.log('Loan application submitted:', loanFormData);
    Alert.alert(
      'Salamat!',
      'Ang inyong loan application ay naipadala na. Makakakuha kayo ng sagot sa loob ng 24 oras.',
      [
        {
          text: 'OK',
          onPress: () => handleCloseLoanModal(),
        },
      ]
    );
  };

  const updateFormData = (field, value) => {
    setLoanFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleHowToPlant = () => {
    // Navigate to planting guide
    console.log('How to plant:', productData.name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="chevron-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Detalye</Text>
        
        <TouchableOpacity style={styles.cartButton}>
          <Icon name="shopping-bag" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: productData.image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{productData.name}</Text>
          
          <Text style={styles.productDescription}>
            {productData.description}
          </Text>

          {/* Price Section */}
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>PHP {productData.price.toFixed(2)} / {productData.priceUnit}</Text>
          </View>

          {/* Bulk Price Button */}
          <TouchableOpacity style={styles.bulkPriceButton}>
            <Text style={styles.bulkPriceText}>{productData.bulkLabel}</Text>
          </TouchableOpacity>
          
          <Text style={styles.bulkPrice}>PHP {productData.bulkPrice.toFixed(2)} / {productData.bulkUnit}</Text>

          {/* How to Plant Link */}
          <TouchableOpacity onPress={handleHowToPlant} style={styles.plantingGuideContainer}>
            <Text style={styles.plantingGuideText}>
              Paano magtanim ng <Text style={styles.plantingGuideLink}>palay?</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Idagdag sa Cart</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.loanButton}
          onPress={handleLoan}
        >
          <Text style={styles.loanText}>I-Loan</Text>
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
            <Text style={styles.modalTitle}>Loan Application</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalSubtitle}>
              Para sa {productData.name}
            </Text>

            <View style={styles.formContainer}>
              {/* Full Name */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Pangalan *</Text>
                <TextInput
                  style={styles.textInput}
                  value={loanFormData.pangalan}
                  onChangeText={(value) => updateFormData('pangalan', value)}
                  placeholder="Ilagay ang buong pangalan"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Contact Number */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Contact Number *</Text>
                <TextInput
                  style={styles.textInput}
                  value={loanFormData.contactNumber}
                  onChangeText={(value) => updateFormData('contactNumber', value)}
                  placeholder="09XXXXXXXXX"
                  placeholderTextColor="#9ca3af"
                  keyboardType="phone-pad"
                  maxLength={11}
                />
              </View>

              {/* Address */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Address *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={loanFormData.address}
                  onChangeText={(value) => updateFormData('address', value)}
                  placeholder="Ilagay ang kumpletong address"
                  placeholderTextColor="#9ca3af"
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              {/* Age */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Edad</Text>
                <TextInput
                  style={styles.textInput}
                  value={loanFormData.edad}
                  onChangeText={(value) => updateFormData('edad', value)}
                  placeholder="Ilagay ang edad"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>

              {/* Occupation */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Trabaho</Text>
                <TextInput
                  style={styles.textInput}
                  value={loanFormData.trabaho}
                  onChangeText={(value) => updateFormData('trabaho', value)}
                  placeholder="Anong trabaho ninyo?"
                  placeholderTextColor="#9ca3af"
                />
              </View>

              {/* Monthly Income */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Buwanang Kita</Text>
                <TextInput
                  style={styles.textInput}
                  value={loanFormData.kita}
                  onChangeText={(value) => updateFormData('kita', value)}
                  placeholder="PHP 0.00"
                  placeholderTextColor="#9ca3af"
                  keyboardType="numeric"
                />
              </View>

              {/* Reason for Loan */}
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Dahilan ng Pag-loan</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={loanFormData.dahilan}
                  onChangeText={(value) => updateFormData('dahilan', value)}
                  placeholder="Bakit kailangan ninyo ng loan?"
                  placeholderTextColor="#9ca3af"
                  multiline={true}
                  numberOfLines={3}
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
              onPress={handleCloseLoanModal}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.submitButton}
              onPress={handleSubmitLoan}
            >
              <Text style={styles.submitButtonText}>I-submit</Text>
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
    backgroundColor: '#f1f5f9',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  backButton: {
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  cartButton: {
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
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  productInfo: {
    paddingHorizontal: 20,
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803d',
    textAlign: 'center',
    marginBottom: 16,
  },
  productDescription: {
    fontSize: 14,
    color: '#87BE42',
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 8,
  },
  priceContainer: {
    borderWidth: 2,
    borderColor: '#87BE42',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  priceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15803d',
    textAlign: 'center',
  },
  bulkPriceButton: {
    backgroundColor: '#87BE42',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  bulkPriceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
  bulkPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15803d',
    textAlign: 'center',
    marginBottom: 32,
  },
  plantingGuideContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  plantingGuideText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  plantingGuideLink: {
    color: '#15803d',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  bottomSpacer: {
    height: 120,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    backgroundColor: '#f1f5f9',
    gap: 12,
  },
  addToCartButton: {
    flex: 1,
    borderWidth: 2,
    borderColor: '#87BE42',
    borderRadius: 16,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  addToCartText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803d',
    textAlign: 'center',
  },
  loanButton: {
    flex: 1,
    backgroundColor: '#87BE42',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  loanText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
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
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#ffffff',
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
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingVertical: 12,
    backgroundColor: '#ffffff',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    textAlign: 'center',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#87BE42',
    borderRadius: 12,
    paddingVertical: 12,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default ProductDetailsPage;