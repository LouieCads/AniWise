import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Dimensions,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));

  const onboardingSteps = [
    {
      title: "Maligayang pagdating sa AniWise!",
      message: "Ako si Tatay Lito. Tutulong ako sa inyo na gamitin ang app na ito para sa inyong bukid.",
      icon: "👋",
      color: "#22c55e"
    },
    {
      title: "Ano ang Score?",
      message: "Yung score ay parang grade sa school. Kapag mataas ang score mo, ibig sabihin magaling ka mag-alaga ng lupa.",
      tip: "Mataas na score = Mas malaking tulong sa pera!",
      icon: "⭐",
      color: "#f59e0b"
    },
    {
      title: "Bakit importante ang lupa?",
      message: "Sinusukat namin kung basa ba ang lupa, kung mainit ba, at kung okay ba ang hangin. Healthy na lupa = Healthy na tanim!",
      tip: "Makikita mo dito ang lagay ng lupa araw-araw.",
      icon: "🌱",
      color: "#10b981"
    },
    {
      title: "Paano makakakuha ng pera?",
      message: "Kapag maganda ang score mo, pwede kang humiram ng pera. Gamitin mo para sa binhi, pataba, o iba pang kailangan.",
      tip: "Walang alalahanin - ipapakita namin kung magkano.",
      icon: "💰",
      color: "#ef4444"
    },
    {
      title: "Ano meron sa app?",
      message: "May weather para sa panahon, calendar para sa schedule, at journal para sa mga note mo!",
      icon: "📱",
      color: "#8b5cf6"
    },
    {
      title: "Handa na ba tayo?",
      message: "Simulan na natin! Samahan mo ako sa paggamit ng app. Kapag may tanong ka, hanapin mo lang ako! 😊",
      icon: "🎉",
      color: "#22c55e"
    }
  ];

  useEffect(() => {
    animateStep();
  }, [currentStep]);

  const animateStep = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      router.replace('/dashboard');
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipOnboarding = () => {
    router.replace('/dashboard');
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#16a34a" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.skipButton} onPress={skipOnboarding}>
          <Text style={styles.skipText}>Laktawan</Text>
        </TouchableOpacity>
        
        {/* Simple Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentStep + 1} sa {onboardingSteps.length}
          </Text>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.stepContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {/* Big Icon */}
          <View style={[styles.iconContainer, { backgroundColor: currentStepData.color + '20' }]}>
            <Text style={styles.stepIcon}>{currentStepData.icon}</Text>
          </View>

          {/* Tatay Lito */}
          <View style={styles.mascotContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1710563849800-73af5bfc9f36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              }}
              style={styles.mascotImage}
            />
            <Text style={styles.mascotName}>Tatay Lito</Text>
          </View>

          {/* Message */}
          <View style={styles.messageContainer}>
            <Text style={styles.stepTitle}>{currentStepData.title}</Text>
            <Text style={styles.stepMessage}>{currentStepData.message}</Text>
            
            {currentStepData.tip && (
              <View style={styles.tipContainer}>
                <Icon name="lightbulb" size={18} color="#f59e0b" />
                <Text style={styles.tipText}>{currentStepData.tip}</Text>
              </View>
            )}
          </View>

          {/* Show simple features for step 4 */}
          {currentStep === 4 && (
            <View style={styles.featuresContainer}>
              <Text style={styles.featuresTitle}>Mga makikita mo dito:</Text>
              <View style={styles.featuresGrid}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>🌤️</Text>
                  <Text style={styles.featureText}>Panahon</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>📅</Text>
                  <Text style={styles.featureText}>Calendar</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>💰</Text>
                  <Text style={styles.featureText}>Pera</Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>📝</Text>
                  <Text style={styles.featureText}>Notes</Text>
                </View>
              </View>
            </View>
          )}
        </Animated.View>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.backButton, currentStep === 0 && styles.buttonDisabled]}
          onPress={prevStep}
          disabled={currentStep === 0}
        >
          <Icon name="arrow-back" size={20} color={currentStep === 0 ? "#cbd5e1" : "#6b7280"} />
          <Text style={[styles.backButtonText, currentStep === 0 && styles.buttonTextDisabled]}>
            Bumalik
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.nextButton, { backgroundColor: currentStepData.color }]}
          onPress={nextStep}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === onboardingSteps.length - 1 ? 'Simulan na! 🚀' : 'Susunod'}
          </Text>
          <Icon name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  skipButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
  },
  skipText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  progressText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBar: {
    width: width * 0.6,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  stepContainer: {
    flex: 1,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepIcon: {
    fontSize: 50,
  },
  mascotContainer: {
    alignItems: 'center',
    marginBottom: 25,
  },
  mascotImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  mascotName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  messageContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 10,
    textAlign: 'center',
  },
  stepMessage: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    padding: 15,
    borderRadius: 15,
    marginTop: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e',
    marginLeft: 10,
    fontWeight: '500',
  },
  featuresContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 15,
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: '#f8fafc',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 10,
  },
  featureIcon: {
    fontSize: 30,
    marginBottom: 5,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 15,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginLeft: 5,
  },
  buttonTextDisabled: {
    color: '#cbd5e1',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 15,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    marginRight: 5,
  },
});

export default OnboardingScreen;