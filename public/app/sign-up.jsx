import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Formik } from 'formik';
import * as Yup from 'yup';

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

export default function SignUp() {
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
      const response = await fetch('http://192.168.100.134:3000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

    const data = await response.json();

    if (data.success) {
      Alert.alert('Success', data.message, [
        {
          text: 'OK',
          onPress: () => router.push('/sign-in') // ✅ Route to /mapping
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
        {/* Logo Section */}
        {/* <View style={styles.logoContainer}>
          <View style={styles.logoPlaceholder}>
            <Text style={styles.logoText}>🌱</Text>
          </View>
          <Text style={styles.brandName}>FarmWise</Text>
        </View> */}

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
                  <TextInput
                    style={[
                      styles.input,
                      touched[key] && errors[key] && styles.inputError
                    ]}
                    placeholder={fieldPlaceholders[key]}
                    placeholderTextColor="#a8b3a8"
                    secureTextEntry={key === 'password'}
                    value={values[key]}
                    onChangeText={handleChange(key)}
                    onBlur={handleBlur(key)}
                    autoCapitalize={key === 'name' ? 'words' : 'none'}
                    keyboardType={key === 'contactNumber' ? 'phone-pad' : 'default'}
                    editable={!isSubmitting}
                  />
                  {touched[key] && errors[key] && (
                    <Text style={styles.errorText}>{errors[key]}</Text>
                  )}
                </View>
              ))}

              <TouchableOpacity 
                style={[styles.button, isSubmitting && styles.buttonDisabled]} 
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={isSubmitting}
              >
                <Text style={styles.buttonText}>
                  {isSubmitting ? 'Nagsisign-up...' : 'Mag Sign-up'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, { backgroundColor: '#6c757d', marginTop: 10 }]} 
                onPress={() => router.push('/mapping')}
              >
                <Text style={styles.buttonText}>Skip to Mapping</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.button, { backgroundColor: '#6c757d', marginTop: 10 }]} 
                onPress={() => router.push('/dashboard')}
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