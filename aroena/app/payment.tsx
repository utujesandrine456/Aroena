import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView, Alert, TextInput
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Payment() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [amount, setAmount] = useState('');

  const payments = [
    { id: 'Card', label: 'Credit / Debit Card', icon: 'card-outline' },
    { id: 'Momo', label: 'Mobile Money', icon: 'phone-portrait-outline' },
    { id: 'Paypal', label: 'PayPal', icon: 'logo-paypal' },
    { id: 'Cash', label: 'Cash on Delivery', icon: 'cash-outline' },
  ];

  const handlePay = ()=> {
    if(!selected || !amount){
      Alert.alert('Incomplete', 'Please select a payment method and enter amount');
      return;
    }

    router.push({
      pathname: '/success',
      params: {
        paymentMethod: selected,
        amount: amount,
      },
    });
  }

  return (
    <>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Method</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {payments.map(item => (
          <View>
            <TouchableOpacity
              key={item.id}
              style={[styles.card, selected === item.id && styles.cardActive ]}
              onPress={() => setSelected(item.id)} >
              <Ionicons
                name={item.icon as any}
                size={26}
                color={selected === item.id ? '#FF4A1C' : '#555'}
              />
              <Text style={styles.cardText}>{item.label}</Text>
              {selected === item.id && (
                <Ionicons name="checkmark-circle" size={22} color="#FF4A1C" />
              )}
            </TouchableOpacity>

            {selected === item.id && (
              <View style={styles.amountBox}>
                <Text style={styles.amountLabel}>Enter Amount</Text>
                <TextInput
                  placeholder="Enter amount"
                  keyboardType="numeric"
                  value={amount}
                  onChangeText={setAmount}
                  style={styles.amountInput}
                />
              </View>
            )}
          </View>
        ))}

        
        <TouchableOpacity style={styles.payButton} onPress={handlePay}>
          <Text style={styles.payText}>Pay Now</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    backgroundColor: '#FF4A1C',
    padding: 10,
    borderRadius: 30,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontFamily: 'Outfit_700Bold',
    color: '#333',
  },
  container: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#fff',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardActive: {
    borderColor: '#FF4A1C',
    backgroundColor: '#FFF3EF',
  },
  cardText: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
    color: '#333',
  },
  payButton: {
    backgroundColor: '#FF4A1C',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 20,
  },
  payText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Outfit_700Bold',
  },
  amountBox: {
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 14,
    fontFamily: 'Outfit_500Medium',
    marginBottom: 8,
    color: '#333',
  },
  amountInput: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#333',
  },
});
