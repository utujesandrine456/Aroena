import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';
import * as Animatable from 'react-native-animatable';

type Order = {
    id: number;
    service: {
        title: string;
        image: string;
        price: number;
        category: string;
    };
    quantity: number;
    total: number;
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PAID';
    date: string;
};

export default function MyOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    
    const fetchOrders = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (!userData) {
                setLoading(false);
                return;
            }
            const user = JSON.parse(userData);

            const res = await api.get(`/orders/user/${user.id}`);
            setOrders(res.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch orders');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchOrders();
        }, [])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOrders();
    }, []);

    const handlePay = (order: Order) => {
        router.push({
            pathname: '/payment',
            params: { orderId: order.id, amount: order.total }
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return '#4CAF50';
            case 'PENDING': return '#FFC107';
            case 'REJECTED': return '#F44336';
            case 'PAID': return '#2196F3';
            default: return '#999';
        }
    };

    const renderItem = ({ item, index }: { item: Order, index: number }) => (
        <Animatable.View animation="fadeInUp" delay={index * 100} style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.serviceTitle}>{item.service.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.details}>
                <Text style={styles.detailText}>Quantity: {item.quantity}</Text>
                <Text style={styles.detailText}>Total: {item.total.toLocaleString()} RWF</Text>
                <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
            </View>

            {item.status === 'APPROVED' && (
                <TouchableOpacity style={styles.payButton} onPress={() => handlePay(item)}>
                    <Text style={styles.payButtonText}>Pay Now</Text>
                    <Ionicons name="card-outline" size={16} color="#fff" style={{ marginLeft: 5 }} />
                </TouchableOpacity>
            )}

            {item.status === 'REJECTED' && (
                <View style={styles.rejectedMessage}>
                    <Text style={styles.rejectedText}>This order was rejected by admin.</Text>
                </View>
            )}
        </Animatable.View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#FF4A1C" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.topHeader}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <Text style={styles.title}>My Orders</Text>
            </View>

            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons name="basket-outline" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>No orders found</Text>
                    </View>
                }
            />
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8',
        paddingTop: 40,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    backButton: {
        padding: 5,
        marginRight: 15,
    },
    title: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 24,
        color: '#333',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    serviceTitle: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 18,
        color: '#333',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontFamily: 'Outfit_500Medium',
    },
    details: {
        marginBottom: 15,
    },
    detailText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: '#666',
        marginBottom: 3,
    },
    dateText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    payButton: {
        backgroundColor: '#FF4A1C',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 12,
        borderRadius: 10,
    },
    payButtonText: {
        color: '#fff',
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
    },
    rejectedMessage: {
        marginTop: 5,
        padding: 10,
        backgroundColor: '#fee',
        borderRadius: 8
    },
    rejectedText: {
        color: '#d32f2f',
        fontSize: 13,
        fontFamily: 'Outfit_400Regular'
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 50,
    },
    emptyText: {
        color: '#999',
        fontFamily: 'Outfit_400Regular',
        fontSize: 16,
        marginTop: 10,
    }
});
