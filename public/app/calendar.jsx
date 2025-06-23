import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const Calendar = () => {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState('Abril');
  const [selectedDates, setSelectedDates] = useState([20, 21, 22, 23, 24, 25, 26]);

  // Router functions
  const navigateToWeather = () => {
    router.push('/weather');
  };

  const navigateToCalendar = () => {
    router.push('/calendar');
  };

  const navigateToHome = () => {
    router.push('/dashboard');
  };

  const navigateToShop = () => {
    router.push('/catalog');
  };

  const navigateToAlerts = () => {
    router.push('/journal');
  };

  const handlePreviousMonth = () => {
    router.push('/calendar?month=march');
  };

  const handleNextMonth = () => {
    router.push('/calendar?month=may');
  };

  const handleDatePress = (date) => {
    router.push(`/calendar/date/${date}`);
  };

  // Generate calendar days for April
  const generateCalendarDays = () => {
    const days = [];
    const totalDays = 30;
    const startPadding = 2; // April starts on Wednesday (2 empty slots)
    
    // Days of the week headers
    const weekDays = ['L', 'L', 'M', 'M', 'H', 'B', 'S'];

    // Add empty slots for days before month starts
    for (let i = 0; i < startPadding; i++) {
      days.push({ day: null, isEmpty: true, key: `empty-start-${i}` });
    }

    // Add actual days of the month
    for (let day = 1; day <= totalDays; day++) {
      days.push({
        day,
        isEmpty: false,
        isSelected: selectedDates.includes(day),
        key: `day-${day}`
      });
    }

    // Add empty slots to complete the grid (6 rows × 7 days = 42 total slots)
    const totalSlots = 42;
    const remainingSlots = totalSlots - (startPadding + totalDays);
    for (let i = 0; i < remainingSlots; i++) {
      days.push({ day: null, isEmpty: true, key: `empty-end-${i}` });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['L', 'L', 'M', 'M', 'H', 'B', 'S'];

  const renderCalendarDay = (dayInfo) => {
    if (dayInfo.isEmpty) {
      return (
        <View key={dayInfo.key} style={styles.emptyDay} />
      );
    }

    const dayStyle = [
      styles.calendarDay,
      dayInfo.isSelected && styles.selectedDay
    ];

    const textStyle = [
      styles.dayText,
      dayInfo.isSelected && styles.selectedDayText
    ];

    return (
      <TouchableOpacity
        key={dayInfo.key}
        style={dayStyle}
        onPress={() => handleDatePress(dayInfo.day)}
        activeOpacity={0.7}
      >
        <Text style={textStyle}>{dayInfo.day}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Kalendaryo ng mga Ani</Text>
          <Text style={styles.subtitle}>Plano sa Pagaani</Text>
        </View>

        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handlePreviousMonth}
            activeOpacity={0.7}
          >
            <Icon name="chevron-left" size={24} color="#10b981" />
          </TouchableOpacity>
          
          <View style={styles.monthContainer}>
            <Text style={styles.monthText}>{currentMonth} 2024</Text>
          </View>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handleNextMonth}
            activeOpacity={0.7}
          >
            <Icon name="chevron-right" size={24} color="#10b981" />
          </TouchableOpacity>
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarContainer}>
          {/* Week Days Header */}
          <View style={styles.weekDaysHeader}>
            {weekDays.map((day, index) => (
              <View key={index} style={styles.weekDayContainer}>
                <Text style={styles.weekDayText}>{day}</Text>
              </View>
            ))}
          </View>

          {/* Calendar Days Grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map(renderCalendarDay)}
          </View>
        </View>

        {/* Selected Date Range Info */}
        <View style={styles.dateRangeInfo}>
          <LinearGradient
            colors={['#ecfdf5', '#f0fdf4']}
            style={styles.dateRangeGradient}
          >
            <View style={styles.dateRangeHeader}>
              <Icon name="eco" size={32} color="#10b981" />
              <Text style={styles.dateRangeTitle}>20-26</Text>
            </View>
            <Text style={styles.dateRangeDescription}>
              Ang pinakamainom na petsa para anihin ang inyong mga pananim.
            </Text>
            <View style={styles.harvestInfo}>
              <View style={styles.harvestItem}>
                <Icon name="schedule" size={16} color="#059669" />
                <Text style={styles.harvestText}>7 araw</Text>
              </View>
              <View style={styles.harvestItem}>
                <Icon name="wb-sunny" size={16} color="#059669" />
                <Text style={styles.harvestText}>Maaraw</Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

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
            <Icon name="payments" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Loan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={navigateToAlerts}>
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
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  monthContainer: {
    flex: 1,
    marginHorizontal: 20,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  monthText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2937',
  },
  calendarContainer: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  weekDaysHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  weekDayContainer: {
    flex: 1,
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 7,
  },
  calendarDay: {
    width: '12.28571%', // 1/7 of the width
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    margin: 1,
  },
  selectedDay: {
    backgroundColor: '#10b981',
    borderColor: '#059669',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyDay: {
    width: '14.28571%',
    aspectRatio: 1,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  selectedDayText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  dateRangeInfo: {
    marginBottom: 20,
  },
  dateRangeGradient: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: '#d1fae5',
  },
  dateRangeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateRangeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#10b981',
    marginLeft: 12,
  },
  dateRangeDescription: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'left',
    lineHeight: 24,
    marginBottom: 16,
  },
  harvestInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#d1fae5',
  },
  harvestItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  harvestText: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '600',
    marginLeft: 6,
  },
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
  activeNavLabel: {
    color: '#10b981',
    fontWeight: '600',
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

export default Calendar;