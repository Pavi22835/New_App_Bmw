import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';

const showrooms = [
  { id: 1, name: 'BMW Downtown Showroom', address: '123 BMW Street', city: 'Los Angeles', phone: '+1 310 555 0123' },
  { id: 2, name: 'BMW City Center', address: '456 Luxury Avenue', city: 'Beverly Hills', phone: '+1 310 555 0456' },
  { id: 3, name: 'BMW Premium Auto', address: '789 Performance Blvd', city: 'Santa Monica', phone: '+1 310 555 0789' },
];

export default function ShowroomsScreen() {
  const [nearby, setNearby] = useState(showrooms);

  useEffect(() => {
    setNearby(showrooms);
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Nearby Showrooms</Text>
      <Text style={styles.subtitle}>Browse BMW showrooms near you.</Text>
      {nearby.map((showroom) => (
        <View key={showroom.id} style={styles.card}>
          <Text style={styles.showroomName}>{showroom.name}</Text>
          <Text style={styles.showroomText}>{showroom.address}</Text>
          <Text style={styles.showroomText}>{showroom.city}</Text>
          <Text style={styles.showroomPhone}>Call: {showroom.phone}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0066B4', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } },
  showroomName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  showroomText: { fontSize: 14, color: '#666', marginBottom: 4 },
  showroomPhone: { fontSize: 14, fontWeight: '700', color: '#0066B4', marginTop: 8 },
});
