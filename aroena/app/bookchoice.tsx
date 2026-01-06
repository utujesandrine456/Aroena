'use client';

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import api, { API_URL } from '../api';


type Service = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  priceUnit: string;
  rating: number;
  image: string;
  available: boolean;
  features: string[];
};

type Filter = {
  id: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const filters: Filter[] = [
  { id: 'All', label: 'All', icon: 'apps' },
  { id: 'Room', label: 'Rooms', icon: 'bed' },
  { id: 'Food', label: 'Dining', icon: 'restaurant' },
  { id: 'Available', label: 'Available', icon: 'checkmark-circle' }
];

const formatMoney = (amount: number) => amount.toLocaleString('en-RW');


export default function BookChoice() {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();


  const fetchServices = async () => {
    try {
      setLoading(true);
      console.log('Fetching services...');
      const res = await api.get('/services');
      console.log('Services fetched:', JSON.stringify(res.data, null, 2));

      const data = res.data as Service[];

      setServices(data);
      setFilteredServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);


  useEffect(() => {
    let filtered: Service[] = selectedFilter === 'All'
      ? [...services]
      : selectedFilter === 'Available'
        ? services.filter(s => s.available)
        : services.filter(s => s.category === selectedFilter);

    if (searchQuery.trim()) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    setFilteredServices(filtered);
  }, [selectedFilter, searchQuery, services]);


  const renderStars = (rating: number) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    for (let i = 0; i < full; i++) stars.push(<Ionicons key={`f${i}`} name="star" size={16} color="#FFD700" />);
    if (half) stars.push(<Ionicons key="h" name="star-half" size={16} color="#FFD700" />);
    for (let i = 0; i < 5 - stars.length; i++) stars.push(<Ionicons key={`e${i}`} name="star-outline" size={16} color="#FFD700" />);
    return stars;
  };

  const handleBookNow = (service: Service) => {
    router.push(`/details?service=${encodeURIComponent(JSON.stringify(service))}`);
  };

  const getServiceImageUrl = (imagePath: string) => {
    if (!imagePath) return 'https://via.placeholder.com/400x300?text=No+Image';
    if (imagePath.startsWith('http')) return imagePath;
    // Remove leading slash if present to avoid double slashes with API_URL which ends with slash
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    return `${API_URL}${cleanPath}`;
  };

  return (
    <View style={styles.container}>
      <Animatable.View animation="fadeInDown" duration={800} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Aroena</Text>
          <TouchableOpacity
            style={styles.reloadButton}
            onPress={fetchServices}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="reload" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            placeholder="Search services..."
            placeholderTextColor="#999"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={200} style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersScroll}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.id}
              style={[styles.filterChip, selectedFilter === filter.id ? styles.filterChipSelected : null]}
              onPress={() => setSelectedFilter(filter.id)}
              activeOpacity={0.7}
            >
              <Ionicons name={filter.icon} size={18} color={selectedFilter === filter.id ? '#fff' : '#FF4A1C'} />
              <Text style={[styles.filterChipText, selectedFilter === filter.id ? styles.filterChipTextSelected : null]}>{filter.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animatable.View>

      <Animatable.View animation="fadeInUp" delay={300} style={styles.resultsContainer}>
        <Text style={styles.resultsText}>{filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found</Text>
      </Animatable.View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.servicesContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF4A1C" />
            <Text style={styles.loadingText}>Loading services...</Text>
          </View>
        ) : filteredServices.length > 0 ? (
          filteredServices.map((service, idx) => (
            <Animatable.View key={service.id} animation="fadeInUp" delay={300 + idx * 100} style={styles.serviceCard}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: getServiceImageUrl(service.image) }} style={styles.serviceImage} />
                {!service.available && <View style={styles.unavailableOverlay}><Text style={styles.unavailableText}>Unavailable</Text></View>}
                <View style={styles.ratingBadge}>{renderStars(service.rating)}<Text style={styles.ratingText}>{service.rating}</Text></View>
                <TouchableOpacity style={styles.heartButton}><Ionicons name="heart-outline" size={24} color="#fff" /></TouchableOpacity>
              </View>
              <View style={styles.serviceInfo}>
                <View style={styles.serviceHeader}>
                  <Text style={styles.serviceTitle}>{service.title}</Text>
                  <View style={styles.categoryBadge}><Text style={styles.categoryText}>{service.category}</Text></View>
                </View>
                <Text style={styles.serviceDescription} numberOfLines={2}>{service.description}</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuresContainer}>
                  {service.features.map((f, i) => <View key={i} style={styles.featureTag}><Text style={styles.featureText}>{f}</Text></View>)}
                </ScrollView>
                <View style={styles.actionRow}>
                  <Text style={styles.price}>{formatMoney(service.price)} Frw <Text style={styles.priceUnit}>{service.priceUnit}</Text></Text>
                  <TouchableOpacity style={[styles.bookButton, !service.available ? styles.bookButtonDisabled : null]} onPress={() => handleBookNow(service)} disabled={!service.available}>
                    <Text style={styles.bookButtonText}>{service.category === 'Room' ? 'Book Now' : 'Order Now'}</Text>
                    <Ionicons name={service.category === 'Room' ? 'arrow-forward' : 'fast-food'} size={18} color="#fff" style={styles.bookIcon} />
                  </TouchableOpacity>
                </View>
              </View>
            </Animatable.View>
          ))
        ) : (
          <Animatable.View animation="fadeIn" style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={80} color="#777" />
            <Text style={styles.emptyTitle}>No services found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters or search terms</Text>
            <TouchableOpacity style={styles.resetButton} onPress={() => { setSelectedFilter('All'); setSearchQuery(''); }}>
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      </ScrollView>
    </View>
  );
}

// -------------------- STYLES --------------------
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
  header: { marginTop: 20, marginBottom: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 20, position: 'relative' },
  title: { fontFamily: 'Satisfy_400Regular', fontSize: 42, color: '#FF4A1C', textAlign: 'center' },
  reloadButton: {
    position: 'absolute',
    right: 0,
    backgroundColor: '#FF4A1C',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4
  },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#e0e0e0' },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, paddingVertical: 14, color: '#333', fontFamily: 'Outfit_400Regular', fontSize: 16 },
  filtersContainer: { marginBottom: 15 },
  filtersScroll: { paddingHorizontal: 4 },
  filterChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8f8f8', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 25, marginRight: 10, borderWidth: 1, borderColor: '#e0e0e0' },
  filterChipSelected: { backgroundColor: '#FF4A1C', borderColor: '#FF4A1C' },
  filterChipText: { color: '#666', fontFamily: 'Outfit_500Medium', fontSize: 14, marginLeft: 6 },
  filterChipTextSelected: { color: '#fff', fontFamily: 'Outfit_500Medium' },
  resultsContainer: { marginBottom: 15 },
  resultsText: { color: '#666', fontFamily: 'Outfit_400Regular', fontSize: 14 },
  servicesContainer: { paddingBottom: 100 },
  serviceCard: { backgroundColor: '#f8f8f8', borderRadius: 16, marginBottom: 20, overflow: 'hidden', borderWidth: 1, borderColor: '#e0e0e0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  imageContainer: { position: 'relative' },
  serviceImage: { width: '100%', height: 200 },
  unavailableOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  unavailableText: { color: '#fff', fontFamily: 'Outfit_700Bold', fontSize: 18, backgroundColor: 'rgba(255,0,0,0.7)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  ratingBadge: { position: 'absolute', top: 15, left: 15, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  ratingText: { color: '#fff', fontFamily: 'Outfit_500Medium', fontSize: 14, marginLeft: 5 },
  heartButton: { position: 'absolute', top: 15, right: 15, backgroundColor: 'rgba(0,0,0,0.5)', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  serviceInfo: { padding: 20 },
  serviceHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  serviceTitle: { fontFamily: 'Outfit_700Bold', fontSize: 22, color: '#333', flex: 1 },
  categoryBadge: { backgroundColor: 'rgba(255,74,28,0.1)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: '#FF4A1C' },
  categoryText: { color: '#FF4A1C', fontFamily: 'Outfit_500Medium', fontSize: 12 },
  serviceDescription: { color: '#666', fontFamily: 'Outfit_400Regular', fontSize: 14, lineHeight: 20, marginBottom: 15 },
  featuresContainer: { marginBottom: 15 },
  featureTag: { backgroundColor: '#e8e8e8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, marginRight: 8, borderWidth: 1, borderColor: '#d0d0d0' },
  featureText: { color: '#555', fontFamily: 'Outfit_400Regular', fontSize: 12 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontFamily: 'Outfit_700Bold', fontSize: 14, color: '#333' },
  priceUnit: { fontFamily: 'Outfit_400Regular', fontSize: 14, color: '#666' },
  bookButton: { backgroundColor: '#FF4A1C', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, paddingVertical: 12, borderRadius: 15 },
  bookButtonDisabled: { backgroundColor: '#999' },
  bookButtonText: { color: '#fff', fontFamily: 'Outfit_500Medium', fontSize: 16 },
  bookIcon: { marginLeft: 8 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', minHeight: 300 },
  loadingText: { color: '#666', fontFamily: 'Outfit_400Regular', fontSize: 16, marginTop: 20 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { color: '#333', fontFamily: 'Outfit_700Bold', fontSize: 24, marginTop: 20, marginBottom: 10 },
  emptyText: { color: '#666', fontFamily: 'Outfit_400Regular', fontSize: 16, textAlign: 'center', marginBottom: 30 },
  resetButton: { backgroundColor: '#f0f0f0', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 15, borderWidth: 1, borderColor: '#d0d0d0' },
  resetButtonText: { color: '#333', fontFamily: 'Outfit_500Medium', fontSize: 16 }
});
