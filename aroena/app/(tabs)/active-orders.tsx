import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api';
import * as Animatable from 'react-native-animatable';
import { useRouter, useFocusEffect } from 'expo-router';

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

export default function ActiveOrders() {
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
            // Filter only active orders (PENDING and APPROVED)
            const activeOrders = res.data.filter(
                (order: Order) => order.status === 'PENDING' || order.status === 'APPROVED'
            );
            setOrders(activeOrders);
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
            params: { orderId: order.id, amount: order.total },
        });
    };

    const handleDelete = async (orderId: number) => {
        Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
            { text: 'No', style: 'cancel' },
            {
                text: 'Yes, Cancel',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.delete(`/orders/${orderId}`);
                        setOrders((prev) => prev.filter((o) => o.id !== orderId));
                        Alert.alert('Success', 'Order cancelled successfully');
                    } catch (error: any) {
                        Alert.alert('Error', `Failed to cancel order: ${error.response?.data?.message || error.message}`);
                    }
                },
            },
        ]);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
                return '#4CAF50';
            case 'PENDING':
                return '#FFC107';
            default:
                return '#999';
        }
    };

    const renderItem = ({ item, index }: { item: Order; index: number }) => (
        <Animatable.View animation="fadeInUp" delay={index * 100} style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.serviceTitle}>{item.service.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status}</Text>
                </View>
            </View>

            <View style={styles.details}>
                <View style={styles.detailRow}>
                    <Ionicons name="pricetag-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>Quantity: {item.quantity}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="cash-outline" size={16} color="#666" />
                    <Text style={styles.detailText}>Total: {item.total.toLocaleString()} RWF</Text>
                </View>
                <View style={styles.detailRow}>
                    <Ionicons name="calendar-outline" size={16} color="#666" />
                    <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
                </View>
            </View>

            {item.status === 'APPROVED' && (
                <TouchableOpacity style={styles.payButton} onPress={() => handlePay(item)}>
                    <Ionicons name="card-outline" size={18} color="#fff" />
                    <Text style={styles.payButtonText}>Pay Now</Text>
                </TouchableOpacity>
            )}

            {item.status === 'PENDING' && (
                <View style={styles.actionRow}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                        <Ionicons name="trash-outline" size={18} color="#F44336" />
                        <Text style={styles.deleteButtonText}>Cancel</Text>
                    </TouchableOpacity>
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
                <Text style={styles.title}>Active Orders</Text>
                <TouchableOpacity onPress={onRefresh} style={styles.refreshButton} disabled={refreshing}>
                    {refreshing ? (
                        <ActivityIndicator size="small" color="#FF4A1C" />
                    ) : (
                        <Ionicons name="refresh" size={22} color="#FF4A1C" />
                    )}
                </TouchableOpacity>
            </View>

            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <Animatable.View animation="fadeIn" style={styles.emptyContainer}>
                        <Ionicons name="time-outline" size={80} color="#ddd" />
                        <Text style={styles.emptyTitle}>No Active Orders</Text>
                        <Text style={styles.emptyText}>You don't have any pending or approved orders</Text>
                    </Animatable.View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    topHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    title: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 28,
        color: '#333',
    },
    refreshButton: {
        padding: 8,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    listContent: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 18,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    serviceTitle: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18,
        color: '#333',
        flex: 1,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    statusText: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Outfit_600SemiBold',
    },
    details: {
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    detailText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: '#666',
        marginLeft: 8,
    },
    dateText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 13,
        color: '#999',
        marginLeft: 8,
    },
    payButton: {
        backgroundColor: '#FF4A1C',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 14,
        borderRadius: 12,
        gap: 8,
    },
    payButtonText: {
        color: '#fff',
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 16,
        marginLeft: 8,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 12,
    },
    deleteButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(244, 67, 54, 0.1)',
    },
    deleteButtonText: {
        color: '#F44336',
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        marginLeft: 5,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
    },
    emptyTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 22,
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    emptyText: {
        color: '#999',
        fontFamily: 'Outfit_400Regular',
        fontSize: 15,
        textAlign: 'center',
    },
});
