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

const Dashboard = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&h=60&fit=crop&crop=face&auto=format'
              }}
              style={styles.profileImage}
            />
            <View style={styles.headerText}>
              <Text style={styles.greeting}>Hello, Lito!</Text>
              <Text style={styles.subtitle}>Lorem Ipsum Dolor Sit</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Icon name="trending-up" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Temperature and Date Cards */}
        <View style={styles.cardRow}>
          {/* Temperature Card */}
          <View style={styles.temperatureCard}>
            <Icon name="trending-up" size={32} color="#16a34a" style={styles.tempIcon} />
            <Text style={styles.temperature}>39°C</Text>
            <Text style={styles.time}>1:00 AM</Text>
          </View>

          {/* Date Card */}
          <View style={styles.dateCard}>
            <Text style={styles.dateTitle}>Abr. 20-26</Text>
            <Text style={styles.dateDescription}>
              ang pinakamainom na petsa para anihin ang inyong mga pananim.
            </Text>
          </View>
        </View>

        {/* Statistics Card */}
        <LinearGradient
          colors={['#4ade80', '#22c55e']}
          style={styles.statsCard}
        >
          <Text style={styles.statsTitle}>Estadistika ng ani</Text>
          <View style={styles.statsContent}>
            {/* Bar Chart */}
            <View style={styles.barChart}>
              <View style={[styles.bar, { height: 48 }]} />
              <View style={[styles.bar, { height: 80 }]} />
              <View style={[styles.bar, { height: 64 }]} />
              <View style={[styles.bar, { height: 40 }]} />
              <View style={[styles.bar, { height: 56 }]} />
            </View>
            
            {/* Pie Chart */}
            <View style={styles.pieChart}>
              <View style={styles.pieBase}>
                <View style={styles.pieSlice} />
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Tignan Section */}
        <View style={styles.tignanSection}>
          <Text style={styles.sectionTitle}>Tignan</Text>
          
          {/* Question Cards */}
          <TouchableOpacity style={styles.questionCard}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=100&h=80&fit=crop&auto=format'
              }}
              style={styles.questionImage}
            />
            <View style={styles.questionContent}>
              <Text style={styles.questionTitle}>Paano magtanim ng palay?</Text>
              <Text style={styles.questionSubtitle}>
                Panoorin kung paano ang pagtataruhan ng palay.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.questionCard}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=100&h=80&fit=crop&auto=format'
              }}
              style={styles.questionImage}
            />
            <View style={styles.questionContent}>
              <Text style={styles.questionTitle}>Paano magtanim ng palay?</Text>
              <Text style={styles.questionSubtitle}>
                Panoorin kung paano ang pagtataruhan ng palay.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Bottom Navigation */}
        <View style={styles.bottomNav}>
          <TouchableOpacity style={styles.navButton}>
            <Icon name="cloud" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Icon name="calendar-today" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.homeButton}>
            <Icon name="home" size={32} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Icon name="shopping-cart" size={24} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton}>
            <Icon name="notifications" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#15803d',
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Poppins-Regular',
  },
  menuButton: {
    width: 40,
    height: 40,
    backgroundColor: '#15803d',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  temperatureCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  tempIcon: {
    marginBottom: 8,
  },
  temperature: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#15803d',
    fontFamily: 'Poppins-Bold',
  },
  time: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Poppins-Regular',
  },
  dateCard: {
    flex: 1.2,
    backgroundColor: '#ffffff',
    borderWidth: 2,
    borderColor: '#22c55e',
    borderRadius: 12,
    padding: 16,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  dateDescription: {
    fontSize: 12,
    color: '#6b7280',
    lineHeight: 16,
    fontFamily: 'Poppins-Regular',
  },
  statsCard: {
    margin: 16,
    borderRadius: 12,
    padding: 24,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  statsContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    flex: 1,
  },
  bar: {
    width: 24,
    backgroundColor: '#15803d',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  pieChart: {
    width: 80,
    height: 80,
    marginLeft: 16,
  },
  pieBase: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#15803d',
    position: 'relative',
    overflow: 'hidden',
  },
  pieSlice: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  tignanSection: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    fontFamily: 'Poppins-Bold',
  },
  questionCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  questionImage: {
    width: 80,
    height: 80,
  },
  questionContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'center',
  },
  questionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#15803d',
    marginBottom: 4,
    fontFamily: 'Poppins-SemiBold',
  },
  questionSubtitle: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Poppins-Regular',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  navButton: {
    width: 48,
    height: 48,
    backgroundColor: '#16a34a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeButton: {
    width: 64,
    height: 64,
    backgroundColor: '#16a34a',
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default Dashboard;