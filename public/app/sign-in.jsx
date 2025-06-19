import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn() {
  const [form, setForm] = useState({ name: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    // Basic validation
    if (!form.name || !form.password) {
      Alert.alert('Error', 'Pangalan at password ay kailangan');
      return;
    }

    setLoading(true);

    try {
      // Replace 'YOUR_LOCAL_IP' with your actual local IP address
      // You can find it by running 'ipconfig' (Windows) or 'ifconfig' (Mac/Linux)
      const response = await fetch('http://192.168.254.169:3000/api/signin', {
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
        Alert.alert('Success', data.message, [
          {
            text: 'OK',
            onPress: () => router.push('/mapping')
          }
        ]);
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
        <View style={styles.logoPlaceholder}>
          <Text style={styles.logoText}>🌱</Text>
        </View>
        <Text style={styles.brandName}>FarmWise</Text>
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
          <TextInput
            style={styles.input}
            placeholder="aniwise123"
            placeholderTextColor="#a8b3a8"
            secureTextEntry
            value={form.password}
            onChangeText={(t) => setForm({ ...form, password: t })}
            editable={!loading}
          />
        </View>

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSignIn}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Nagsisign-in...' : 'Mag Sign-in'}
          </Text>
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
    marginBottom: 40,
    marginTop: 20,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: '#87BE42',
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoText: {
    fontSize: 36,
    color: '#ffffff',
  },
  brandName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2d5016',
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
  button: {
    height: 56,
    backgroundColor: '#87BE42',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: '#a8b3a8',
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