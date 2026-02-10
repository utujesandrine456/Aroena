import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect, useRouter } from 'expo-router';

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

export default function CompletedOrders() {
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
            // Filter only completed orders (PAID)
            const completedOrders = res.data.filter((order: Order) => order.status === 'PAID');
            setOrders(completedOrders);
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

    const handleReorder = (order: Order) => {
        Alert.alert(
            'Reorder',
            `Would you like to order ${order.service.title} again?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reorder',
                    onPress: () => {
                        router.push(`/details?service=${encodeURIComponent(JSON.stringify(order.service))}`);
                    },
                },
            ]
        );
    };

    const handleViewReceipt = (order: Order) => {
        Alert.alert(
            'Order Receipt',
            `Order ID: ${order.id}\n` +
            `Service: ${order.service.title}\n` +
            `Quantity: ${order.quantity}\n` +
            `Total: ${order.total.toLocaleString()} RWF\n` +
            `Date: ${new Date(order.date).toLocaleDateString()}\n` +
            `Status: ${order.status}`,
            [{ text: 'OK' }]
        );
    };

    const renderItem = ({ item, index }: { item: Order; index: number }) => (
        <Animatable.View animation="fadeInUp" delay={index * 100} style={styles.card}>
            <View style={styles.cardHeader}>
                <View style={styles.headerLeft}>
                    <View style={styles.iconContainer}>
                        <Ionicons
                            name={item.service.category === 'Room' ? 'bed' : 'restaurant'}
                            size={24}
                            color="#FF4A1C"
                        />
                    </View>
                    <View style={styles.headerInfo}>
                        <Text style={styles.serviceTitle}>{item.service.title}</Text>
                        <Text style={styles.categoryText}>{item.service.category}</Text>
                    </View>
                </View>
                <View style={styles.statusBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="#fff" />
                    <Text style={styles.statusText}>PAID</Text>
                </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.details}>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Quantity:</Text>
                    <Text style={styles.detailValue}>{item.quantity}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Total Amount:</Text>
                    <Text style={styles.detailValueHighlight}>{item.total.toLocaleString()} RWF</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Completed on:</Text>
                    <Text style={styles.detailValue}>{new Date(item.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    })}</Text>
                </View>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity style={styles.receiptButton} onPress={() => handleViewReceipt(item)}>
                    <Ionicons name="receipt-outline" size={18} color="#666" />
                    <Text style={styles.receiptButtonText}>View Receipt</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reorderButton} onPress={() => handleReorder(item)}>
                    <Ionicons name="repeat-outline" size={18} color="#fff" />
                    <Text style={styles.reorderButtonText}>Reorder</Text>
                </TouchableOpacity>
            </View>
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
                <View>
                    <Text style={styles.title}>Completed Orders</Text>
                    <Text style={styles.subtitle}>{orders.length} order{orders.length !== 1 ? 's' : ''} completed</Text>
                </View>
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
                        <View style={styles.emptyIconContainer}>
                            <Ionicons name="checkmark-done-circle-outline" size={100} color="#e0e0e0" />
                        </View>
                        <Text style={styles.emptyTitle}>No Completed Orders</Text>
                        <Text style={styles.emptyText}>Your completed orders will appear here</Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => router.push('/bookchoice')}
                        >
                            <Text style={styles.browseButtonText}>Browse Services</Text>
                            <Ionicons name="arrow-forward" size={18} color="#fff" />
                        </TouchableOpacity>
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
    subtitle: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: '#666',
        marginTop: 4,
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
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 74, 28, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    headerInfo: {
        flex: 1,
    },
    serviceTitle: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 17,
        color: '#333',
        marginBottom: 2,
    },
    categoryText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 13,
        color: '#999',
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
    },
    statusText: {
        color: '#fff',
        fontSize: 11,
        fontFamily: 'Outfit_600SemiBold',
        marginLeft: 4,
    },
    divider: {
        height: 1,
        backgroundColor: '#f0f0f0',
        marginBottom: 15,
    },
    details: {
        marginBottom: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    detailLabel: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: '#666',
    },
    detailValue: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        color: '#333',
    },
    detailValueHighlight: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 16,
        color: '#FF4A1C',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 10,
    },
    receiptButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        gap: 6,
    },
    receiptButtonText: {
        color: '#666',
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        marginLeft: 6,
    },
    reorderButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FF4A1C',
        paddingVertical: 12,
        borderRadius: 10,
        gap: 6,
    },
    reorderButtonText: {
        color: '#fff',
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 14,
        marginLeft: 6,
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        paddingHorizontal: 40,
    },
    emptyIconContainer: {
        marginBottom: 20,
    },
    emptyTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 22,
        color: '#333',
        marginBottom: 10,
    },
    emptyText: {
        color: '#999',
        fontFamily: 'Outfit_400Regular',
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 30,
    },
    browseButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF4A1C',
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 12,
        gap: 8,
    },
    browseButtonText: {
        color: '#fff',
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 16,
    },
});
