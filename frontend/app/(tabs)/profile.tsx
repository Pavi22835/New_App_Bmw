import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>👤 My Profile</Text>
      <Text style={styles.subtitle}>Manage your BMW settings, favorites, bookings and app tools.</Text>

      <View style={styles.card}>
        <Text style={styles.cardHeading}>Welcome back, BMW driver</Text>
        <Text style={styles.cardText}>
          Use this space to access your favorites, recent cars, booking history and app extras.
        </Text>
      </View>

      <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/more')}>
        <Text style={styles.actionButtonText}>Open App Extras</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 30, fontWeight: 'bold', color: '#0066B4', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 20, padding: 22, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, marginBottom: 24 },
  cardHeading: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 10 },
  cardText: { fontSize: 15, color: '#555', lineHeight: 22 },
  actionButton: { backgroundColor: '#0066B4', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  actionButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
