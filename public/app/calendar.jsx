import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const CROP_DATA = {
  rice: {
    name: 'Palay (Rice)',
    plantingMonths: [5, 6], // June, July
    growthDuration: 120, // days
    description: 'Mainam itanim ang palay sa Hunyo-Hulyo dahil sa pagsisimula ng tag-ulan, na mahalaga para sa patubig.',
    regionalAdvice: 'Sa Luzon, ang panahon na ito ay sakto sa regular na pag-ulan. Sa Visayas at Mindanao, i-adjust base sa lokal na pattern ng ulan.'
  },
  corn: {
    name: 'Mais (Corn)',
    plantingMonths: [4, 5], // May, June
    growthDuration: 75,
    description: 'Ang mais ay magandang itanim sa Mayo hanggang Hunyo, kung kailan sapat ang sikat ng araw at may sapat na ulan.',
    regionalAdvice: 'Ito ay angkop sa karamihan ng rehiyon dahil sa balanseng panahon ng tag-araw at simula ng tag-ulan.'
  },
  sugarcane: {
    name: 'Tubo (Sugarcane)',
    plantingMonths: [9, 10], // October, November
    growthDuration: 365,
    description: 'Ang tubo ay pinakamainam itanim sa Oktubre-Nobyembre upang lumago sa mas malamig na buwan at anihin bago ang susunod na tag-ulan.',
    regionalAdvice: 'Angkop ito sa mga lugar tulad ng Negros sa Visayas, kung saan malawak ang taniman ng tubo.'
  },
  onion: {
    name: 'Sibuyas (Onion)',
    plantingMonths: [10, 11], // November, December
    growthDuration: 90,
    description: 'Itanim ang sibuyas sa Nobyembre-Disyembre para sa anihan sa mga buwan ng tag-init, kung kailan mababa ang tyansa ng pag-ulan.',
    regionalAdvice: 'Kilala ang Nueva Ecija sa Luzon sa pagtatanim ng sibuyas sa panahong ito.'
  },
  mango: {
    name: 'Mangga (Mango)',
    plantingMonths: [2, 3], // March, April
    growthDuration: 120,
    description: 'Ang pagtatanim ng mangga sa Marso-Abril ay nagbibigay-daan para sa pamumulaklak sa tag-init, na nagreresulta sa mas matamis na bunga.',
    regionalAdvice: 'Ang Guimaras sa Visayas at mga probinsya sa Central Luzon ay perpekto para sa pagtatanim ng mangga sa panahong ito.'
  }
};

const Calendar = () => {
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [plantingDates, setPlantingDates] = useState([]);
  const [harvestDates, setHarvestDates] = useState([]);

  const currentMonth = date.toLocaleString('default', { month: 'long' });
  const currentYear = date.getFullYear();

  useEffect(() => {
    const crop = CROP_DATA[selectedCrop];
    const year = new Date().getFullYear(); // Use current year for planning

    const newPlantingDates = [];
    const newHarvestDates = [];

    const formatDate = (d) => d.toISOString().split('T')[0];

    crop.plantingMonths.forEach(monthIndex => {
      const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        const plantingDate = new Date(year, monthIndex, day);
        newPlantingDates.push(formatDate(plantingDate));

        const harvestDate = new Date(plantingDate);
        harvestDate.setDate(harvestDate.getDate() + crop.growthDuration);
        newHarvestDates.push(formatDate(harvestDate));
      }
    });

    setPlantingDates(newPlantingDates);
    setHarvestDates(newHarvestDates);
  }, [selectedCrop]);

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
    setDate(new Date(date.setMonth(date.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setDate(new Date(date.setMonth(date.getMonth() + 1)));
  };

  const handleDatePress = (day) => {
    if (!day) return;
    const fullDate = new Date(currentYear, date.getMonth(), day);
    // You could navigate or show info about this date
    console.log('Pressed date:', fullDate.toDateString());
  };

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: null, key: `empty-start-${i}` });
    }

    const formatDate = (d) => d.toISOString().split('T')[0];

    // Add actual days of the month
    for (let day = 1; day <= totalDays; day++) {
      const dayDate = new Date(year, month, day);
      const dateString = formatDate(dayDate);

      days.push({
        day,
        isPlanting: plantingDates.includes(dateString),
        isHarvest: harvestDates.includes(dateString),
        key: `day-${day}`
      });
    }
    
    // Add empty slots to complete the grid
    const totalSlots = 42; // 6 rows * 7 days
    while (days.length < totalSlots) {
      days.push({ day: null, key: `empty-end-${days.length}` });
    }

    return days;
  }, [date, plantingDates, harvestDates]);

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const renderCalendarDay = (dayInfo) => {
    if (!dayInfo.day) {
      return (
        <View key={dayInfo.key} style={styles.emptyDay} />
      );
    }

    const dayStyle = [
      styles.calendarDay,
      dayInfo.isPlanting && styles.plantingDay,
      dayInfo.isHarvest && styles.harvestDay,
    ];

    const textStyle = [
      styles.dayText,
      (dayInfo.isPlanting || dayInfo.isHarvest) && styles.selectedDayText
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

  const renderCropSelector = () => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cropSelectorContent}
        style={styles.cropSelectorScrollView}
      >
        {Object.keys(CROP_DATA).map((cropKey) => (
          <TouchableOpacity
            key={cropKey}
            style={[
              styles.cropButton,
              selectedCrop === cropKey && styles.selectedCropButton
            ]}
            onPress={() => setSelectedCrop(cropKey)}
          >
            <Text style={[
              styles.cropButtonText,
              selectedCrop === cropKey && styles.selectedCropButtonText
            ]}>
              {CROP_DATA[cropKey].name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  };

  const renderLegend = () => {
    return (
      <View style={styles.legendContainer}>
        <View style={styles.legendItem}>
          <View style={[styles.legendIndicator, styles.plantingDay]} />
          <Text style={styles.legendText}>Araw ng Pagtanim</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendIndicator, styles.harvestDay]} />
          <Text style={styles.legendText}>Tinatayang Araw ng Pag-ani</Text>
        </View>
      </View>
    );
  }

  const renderInfoBox = () => {
    const crop = CROP_DATA[selectedCrop];
    const plantingMonths = crop.plantingMonths.map(m => 
      new Date(0, m).toLocaleString('default', { month: 'long' })
    ).join(' - ');

    return (
      <View style={styles.dateRangeInfo}>
        <LinearGradient
          colors={['#ecfdf5', '#f0fdf4']}
          style={styles.dateRangeGradient}
        >
          <View style={styles.dateRangeHeader}>
            <Icon name="eco" size={32} color="#10b981" />
            <Text style={styles.dateRangeTitle}>{crop.name}</Text>
          </View>
          <Text style={styles.dateRangeDescription}>
            {crop.description}
          </Text>
          <View style={styles.harvestInfo}>
            <View style={styles.harvestItem}>
              <Icon name="calendar-today" size={16} color="#059669" />
              <Text style={styles.harvestText}>Planting: {plantingMonths}</Text>
            </View>
            <View style={styles.harvestItem}>
              <Icon name="schedule" size={16} color="#059669" />
              <Text style={styles.harvestText}>Grows in {crop.growthDuration} days</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Kalendaryo ng mga Ani</Text>
          <Text style={styles.subtitle}>Plano sa Pagtanim at Pag-aani</Text>
        </View>
        
        {/* Crop Selector */}
        {renderCropSelector()}

        {/* Legend */}
        {renderLegend()}

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
            <Text style={styles.monthText}>{currentMonth} {currentYear}</Text>
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
        {renderInfoBox()}
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 120, // To make space for bottom nav
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
  cropSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  cropSelectorScrollView: {
    marginBottom: 20,
  },
  cropSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  cropButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  selectedCropButton: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  cropButtonText: {
    color: '#374151',
    fontWeight: '600',
  },
  selectedCropButtonText: {
    color: '#fff',
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
    paddingHorizontal: 25,
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
    fontSize: 12,
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
    width: '14.28%',
    aspectRatio: 1,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  plantingDay: {
    backgroundColor: '#34d399', // A nice green for planting
    borderColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  harvestDay: {
    backgroundColor: '#fbbf24', // A golden yellow for harvest
    borderColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  emptyDay: {
    width: '14.28%',
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
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 8,
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
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#374151',
  },
});

export default Calendar;