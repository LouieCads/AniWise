import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, Image } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function SignIn() {
  const [form, setForm] = useState({ name: '', password: '' });

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
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="iloveyou123"
            placeholderTextColor="#a8b3a8"
            secureTextEntry
            value={form.password}
            onChangeText={(t) => setForm({ ...form, password: t })}
          />
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/dashboard')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Mag Sign-in</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          May account ka na? 
          <Text style={styles.linkText}> Mag sign-in</Text>
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