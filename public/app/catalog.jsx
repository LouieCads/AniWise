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
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

const CatalogPage = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f1f5f9" />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Header */}
        <View style={styles.searchHeader}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={24} color="#9ca3af" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Maghanap..."
              placeholderTextColor="#9ca3af"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="filter-list" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Sikat ngayon Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sikat ngayon</Text>
          
          {/* Farming Kit Card */}
          <LinearGradient
            colors={['#14532d', '#166534', '#15803d']}
            style={styles.farmingKitCard}
          >
            <View style={styles.farmingKitContent}>
              <Text style={styles.farmingKitTitle}>Farming Kit</Text>
              <TouchableOpacity style={styles.tignanButton}>
                <Text style={styles.tignanButtonText}>Tignan</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.farmingKitImages}>
              <View style={styles.pottingJar}>
                <View style={styles.jarTop} />
                <View style={styles.jarBody}>
                  <Text style={styles.jarLabel}>Potting{'\n'}Jar</Text>
                </View>
              </View>
              <View style={styles.fertilizerContainer}>
                <View style={styles.fertilizerPacket} />
                <View style={styles.fertilizerBottle}>
                  <Text style={styles.fertilizerLabel}>Fertilizer</Text>
                  <Icon name="eco" size={16} color="#15803d" />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Mga Pananim Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mga Pananim</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Tignan lahat</Text>
            </TouchableOpacity>
          </View>

          {/* Seeds Grid */}
          <View style={styles.seedsGrid}>
            {/* Row 1 */}
            <View style={styles.seedRow}>
              <TouchableOpacity style={styles.seedCard}
               onPress={() => router.push('/product-details', { 
                    productId: 1, 
                    productName: 'Palay' 
                })}>
                <View style={styles.seedImageContainer}>
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=150&fit=crop&auto=format'
                    }}
                    style={styles.seedImage}
                  />
                </View>
                <View style={styles.seedInfo}>
                  <Text style={styles.seedName}>Palay</Text>
                  <Text style={styles.seedDescription}>Sariwa at de-kalidad</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.seedCard}>
                <View style={styles.seedImageContainer}>
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&h=150&fit=crop&auto=format'
                    }}
                    style={styles.seedImage}
                  />
                </View>
                <View style={styles.seedInfo}>
                  <Text style={styles.seedName}>Mais</Text>
                  <Text style={styles.seedDescription}>Sariwa at de-kalidad</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* // Row 2
            <View style={styles.seedRow}>
              <TouchableOpacity style={styles.seedCard}>
                <View style={styles.seedImageContainer}>
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200&h=150&fit=crop&auto=format'
                    }}
                    style={styles.seedImage}
                  />
                </View>
                <View style={styles.seedInfo}>
                  <Text style={styles.seedName}>Palay</Text>
                  <Text style={styles.seedDescription}>Sariwa at de-kalidad</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity style={styles.seedCard}>
                <View style={styles.seedImageContainer}>
                  <Image
                    source={{
                      uri: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200&h=150&fit=crop&auto=format'
                    }}
                    style={styles.seedImage}
                  />
                </View>
                <View style={styles.seedInfo}>
                  <Text style={styles.seedName}>Mais</Text>
                  <Text style={styles.seedDescription}>Sariwa at de-kalidad</Text>
                </View>
              </TouchableOpacity>
            </View> */}
          </View>
        </View>

        {/* Bottom Spacer */}
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
  searchHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#87BE42',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    paddingVertical: 16,
  },
  filterButton: {
    width: 52,
    height: 52,
    backgroundColor: '#87BE42',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAll: {
    fontSize: 14,
    color: '#10b981',
    fontWeight: '600',
  },
  farmingKitCard: {
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    overflow: 'hidden',
  },
  farmingKitContent: {
    flex: 1,
  },
  farmingKitTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  tignanButton: {
    backgroundColor: '#87BE42',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  tignanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  farmingKitImages: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pottingJar: {
    alignItems: 'center',
  },
  jarTop: {
    width: 32,
    height: 8,
    backgroundColor: '#d4a574',
    borderRadius: 4,
    marginBottom: 2,
  },
  jarBody: {
    width: 40,
    height: 50,
    backgroundColor: '#e5b887',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#cd9456',
  },
  jarLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#7c2d12',
    textAlign: 'center',
    lineHeight: 10,
  },
  fertilizerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  fertilizerPacket: {
    width: 24,
    height: 32,
    backgroundColor: '#fbbf24',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  fertilizerBottle: {
    width: 32,
    height: 48,
    backgroundColor: '#87BE42',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  fertilizerLabel: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 2,
  },
  seedsGrid: {
    gap: 16,
  },
  seedRow: {
    flexDirection: 'row',
    gap: 16,
  },
  seedCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#87BE42',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  seedImageContainer: {
    height: 120,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  seedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  seedInfo: {
    padding: 16,
    alignItems: 'center',
  },
  seedName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#15803d',
    marginBottom: 4,
    textAlign: 'center',
  },
  seedDescription: {
    fontSize: 12,
    color: '#87BE42',
    textAlign: 'center',
    fontWeight: '500',
  },
  bottomSpacer: {
    height: 100,
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

export default CatalogPage;                                                                                     