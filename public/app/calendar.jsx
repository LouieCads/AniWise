import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

const CROP_DATA = {
  rice: {
    name: 'Palay',
    icon: '🌾',
    plantingMonths: [5, 6], // June, July
    growthDuration: 120, // days
    description: 'Mainam itanim ang palay sa Hunyo-Hulyo dahil sa pagsisimula ng tag-ulan. Kailangan ng maraming tubig para sa magandang ani.',
    tips: 'Siguraduhing may sapat na tubig at tamang lupa. Mag-apply ng fertilizer pagkatapos ng 2 linggo.',
    regionalAdvice: 'Sa Luzon: Tamang panahon para sa regular na pag-ulan. Sa Visayas/Mindanao: Sundin ang lokal na pattern ng ulan.'
  },
  corn: {
    name: 'Mais',
    icon: '🌽',
    plantingMonths: [4, 5], // May, June
    growthDuration: 75,
    description: 'Itanim ang mais sa Mayo-Hunyo para sa tamang init at ulan. Mas mabilis lumaki kumpara sa palay.',
    tips: 'Lagyan ng compost o pataba. Bantayan ang peste lalo na sa unang buwan.',
    regionalAdvice: 'Angkop sa lahat ng rehiyon. Pwedeng 2-3 beses sa isang taon depende sa lugar.'
  },
  sugarcane: {
    name: 'Tubo',
    icon: '🎋',
    plantingMonths: [9, 10], // October, November
    growthDuration: 365,
    description: 'Mahabang panahon bago ma-ani ang tubo. Itanim sa Oktubre-Nobyembre para sa tamang laki.',
    tips: 'Kailangan ng malaking lupang sakahan. Regular na pag-aalaga sa loob ng 1 taon.',
    regionalAdvice: 'Sikat sa Negros at iba pang sugar-producing areas. Kailangan ng tamang klima.'
  },
  onion: {
    name: 'Sibuyas',
    icon: '🧅',
    plantingMonths: [10, 11], // November, December
    growthDuration: 90,
    description: 'Itanim sa simula ng tag-lamig para sa magandang laki. Ayaw ng masyadong ulan.',
    tips: 'Kailangan ng matabang lupa. Iwasan ang sobrang tubig para hindi mabulok.',
    regionalAdvice: 'Kilala ang Nueva Ecija sa magagandang sibuyas. Sundin ang tamang spacing.'
  },
  mango: {
    name: 'Mangga',
    icon: '🥭',
    plantingMonths: [2, 3], // March, April
    growthDuration: 120,
    description: 'Itanim sa tag-init para sa tamang pamumulaklak. Magbubunga ng matamis na mangga.',
    tips: 'Kailangan ng malalim na hukay. Regular na pruning para sa magandang hugis.',
    regionalAdvice: 'Sikat sa Guimaras at Central Luzon. Kailangan ng matagal na pag-aalaga.'
  }
};

const getApiUrl = () => process.env.EXPO_PUBLIC_API_URL || 'http://192.168.254.169:3000';

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
    const year = new Date().getFullYear();

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

  const weekDays = ['Lin', 'Lun', 'Mar', 'Miy', 'Huw', 'Biy', 'Sab'];

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
        {dayInfo.isPlanting && (
          <View style={styles.plantingIndicator}>
            <Text style={styles.indicatorText}>🌱</Text>
          </View>
        )}
        {dayInfo.isHarvest && (
          <View style={styles.harvestIndicator}>
            <Text style={styles.indicatorText}>🌾</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderCropSelector = () => {
    return (
      <View style={styles.cropSelectorContainer}>
        <Text style={styles.cropSelectorTitle}>Piliin ang Pananim:</Text>
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
              <Text style={styles.cropIcon}>{CROP_DATA[cropKey].icon}</Text>
              <Text style={[
                styles.cropButtonText,
                selectedCrop === cropKey && styles.selectedCropButtonText
              ]}>
                {CROP_DATA[cropKey].name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderLegend = () => {
    return (
      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Gabay sa Kalendaryo:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={styles.legendBox}>
              <Text style={styles.legendEmoji}>🌱</Text>
            </View>
            <Text style={styles.legendText}>Panahon ng Pagtanim</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={styles.legendBox}>
              <Text style={styles.legendEmoji}>🌾</Text>
            </View>
            <Text style={styles.legendText}>Panahon ng Pag-ani</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderInfoBox = () => {
    const crop = CROP_DATA[selectedCrop];
    const plantingMonths = crop.plantingMonths.map(m => {
      const months = ['Enero', 'Pebrero', 'Marso', 'Abril', 'Mayo', 'Hunyo', 
                     'Hulyo', 'Agosto', 'Setyembre', 'Oktubre', 'Nobyembre', 'Disyembre'];
      return months[m];
    }).join(' - ');

    return (
      <View style={styles.infoContainer}>
        <LinearGradient
          colors={['#f0fdf4', '#dcfce7']}
          style={styles.infoGradient}
        >
          <View style={styles.infoHeader}>
            <Text style={styles.cropEmoji}>{crop.icon}</Text>
            <Text style={styles.infoTitle}>{crop.name}</Text>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>📅 Kapag Itatanim:</Text>
            <Text style={styles.infoText}>{plantingMonths}</Text>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>⏰ Tagal ng Paglaki:</Text>
            <Text style={styles.infoText}>{crop.growthDuration} araw</Text>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>📝 Paliwanag:</Text>
            <Text style={styles.infoDescription}>{crop.description}</Text>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>💡 Mga Tip:</Text>
            <Text style={styles.infoDescription}>{crop.tips}</Text>
          </View>
          
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>🏝️ Sa mga Rehiyon:</Text>
            <Text style={styles.infoDescription}>{crop.regionalAdvice}</Text>
          </View>
        </LinearGradient>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#15803d" />
      
      {/* Header */}
      <LinearGradient
        colors={['#15803d', '#22c55e']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Icon name="chevron-left" size={24} color="#ffffff" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Kalendaryo ng Ani</Text>
        
        <View style={{ width: 40 }} />
      </LinearGradient>
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
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
            <Icon name="chevron-left" size={24} color="#15803d" />
          </TouchableOpacity>
          
          <LinearGradient
            colors={['#15803d', '#22c55e']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.monthContainer}
          >
            <Text style={styles.monthText}>{currentMonth} {currentYear}</Text>
          </LinearGradient>
          
          <TouchableOpacity 
            style={styles.navButton}
            onPress={handleNextMonth}
            activeOpacity={0.7}
          >
            <Icon name="chevron-right" size={24} color="#15803d" />
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

        {/* Selected Crop Info */}
        {renderInfoBox()}
      </ScrollView>

      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.bottomNav}
        >
          <TouchableOpacity style={styles.navButton } onPress={() => router.push('/weather')}>
            <Icon name="cloud" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Weather</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/calendar')}>
            <Icon name="calendar-today" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeButton} onPress={() => router.push('/dashboard')}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.homeButtonGradient}
            >
              <Icon name="home" size={28} color="#ffffff" />
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/catalog')}>
            <Icon name="payments" size={24} color="#6b7280" />
            <Text style={styles.navLabel} onPress={() => router.push('/catalog')}>Loan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/journal')}>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 120,
  },
  cropSelectorContainer: {
    marginBottom: 24,
  },
  cropSelectorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 12,
    textAlign: 'center',
  },
  cropSelectorScrollView: {
    marginBottom: 0,
  },
  cropSelectorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 4,
  },
  cropButton: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedCropButton: {
    backgroundColor: '#15803d',
    borderColor: '#15803d',
  },
  cropIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  cropButtonText: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 12,
  },
  selectedCropButtonText: {
    color: '#ffffff',
  },
  legendContainer: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 12,
    textAlign: 'center',
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    alignItems: 'center',
  },
  legendBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0fdf4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendEmoji: {
    fontSize: 20,
  },
  legendText: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
  },
  monthNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  monthContainer: {
    flex: 5,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  calendarContainer: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
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
    fontWeight: 'bold',
    color: '#15803d',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 8,
  },
  calendarDay: {
    width: '13.5%',
    height: 0,
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  plantingDay: {
    backgroundColor: '#bbf7d0',
    borderColor: '#22c55e',
  },
  harvestDay: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
  },
  emptyDay: {
    width: '13.5%',
    aspectRatio: 1,
  },
  dayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  selectedDayText: {
    color: '#15803d',
    fontWeight: 'bold',
  },
  plantingIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  harvestIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
  },
  indicatorText: {
    fontSize: 8,
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoGradient: {
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#22c55e',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  cropEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803d',
  },
  infoSection: {
    marginBottom: 16,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '600',
  },
  infoDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
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
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  navItem: {
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
    color: '#15803d',
    fontWeight: 'bold',
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