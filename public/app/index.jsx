import { View, Text, TouchableOpacity, StyleSheet, StatusBar, Image, ImageBackground } from 'react-native';
import { Link, router, } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  return (
    <ImageBackground 
      source={require('../assets/Background.png')} // You'll need to add this image
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
          
          {/* Logo Section */}
          <View style={styles.logoContainer}>
            <View style={styles.logoWrapper}>
              <Image 
                source={require('../assets/Aniwise.png')} 
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Welcome Content */}
          <View style={styles.contentContainer}>
            <View style={styles.textBackground}>
              <Text style={styles.title}>Welcome to AniWise!</Text>
              <Text style={styles.subtitle}>Ang all-in-one na app para sa pagsasaka</Text>
            </View>
          </View>

          {/* Buttons Container */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              onPress={() => router.push('/sign-up')}
              activeOpacity={0.8}
              style={styles.primaryButtonWrapper}
            >
              <LinearGradient
                colors={['#15803d', '#22c55e']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButton}
              >
                <Text style={styles.primaryButtonText}>Simulan</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={() => router.push('/sign-in')}
              activeOpacity={0.8}
            >
              <Text style={styles.secondaryButtonText}>May account ka na? Mag sign-in</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(248, 249, 250, 0.85)', // Light overlay for better text readability
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 280,
    height: 280,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#2d5016',
    textAlign: 'center',
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7c5a',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: 8,
  },
  primaryButtonWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    shadowColor: '#22c55e',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    height: 56,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#87BE42',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryButtonText: {
    color: '#2d5016',
    fontSize: 16,
    fontWeight: '600',
  },
});