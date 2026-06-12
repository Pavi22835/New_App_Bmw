import { fetchCars } from '@/services/api';
import { getCompareCars, toggleCompareCar, clearCompareCars } from '@/services/appStorage';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CompareScreen() {
  const [cars, setCars] = useState<any[]>([]);
  const [compareIds, setCompareIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      setLoading(true);
      const [allCars, selectedIds] = await Promise.all([fetchCars(), getCompareCars()]);
      setCars(allCars.filter((car) => selectedIds.includes(car.id)));
      setCompareIds(selectedIds);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggle = async () => {
    if (compareIds.length < 2) {
      Alert.alert('Compare Cars', 'Select two cars from the homepage first.');
      return;
    }
    await clearCompareCars();
    setCompareIds([]);
    setCars([]);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066B4" />
        <Text style={styles.statusText}>Preparing comparison...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Compare Cars</Text>
      <Text style={styles.subtitle}>Select two BMW models to compare their specs side by side.</Text>
      {cars.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No cars selected</Text>
          <Text style={styles.emptyText}>Use the homepage to pick two cars and compare them here.</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {cars.map((car) => (
            <View key={car.id} style={styles.carCard}>
              <Text style={styles.carModel}>{car.model}</Text>
              <Text style={styles.carPrice}>{car.price}</Text>
              <Text style={styles.specText}>Year: {car.year}</Text>
              <Text style={styles.specText}>Engine: {car.engine}</Text>
              <Text style={styles.specText}>HP: {car.horsepower}</Text>
            </View>
          ))}
        </View>
      )}
      <TouchableOpacity style={styles.clearButton} onPress={handleToggle}>
        <Text style={styles.clearButtonText}>Clear Comparison</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  statusText: { marginTop: 12, color: '#666' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0066B4', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 22 },
  grid: { flexDirection: 'row', justifyContent: 'space-between', gap: 16 },
  carCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, width: '48%', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 2 } },
  carModel: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  carPrice: { fontSize: 16, color: '#0066B4', marginBottom: 12 },
  specText: { fontSize: 14, color: '#555', marginBottom: 6 },
  clearButton: { marginTop: 24, backgroundColor: '#0066B4', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  clearButtonText: { color: '#fff', fontWeight: '700' },
});
