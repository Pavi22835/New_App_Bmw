import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function MoreScreen() {
  const buttons = [
    { label: 'My Bookings', route: '/bookings' },
    { label: 'Recent Cars', route: '/recent-cars' },
    { label: 'Compare Cars', route: '/compare' },
    { label: 'Price Alerts', route: '/price-alerts' },
    { label: 'Car Loan Calculator', route: '/loan-calculator' },
    { label: 'Ratings & Reviews', route: '/reviews' },
    { label: 'Nearby Showrooms', route: '/showrooms' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>BMW App Extras</Text>
      <Text style={styles.subtitle}>Access all advanced tools and experiences in one place.</Text>
      {buttons.map((item) => (
        <TouchableOpacity key={item.route} style={styles.card} onPress={() => router.push(item.route)}>
          <Text style={styles.cardLabel}>{item.label}</Text>
          <Text style={styles.cardArrow}>→</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.note}>Tip: Share car details from the car detail screen to send BMW favorites to your friends.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0066B4', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 16, marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 3 } },
  cardLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
  cardArrow: { fontSize: 20, color: '#0066B4' },
  note: { marginTop: 16, fontSize: 14, color: '#666', lineHeight: 20 },
});
