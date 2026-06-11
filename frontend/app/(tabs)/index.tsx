import { Car, fetchCars } from '../../services/api';
import { getFavorites, toggleFavorite } from '../../services/favorites';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

export default function HomeScreen() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  const tags = ['All', 'Sport', 'Electric', 'SUV', 'Luxury', 'Convertible'];

  const loadCars = async () => {
    try {
      setError(null);
      const data = await fetchCars();
      setCars(data);
    } catch (err) {
      setError('Failed to load cars. Make sure backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadFavorites = async () => {
    const favs = await getFavorites();
    setFavorites(favs);
  };

  const handleToggleFavorite = async (carId: number) => {
    const isNowFavorite = await toggleFavorite(carId);
    if (isNowFavorite) {
      setFavorites(prev => [...prev, carId]);
    } else {
      setFavorites(prev => prev.filter(id => id !== carId));
    }
  };

  useEffect(() => {
    loadCars();
    loadFavorites();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadCars();
    loadFavorites();
  };

  const filteredCars = cars.filter(car => {
    const matchesTag = selectedTag === 'All' || car.tag === selectedTag;
    const matchesSearch = searchQuery === '' || 
      car.model.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066B4" />
        <Text style={styles.loadingText}>Loading BMW cars...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCars}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back 👋</Text>
          <Text style={styles.title}>Discover BMW</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/favorites')}
        >
          <Text style={styles.cartIcon}>🛒</Text>
          {favorites.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{favorites.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by model name..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
        {tags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tag, selectedTag === tag && styles.tagActive]}
            onPress={() => setSelectedTag(tag)}
          >
            <Text style={[styles.tagText, selectedTag === tag && styles.tagTextActive]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          Found {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {filteredCars.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsEmoji}>🔍</Text>
          <Text style={styles.noResultsTitle}>No cars found</Text>
          <Text style={styles.noResultsText}>
            Try searching for "M4" or "i7" or clear the search
          </Text>
          <TouchableOpacity style={styles.clearSearchButton} onPress={clearSearch}>
            <Text style={styles.clearSearchButtonText}>Clear Search</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.grid}>
          {filteredCars.map((car) => (
            <TouchableOpacity 
              key={car.id} 
              style={styles.carCard} 
              onPress={() => router.push(`/car/${car.id}`)}
            >
              <Image source={{ uri: car.image }} style={styles.carImage} />
              <TouchableOpacity 
                style={styles.cartButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleToggleFavorite(car.id);
                }}
              >
                <Text style={styles.cartButtonText}>
                  {favorites.includes(car.id) ? '🛒' : '📦'}
                </Text>
              </TouchableOpacity>
              <View style={styles.carInfo}>
                <Text style={styles.carModel}>{car.model}</Text>
                <Text style={styles.carPrice}>{car.price}</Text>
                <View style={styles.specs}>
                  <Text style={styles.specText}>⚡ {car.horsepower}</Text>
                  <Text style={styles.specText}>🔧 {car.engine.split(' ')[0]}</Text>
                </View>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsText}>View Details →</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  loadingText: { marginTop: 12, color: '#666' },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 16 },
  retryButton: { backgroundColor: '#0066B4', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#fff' },
  greeting: { fontSize: 14, color: '#666' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0066B4', marginTop: 4 },
  profileButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  cartIcon: { fontSize: 24 },
  badge: { position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 10, minWidth: 18, height: 18, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 4 },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  searchContainer: { paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0' },
  searchIcon: { fontSize: 18, marginRight: 10, color: '#666' },
  searchInput: { flex: 1, fontSize: 16, color: '#333', padding: 0 },
  clearButton: { padding: 4 },
  clearButtonText: { fontSize: 18, color: '#999', fontWeight: '600' },
  tagsContainer: { paddingHorizontal: 20, paddingVertical: 12 },
  tag: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', marginRight: 12 },
  tagActive: { backgroundColor: '#0066B4' },
  tagText: { color: '#666', fontWeight: '600' },
  tagTextActive: { color: '#fff' },
  resultsContainer: { paddingHorizontal: 20, paddingVertical: 8 },
  resultsText: { fontSize: 14, color: '#666' },
  noResultsContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  noResultsEmoji: { fontSize: 64, marginBottom: 16 },
  noResultsTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  noResultsText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
  clearSearchButton: { backgroundColor: '#0066B4', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  clearSearchButtonText: { color: '#fff', fontWeight: '600' },
  grid: { paddingHorizontal: 16, paddingBottom: 30 },
  carCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 20, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, position: 'relative' },
  carImage: { width: '100%', height: 200 },
  cartButton: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 8, zIndex: 1 },
  cartButtonText: { fontSize: 24 },
  carInfo: { padding: 16 },
  carModel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  carPrice: { fontSize: 20, fontWeight: 'bold', color: '#0066B4', marginTop: 4 },
  specs: { flexDirection: 'row', gap: 16, marginTop: 12, marginBottom: 16 },
  specText: { fontSize: 13, color: '#666' },
  detailsButton: { backgroundColor: '#0066B4', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  detailsText: { color: '#fff', fontWeight: '600' },
});