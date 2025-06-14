import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { Link, router } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>🌱</Text>
        </View>
        <Text style={styles.brandName}>AniWise</Text>
      </View>

      {/* Welcome Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Welcome to AniWise!</Text>
        <Text style={styles.subtitle}>Ang all-in-one na app para sa pagsasaka</Text>
      </View>

      {/* Buttons Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.primaryButton} 
          onPress={() => router.push('/sign-up')}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Simulan</Text>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
    marginTop: 40,
  },
  logoPlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#87BE42',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#87BE42',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logoText: {
    fontSize: 48,
    color: '#ffffff',
  },
  brandName: {
    fontSize: 36,
    fontWeight: '700',
    color: '#2d5016',
    letterSpacing: -1,
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
    marginBottom: 16,
    letterSpacing: -0.5,
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
  primaryButton: {
    height: 56,
    backgroundColor: '#87BE42',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#87BE42',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  secondaryButton: {
    height: 56,
    backgroundColor: 'transparent',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#87BE42',
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#2d5016',
    fontSize: 16,
    fontWeight: '600',
  },
});