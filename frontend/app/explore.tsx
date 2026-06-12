import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Car, fetchCars } from '@/services/api';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ExploreScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadCars = async () => {
    try {
      const data = await fetchCars();
      setCars(data);
    } catch (error) {
      console.error('Error loading cars:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadCars();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066B4" />
        <ThemedText style={styles.loadingText}>Loading BMW cars...</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <ThemedView style={styles.header}>
        <ThemedText style={styles.title}>Explore BMW</ThemedText>
        <ThemedText style={styles.subtitle}>
          Discover our collection of luxury vehicles
        </ThemedText>
      </ThemedView>

      <View style={styles.grid}>
        {cars.map((car) => (
          <TouchableOpacity 
            key={car.id} 
            style={styles.carCard}
            onPress={() => router.push(`/car/${car.id}`)}
          >
            <Image source={{ uri: car.image }} style={styles.carImage} />
            <View style={styles.carInfo}>
              <ThemedText style={styles.carModel}>{car.model}</ThemedText>
              <ThemedText style={styles.carPrice}>{car.price}</ThemedText>
              <View style={styles.specs}>
                <ThemedText style={styles.specText}>⚡ {car.horsepower}</ThemedText>
                <ThemedText style={styles.specText}>📅 {car.year}</ThemedText>
              </View>
              <TouchableOpacity style={styles.detailsButton}>
                <ThemedText style={styles.detailsText}>View Details →</ThemedText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0066B4',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  grid: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  carCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  carImage: {
    width: '100%',
    height: 200,
  },
  carInfo: {
    padding: 16,
  },
  carModel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  carPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0066B4',
    marginTop: 4,
  },
  specs: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 12,
    marginBottom: 16,
  },
  specText: {
    fontSize: 13,
    color: '#666',
  },
  detailsButton: {
    backgroundColor: '#0066B4',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  detailsText: {
    color: '#fff',
    fontWeight: '600',
  },
});