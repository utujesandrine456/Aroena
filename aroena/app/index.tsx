import React from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Link } from 'expo-router';

const { width, height } = Dimensions.get('window');

export default function Home() {
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
          <Text style={styles.description}>Book your stay effortlessly and enjoy a comfortable, memorable experience at our hotel.</Text>

          <TouchableOpacity style={styles.button} activeOpacity={0.8}>
            <Link href="/bookchoice">
                <Animatable.Text animation="pulse" iterationCount="infinite" easing="ease-out" style={styles.buttonText}>
                Book Now
                </Animatable.Text>
            </Link>
          </TouchableOpacity>
        </Animatable.View>
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
});
