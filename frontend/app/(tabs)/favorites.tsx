import { Car, fetchCars } from '../../services/api';
import { getFavorites, removeFavorite } from '../../services/favorites';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function FavoritesScreen() {
  const [favoriteCars, setFavoriteCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const favIds = await getFavorites();
      setFavoriteIds(favIds);
      
      if (favIds.length === 0) {
        setFavoriteCars([]);
        setLoading(false);
        return;
      }
      
      const allCars = await fetchCars();
      const filtered = allCars.filter(car => favIds.includes(car.id));
      setFavoriteCars(filtered);
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadFavorites();
  };

  const handleRemoveFavorite = async (carId: number) => {
    await removeFavorite(carId);
    setFavoriteCars(prev => prev.filter(car => car.id !== carId));
    setFavoriteIds(prev => prev.filter(id => id !== carId));
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066B4" />
        <Text style={styles.loadingText}>Loading favorites...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.header}>
        <Text style={styles.title}>❤️ My Favorites</Text>
        <Text style={styles.subtitle}>
          {favoriteCars.length} car{favoriteCars.length !== 1 ? 's' : ''} saved
        </Text>
      </View>

      {favoriteCars.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>❤️</Text>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>
            Tap the heart icon on any car to add it to your favorites
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/')}
          >
            <Text style={styles.browseButtonText}>Browse Cars →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.grid}>
          {favoriteCars.map((car) => (
            <TouchableOpacity 
              key={car.id} 
              style={styles.carCard} 
              onPress={() => router.push(`/car/${car.id}`)}
            >
              <Image source={{ uri: car.image }} style={styles.carImage} />
              <TouchableOpacity 
                style={styles.favoriteButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleRemoveFavorite(car.id);
                }}
              >
                <Text style={styles.favoriteButtonText}>❤️</Text>
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
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 20, backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 80, paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptyText: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
  browseButton: { backgroundColor: '#0066B4', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  browseButtonText: { color: '#fff', fontWeight: '600' },
  grid: { paddingHorizontal: 16, paddingBottom: 30 },
  carCard: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 20, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, position: 'relative' },
  carImage: { width: '100%', height: 200 },
  favoriteButton: { position: 'absolute', top: 12, right: 12, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20, padding: 8, zIndex: 1 },
  favoriteButtonText: { fontSize: 24 },
  carInfo: { padding: 16 },
  carModel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  carPrice: { fontSize: 20, fontWeight: 'bold', color: '#0066B4', marginTop: 4 },
  specs: { flexDirection: 'row', gap: 16, marginTop: 12, marginBottom: 16 },
  specText: { fontSize: 13, color: '#666' },
  detailsButton: { backgroundColor: '#0066B4', paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  detailsText: { color: '#fff', fontWeight: '600' },
});