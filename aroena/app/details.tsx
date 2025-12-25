import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, FlatList, Platform } from 'react-native';
import * as Animatable from 'react-native-animatable';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const formatMoney = (amount) => amount.toLocaleString('en-RW');

export default function Details() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showDateModal, setShowDateModal] = useState(false);
  const [showTimeModal, setShowTimeModal] = useState(false);


  useEffect(() => {
    if (params.service) {
      try {
        const parsedService = JSON.parse(params.service as string);
        setService(parsedService);
      } catch (error) {
        console.error('Error parsing service:', error);
        Alert.alert('Error', 'Failed to load service details');
        router.back();
      }
      setLoading(false);
    }
  }, [params.service]);


  const renderStars = (rating) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars.push(<Ionicons key={`f${i}`} name="star" size={20} color="#FFD700" />);
    if (half) stars.push(<Ionicons key="h" name="star-half" size={20} color="#FFD700" />);
    for (let i = 0; i < 5 - stars.length; i++) stars.push(<Ionicons key={`e${i}`} name="star-outline" size={20} color="#FFD700" />);
    return stars;
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hour = h.toString().padStart(2, '0');
        const minute = m.toString().padStart(2, '0');
        slots.push(`${hour}:${minute}`);
      }
    }
    return slots;
  };

  const handleBookNow = (service) => {
    router.push(`/order?service=${encodeURIComponent(JSON.stringify({...service, quantity, selectedDate: date.toISOString()}))}`);
  };

  const handleCall = () => Linking.openURL('tel:+250788123456');

  const handleWhatsApp = () => {
    if (!service) return;
    const message = `Hello! I'm interested in ${service.category === 'Room' ? 'booking' : 'ordering'} ${service.title}`;
    Linking.openURL(`whatsapp://send?text=${encodeURIComponent(message)}&phone=+250788123456`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF4A1C" />
        <Text style={styles.loadingText}>Loading details...</Text>
      </View>
    );
  }

  if (!service) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={60} color="#FF4A1C" />
        <Text style={styles.errorTitle}>Service Not Found</Text>
        <Text style={styles.errorText}>The service details could not be loaded</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{service.category === 'Room' ? 'Room' : 'Food'} Details</Text>
        <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)} style={styles.favoriteButton}>
          <Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#FF4A1C" : "#333"} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <Animatable.View animation="fadeIn" style={styles.imageContainer}>
          <Image source={service.image} style={styles.image} />
          <View style={styles.ratingContainer}>
            <View style={styles.ratingBadge}>
              {renderStars(service.rating)}
              <Text style={styles.ratingText}>{service.rating}</Text>
            </View>
          </View>
        </Animatable.View>

        <Animatable.View animation="fadeInUp" delay={200} style={styles.content}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{service.title}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{formatMoney(service.price)} Frw</Text>
              <Text style={styles.priceUnit}>{service.priceUnit}</Text>
            </View>
          </View>

          <Text style={styles.description}>{service.description}</Text>

          <View style={styles.categoryContainer}>
            <Text style={styles.categoryText}>{service.category}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresContainer}>
              {service.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#4CAF50" />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          {!service.available && (
            <View style={styles.availabilityContainer}>
              <Ionicons name="warning" size={20} color="#FF4A1C" />
              <Text style={styles.availabilityText}>Currently Unavailable</Text>
            </View>
          )}

          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(Math.max(1, quantity - 1))} disabled={!service.available}>
                <Ionicons name="remove" size={24} color={service.available ? "#333" : "#999"} />
              </TouchableOpacity>
              <View style={styles.quantityDisplay}>
                <Text style={styles.quantityText}>{quantity}</Text>
              </View>
              <TouchableOpacity style={styles.quantityButton} onPress={() => setQuantity(quantity + 1)} disabled={!service.available}>
                <Ionicons name="add" size={24} color={service.available ? "#333" : "#999"} />
              </TouchableOpacity>
            </View>
            <Text style={styles.totalText}>Total: {formatMoney(service.price * quantity)} Frw</Text>
          </View>

          <View style={styles.dateTimeSection}>
            <Text style={styles.sectionTitle}>Select Date & Time</Text>
            <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDateModal(true)} disabled={!service.available}>
              <Ionicons name="calendar-outline" size={20} color={service.available ? "#FF4A1C" : "#999"} />
              <Text style={[styles.dateTimeText, !service.available && {color: '#999'}]}>
                {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </Text>
            </TouchableOpacity>

              <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowTimeModal(true)} disabled={!service.available}>
                <Ionicons name="time-outline" size={20} color={service.available ? "#FF4A1C" : "#999"} />
                <Text style={[styles.dateTimeText, !service.available && {color: '#999'}]}>
                  {date ? date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }) : '--:--'}
                </Text>
              </TouchableOpacity>
          </View>

          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Need Help?</Text>
            <View style={styles.contactButtons}>
              <TouchableOpacity style={styles.contactButton} onPress={handleCall} disabled={!service.available}>
                <Ionicons name="call" size={20} color={service.available ? "#FF4A1C" : "#999"} />
                <Text style={[styles.contactText, !service.available && styles.contactTextDisabled]}>Call Us</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton} onPress={handleWhatsApp} disabled={!service.available}>
                <Ionicons name="logo-whatsapp" size={20} color={service.available ? "#25D366" : "#999"} />
                <Text style={[styles.contactText, !service.available && styles.contactTextDisabled]}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animatable.View>
      </ScrollView>

      <Modal visible={showDateModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date</Text>
            <FlatList
              data={generateDates()}
              keyExtractor={(item) => item.toISOString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setDate(new Date(item.getFullYear(), item.getMonth(), item.getDate(), date.getHours(), date.getMinutes()));
                    setShowDateModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowDateModal(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
      <Modal visible={showTimeModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Time</Text>
            <FlatList
              data={generateTimeSlots()}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    const [hour, minute] = item.split(':').map(Number);
                    const updatedDate = new Date(date);
                    updatedDate.setHours(hour);
                    updatedDate.setMinutes(minute);
                    setDate(updatedDate);
                    setShowTimeModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowTimeModal(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


      <Animatable.View animation="fadeInUp" delay={400} style={styles.actionContainer}> 
        <TouchableOpacity style={[styles.confirmButton, !service.available && styles.confirmButtonDisabled]} onPress={() => handleBookNow(service)} disabled={!service.available}> 
          <Ionicons name={service.category === 'Room' ? 'bed' : 'fast-food'} size={24} color="#fff" /> 
          <Text style={styles.confirmButtonText}>{service.category === 'Room' ? 'Confirm Booking' : 'Confirm Order'} - {formatMoney(service.price * quantity)} Frw</Text> 
        </TouchableOpacity>
      </Animatable.View>
    </View>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', marginTop: 30 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  loadingText: { fontFamily: 'Outfit_400Regular', fontSize: 16, color: '#666', marginTop: 20 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  errorTitle: { fontFamily: 'Outfit_700Bold', fontSize: 24, color: '#333', marginTop: 20, marginBottom: 10 },
  errorText: { fontFamily: 'Outfit_400Regular', fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  backButton: { backgroundColor: '#FF4A1C', padding: 10, borderRadius: 30 },
  backButtonText: { fontFamily: 'Outfit_500Medium', fontSize: 16, color: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontFamily: 'Outfit_700Bold', fontSize: 18, color: '#333' },
  favoriteButton: { padding: 8, borderRadius: 10, backgroundColor: '#f8f8f8' },
  imageContainer: { position: 'relative', height: 300 },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  ratingContainer: { position: 'absolute', top: 20, left: 20 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.7)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  ratingText: { fontFamily: 'Outfit_500Medium', fontSize: 14, color: '#fff', marginLeft: 6 },
  content: { padding: 20, paddingBottom: 100 },
  titleSection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title: { fontFamily: 'Outfit_700Bold', fontSize: 24, color: '#333', flex: 1, marginRight: 16 },
  priceContainer: { alignItems: 'flex-end', display: 'flex', flexDirection: 'row', paddingTop: 8 },
  price: { fontFamily: 'Outfit_700Bold', fontSize: 14, color: '#FF4A1C', marginRight: 6 },
  priceUnit: { fontFamily: 'Outfit_400Regular', fontSize: 12, color: '#666', marginTop: 2 },
  description: { fontFamily: 'Outfit_400Regular', fontSize: 16, color: '#666', lineHeight: 24, marginBottom: 20 },
  categoryContainer: { alignSelf: 'flex-start', backgroundColor: 'rgba(255, 74, 28, 0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, borderWidth: 1, borderColor: '#FF4A1C', marginBottom: 20 },
  categoryText: { fontFamily: 'Outfit_500Medium', fontSize: 12, color: '#FF4A1C' },
  section: { marginBottom: 24 },
  sectionTitle: { fontFamily: 'Outfit_700Bold', fontSize: 18, color: '#333', marginBottom: 12 },
  featuresContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  featureItem: { flexDirection: 'row', alignItems: 'center', width: '50%', marginBottom: 10 },
  featureText: { fontFamily: 'Outfit_500Medium', fontSize: 14, color: '#555', marginLeft: 8 },
  availabilityContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff5f5', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#ffd1d1', marginBottom: 20 },
  availabilityText: { fontFamily: 'Outfit_500Medium', fontSize: 14, color: '#e74c3c', marginLeft: 10 },
  quantitySection: { backgroundColor: '#f8f9fa', padding: 20, borderRadius: 16, marginBottom: 24 },
  quantityLabel: { fontFamily: 'Outfit_500Medium', fontSize: 16, color: '#333', marginBottom: 16 },
  quantitySelector: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  quantityButton: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#e0e0e0' },
  quantityDisplay: { width: 60, height: 48, justifyContent: 'center', alignItems: 'center', marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: '#FF4A1C' },
  quantityText: { fontFamily: 'Outfit_700Bold', fontSize: 24, color: '#333' },
  totalText: { fontFamily: 'Outfit_700Bold', fontSize: 20, color: '#FF4A1C', textAlign: 'center' },
  contactSection: { marginBottom: 24 },
  contactTitle: { fontFamily: 'Outfit_700Bold', fontSize: 18, color: '#333', marginBottom: 16 },
  contactButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  contactButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f8f8', paddingVertical: 14, borderRadius: 12, marginHorizontal: 8, borderWidth: 1, borderColor: '#e0e0e0' },
  contactText: { fontFamily: 'Outfit_500Medium', fontSize: 14, color: '#333', marginLeft: 8 },
  contactTextDisabled: { color: '#999' },
  actionContainer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 20, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  confirmButton: { backgroundColor: '#FF4A1C', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 12, shadowColor: '#FF4A1C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  confirmButtonDisabled: { backgroundColor: '#999' },
  confirmButtonText: { fontFamily: 'Outfit_700Bold', fontSize: 18, color: '#fff', marginLeft: 10 },
  dateTimeSection: { marginBottom: 24, backgroundColor: '#f8f9fa', padding: 20, borderRadius: 16 },
  dateTimeButton: { backgroundColor: '#fff', paddingVertical: 16, paddingHorizontal: 20, borderRadius: 12, borderWidth: 2, borderColor: '#e0e0e0', marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  dateTimeText: { fontFamily: 'Outfit_500Medium', fontSize: 16, color: '#333', marginLeft: 12 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '85%', maxHeight: '70%' },
  modalTitle: { fontFamily: 'Outfit_700Bold', fontSize: 20, color: '#333', marginBottom: 20, textAlign: 'center' },
  modalItem: { paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', borderRadius: 8 },
  modalItemText: { fontFamily: 'Outfit_500Medium', fontSize: 16, color: '#333', textAlign: 'center' },
  modalClose: { marginTop: 20, paddingVertical: 14, backgroundColor: '#FF4A1C', borderRadius: 12, alignItems: 'center' },
  modalCloseText: { fontFamily: 'Outfit_700Bold', fontSize: 16, color: '#fff' },
});
