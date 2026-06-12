import { useEffect, useState } from 'react';
import { createPriceAlert, deletePriceAlert, fetchPriceAlerts, PriceAlert } from '@/services/api';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function PriceAlertsScreen() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [label, setLabel] = useState('');
  const [targetPrice, setTargetPrice] = useState('');

  const loadAlerts = async () => {
    setAlerts(await fetchPriceAlerts());
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  const handleAdd = async () => {
    if (!label || !targetPrice) return;

    await createPriceAlert({
      carId: null,
      label,
      targetPrice: Number(targetPrice),
    });

    setLabel('');
    setTargetPrice('');
    loadAlerts();
  };

  const handleRemove = async (id: number) => {
    await deletePriceAlert(id);
    loadAlerts();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Price Alerts</Text>
      <Text style={styles.subtitle}>Create a price alert and we’ll save it for you.</Text>
      <View style={styles.card}>
        <TextInput style={styles.input} placeholder="Alert Name" value={label} onChangeText={setLabel} />
        <TextInput style={styles.input} placeholder="Target Price" keyboardType="numeric" value={targetPrice} onChangeText={setTargetPrice} />
        <TouchableOpacity style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Save Alert</Text>
        </TouchableOpacity>
      </View>
      {alerts.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No alerts yet</Text>
          <Text style={styles.emptyText}>Add an alert to track price drops.</Text>
        </View>
      ) : (
        alerts.map((alert) => (
          <View key={alert.id} style={styles.alertCard}>
            <Text style={styles.alertLabel}>{alert.label}</Text>
            <Text style={styles.alertValue}>Target: ${alert.targetPrice}</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={() => handleRemove(alert.id)}>
              <Text style={styles.deleteButtonText}>Delete</Text>
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
  title: { fontSize: 28, fontWeight: 'bold', color: '#0066B4', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 }, marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#333', marginBottom: 16 },
  button: { backgroundColor: '#0066B4', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 8 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 22 },
  alertCard: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 2 } },
  alertLabel: { fontSize: 16, fontWeight: '700', color: '#333' },
  alertValue: { fontSize: 14, color: '#666', marginTop: 8 },
  deleteButton: { marginTop: 12, backgroundColor: '#d32f2f', paddingVertical: 12, borderRadius: 12, alignItems: 'center' },
  deleteButtonText: { color: '#fff', fontWeight: '700' },
});
