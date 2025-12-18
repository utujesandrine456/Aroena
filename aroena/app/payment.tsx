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
import {useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';


export default function Payment() {
    return(
      <>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{service.category === 'Room' ? 'Room' : 'Food'} Details</Text>
            <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.favoriteButton}>
              <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#FF4A1C" : "#333"} />
            </TouchableOpacity>
          </View>
      </>
    )
}


const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#6200EE',
  },
  backButton: {
    padding: 5,
  },  
})