import { useLocalSearchParams, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { fetchCarById, createBooking } from '@/services/api';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function BookCarScreen() {
  const { id } = useLocalSearchParams();
  const [car, setCar] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadCar = async () => {
      try {
        const data = await fetchCarById(Number(id));
        setCar(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadCar();
  }, [id]);

  const handleBook = async () => {
    if (!car || !name || !email || !phone || !bookingDate || !bookingTime) {
      Alert.alert('Missing information', 'Please fill all fields before booking.');
      return;
    }

    setSubmitting(true);
    try {
      await createBooking({
        carId: Number(id),
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        bookingDate,
        bookingTime,
        message,
      });
      Alert.alert('Booking confirmed', 'Your BMW test drive has been booked.');
      router.push('/bookings');
    } catch (error) {
      Alert.alert('Booking failed', 'Unable to create booking. Please try again later.');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0066B4" />
        <Text style={styles.loadingText}>Loading booking details...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Book Test Drive</Text>
      <Text style={styles.subtitle}>{car?.model || 'BMW vehicle'}</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="John Doe" />
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="john@example.com" keyboardType="email-address" />
        <Text style={styles.label}>Phone</Text>
        <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="1234567890" keyboardType="phone-pad" />
        <Text style={styles.label}>Booking Date</Text>
        <TextInput style={styles.input} value={bookingDate} onChangeText={setBookingDate} placeholder="2026-07-01" />
        <Text style={styles.label}>Booking Time</Text>
        <TextInput style={styles.input} value={bookingTime} onChangeText={setBookingTime} placeholder="11:00 AM" />
        <Text style={styles.label}>Message</Text>
        <TextInput
          style={[styles.input, styles.messageInput]}
          value={message}
          onChangeText={setMessage}
          placeholder="Any notes for the showroom"
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleBook} disabled={submitting}>
          <Text style={styles.buttonText}>{submitting ? 'Booking...' : 'Confirm Test Drive'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 12, color: '#666' },
  backButton: { marginTop: 50, marginBottom: 20 },
  backText: { color: '#0066B4', fontWeight: '700', fontSize: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0066B4', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } },
  label: { fontSize: 14, color: '#666', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#333' },
  messageInput: { minHeight: 100, textAlignVertical: 'top' },
  button: { marginTop: 24, backgroundColor: '#0066B4', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
