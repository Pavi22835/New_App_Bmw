import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoanCalculatorScreen() {
  const [price, setPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [interestRate, setInterestRate] = useState('8.5');
  const [termMonths, setTermMonths] = useState('60');
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const calculateEmi = () => {
    const principal = Math.max(0, Number(price.replace(/[^0-9.]/g, '')) - Number(downPayment.replace(/[^0-9.]/g, '')));
    const monthlyRate = Number(interestRate) / 100 / 12;
    const months = Number(termMonths);

    if (!principal || !monthlyRate || !months) {
      setMonthlyPayment(null);
      return;
    }

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    setMonthlyPayment(Number(emi.toFixed(2)));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Car Loan Calculator</Text>
      <Text style={styles.subtitle}>Estimate your monthly EMI for BMW financing.</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Car Price</Text>
        <TextInput style={styles.input} placeholder="$120000" keyboardType="numeric" value={price} onChangeText={setPrice} />
        <Text style={styles.label}>Down Payment</Text>
        <TextInput style={styles.input} placeholder="$20000" keyboardType="numeric" value={downPayment} onChangeText={setDownPayment} />
        <Text style={styles.label}>Interest Rate (%)</Text>
        <TextInput style={styles.input} placeholder="8.5" keyboardType="numeric" value={interestRate} onChangeText={setInterestRate} />
        <Text style={styles.label}>Loan Term (months)</Text>
        <TextInput style={styles.input} placeholder="60" keyboardType="numeric" value={termMonths} onChangeText={setTermMonths} />
        <TouchableOpacity style={styles.button} onPress={calculateEmi}>
          <Text style={styles.buttonText}>Calculate EMI</Text>
        </TouchableOpacity>
        {monthlyPayment !== null && (
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>Estimated Monthly Payment</Text>
            <Text style={styles.resultValue}>${monthlyPayment.toLocaleString()}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  contentContainer: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0066B4', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 22 },
  card: { backgroundColor: '#fff', borderRadius: 18, padding: 20, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 3 } },
  label: { fontSize: 14, color: '#666', marginBottom: 8, marginTop: 16 },
  input: { borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#333' },
  button: { marginTop: 24, backgroundColor: '#0066B4', paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  resultCard: { marginTop: 24, backgroundColor: '#f0f8ff', padding: 16, borderRadius: 14 },
  resultLabel: { color: '#666', marginBottom: 8 },
  resultValue: { fontSize: 24, fontWeight: 'bold', color: '#0a4d8c' },
});
