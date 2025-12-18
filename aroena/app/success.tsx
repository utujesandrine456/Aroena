import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function PaymentSuccess() {
  const { amount, paymentMethod } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={{width: 200, height: 200, marginBottom: 20, backgroundColor: '#ff491c12', borderRadius: 100, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 160, height: 160, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ff491c4a', borderRadius: 100, justifyContent: 'center' }}>
          <View style={{ width: 120, height: 120, backgroundColor: '#FF4A1C', borderRadius: 100, alignItems: 'center', justifyContent: 'center'  }}>
            <Ionicons name="checkmark-done" size={60} color="#fff"  />
          </View>
        </View>
      </View>
      <Text style={styles.success}>Payment Successful </Text>
      <Text style={styles.method}>Method: {paymentMethod}</Text>
      <Text style={styles.amount}>Amount Paid: {amount} RWF</Text>
      <TouchableOpacity style={{backgroundColor: '#FF4A1C', marginTop: 40, padding: 15, borderRadius: 15 }} onPress={() => router.push('/')}>
        <Text style={{ fontSize: 20, color: '#fff', fontFamily: 'Outfit_500Medium' }}>Go Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,  alignItems: 'center', fontFamily: 'Outfit_400Regular', marginBlock: 40},
  success: { fontSize: 36, fontWeight: 'bold', marginBottom: 10, fontFamily: 'Outfit_500Medium' },
  method: { fontSize: 24, marginBottom: 5, fontFamily: 'Outfit_400Regular'  },
  amount: { fontSize: 24, fontFamily: 'Outfit_400Regular' },
});
