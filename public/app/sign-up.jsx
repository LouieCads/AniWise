import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react'; // Import useState
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Import an icon library, make sure you have it installed: expo install @expo/vector-icons
import { LinearGradient } from 'expo-linear-gradient';

const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .required('Pangalan ay kailangan')
    .min(2, 'Pangalan ay masyadong maikli'),
  contactNumber: Yup.string()
    .required('Contact number ay kailangan')
    .matches(/^[0-9]+$/, 'Contact number ay dapat mga numero lang')
    .min(11, 'Contact number ay dapat 11 digits'),
  organization: Yup.string()
    .required('Organisasyon ay kailangan'),
  location: Yup.string()
    .required('Tirahan ay kailangan'),
  password: Yup.string()
    .required('Password ay kailangan')
    .min(8, 'Password ay dapat 8 characters o higit pa'),
});

const getApiUrl = () => process.env.EXPO_PUBLIC_API_URL || 'http://192.168.254.169:3000';

export default function SignUp() {
  // New state to manage password visibility
  const [showPassword, setShowPassword] = useState(false);

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

  const handleSignUp = async (values, { setSubmitting }) => {
    try {
      const response = await fetch(`${getApiUrl()}/api/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert('Success', data.message + '\nPlease sign in with your new credentials.', [
          {
            text: 'OK',
            onPress: () => router.replace('/sign-in')
          }
        ]);
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      Alert.alert('Error', 'Network error. Make sure the server is running.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={styles.header}>Gumawa ng account</Text>

        <Formik
          initialValues={{
            name: '',
            contactNumber: '',
            organization: '',
            location: '',
            password: '',
          }}
          validationSchema={SignUpSchema}
          onSubmit={handleSignUp}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <View style={styles.formContainer}>
              {Object.keys(values).map((key) => (
                <View key={key} style={styles.inputGroup}>
                  <Text style={styles.label}>{fieldLabels[key]}</Text>
                  {key === 'password' ? ( // Special handling for password input
                    <View style={[
                        styles.passwordInputContainer,
                        touched[key] && errors[key] && styles.inputError // Apply error border to container
                    ]}>
                      <TextInput
                        style={styles.passwordTextInput} // Apply a specific style for password TextInput
                        placeholder={fieldPlaceholders[key]}
                        placeholderTextColor="#a8b3a8"
                        secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
                        value={values[key]}
                        onChangeText={handleChange(key)}
                        onBlur={handleBlur(key)}
                        editable={!isSubmitting}
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
                  ) : ( // Regular input fields
                    <TextInput
                      style={[
                        styles.input,
                        touched[key] && errors[key] && styles.inputError
                      ]}
                      placeholder={fieldPlaceholders[key]}
                      placeholderTextColor="#a8b3a8"
                      value={values[key]}
                      onChangeText={handleChange(key)}
                      onBlur={handleBlur(key)}
                      autoCapitalize={key === 'name' ? 'words' : 'none'}
                      keyboardType={key === 'contactNumber' ? 'phone-pad' : 'default'}
                      editable={!isSubmitting}
                    />
                  )}
                  {touched[key] && errors[key] && (
                    <Text style={styles.errorText}>{errors[key]}</Text>
                  )}
                </View>
              ))}

              <TouchableOpacity
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isSubmitting}
                style={styles.primaryButtonWrapper}
              >
                <LinearGradient
                  colors={isSubmitting ? ['#a8b3a8', '#a8b3a8'] : ['#15803d', '#22c55e']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.primaryButton}
                >
                  <Text style={styles.buttonText}>
                    {isSubmitting ? 'Nagsisign-up...' : 'Mag Sign-up'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#6c757d', marginTop: 10 }]}
                onPress={() => router.push('/mapping')}
              >
                <Text style={styles.buttonText}>Skip to Mapping</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#6c757d', marginTop: 10 }]}
                onPress={() => router.push('/tutorial')}
              >
                <Text style={styles.buttonText}>Skip to Dashboard</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>

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
    // No vertical padding needed here as the container handles the height
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
  inputError: {
    borderColor: '#ff6b6b',
  },
  errorText: {
    color: '#ff6b6b',
    fontSize: 12,
    marginTop: 4,
  },
});