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
  Platform,
  Alert,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';

const getApiUrl = () => process.env.EXPO_PUBLIC_API_URL || 'http://192.168.254.169:3000';

const Journal = () => {
  const router = useRouter();
  const today = new Date();
  const [logs, setLogs] = useState([
    { 
      id: 1,
      date: 'Hunyo 16, 2025', 
      progress: 'Matagumpay na natapos ang pagpapatubig sa buong palayan. Sinimulan na ring maglagay ng organikong pataba sa Sektor 1.',
      mood: 'productive'
    },
    { 
      id: 2,
      date: 'Hunyo 15, 2025', 
      progress: 'Sinuri ang mga binhi para sa kalidad; handa na para sa susunod na yugto ng pagtatanim. Nag-organisa ng kasunod na pulong para sa mga magsasaka.',
      mood: 'focused'
    },
    { 
      id: 3,
      date: 'Hunyo 14, 2025', 
      progress: 'Araw ng paglilinis at pag-aayos ng mga kagamitan sa bukid. Nakumpuni ang sirang parte ng traktora.',
      mood: 'accomplished'
    },
  ]);

  const [date, setDate] = useState(today);
  const [progress, setProgress] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedMood, setSelectedMood] = useState('productive');

  const moods = [
    { key: 'productive', label: 'Produktibo', icon: 'trending-up', color: '#10b981' },
    { key: 'focused', label: 'Nakatuon', icon: 'center-focus-strong', color: '#3b82f6' },
    { key: 'accomplished', label: 'Nakamit', icon: 'check-circle', color: '#8b5cf6' },
    { key: 'challenging', label: 'Mahirap', icon: 'warning', color: '#f59e0b' },
  ];

  const handleAddLog = () => {
    if (progress.trim()) {
      const formattedDate = date.toLocaleDateString('tl-PH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const newLog = { 
        id: Date.now(),
        date: formattedDate, 
        progress: progress.trim(),
        mood: selectedMood
      };
      setLogs([newLog, ...logs]);
      setProgress('');
      setSelectedMood('productive');
      
      // Show success feedback
      Alert.alert('Matagumpay!', 'Naidagdag na ang inyong log sa journal.');
    }
  };

  const handleDeleteLog = (id) => {
    Alert.alert(
      'Tanggalin ang Log',
      'Sigurado ka bang gusto mong tanggalin ang log na ito?',
      [
        { text: 'Hindi', style: 'cancel' },
        { text: 'Oo', onPress: () => setLogs(logs.filter(log => log.id !== id)) }
      ]
    );
  };

  const getMoodColor = (mood) => {
    const moodData = moods.find(m => m.key === mood);
    return moodData ? moodData.color : '#10b981';
  };

  const getMoodIcon = (mood) => {
    const moodData = moods.find(m => m.key === mood);
    return moodData ? moodData.icon : 'trending-up';
  };

  const nav = (path) => router.push(path);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#15803d" />

      <LinearGradient
        colors={['#15803d', '#22c55e']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Icon name="chevron-left" size={26} color="#fff" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Journal</Text>
        </View>
        <View style={{ width: 40 }} />
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#fff', '#f8fafc']}
          style={styles.card}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.cardHeader}>
            <Icon name="create" size={24} color="#15803d" />
            <Text style={styles.cardTitle}>Bagong Log</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Petsa</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.dateInput}
            >
              <Icon name="event" size={20} color="#64748b" />
              <Text style={styles.dateText}>
                {date.toLocaleDateString('tl-PH', { year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
              <Icon name="arrow-drop-down" size={20} color="#64748b" />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setDate(selectedDate);
              }}
            />
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Kalagayan</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.moodSelector}>
              {moods.map((mood) => (
                <TouchableOpacity
                  key={mood.key}
                  style={[
                    styles.moodButton,
                    selectedMood === mood.key && { backgroundColor: mood.color }
                  ]}
                  onPress={() => setSelectedMood(mood.key)}
                >
                  <Icon 
                    name={mood.icon} 
                    size={18} 
                    color={selectedMood === mood.key ? '#fff' : mood.color} 
                  />
                  <Text style={[
                    styles.moodButtonText,
                    selectedMood === mood.key && { color: '#fff' }
                  ]}>
                    {mood.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mga Ginawa</Text>
            <TextInput
              placeholder="Isulat ang inyong mga ginawa ngayong araw..."
              value={progress}
              onChangeText={setProgress}
              multiline
              style={styles.textArea}
              placeholderTextColor="#94a3b8"
            />
          </View>

          <LinearGradient
            colors={['#15803d', '#22c55e']}
            style={styles.addButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <TouchableOpacity style={styles.addButtonInner} onPress={handleAddLog}>
              <Icon name="add" size={22} color="#fff" />
              <Text style={styles.addButtonText}>Idagdag sa Journal</Text>
            </TouchableOpacity>
          </LinearGradient>
        </LinearGradient>

        <View style={styles.logsSection}>
          <View style={styles.logsSectionHeader}>
            <Text style={styles.sectionTitle}>Mga Nakaraang Log</Text>
            <Text style={styles.logsCount}>{logs.length} entries</Text>
          </View>

          {logs.length === 0 ? (
            <View style={styles.noLogsContainer}>
              <LinearGradient
                colors={['#f1f5f9', '#e2e8f0']}
                style={styles.noLogsIcon}
              >
                <Icon name="auto-stories" size={40} color="#94a3b8" />
              </LinearGradient>
              <Text style={styles.noLogsTitle}>Walang mga log pa</Text>
              <Text style={styles.noLogsText}>Magsimula ng pagsusulat ng inyong mga karanasan</Text>
            </View>
          ) : (
            logs.map((log) => (
              <View key={log.id} style={styles.logItem}>
                <View style={styles.logHeader}>
                  <View style={styles.logDateContainer}>
                    <Text style={styles.logDate}>{log.date}</Text>
                    <View style={[styles.moodIndicator, { backgroundColor: getMoodColor(log.mood) }]}>
                      <Icon name={getMoodIcon(log.mood)} size={12} color="#fff" />
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleDeleteLog(log.id)}
                    style={styles.deleteButton}
                  >
                    <Icon name="delete-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <Text style={styles.logText}>{log.progress}</Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Updated Bottom Navigation - Dashboard Style */}
      <View style={styles.bottomNavContainer}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.bottomNav}
        >
          <TouchableOpacity style={styles.navButton} onPress={() => nav('/weather')}>
            <Icon name="cloud" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Weather</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => nav('/calendar')}>
            <Icon name="calendar-today" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeButton} onPress={() => nav('/dashboard')}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.homeButtonGradient}
            >
              <Icon name="home" size={28} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => nav('/catalog')}>
            <Icon name="payments" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Loan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => nav('/journal')}>
            <Icon name="book" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Journal</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f1f5f9' 
  },
  
  scrollView: { 
    flex: 1,
    paddingHorizontal: 20 
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 38,
    paddingBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  headerButton: { 
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1
  },
  
  headerTitle: { 
    color: '#fff', 
    fontSize: 22, 
    fontWeight: '800',
    letterSpacing: 0.5
  },
  
  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginTop: 2
  },
  
  card: { 
    borderRadius: 24, 
    padding: 24, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 15, 
    elevation: 8, 
    marginTop: 20, 
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)'
  },
  
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20
  },
  
  cardTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1e293b', 
    marginLeft: 12
  },
  
  inputGroup: {
    marginBottom: 20
  },
  
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8
  },
  
  dateInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  
  dateText: {
    fontSize: 16,
    color: '#334155',
    flex: 1,
    marginLeft: 12
  },
  
  moodSelector: {
    flexDirection: 'row'
  },
  
  moodButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  
  moodButtonText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
    color: '#64748b'
  },
  
  textArea: { 
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    minHeight: 120,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#334155',
    lineHeight: 24
  },
  
  addButton: {
    borderRadius: 16,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  
  addButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24
  },
  
  addButtonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '700',
    marginLeft: 8
  },
  
  logsSection: {
    marginBottom: 20
  },
  
  logsSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1e293b'
  },
  
  logsCount: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500'
  },
  
  logItem: { 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 20, 
    marginBottom: 16, 
    borderColor: '#e2e8f0', 
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12
  },
  
  logDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  
  logDate: { 
    fontSize: 13, 
    color: '#64748b', 
    fontWeight: '600'
  },
  
  moodIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12
  },
  
  deleteButton: {
    padding: 8,
    borderRadius: 8
  },
  
  logText: { 
    fontSize: 15, 
    color: '#334155', 
    lineHeight: 24
  },
  
  noLogsContainer: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 40, 
    borderRadius: 20, 
    backgroundColor: '#fff', 
    borderWidth: 1, 
    borderColor: '#e2e8f0'
  },
  
  noLogsIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16
  },
  
  noLogsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 8
  },
  
  noLogsText: { 
    fontSize: 14, 
    color: '#94a3b8', 
    textAlign: 'center',
    lineHeight: 20
  },
  
  // Updated Bottom Navigation Styles - Dashboard Style
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  
  navLabel: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
    fontWeight: '500',
  },
  
  homeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
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