import { Car, fetchCarById } from '../../services/api';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CarDetailScreen() {
  const { id } = useLocalSearchParams();
  const [car, setCar] = useState<Car | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCar();
  }, [id]);

  const loadCar = async () => {
    try {
      setError(null);
      const data = await fetchCarById(Number(id));
      setCar(data);
    } catch (err) {
      setError('Failed to load car details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066B4" />
        <Text style={styles.loadingText}>Loading car details...</Text>
      </View>
    );
  }

  if (error || !car) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error || 'Car not found'}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadCar}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        
        <Image source={{ uri: car.image }} style={styles.carImage} />
        
        <View style={styles.content}>
          <Text style={styles.model}>{car.model}</Text>
          <Text style={styles.price}>{car.price}</Text>
          
          <View style={styles.specSection}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Year</Text>
              <Text style={styles.specValue}>{car.year}</Text>
            </View>
            
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Engine</Text>
              <Text style={styles.specValue}>{car.engine}</Text>
            </View>
            
            <View style={styles.specRow}>
              <Text style={styles.specLabel}>Horsepower</Text>
              <Text style={styles.specValue}>{car.horsepower}</Text>
            </View>
          </View>

          {/* NEW: Book Test Drive Button */}
          <TouchableOpacity style={styles.bookButton} onPress={() => {}}>
            <Text style={styles.bookButtonText}>📅 Book Test Drive</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  loadingText: { marginTop: 12, color: '#666' },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 16 },
  retryButton: { backgroundColor: '#0066B4', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { color: '#fff', fontWeight: '600' },
  backButton: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 10, backgroundColor: '#fff' },
  backText: { fontSize: 16, color: '#0066B4', fontWeight: '600' },
  carImage: { width: '100%', height: 300, resizeMode: 'cover' },
  content: { padding: 20 },
  model: { fontSize: 28, fontWeight: 'bold', color: '#333' },
  price: { fontSize: 24, fontWeight: 'bold', color: '#0066B4', marginTop: 8 },
  specSection: { marginTop: 24, backgroundColor: '#f8f8f8', padding: 16, borderRadius: 12 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  specRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  specLabel: { fontSize: 16, color: '#666' },
  specValue: { fontSize: 16, fontWeight: '600', color: '#333' },
  bookButton: { backgroundColor: '#0066B4', paddingVertical: 16, borderRadius: 12, alignItems: 'center', marginTop: 32 },
  bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});