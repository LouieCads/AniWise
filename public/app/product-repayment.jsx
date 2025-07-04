import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

const SimpleRepaymentPage = ({ route }) => {
  // Loan information
  const [loanInfo] = useState({
    amount: 2500,
    farmerName: "Ka Juan",
    cropType: "Palay",
    dueDate: "Hulyo 15, 2025",
    daysLeft: 26
  });

  const [chosenOption, setChosenOption] = useState(null);

  // Payment choices - made simple
  const paymentChoices = [
    {
      id: 'now',
      title: 'Bayad na ngayon! 🌟',
      description: 'Magbayad na para sa malaking discount',
      payAmount: 1875, // 25% discount
      savings: 625,
      icon: '🎉',
      color: '#22c55e',
      isRecommended: true
    },
    {
      id: 'ontime',
      title: 'Sa tamang panahon 👍',
      description: 'Bayad sa due date, may discount pa rin',
      payAmount: 2125, // 15% discount
      savings: 375,
      icon: '✅',
      color: '#87BE42',
      isRecommended: false
    },
    {
      id: 'regular',
      title: 'Regular na bayad 💪',
      description: 'Bayad ng buong halaga',
      payAmount: 2500,
      savings: 0,
      icon: '💰',
      color: '#6b7280',
      isRecommended: false
    }
  ];

  const selectPayment = (choice) => {
    setChosenOption(choice);
  };

  const confirmPayment = () => {
    if (!chosenOption) {
      Alert.alert('Opsss!', 'Pumili muna ng kung paano magbabayad.');
      return;
    }

    Alert.alert(
      'Sigurado ka ba?',
      `Magbabayad ka ng ₱${chosenOption.payAmount.toLocaleString()}?`,
      [
        { text: 'Hindi pa', style: 'cancel' },
        { 
          text: 'Oo, magbayad na!', 
          onPress: () => processPayment() 
        }
      ]
    );
  };

  const processPayment = () => {
    Alert.alert(
      'Salamat!',
      'Natatanggap na namin ang bayad mo. Makakakuha ka ng text message na confirmation.',
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#15803d" />
      
      {/* Simple Header */}
        <LinearGradient
                colors={['#15803d', '#22c55e']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
        >
        <TouchableOpacity 
          style={styles.backBtn}
          onPress={() => router.back()}
        >
          <Icon name="chevron-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.headerText}>Bayad ng Utang</Text>
        <View style={{width: 40}} />
        </LinearGradient>

      <ScrollView style={styles.content}>
        {/* Friendly Greeting */}
        <View style={styles.greetingBox}>
          <Text style={styles.greeting}>
            Kumusta {loanInfo.farmerName}! 👋
          </Text>
          <Text style={styles.greetingMsg}>
            Panahon na para magbayad ng utang para sa {loanInfo.cropType}
          </Text>
        </View>

        {/* Simple Loan Details */}
        <View style={styles.loanBox}>
          <Text style={styles.loanTitle}>Detalye ng Utang</Text>
          
          <View style={styles.loanRow}>
            <Text style={styles.loanLabel}>Utang:</Text>
            <Text style={styles.loanAmount}>₱{loanInfo.amount.toLocaleString()}</Text>
          </View>
          
          <View style={styles.loanRow}>
            <Text style={styles.loanLabel}>Deadline:</Text>
            <Text style={styles.loanValue}>{loanInfo.dueDate}</Text>
          </View>
          
          <View style={styles.timeLeft}>
            <Icon name="schedule" size={16} color="#3b82f6" />
            <Text style={styles.timeLeftText}>
              {loanInfo.daysLeft} araw na lang
            </Text>
          </View>
        </View>

        {/* Payment Options */}
        <View style={styles.optionsSection}>
          <Text style={styles.optionsTitle}>Paano mo gustong magbayad? 💰</Text>
          <Text style={styles.optionsNote}>
            Mas maaga, mas malaki ang tipid!
          </Text>

          {paymentChoices.map((choice) => (
            <TouchableOpacity
              key={choice.id}
              style={[
                styles.choiceBox,
                chosenOption?.id === choice.id && styles.chosenBox
              ]}
              onPress={() => selectPayment(choice)}
            >
              {choice.isRecommended && (
                <View style={styles.recommendedTag}>
                  <Text style={styles.recommendedText}>Pinakamabuti!</Text>
                </View>
              )}
              
              <View style={styles.choiceTop}>
                <Text style={styles.choiceIcon}>{choice.icon}</Text>
                <View style={styles.choiceInfo}>
                  <Text style={[styles.choiceTitle, {color: choice.color}]}>
                    {choice.title}
                  </Text>
                  <Text style={styles.choiceDesc}>{choice.description}</Text>
                </View>
              </View>

              <View style={styles.amountSection}>
                <Text style={styles.amountLabel}>Babayaran mo:</Text>
                <Text style={[styles.amountText, {color: choice.color}]}>
                  ₱{choice.payAmount.toLocaleString()}
                </Text>
              </View>

              {choice.savings > 0 && (
                <View style={styles.savingsSection}>
                  <Text style={styles.savingsLabel}>Matitipid mo:</Text>
                  <Text style={styles.savingsText}>
                    ₱{choice.savings.toLocaleString()}
                  </Text>
                </View>
              )}

              {chosenOption?.id === choice.id && (
                <View style={styles.chosenMark}>
                  <Icon name="check-circle" size={20} color="#22c55e" />
                  <Text style={styles.chosenText}>Napili mo</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Encouragement */}
        <View style={styles.encourageBox}>
          <Text style={styles.encourageTitle}>🌾 Magaling!</Text>
          <Text style={styles.encourageText}>
            Ang pagbabayad ng utang ay tumutulong sa inyong negosyo. 
            Salamat sa tiwala ninyo sa amin!
          </Text>
        </View>

        {/* Big Pay Button */}
        <TouchableOpacity 
          style={[
            styles.payBtn,
            !chosenOption && styles.payBtnDisabled
          ]}
          onPress={confirmPayment}
          disabled={!chosenOption}
        >
          <Icon name="payment" size={24} color="#ffffff" />
          <Text style={styles.payBtnText}>
            {chosenOption 
              ? `Magbayad ng ₱${chosenOption.payAmount.toLocaleString()}`
              : 'Pumili muna ng paraan'
            }
          </Text>
        </TouchableOpacity>

        {/* Help */}
        <View style={styles.helpSection}>
          <Text style={styles.helpText}>May tanong?</Text>
          <TouchableOpacity style={styles.helpBtn}>
            <Icon name="phone" size={18} color="#87BE42" />
            <Text style={styles.helpBtnText}>Tumawag sa amin</Text>
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
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  greetingBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 8,
  },
  greetingMsg: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  loanBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  loanTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 16,
    textAlign: 'center',
  },
  loanRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  loanLabel: {
    fontSize: 16,
    color: '#64748b',
  },
  loanAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  loanValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  timeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dbeafe',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  timeLeftText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    marginLeft: 4,
  },
  optionsSection: {
    marginBottom: 16,
  },
  optionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 4,
  },
  optionsNote: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 16,
  },
  choiceBox: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e2e8f0',
    position: 'relative',
  },
  chosenBox: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  recommendedTag: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recommendedText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  choiceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  choiceIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  choiceInfo: {
    flex: 1,
  },
  choiceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  choiceDesc: {
    fontSize: 14,
    color: '#64748b',
  },
  amountSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 16,
    color: '#1e293b',
  },
  amountText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  savingsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  savingsLabel: {
    fontSize: 14,
    color: '#64748b',
  },
  savingsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#22c55e',
  },
  chosenMark: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    padding: 8,
    backgroundColor: '#dcfce7',
    borderRadius: 8,
  },
  chosenText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#22c55e',
    marginLeft: 4,
  },
  encourageBox: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  encourageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#92400e',
    marginBottom: 8,
  },
  encourageText: {
    fontSize: 14,
    color: '#a16207',
    textAlign: 'center',
    lineHeight: 20,
  },
  payBtn: {
    backgroundColor: '#87BE42',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  payBtnDisabled: {
    backgroundColor: '#d1d5db',
  },
  payBtnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  helpSection: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  helpText: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 8,
  },
  helpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f0f9ff',
  },
  helpBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#87BE42',
    marginLeft: 4,
  },
});

export default SimpleRepaymentPage;