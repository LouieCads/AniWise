import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert, Image } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import an icon library
import { LinearGradient } from 'expo-linear-gradient';

export default function SignIn() {
  const [form, setForm] = useState({ name: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility

  // Auto-check on mount for existing auth
  useEffect(() => {
    const checkAuthAndFarm = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          // Check farm
          const farmRes = await fetch(`${getApiUrl()}/api/farms/my`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          const farmData = await farmRes.json();
          if (farmData.success && Array.isArray(farmData.farms) && farmData.farms.length > 0) {
            router.replace('/dashboard');
          } else {
            router.replace('/mapping');
          }
        }
      } catch (e) {
        // Ignore errors, stay on sign-in
      } finally {
        setLoading(false);
      }
    };
    checkAuthAndFarm();
  }, []);

  const getApiUrl = () => process.env.EXPO_PUBLIC_API_URL || 'http://192.168.254.169:3000';

  const handleSignIn = async () => {
    // Basic validation
    if (!form.name || !form.password) {
      Alert.alert('Error', 'Pangalan at password ay kailangan');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${getApiUrl()}/api/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (data.success) {
        // Store the token in AsyncStorage
        await AsyncStorage.setItem('authToken', data.token);
        // Check if user has farm data
        try {
          const farmRes = await fetch(`${getApiUrl()}/api/farms/my`, {
            headers: { 'Authorization': `Bearer ${data.token}` }
          });
          const farmData = await farmRes.json();
          if (farmData.success && Array.isArray(farmData.farms) && farmData.farms.length > 0) {
            // User has farm data, redirect to dashboard
            router.replace('/dashboard');
          } else {
            // No farm data, redirect to mapping
            router.replace('/mapping');
          }
        } catch (farmError) {
          // If farm check fails, default to mapping
          console.error('Farm data check error:', farmError); // Log the error for debugging
          router.replace('/mapping');
        }
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Sign-in error:', error);
      Alert.alert('Error', 'Network error. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      {/* Logo Section */}
      <View style={styles.logoContainer}>
        <View style={styles.logoWrapper}>
          <Image 
            source={require('../assets/Aniwise2.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Header */}
      <Text style={styles.header}>Mag Sign-in</Text>

      {/* Form Container */}
      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Pangalan</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan Dela Cruz"
            placeholderTextColor="#a8b3a8"
            value={form.name}
            onChangeText={(t) => setForm({ ...form, name: t })}
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordTextInput}
              placeholder="aniwise123"
              placeholderTextColor="#a8b3a8"
              secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
              value={form.password}
              onChangeText={(t) => setForm({ ...form, password: t })}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)} // Toggle showPassword state
              style={styles.passwordToggle}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'} // Change icon based on showPassword
                size={24}
                color="#a8b3a8"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleSignIn}
          activeOpacity={0.8}
          disabled={loading}
          style={styles.primaryButtonWrapper}
        >
          <LinearGradient
            colors={loading ? ['#a8b3a8', '#a8b3a8'] : ['#15803d', '#22c55e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButton}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Nagsisign-in...' : 'Mag Sign-in'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Wala pang account?
          <Text
            style={styles.linkText}
            onPress={() => router.push('/sign-up')}
          > Mag sign-up</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  logo: {
    width: 170,
    height: 170,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2d5016',
    textAlign: 'center',
    marginBottom: 40,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 4,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d5016',
    marginBottom: 8,
  },
  input: {
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
    borderWidth: 2,
    borderColor: '#87BE42',
  },
  // New styles for password visibility
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#87BE42',
  },
  passwordTextInput: {
    flex: 1, // Allows the TextInput to take up available space
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333333',
  },
  passwordToggle: {
    paddingHorizontal: 15, // Add padding to the icon for better touch area
  },
  primaryButtonWrapper: {
    marginTop: 20,
    borderRadius: 12,
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
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#87BE42',
  },
  linkText: {
    fontWeight: '600',
    color: '#2d5016',
  },
});