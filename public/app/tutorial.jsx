import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
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
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  const onboardingSteps = [
    {
      title: "Kumusta, kaibigan!",
      message: "Ako si Tatay Lito, ang inyong gabay dito sa app! Matutulungan ko kayong maintindihan kung paano ito gagamitin para sa inyong sakahan.",
      icon: "waving-hand",
      color: "#10b981",
      bgGradient: ["#10b981", "#059669"],
      illustration: "👋"
    },
    {
      title: "Ano ba ang Credibility Score?",
      message: "Ito yung numero na nagpapakita kung gaano ka kagaling mag-alaga ng lupa mo. Parang grade sa school - mas mataas, mas maganda!",
      subMessage: "Kapag 'Good' ang score mo, pwede kang makakuha ng mas malaking tulong sa pera!",
      icon: "star",
      color: "#f59e0b",
      bgGradient: ["#f59e0b", "#d97706"],
      illustration: "⭐"
    },
    {
      title: "Bakit importante ang lupa?",
      message: "Tinitingnan namin kung healthy ba ang lupa mo - yung moisture, temperatura, at humidity. Kapag healthy ang lupa, healthy din ang tanim!",
      subMessage: "Makikita mo dito sa app ang lagay ng inyong lupa araw-araw.",
      icon: "grass",
      color: "#059669",
      bgGradient: ["#059669", "#047857"],
      illustration: "🌱"
    },
    {
      title: "Paano nakakakuha ng pera?",
      message: "Kapag maganda ang score mo, pwede kang mag-loan! Yung pera na 'to, pwede mong gamitin para sa binhi, pataba, o iba pang pangangailangan sa farm.",
      subMessage: "Hindi ka mag-aalala - ipapakita namin kung magkano pwede mong makuha!",
      icon: "account-balance-wallet",
      color: "#dc2626",
      bgGradient: ["#dc2626", "#b91c1c"],
      illustration: "💰"
    },
    {
      title: "Mga Features ng App",
      message: "May weather forecast para sa panahon, calendar para sa schedule, at journal para sa mga notes mo!",
      subMessage: "Lahat ng kailangan mo para sa farming, nandito na!",
      icon: "apps",
      color: "#7c3aed",
      bgGradient: ["#7c3aed", "#6d28d9"],
      illustration: "📱"
    },
    {
      title: "Handa na ba kayo?",
      message: "Simulan na natin! Mag-enjoy sa paggamit ng app at sana makatulong ito sa inyong pag-farm!",
      subMessage: "Kapag may tanong kayo, hanapin niyo lang si Tatay Lito! 😊",
      icon: "celebration",
      color: "#10b981",
      bgGradient: ["#10b981", "#059669"],
      illustration: "🎉"
    }
  ];

  useEffect(() => {
    animateStep();
  }, [currentStep]);

  const animateStep = () => {
    // Reset animations
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    scaleAnim.setValue(0.8);

    // Animate in sequence
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
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
      <StatusBar barStyle="light-content" backgroundColor="#14532d" />
      
      {/* Dynamic Header */}
      <LinearGradient
        colors={currentStepData.bgGradient}
        style={styles.header}
      >
        <TouchableOpacity 
          style={styles.skipButton} 
          onPress={skipOnboarding}
        >
          <Text style={styles.skipText}>Skip</Text>
          <Icon name="close" size={16} color="#ffffff" />
        </TouchableOpacity>
        
        {/* Enhanced Progress Indicator */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {currentStep + 1} ng {onboardingSteps.length}
          </Text>
          <View style={styles.progressBarContainer}>
            <View style={styles.progressBarBackground} />
            <Animated.View 
              style={[
                styles.progressBarFill, 
                { 
                  width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` 
                }
              ]} 
            />
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Enhanced Mascot Section */}
        <Animated.View 
          style={[
            styles.mascotSection,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {/* Large Illustration */}
          <View style={[styles.illustrationContainer, { backgroundColor: currentStepData.bgGradient[0] + '20' }]}>
            <Text style={styles.illustration}>{currentStepData.illustration}</Text>
            <View style={styles.illustrationGlow} />
          </View>
          
          {/* Mascot with Floating Animation */}
          <View style={styles.mascotWrapper}>
            <LinearGradient
              colors={currentStepData.bgGradient}
              style={styles.mascotCircle}
            >
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1710563849800-73af5bfc9f36?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                }}
                style={styles.mascotImage}
              />
            </LinearGradient>
            <View style={styles.mascotBadge}>
              <Text style={styles.mascotName}>Tatay Lito</Text>
              <Text style={styles.mascotRole}>Aniwise Guide</Text>
            </View>
          </View>
        </Animated.View>

        {/* Feature Preview Cards for Step 4 */}
        {currentStep === 4 && (
          <Animated.View 
            style={[
              styles.featurePreview,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}
          >
            <Text style={styles.featurePreviewTitle}>Mga Available Features:</Text>
            <View style={styles.previewRow}>
              <View style={styles.previewCard}>
                <LinearGradient colors={['#3b82f6', '#2563eb']} style={styles.previewIconBg}>
                  <Icon name="cloud" size={28} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.previewText}>Weather</Text>
                <Text style={styles.previewSubtext}>Daily forecast</Text>
              </View>
              <View style={styles.previewCard}>
                <LinearGradient colors={['#f59e0b', '#d97706']} style={styles.previewIconBg}>
                  <Icon name="calendar-today" size={28} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.previewText}>Calendar</Text>
                <Text style={styles.previewSubtext}>Schedule tasks</Text>
              </View>
            </View>
            <View style={styles.previewRow}>
              <View style={styles.previewCard}>
                <LinearGradient colors={['#10b981', '#059669']} style={styles.previewIconBg}>
                  <Icon name="account-balance-wallet" size={28} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.previewText}>Loan</Text>
                <Text style={styles.previewSubtext}>Get funding</Text>
              </View>
              <View style={styles.previewCard}>
                <LinearGradient colors={['#8b5cf6', '#7c3aed']} style={styles.previewIconBg}>
                  <Icon name="book" size={28} color="#ffffff" />
                </LinearGradient>
                <Text style={styles.previewText}>Journal</Text>
                <Text style={styles.previewSubtext}>Track progress</Text>
              </View>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {/* Dialog Section - Now at Bottom */}
      <Animated.View 
        style={[
          styles.dialogSection,
          { 
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.dialogContainer}
        >
          <View style={styles.dialogHeader}>
            <View style={styles.dialogAvatar}>
              <Text style={styles.dialogAvatarText}>🗣️</Text>
            </View>
            <View style={styles.dialogInfo}>
              <Text style={styles.dialogSpeaker}>Tatay Lito</Text>
              <Text style={styles.dialogTimestamp}>Nueva Ecija Farmer</Text>
            </View>
          </View>
          
          <View style={styles.dialogBubble}>
            <Text style={styles.dialogTitle}>{currentStepData.title}</Text>
            <Text style={styles.dialogMessage}>{currentStepData.message}</Text>
            {currentStepData.subMessage && (
              <View style={styles.dialogSubMessageContainer}>
                <Icon name="lightbulb" size={16} color="#f59e0b" />
                <Text style={styles.dialogSubMessage}>{currentStepData.subMessage}</Text>
              </View>
            )}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Enhanced Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
          onPress={prevStep}
          disabled={currentStep === 0}
        >
          <Icon name="arrow-back" size={20} color={currentStep === 0 ? "#cbd5e1" : "#6b7280"} />
          <Text style={[styles.navButtonText, currentStep === 0 && styles.navButtonTextDisabled]}>
            Bumalik
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.nextButton}
          onPress={nextStep}
        >
          <LinearGradient
            colors={currentStepData.bgGradient}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === onboardingSteps.length - 1 ? 'Simulan! 🚀' : 'Susunod'}
            </Text>
            <Icon name="arrow-forward" size={20} color="#ffffff" />
          </LinearGradient>
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
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  skipButton: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    gap: 4,
  },
  skipText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    opacity: 0.9,
  },
  progressBarContainer: {
    width: width * 0.6,
    height: 6,
    position: 'relative',
  },
  progressBarBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 3,
  },
  content: {
    flex: 1,
  },
  mascotSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  illustrationContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  illustration: {
    fontSize: 60,
  },
  illustrationGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  mascotWrapper: {
    alignItems: 'center',
  },
  mascotCircle: {
    width: 125,
    height: 125,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  mascotImage: {
    width: 125,
    height: 125,
    borderRadius: 27,
  },
  mascotBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mascotName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  mascotRole: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  featurePreview: {
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  featurePreviewTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 12,
  },
  previewCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  previewIconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 2,
  },
  previewSubtext: {
    fontSize: 12,
    color: '#6b7280',
  },
  dialogSection: {
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  dialogContainer: {
    borderRadius: 24,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  dialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dialogAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dialogAvatarText: {
    fontSize: 18,
  },
  dialogInfo: {
    flex: 1,
  },
  dialogSpeaker: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  dialogTimestamp: {
    fontSize: 12,
    color: '#6b7280',
  },
  dialogBubble: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  dialogMessage: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 8,
  },
  dialogSubMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fffbeb',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  dialogSubMessage: {
    flex: 1,
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  navButtonTextDisabled: {
    color: '#cbd5e1',
  },
  nextButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 6,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});

export default OnboardingScreen;