import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';

export default function SignUp() {
  const [form, setForm] = useState({
    name: '', 
    contactNumber: '', 
    organization: '', 
    location: '', 
    password: '',
  });

  const fieldLabels = {
    name: 'Pangalan',
    contactNumber: 'Contact Number',
    organization: 'Partner na Organisasyon',
    location: 'Tirahan',
    password: 'Password'
  };

  const fieldPlaceholders = {
    name: 'Juan Dela Cruz',
    contactNumber: '01234567910',
    organization: 'Makati LGU',
    location: 'Makati City, Metro Manila, Philippines',
    password: 'iloveyou123'
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Logo Section */}
        {/* <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🌱</Text>
          </View>
          <Text style={styles.brandName}>FarmWise</Text>
        </View> */}

        {/* Header */}
        <Text style={styles.header}>Gumawa ng account</Text>

        {/* Form Container */}
        <View style={styles.formContainer}>
          {Object.entries(form).map(([key, value]) => (
            <View key={key} style={styles.inputGroup}>
              <Text style={styles.label}>{fieldLabels[key]}</Text>
              <TextInput
                style={styles.input}
                placeholder={fieldPlaceholders[key]}
                placeholderTextColor="#a8b3a8"
                secureTextEntry={key === 'password'}
                value={value}
                onChangeText={(t) => setForm({ ...form, [key]: t })}
                autoCapitalize={key === 'name' ? 'words' : 'none'}
                keyboardType={key === 'contactNumber' ? 'phone-pad' : 'default'}
              />
            </View>
          ))}

          <TouchableOpacity 
            style={styles.button} 
            onPress={() => router.push('/dashboard')}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Mag Sign-up</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            May account ka na? 
            <Text 
              style={styles.linkText}
              onPress={() => router.push('/sign-in')}
            > Mag sign-in</Text>
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
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
    marginTop: 30,
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