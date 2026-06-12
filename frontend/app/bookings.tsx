import { fetchAllBookings, cancelBooking } from '@/services/api';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function BookingsScreen() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchAllBookings();
      setBookings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (id: number) => {
    try {
      await cancelBooking(id);
      await loadBookings();
      Alert.alert('Booking cancelled', 'Your booking has been cancelled successfully.');
    } catch (error) {
      Alert.alert('Unable to cancel', 'Please try again later.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066B4" />
        <Text style={styles.statusText}>Loading your bookings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>My Bookings</Text>
      {bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptyText}>Book a test drive from the car detail page to see it here.</Text>
        </View>
      ) : (
        bookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <Text style={styles.carModel}>{booking.car?.model || 'Unknown BMW'}</Text>
            <Text style={styles.carPrice}>{booking.car?.price || ''}</Text>
            <Text style={styles.bookingText}>Name: {booking.customerName}</Text>
            <Text style={styles.bookingText}>Email: {booking.customerEmail}</Text>
            <Text style={styles.bookingText}>Phone: {booking.customerPhone}</Text>
            <Text style={styles.bookingText}>Date: {new Date(booking.bookingDate).toLocaleDateString()}</Text>
            <Text style={styles.bookingText}>Time: {booking.bookingTime}</Text>
            <Text style={styles.bookingText}>Status: {booking.status}</Text>
            <TouchableOpacity
              style={[styles.cancelButton, booking.status === 'cancelled' && styles.cancelledButton]}
              disabled={booking.status === 'cancelled'}
              onPress={() => handleCancel(booking.id)}
            >
              <Text style={styles.cancelButtonText}>{booking.status === 'cancelled' ? 'Cancelled' : 'Cancel Booking'}</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' },
  statusText: { marginTop: 12, color: '#666' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0066B4', marginBottom: 16 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 22 },
  bookingCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 2 } },
  carModel: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  carPrice: { fontSize: 16, color: '#0066B4', marginVertical: 6 },
  bookingText: { fontSize: 14, color: '#555', marginBottom: 6 },
  cancelButton: { marginTop: 12, backgroundColor: '#d32f2f', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  cancelledButton: { backgroundColor: '#999' },
  cancelButtonText: { color: '#fff', fontWeight: '700' },
});
