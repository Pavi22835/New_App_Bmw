import { useEffect, useState } from 'react';
import { fetchCars } from '@/services/api';
import { getRecentCars } from '@/services/appStorage';
import { router } from 'expo-router';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function RecentCarsScreen() {
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRecent = async () => {
    try {
      setLoading(true);
      const [allCars, recentIds] = await Promise.all([fetchCars(), getRecentCars()]);
      setCars(allCars.filter((car) => recentIds.includes(car.id)));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecent();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066B4" />
        <Text style={styles.statusText}>Loading recently viewed cars...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Recently Viewed</Text>
      {cars.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No recent cars yet</Text>
          <Text style={styles.emptyText}>View cars from the homepage and they will appear here.</Text>
        </View>
      ) : (
        cars.map((car) => (
          <TouchableOpacity key={car.id} style={styles.card} onPress={() => router.push(`/car/${car.id}`)}>
            <Image source={{ uri: car.image }} style={styles.image} />
            <View style={styles.cardContent}>
              <Text style={styles.carModel}>{car.model}</Text>
              <Text style={styles.carPrice}>{car.price}</Text>
              <Text style={styles.carTag}>{car.tag}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5', padding: 20 },
  statusText: { marginTop: 12, color: '#666' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0066B4', marginBottom: 16 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 22 },
  card: { backgroundColor: '#fff', borderRadius: 18, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  image: { width: '100%', height: 180 },
  cardContent: { padding: 16 },
  carModel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  carPrice: { fontSize: 16, color: '#0066B4', marginTop: 8 },
  carTag: { fontSize: 14, color: '#666', marginTop: 4 },
});
