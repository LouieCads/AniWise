import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

const Dashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#14532d" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={['#14532d', '#166534', '#15803d']}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.profileImageContainer}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&auto=format'
                  }}
                  style={styles.profileImage}
                />
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.headerText}>
                <Text style={styles.greeting}>Hello, Lito! 👋</Text>
                <Text style={styles.subtitle}>Ready to grow today?</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.menuButton}>
              <Icon name="trending-up" size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Temperature and Date Cards */}
        <View style={styles.cardRow}>
          {/* Temperature Card */}
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.temperatureCard}
          >
            <View style={styles.iconBackground}>
              <Icon name="trending-up" size={28} color="#10b981" />
            </View>
            <Text style={styles.temperature}>39°C</Text>
            <Text style={styles.time}>1:00 AM</Text>
            <View style={styles.cardAccent} />
          </LinearGradient>

          {/* Date Card */}
          <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.dateCard}
          >
            <View style={styles.dateHeader}>
              <Text style={styles.dateTitle}>Abr. 20-26</Text>
              <Icon name="schedule" size={20} color="#10b981" />
            </View>
            <Text style={styles.dateDescription}>
              ang pinakamainom na petsa para anihin ang inyong mga pananim.
            </Text>
            <View style={styles.cardAccent} />
          </LinearGradient>
        </View>

        {/* Statistics Card */}
        <LinearGradient
          colors={['#10b981', '#059669', '#047857']}
          style={styles.statsCard}
        >
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>Estadistika ng ani</Text>
            <TouchableOpacity style={styles.moreButton}>
              <Icon name="more-horiz" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>
          <View style={styles.statsContent}>
            {/* Bar Chart */}
            <View style={styles.barChart}>
              <View style={styles.barContainer}>
                <View style={[styles.bar, { height: 48 }]} />
                <Text style={styles.barLabel}>M</Text>
              </View>
              <View style={styles.barContainer}>
                <View style={[styles.bar, { height: 80 }]} />
                <Text style={styles.barLabel}>T</Text>
              </View>
              <View style={styles.barContainer}>
                <View style={[styles.bar, { height: 64 }]} />
                <Text style={styles.barLabel}>W</Text>
              </View>
              <View style={styles.barContainer}>
                <View style={[styles.bar, { height: 40 }]} />
                <Text style={styles.barLabel}>T</Text>
              </View>
              <View style={styles.barContainer}>
                <View style={[styles.bar, { height: 56 }]} />
                <Text style={styles.barLabel}>F</Text>
              </View>
            </View>
            
            {/* Pie Chart */}
            <View style={styles.pieChart}>
              <View style={styles.pieBase}>
                <View style={styles.pieSlice} />
                <View style={styles.pieCenter}>
                  <Text style={styles.pieText}>75%</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Tignan Section */}
        <View style={styles.tignanSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tignan</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          
          {/* Question Cards */}
          <TouchableOpacity style={styles.questionCard}>
            <View style={styles.questionImageContainer}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=80&fit=crop&auto=format'
                }}
                style={styles.questionImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)']}
                style={styles.imageOverlay}
              />
            </View>
            <View style={styles.questionContent}>
              <Text style={styles.questionTitle}>Paano magtanim ng palay?</Text>
              <Text style={styles.questionSubtitle}>
                Panoorin kung paano ang pagtataruhan ng palay.
              </Text>
              <View style={styles.questionMeta}>
                <Icon name="play-circle-outline" size={16} color="#10b981" />
                <Text style={styles.duration}>5 min</Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.questionCard}>
            <View style={styles.questionImageContainer}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=100&h=80&fit=crop&auto=format'
                }}
                style={styles.questionImage}
              />
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.3)']}
                style={styles.imageOverlay}
              />
            </View>
            <View style={styles.questionContent}>
              <Text style={styles.questionTitle}>Paano magtanim ng palay?</Text>
              <Text style={styles.questionSubtitle}>
                Panoorin kung paano ang pagtataruhan ng palay.
              </Text>
              <View style={styles.questionMeta}>
                <Icon name="play-circle-outline" size={16} color="#10b981" />
                <Text style={styles.duration}>3 min</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
      
      {/* Fixed Bottom Navigation */}
      <View style={styles.bottomNavContainer}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc']}
          style={styles.bottomNav}
        >
          <TouchableOpacity style={styles.navButton}>
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
            <Icon name="shopping-cart" size={24} color="#6b7280" />
            <Text style={styles.navLabel} onPress={() => router.push('/catalog')}>Shop</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={() => router.push('/alerts')}>
            <Icon name="notifications" size={24} color="#6b7280" />
            <Text style={styles.navLabel}>Alerts</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f5f9',
  },
  scrollView: {
    flex: 1,
  },
  headerGradient: {
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  profileImage: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    borderColor: '#10b981',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10b981',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  menuButton: {
    width: 44,
    height: 44,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  cardRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
    gap: 16,
  },
  temperatureCard: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  iconBackground: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#ecfdf5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  temperature: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#64748b',
  },
  dateCard: {
    flex: 1.3,
    borderRadius: 20,
    padding: 20,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  dateDescription: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
  },
  cardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 4,
    height: '100%',
    backgroundColor: '#10b981',
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
  },
  statsCard: {
    margin: 20,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  moreButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
    flex: 1,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    marginBottom: 8,
  },
  barLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  pieChart: {
    width: 80,
    height: 80,
    marginLeft: 24,
  },
  pieBase: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieSlice: {
    position: 'absolute',
    top: -10,
    right: -10,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ffffff',
  },
  pieCenter: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  tignanSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  bottomSpacer: {
    height: 100, // Space for fixed bottom navigation
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  seeAll: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  questionCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  questionImageContainer: {
    position: 'relative',
  },
  questionImage: {
    width: 100,
    height: 90,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 30,
  },
  questionContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
    marginBottom: 6,
    lineHeight: 22,
  },
  questionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    lineHeight: 18,
    marginBottom: 8,
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  duration: {
    fontSize: 12,
    color: '#10b981',
    marginLeft: 4,
    fontWeight: '500',
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

export default Dashboard;