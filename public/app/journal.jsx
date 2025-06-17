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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const Journal = () => {
  const router = useRouter();
  const [logs, setLogs] = useState([]);
  const [date, setDate] = useState('');
  const [progress, setProgress] = useState('');

  const handleAddLog = () => {
    if (date && progress) {
      const newLog = { date, progress };
      setLogs([newLog, ...logs]);
      setDate('');
      setProgress('');
    }
  };

  // Navigation functions
  const navigateToWeather = () => router.push('/weather');
  const navigateToCalendar = () => router.push('/calendar');
  const navigateToHome = () => router.push('/dashboard');
  const navigateToShop = () => router.push('/catalog');
  const navigateToAlerts = () => router.push('/alerts');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Journal</Text>
          <Text style={styles.subtitle}>Track your daily progress</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Date (e.g. June 17, 2025)"
            value={date}
            onChangeText={setDate}
            style={styles.input}
          />
          <TextInput
            placeholder="What did you accomplish?"
            value={progress}
            onChangeText={setProgress}
            multiline
            style={[styles.input, { height: 100 }]}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddLog}>
            <Text style={styles.addButtonText}>Add Log</Text>
          </TouchableOpacity>
        </View>

        {logs.map((log, index) => (
          <View key={index} style={styles.logItem}>
            <Text style={styles.logDate}>{log.date}</Text>
            <Text style={styles.logText}>{log.progress}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomNavContainer}>
        <LinearGradient colors={['#ffffff', '#f8fafc']} style={styles.bottomNav}>
          <TouchableOpacity style={styles.navButton} onPress={navigateToWeather}>
            <Icon name="cloud" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Weather</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={navigateToCalendar}>
            <Icon name="calendar-today" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeButton} onPress={navigateToHome}>
            <LinearGradient colors={['#10b981', '#059669']} style={styles.homeButtonGradient}>
              <Icon name="home" size={28} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={navigateToShop}>
            <Icon name="shopping-cart" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={navigateToAlerts}>
            <Icon name="notifications" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Alerts</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#10b981' },
  subtitle: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  inputContainer: { marginBottom: 20 },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    borderColor: '#d1d5db',
    borderWidth: 1,
    marginBottom: 12,
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  logItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderColor: '#d1d5db',
    borderWidth: 1,
  },
  logDate: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
    fontWeight: '600',
  },
  logText: { fontSize: 16, color: '#374151' },
  bottomNavContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  navButton: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  navLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  homeButton: { alignItems: 'center', justifyContent: 'center' },
  homeButtonGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default Journal;