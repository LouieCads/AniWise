import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const OrderStatusTracker = ({ route }) => {
  const params = route?.params || {};
  const [orderData] = useState({
    orderNumber: params.orderNumber || "ORD-2025-001",
    productName: params.productName || "Binhi ng Palay",
    quantity: params.quantity || "5 Sako",
    currentStatus: typeof params.currentStatus === 'number' ? params.currentStatus : 2, // Changed to 2 for delivered
    estimatedDelivery: params.estimatedDelivery || "Hunyo 22, 2025",
    deliveryTime: params.deliveryTime || "2-3 araw",
    riderPhone: params.riderPhone || "0917-123-4567",
    riderName: params.riderName || "Juan dela Cruz",
    totalPrice: params.totalPrice || "₱2,500",
    pricePerUnit: params.pricePerUnit || "₱500/Sako",
    orderDate: params.orderDate || "Hunyo 20, 2025",
    deliveryAddress: params.deliveryAddress || "123 Barangay Maligaya, Quezon City"
  });

  const statusSteps = [
    {
      id: 0,
      title: "Pinag-hahanda",
      subtitle: "Inihahanda ang inyong order",
      icon: "inventory-2",
      color: "#87BE42",
      time: "9:30 AM"
    },
    {
      id: 1,
      title: "Ipapadala na",
      subtitle: "Nasa daan na papunta sa inyo",
      icon: "local-shipping",
      color: "#87BE42",
      time: "11:45 AM"
    },
    {
      id: 2,
      title: "Nadeliver na",
      subtitle: "Natanggap na ninyo ang order",
      icon: "home",
      color: "#87BE42",
      time: "2:15 PM" // Updated to show actual delivery time
    }
  ];

  const getStatusColor = (stepId) => {
    if (stepId < orderData.currentStatus) return "#15803d";
    if (stepId === orderData.currentStatus) return "#87BE42";
    return "#d1d5db";
  };

  const getIconColor = (stepId) => {
    if (stepId <= orderData.currentStatus) return "#ffffff";
    return "#9ca3af";
  };

  const getTextColor = (stepId) => {
    if (stepId <= orderData.currentStatus) return "#15803d";
    return "#9ca3af";
  };

  const handleCallRider = () => {
    console.log('Calling rider:', orderData.riderPhone);
  };

  const handleReorder = () => {
    router.push('/catalog');
  };

  const handleCallSupport = () => {
    console.log('Calling support');
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
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="chevron-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Status ng Order</Text>
        
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Header Card */}
        <View style={styles.orderCard}>
          <LinearGradient
            colors={['#15803d', '#22c55e']}
            style={styles.orderCardHeader}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <View style={styles.orderHeaderContent}>
              <View>
                <Text style={styles.orderLabel}>Order Number</Text>
                <Text style={styles.orderNumber}>{orderData.orderNumber}</Text>
              </View>
              <View style={styles.orderDateBadge}>
                <Text style={styles.orderDate}>{orderData.orderDate}</Text>
              </View>
            </View>
          </LinearGradient>
          
          <View style={styles.productSection}>
            <View style={styles.productInfo}>
              <View style={styles.productIcon}>
                <Icon name="inventory-2" size={32} color="#15803d" />
              </View>
              <View style={styles.productDetails}>
                <Text style={styles.productName}>{orderData.productName}</Text>
                <Text style={styles.productQuantity}>{orderData.quantity}</Text>
                <Text style={styles.productPrice}>{orderData.totalPrice}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Delivery Success Banner */}
        {/* <View style={styles.successBanner}>
          <View style={styles.successIcon}>
            <Icon name="check-circle" size={32} color="#22c55e" />
          </View>
          <View style={styles.successContent}>
            <Text style={styles.successTitle}>Order Delivered Successfully!</Text>
            <Text style={styles.successSubtitle}>Salamat sa inyong pagbili</Text>
          </View>
        </View> */}

        {/* Status Progress Card */}
        <View style={styles.statusCard}>
          <Text style={styles.sectionTitle}>Tracking ng Order</Text>
          
          <View style={styles.statusContainer}>
            {statusSteps.map((step, index) => {
              const isCompleted = step.id <= orderData.currentStatus;
              const isCurrent = step.id === orderData.currentStatus;
              
              return (
                <View key={step.id} style={styles.statusStep}>
                  <View style={styles.statusRow}>
                    {/* Icon and Line Container */}
                    <View style={styles.statusIconContainer}>
                      <View 
                        style={[
                          styles.statusIcon,
                          { backgroundColor: getStatusColor(step.id) }
                        ]}
                      >
                        <Icon name="check-circle" size={24} color="#ffffff" />
                      </View>
                      
                      {/* Connecting Line */}
                      {index < statusSteps.length - 1 && (
                        <View 
                          style={[
                            styles.connectingLine,
                            { 
                              backgroundColor: step.id < orderData.currentStatus ? "#15803d" : "#e5e7eb" 
                            }
                          ]}
                        />
                      )}
                    </View>

                    {/* Text Content */}
                    <View style={styles.statusContent}>
                      <View style={styles.statusHeader}>
                        <Text 
                          style={[
                            styles.statusTitle,
                            { color: getTextColor(step.id) }
                          ]}
                        >
                          {step.title}
                        </Text>
                        <Text 
                          style={[
                            styles.statusTime,
                            { color: getTextColor(step.id) }
                          ]}
                        >
                          {step.time}
                        </Text>
                      </View>
                      
                      <Text 
                        style={[
                          styles.statusSubtitle,
                          { color: getTextColor(step.id) }
                        ]}
                      >
                        {step.subtitle}
                      </Text>
                      
                      {/* Current status indicator for delivered */}
                      {isCurrent && (
                        <View style={styles.currentStatusContainer}>
                          <View style={styles.completedDot} />
                          <Text style={styles.completedStatusText}>
                            Tapos na!
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Delivery Information Card */}
        <View style={styles.deliveryCard}>
          <View style={styles.deliveryHeader}>
            <View style={styles.deliveryIcon}>
              <Icon name="done" size={24} color="#22c55e" />
            </View>
            <View style={styles.deliveryInfo}>
              <Text style={styles.deliveryTitle}>Delivery Status</Text>
              <Text style={styles.deliveryDate}>Nadeliver na po!</Text>
              <Text style={styles.deliveryTime}>Natanggap noong {statusSteps[2].time}</Text>
            </View>
          </View>
        </View>

        {/* Delivery Address Card */}
        <View style={styles.addressCard}>
          <View style={styles.addressHeader}>
            <View style={styles.addressIcon}>
              <Icon name="location-on" size={24} color="#8b5cf6" />
            </View>
            <View style={styles.addressInfo}>
              <Text style={styles.addressTitle}>Delivery Address</Text>
              <Text style={styles.addressText}>{orderData.deliveryAddress}</Text>
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleReorder}
          >
            <LinearGradient
              colors={['#15803d', '#22c55e']}
              style={styles.primaryButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Icon name="refresh" size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Mag-order Ulit</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.helpText}>May tanong? Tawagan ninyo kami</Text>
          <TouchableOpacity onPress={handleCallSupport}>
            <Text style={styles.helpPhone}>{orderData.riderPhone}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  orderCardHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  orderHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  orderNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderDateBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  orderDate: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  productSection: {
    padding: 20,
  },
  productInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#dcfce7',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803d',
  },
  successBanner: {
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  successIcon: {
    marginRight: 16,
  },
  successContent: {
    flex: 1,
  },
  successTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 4,
  },
  successSubtitle: {
    fontSize: 14,
    color: '#22c55e',
  },
  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  statusContainer: {
    paddingLeft: 4,
  },
  statusStep: {
    marginBottom: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  statusIconContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  connectingLine: {
    width: 2,
    height: 32,
    marginTop: 8,
  },
  statusContent: {
    flex: 1,
    paddingTop: 4,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusTime: {
    fontSize: 12,
    fontWeight: '500',
  },
  statusSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  currentStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  completedDot: {
    width: 8,
    height: 8,
    backgroundColor: '#22c55e',
    borderRadius: 4,
    marginRight: 8,
  },
  completedStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803d',
  },
  deliveryCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
  },
  deliveryHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  deliveryIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  deliveryInfo: {
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 8,
  },
  deliveryDate: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#22c55e',
  },
  addressCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#f3e8ff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addressInfo: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  actionContainer: {
    marginBottom: 24,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  helpSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
    textAlign: 'center',
  },
  helpPhone: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803d',
    textDecorationLine: 'underline',
  },
});

export default OrderStatusTracker;