import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

const OrderStatusTracker = ({ route }) => {
  // You can get order data from route params
  // const { orderId } = route?.params || {};
  
  // Sample order data - make this dynamic based on actual order
  const [orderData] = useState({
    orderNumber: "ORD-2025-001",
    productName: "Binhi ng Palay",
    quantity: "5 KG",
    currentStatus: 1, // 0: processing, 1: shipping, 2: delivered
    estimatedDelivery: "Hunyo 22, 2025",
    deliveryTime: "2-3 araw",
    riderPhone: "0917-123-4567"
  });

  const statusSteps = [
    {
      id: 0,
      title: "Pinag-hahanda",
      subtitle: "Inihahanda ang inyong order",
      icon: "schedule",
      color: "#87BE42"
    },
    {
      id: 1,
      title: "Ipapadala na",
      subtitle: "Nasa daan na papunta sa inyo",
      icon: "local-shipping",
      color: "#87BE42"
    },
    {
      id: 2,
      title: "Nadeliver na",
      subtitle: "Natanggap na ninyo ang order",
      icon: "home",
      color: "#87BE42"
    }
  ];

  const getStatusColor = (stepId) => {
    if (stepId < orderData.currentStatus) return "#15803d"; // completed - darker green
    if (stepId === orderData.currentStatus) return "#87BE42"; // current - main green
    return "#d1d5db"; // pending - gray
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
    // Add call functionality here
    console.log('Calling rider:', orderData.riderPhone);
  };

  const handleReorder = () => {
    // Navigate back to product or add to cart
    console.log('Reordering product');
  };

  const handleCallSupport = () => {
    // Add call support functionality
    console.log('Calling support');
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
        
        <Text style={styles.headerTitle}>Status ng Order</Text>
        
        <View style={{ width: 48 }} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Order Header */}
        <View style={styles.orderHeader}>
          <Text style={styles.orderTitle}>Order #{orderData.orderNumber}</Text>
        </View>

        {/* Product Info */}
        <View style={styles.productInfoCard}>
          <View style={styles.productInfo}>
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{orderData.productName}</Text>
              <Text style={styles.productQuantity}>{orderData.quantity}</Text>
            </View>
            <View style={styles.productIcon}>
              <Icon name="inventory" size={32} color="#15803d" />
            </View>
          </View>
        </View>

        {/* Status Progress */}
        <View style={styles.statusContainer}>
          {statusSteps.map((step, index) => {
            const isCompleted = step.id < orderData.currentStatus;
            const isCurrent = step.id === orderData.currentStatus;
            
            return (
              <View key={step.id} style={styles.statusStep}>
                <View style={styles.statusRow}>
                  {/* Icon Circle */}
                  <View style={styles.statusIconContainer}>
                    <View 
                      style={[
                        styles.statusIcon,
                        { backgroundColor: getStatusColor(step.id) }
                      ]}
                    >
                      {isCompleted ? (
                        <Icon name="check-circle" size={24} color="#ffffff" />
                      ) : (
                        <Icon name={step.icon} size={20} color={getIconColor(step.id)} />
                      )}
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
                  <View style={styles.statusTextContainer}>
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
                        styles.statusSubtitle,
                        { color: getTextColor(step.id) }
                      ]}
                    >
                      {step.subtitle}
                    </Text>
                    
                    {/* Current status indicator */}
                    {isCurrent && (
                      <View style={styles.currentStatusBadge}>
                        <Text style={styles.currentStatusText}>
                          Kasalukuyang Status
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Delivery Information */}
        <View style={styles.deliveryInfoCard}>
          <View style={styles.deliveryInfo}>
            <Icon name="schedule" size={20} color="#2563eb" />
            <View style={styles.deliveryText}>
              <Text style={styles.deliveryTitle}>Kailan kayo makakatanggap?</Text>
              {orderData.currentStatus < 2 ? (
                <>
                  <Text style={styles.deliveryDate}>{orderData.estimatedDelivery}</Text>
                  <Text style={styles.deliveryTime}>({orderData.deliveryTime} mula ngayon)</Text>
                </>
              ) : (
                <Text style={styles.deliveryDate}>Nadeliver na po!</Text>
              )}
            </View>
          </View>
        </View>

        {/* Action Button */}
        <View style={styles.actionContainer}>
                        {orderData.currentStatus < 2 ? (
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleCallRider}
            >
              <Icon name="phone" size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Tawagan ang Rider</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleReorder}
            >
              <Icon name="refresh" size={20} color="#ffffff" />
              <Text style={styles.primaryButtonText}>Mag-order Ulit</Text>
            </TouchableOpacity>
          )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  orderHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  orderTitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  productInfoCard: {
    backgroundColor: '#f0f9ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#87BE42',
  },
  productInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    color: '#87BE42',
    fontWeight: '500',
  },
  productIcon: {
    width: 60,
    height: 60,
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusContainer: {
    marginBottom: 20,
  },
  statusStep: {
    marginBottom: 16,
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
  },
  connectingLine: {
    width: 2,
    height: 24,
    marginTop: 8,
  },
  statusTextContainer: {
    flex: 1,
    paddingTop: 4,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  currentStatusBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  currentStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803d',
  },
  deliveryInfoCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  deliveryInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  deliveryText: {
    marginLeft: 12,
    flex: 1,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 4,
  },
  deliveryDate: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#1d4ed8',
    marginBottom: 2,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#3b82f6',
  },
  actionContainer: {
    marginBottom: 24,
  },
  primaryButton: {
    backgroundColor: '#87BE42',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  helpSection: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  helpText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
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