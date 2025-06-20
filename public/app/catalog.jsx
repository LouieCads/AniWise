import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, Image,
  StatusBar, SafeAreaView, TouchableOpacity, TextInput
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { router } from 'expo-router';

// --- Dummy Data ---
// const categories = [
//   { id: 'all', name: 'All', image: null },
//   { id: 'plants', name: 'Pananim', image: null },
//   { id: 'tools', name: 'Gamit', image: null },
//   { id: 'fertilizers', name: 'Pataba', image: null },
//   { id: 'pots', name: 'Paso', image: null },
// ];

const shopByCategories = [
  { id: 'women', name: 'Buto', image: 'https://images.unsplash.com/photo-1613500788522-89c4d55bdd0e?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'men', name: 'Materyales', image: 'https://plus.unsplash.com/premium_photo-1678677947273-47497a96ae1c?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'kids', name: 'Pataba', image: 'https://plus.unsplash.com/premium_photo-1678371209833-b9aff08ff327?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fGZlcnRpbGl6ZXJzfGVufDB8fDB8fHww' },
  { id: 'beauty', name: 'Makinarya', image: 'https://images.unsplash.com/photo-1666706210261-a57ea3793fc0?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
];

const productsData = [
  {
    id: 1,
    name: 'Palay',
    brand: 'Local Harvest',
    description: 'Sariwa at de-kalidad',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop&auto=format',
    rating: '1500 php / sako'
  },
  {
    id: 2,
    name: 'Moon Melon',
    brand: 'Vicari\'s farm',
    description: 'Sariwa at de-kalidad',
    image: 'https://static.wikia.nocookie.net/growagarden/images/7/7a/MoonMelon.png/revision/latest?cb=20250519094623',
    rating: '1500 php / sako'
  },
  {
    id: 3,
    name: 'Kamatis',
    brand: 'Garden Fresh',
    description: 'Mainam itanim ngayong buwan',
    image: 'https://plus.unsplash.com/premium_photo-1671395501275-630ae5ea02c4?q=80&w=677&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: '1500 php / sako'
  },
  {
    id: 4,
    name: 'Talong',
    brand: 'Farm Connect',
    description: 'Patok sa tag-init',
    image: 'https://images.unsplash.com/photo-1683543122945-513029986574?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: '1500 php / sako'
  },
  {
    id: 5,
    name: 'Sili',
    brand: 'Spice Master',
    description: 'Maanghang at masarap',
    image: 'https://images.unsplash.com/photo-1526179969422-e92255a5f223?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    rating: '1500 php / sako'
  },
  {
    id: 6,
    name: 'Mais',
    brand: 'Green Farms',
    description: 'Maanghang at masarap',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=300&fit=crop&auto=format',
    rating: '1500 php / sako'
  }
];

const CatalogPage = () => {
  const [activeCategory, setActiveCategory] = React.useState('all');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* --- Search Header --- */}
        <View style={styles.searchHeader}>
          <View style={styles.searchContainer}>
            <Icon name="search" size={24} color="#A0A0A0" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#A0A0A0"
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Icon name="tune" size={24} color="#808080" /> {/* Changed icon to 'tune' for filter */}
          </TouchableOpacity>
        </View>

        {/* --- Product Categories ---
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryTabsScrollView}
          contentContainerStyle={styles.categoryTabsContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryTab,
                activeCategory === category.id && styles.activeCategoryTab
              ]}
              onPress={() => setActiveCategory(category.id)}
            >
              <Text style={[
                styles.categoryTabText,
                activeCategory === category.id && styles.activeCategoryTabText
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView> */}

        {/* --- Shop By Category Section --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mamili ayon sa kategorya</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Tingnan lahat</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.shopByCategoriesScroll}
          >
            {shopByCategories.map((cat) => (
              <TouchableOpacity key={cat.id} style={styles.shopByCategoryItem}>
                <Image source={{ uri: cat.image }} style={styles.shopByCategoryImage} />
                <Text style={styles.shopByCategoryText}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* --- Curated For You (Replaced Mga Pananim) --- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pinili para sa iyo</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Tingnan lahat</Text>
            </TouchableOpacity>
          </View>

          {/* --- Product Grid --- */}
          <View style={styles.productGrid}>
            {productsData.reduce((rows, item, index) => {
              if (index % 2 === 0) {
                rows.push([item]);
              } else {
                rows[rows.length - 1].push(item);
              }
              return rows;
            }, []).map((row, rowIndex) => (
              <View style={styles.productRow} key={rowIndex}>
                {row.map(product => (
                  <TouchableOpacity
                    key={product.id}
                    style={styles.productCard}
                    onPress={() => router.push('/product-details')}
                    activeOpacity={0.7}
                  >
                    <View style={styles.productImageContainer}>
                      <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
                    </View>
                    <View style={styles.productInfo}>
                      <Text style={styles.productBrand}>{product.brand}</Text>
                      <Text style={styles.productName}>{product.name}</Text>
                      <View style={styles.productRatingContainer}>
                        <Text style={styles.productRating}>{product.rating}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* --- Bottom Spacer --- */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* --- Original Bottom Navigation --- */}
      <View style={styles.bottomNavContainer}>
            <LinearGradient
            colors={['#ffffff', '#f8fafc']}
            style={styles.bottomNav}
            >
            <TouchableOpacity style={styles.navButton} onPress={() => router.push('/weather')}>
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
    backgroundColor: '#F7F7F7', // Lighter background to match the image
  },
  scrollView: {
    flex: 1,
  },
  // --- Search Header ---
  searchHeader: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8, // Reduced padding to make space for categories
    alignItems: 'center',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25, // More rounded
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 16,
    height: 50, // Fixed height
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333333',
    paddingVertical: 0, // Remove default vertical padding
  },
  filterButton: {
    width: 50, // Slightly smaller button
    height: 50,
    backgroundColor: '#FFFFFF', // White background
    borderRadius: 25, // Perfectly circular
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  // --- Category Tabs ---
  categoryTabsScrollView: {
    marginBottom: 20,
    paddingLeft: 20, // Align with search bar
  },
  categoryTabsContent: {
    gap: 10,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  activeCategoryTab: {
    backgroundColor: '#10b981', // Active color from original nav
    borderColor: '#10b981',
  },
  categoryTabText: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
  },
  activeCategoryTabText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  // --- Section Headers ---
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeAll: {
    fontSize: 14,
    color: '#A0A0A0', // Softer "See All"
    fontWeight: '600',
  },
  shopButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start', // Keep button to the left
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333', // Dark text on white button
  },

  // --- Shop By Category ---
  shopByCategoriesScroll: {
    gap: 15, // Space between category circles
  },
  shopByCategoryItem: {
    alignItems: 'center',
    width: 80, // Fixed width for each item
  },
  shopByCategoryImage: {
    width: 70, // Size of the circular image
    height: 70,
    borderRadius: 35, // Half of width/height for perfect circle
    borderWidth: 1,
    borderColor: '#EFEFEF', // Light border
    marginBottom: 8,
  },
  shopByCategoryText: {
    fontSize: 13,
    color: '#555555',
    fontWeight: '500',
    textAlign: 'center',
  },

  // --- Product Grid (Curated For You) ---
  productGrid: {
    gap: 16,
  },
  productRow: {
    flexDirection: 'row',
    gap: 16,
  },
  productCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 10, // Slightly less rounded than original seedCard
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 }, // More subtle shadow
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  },
  productImageContainer: {
    height: 140, // Image takes more vertical space
    width: '100%',
    backgroundColor: '#F8F8F8',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    padding: 12, // Adjusted padding
    alignItems: 'flex-start', // Align text to the left
  },
  productBrand: {
    fontSize: 12,
    color: '#A0A0A0', // Softer color for brand
    marginBottom: 4,
    fontWeight: '500',
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  productRatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productRating: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },

  bottomSpacer: {
    height: 100, // Ensure space above bottom nav
  },

  // --- ORIGINAL BOTTOM NAVIGATION STYLES (AS REQUESTED) ---
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
    color: '#6b7280',
    marginTop: 4,
    fontWeight: '500',
  },
  // activeNavLabel style was removed as it's not present in original nav
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