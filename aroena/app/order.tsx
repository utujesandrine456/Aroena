import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Order() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [service, setService] = useState<any>(null);
  const [quantity, setQuantity ] = useState(Number(params.quantity || 1));

  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  useEffect(() => {
    if (params.service) {
      try {
        const parsed = JSON.parse(params.service as string);
        setService(parsed);
        setQuantity(parsed.quantity || 1)
      } catch {
        Alert.alert('Error', 'Invalid order data');
        router.back();
      }
    }
  }, [params.service]);

  if (!service) return null;

  const total = service.price * quantity;

  const handlePay = () => {
    router.push('/payment');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={{backgroundColor: '#FF4A1C', padding: 10, borderRadius: 30}}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order & Payment</Text>
      </View>

      <Text style={styles.sectionTitle}>Booking Summary</Text>

      <View style={styles.card}>
        <Image source={service.image} style={styles.image} />

        <View style={styles.info}>
          <Text style={styles.title}>{service.title}</Text>
          <Text style={styles.meta}>{service.category}</Text>
          <Text style={styles.meta}>Quantity: {quantity}</Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>{total.toLocaleString()} RWF</Text>
        </View>
      </View>

      
      <TouchableOpacity style={styles.payButton} onPress={handlePay}>
        <Ionicons name="lock-closed" size={18} color="#fff" />
        <Text style={styles.payText}>
          Pay {total.toLocaleString()} RWF
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    marginTop: 30
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 18,
    marginLeft: 16,
  },
  sectionTitle: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 16,
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 320,
  },
  info: {
    padding: 14,
  },
  title: {
    fontFamily: 'Outfit_500Medium',
    fontSize: 16,
  },
  meta: {
    fontFamily: 'Outfit_400Regular',
    fontSize: 13,
    color: '#757575',
    marginTop: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
  totalLabel: {
    fontFamily: 'Outfit_500Medium',
  },
  totalPrice: {
    fontFamily: 'Outfit_500Medium',
  },
  inputBox: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontFamily: 'Outfit_400Regular',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallInput: {
    width: '48%',
  },
  payButton: {
    backgroundColor: '#FF4A1C',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  payText: {
    color: '#fff',
    fontFamily: 'Outfit_500Medium',
    fontSize: 16,
    marginLeft: 8,
  },
});
