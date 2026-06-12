import { useEffect, useState } from 'react';
import { createReview, fetchReviewsByCar, fetchCars } from '@/services/api';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ReviewsScreen() {
  const [cars, setCars] = useState<any[]>([]);
  const [selectedCarId, setSelectedCarId] = useState<number | null>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');

  const loadCars = async () => {
    setCars(await fetchCars());
  };

  useEffect(() => {
    loadCars();
  }, []);

  useEffect(() => {
    const loadReviews = async () => {
      if (!selectedCarId) return;
      setReviews(await fetchReviewsByCar(selectedCarId));
    };
    loadReviews();
  }, [selectedCarId]);

  const handleSubmit = async () => {
    if (!selectedCarId || !comment) return;

    await createReview({
      carId: selectedCarId,
      author: 'You',
      rating: Number(rating),
      comment,
    });

    setComment('');
    setReviews(await fetchReviewsByCar(selectedCarId));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Ratings & Reviews</Text>
      <Text style={styles.subtitle}>Share your opinion and read BMW reviews.</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Select car</Text>
        <View style={styles.pickerContainer}>
          {cars.map((car) => (
            <TouchableOpacity key={car.id} style={[styles.pickerItem, selectedCarId === car.id && styles.pickerItemActive]} onPress={() => setSelectedCarId(car.id)}>
              <Text style={[styles.pickerText, selectedCarId === car.id && styles.pickerTextActive]}>{car.model}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.label}>Rating</Text>
        <TextInput style={styles.input} placeholder="5" keyboardType="numeric" value={rating} onChangeText={setRating} />
        <Text style={styles.label}>Comment</Text>
        <TextInput style={[styles.input, styles.commentInput]} placeholder="Write your review..." value={comment} onChangeText={setComment} multiline />
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Review</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.reviewsSection}>
        <Text style={styles.sectionTitle}>Recent Reviews</Text>
        {reviews.length === 0 ? (
          <Text style={styles.emptyText}>No reviews yet for this car.</Text>
        ) : (
          reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <Text style={styles.reviewAuthor}>{review.author} · {review.rating}★</Text>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0066B4', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, marginBottom: 20 },
  label: { fontSize: 14, color: '#666', marginBottom: 10 },
  pickerContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  pickerItem: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: '#e0e0e0', marginRight: 10 },
  pickerItemActive: { backgroundColor: '#0066B4' },
  pickerText: { color: '#333' },
  pickerTextActive: { color: '#fff' },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#333', marginBottom: 16 },
  commentInput: { minHeight: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#0066B4', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  reviewsSection: { backgroundColor: '#fff', borderRadius: 18, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  reviewCard: { marginBottom: 16 },
  reviewAuthor: { fontSize: 14, fontWeight: '700', color: '#333' },
  reviewComment: { fontSize: 14, color: '#666', marginTop: 6 },
  emptyText: { color: '#666' },
});
