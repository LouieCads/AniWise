import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform, // For platform-specific styling
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const Journal = () => {
  const router = useRouter();
  // Initialize with some dummy logs for demonstration, newest first
  const [logs, setLogs] = useState([
    { date: 'Hunyo 16, 2025', progress: 'Matagumpay na natapos ang pagpapatubig sa buong palayan. Sinimulan na ring maglagay ng organikong pataba sa Sektor 1.' },
    { date: 'Hunyo 15, 2025', progress: 'Sinuri ang mga binhi para sa kalidad; handa na para sa susunod na yugto ng pagtatanim. Nag-organisa ng kasunod na pulong para sa mga magsasaka.' },
    { date: 'Hunyo 14, 2025', progress: 'Araw ng paglilinis at pag-aayos ng mga kagamitan sa bukid. Nakumpuni ang sirang parte ng traktora.' },
  ]);
  const [date, setDate] = useState('');
  const [progress, setProgress] = useState('');

  const handleAddLog = () => {
    if (date.trim() && progress.trim()) { // Use .trim() to prevent empty submissions
      const newLog = { date: date.trim(), progress: progress.trim() };
      setLogs([newLog, ...logs]); // Add new log to the top
      setDate('');
      setProgress('');
    } else {
      // Optional: Add a subtle alert or visual feedback for empty fields
      // Alert.alert('Oops!', 'Please fill in both date and progress.');
    }
  };

  // Navigation functions
  const navigateToWeather = () => router.push('/weather');
  const navigateToCalendar = () => router.push('/calendar');
  const navigateToHome = () => router.push('/dashboard');
  const navigateToShop = () => router.push('/catalog');
  const navigateToJournal = () => router.push('/journal'); // Highlight current page
  const navigateToAlerts = () => router.push('/alerts');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Aking Journal</Text>
        <Text style={styles.subtitle}>Subaybayan ang iyong pang-araw-araw na progreso sa bukid.</Text>
      </View>

      <ScrollView style={styles.scrollViewContent} showsVerticalScrollIndicator={false}>
        {/* Log Input Section */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Magdagdag ng Bagong Log</Text>
          <TextInput
            placeholder="Petsa (Hal. Hunyo 17, 2025)"
            value={date}
            onChangeText={setDate}
            style={styles.input}
            placeholderTextColor="#94a3b8"
          />
          <TextInput
            placeholder="Ano ang iyong mga nagawa ngayon?"
            value={progress}
            onChangeText={setProgress}
            multiline
            style={[styles.input, styles.textArea]}
            placeholderTextColor="#94a3b8"
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddLog}>
            <Text style={styles.addButtonText}>Idagdag sa Journal</Text>
            <Icon name="add-circle-outline" size={20} color="#ffffff" style={styles.addButtonIcon} />
          </TouchableOpacity>
        </View>

        {/* Recent Logs Section */}
        <Text style={styles.sectionTitle}>Mga Huling Log</Text>
        {logs.length === 0 ? (
          <View style={styles.noLogsContainer}>
            <Icon name="auto-stories" size={50} color="#cbd5e1" />
            <Text style={styles.noLogsText}>Wala pang log. Simulan ang pagsubaybay sa iyong progreso!</Text>
          </View>
        ) : (
          logs.map((log, index) => (
            <View key={index} style={styles.logItem}>
              <Text style={styles.logDate}>{log.date}</Text>
              <Text style={styles.logText}>{log.progress}</Text>
            </View>
          ))
        )}

        {/* Spacer for bottom navigation */}
        <View style={styles.bottomNavSpacer} />
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.bottomNav}
        >
          <TouchableOpacity style={styles.navButton} onPress={navigateToWeather}>
            <Icon name="cloud" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Weather</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={navigateToCalendar}>
            <Icon name="calendar-today" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeButton} onPress={navigateToHome}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.homeButtonGradient}
            >
              <Icon name="home" size={28} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={navigateToShop}>
            <Icon name="shopping-cart" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Loan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.navButton, styles.activeNavButton]} onPress={navigateToJournal}>
            <Icon name="menu-book" size={24} color="#10b981" />
            <Text style={[styles.navLabel, styles.activeNavLabel]}>Journal</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc', // Light background
  },
  scrollViewContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 25,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 0, // Adjust for Android status bar
  },
  title: {
    fontSize: 28, // Larger title
    fontWeight: 'bold',
    color: '#15803d', // Darker green for emphasis
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b', // Softer gray
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.08,
    shadowRadius: 15,
    elevation: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f8fafc', // Even lighter background for inputs
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderColor: '#e2e8f0', // Softer border
    borderWidth: 1,
    marginBottom: 15,
    fontSize: 16,
    color: '#334155',
  },
  textArea: {
    minHeight: 120, // Taller text area
    textAlignVertical: 'top', // Aligns text to top on Android
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 17,
    marginRight: 8,
  },
  addButtonIcon: {
    // Icon color already set in component
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 15,
    marginTop: 5,
  },
  logItem: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 18,
    marginBottom: 15,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  logDate: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    fontWeight: '600',
    textTransform: 'uppercase', // Make date slightly more prominent
  },
  logText: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24, // Improve readability
  },
  noLogsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  noLogsText: {
    fontSize: 15,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  bottomNavSpacer: {
    height: 100, // Space to prevent content from being hidden by bottom nav
  },
  // Bottom Navigation (re-used and slightly adjusted for active state)
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20, // Generous padding for bottom safe area
    backgroundColor: 'transparent',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10, // Adjusted for more even spacing
    paddingVertical: 16,
    borderRadius: 28, // More rounded nav bar
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12, // Stronger shadow for floating effect
    shadowRadius: 18,
    elevation: 12, // Higher elevation
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 5, // Small padding to make touchable area nicer
  },
  navLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  activeNavButton: {
    // Styles for the active button if needed
  },
  activeNavLabel: {
    color: '#10b981', // Highlight active label
    fontWeight: '600',
  },
  homeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeButtonGradient: {
    width: 60, // Slightly larger home button
    height: 60,
    borderRadius: 30, // Fully round
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4, // More pronounced shadow
    shadowRadius: 12,
    elevation: 10,
  },
});

export default Journal;