import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput, Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import api from '../api';
const { width, height } = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const createUser = async () => {
    if (!name || !phone) {
      Alert.alert('Please fill in all fields');
      return;
    }

    try {
      const res = await api.post('/users/login-or-signup', { name, phone });
      const user = res.data;

      await AsyncStorage.setItem('user', JSON.stringify(user));

      setName('');
      setPhone('');
      setShowForm(false);
      router.push('/bookchoice');
    } catch (error) {
      console.error(error);
      Alert.alert('Error creating user. Please try again');
    }
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/HotelBackground.jpg')}
        style={styles.heroImage}
        resizeMode="cover"
      >
        <Animatable.Text animation="fadeInDown" delay={500} style={styles.title}>
          Aroena
        </Animatable.Text>

        <Animatable.View animation="fadeInUp" delay={1000} style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>Explore rooms and dining options</Text>
          <Text style={styles.description}>
            Book your stay effortlessly and enjoy a comfortable, memorable experience.
          </Text>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => setShowForm(true)}
          >
            <Animatable.Text
              animation="pulse"
              iterationCount="infinite"
              easing="ease-out"
              style={styles.buttonText}
            >
              Book Now
            </Animatable.Text>
          </TouchableOpacity>
        </Animatable.View>


        <Modal visible={showForm} transparent animationType="fade">
          <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />

          <View style={styles.formWrapper}>
            <Animatable.View animation="zoomIn" style={styles.formCard}>
              <Text style={styles.formTitle}>Booking Details</Text>

              <TextInput
                placeholder="Full Name"
                placeholderTextColor="#999"
                style={styles.input}
                value={name}
                onChangeText={setName}
              />

              <TextInput
                placeholder="Phone Number"
                placeholderTextColor="#999"
                style={styles.input}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />

              <TouchableOpacity
                style={styles.formButton}
                onPress={createUser}
                activeOpacity={0.9}
              >
                <Text style={styles.formButtonText}>Book Now</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setShowForm(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </Animatable.View>
          </View>
        </Modal>
      </ImageBackground>
    </View>
  );
}


const styles = StyleSheet.create({
  container: { flex: 1 },

  heroImage: {
    width: width,
    height: height,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  title: {
    fontSize: 80,
    fontFamily: 'Satisfy_400Regular',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 6,
  },

  subtitleContainer: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: 25,
    paddingHorizontal: 30,
    borderRadius: 20,
  },
  subtitle: { fontFamily: 'Outfit_500Medium', fontSize: 22, color: 'white', marginBottom: 5, textAlign: 'center' },
  description: { fontFamily: 'Outfit_400Regular', fontSize: 16, color: 'white', marginBottom: 20, textAlign: 'center' },


  button: {
    backgroundColor: '#FF4A1C',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  buttonText: { fontFamily: 'Outfit_500Medium', fontSize: 18, color: 'white' },
  formWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  formCard: {
    width: '90%',
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 15,
    elevation: 10,
  },

  formTitle: {
    fontSize: 22,
    fontFamily: 'Outfit_500Medium',
    textAlign: 'center',
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    marginBottom: 15,
    fontFamily: 'Outfit_400Regular',
  },

  formButton: {
    backgroundColor: '#FF4A1C',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  formButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Outfit_500Medium',
  },

  cancelText: {
    marginTop: 14,
    textAlign: 'center',
    color: '#777',
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
  },

});
