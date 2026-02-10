import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';
import * as Animatable from 'react-native-animatable';
import { useRouter, useFocusEffect } from 'expo-router';
import SharedBottomNav from '../components/SharedBottomNav';

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
    const [selectedOrders, setSelectedOrders] = useState<number[]>([]);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [editQuantity, setEditQuantity] = useState('');
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
            // Show all except PAID
            const activeOrders = res.data.filter(
                (order: Order) => order.status !== 'PAID'
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

    const handlePaySelected = () => {
        if (selectedOrders.length === 0) return;

        const selectedItems = orders.filter(o => selectedOrders.includes(o.id));
        const totalAmount = selectedItems.reduce((sum, item) => sum + item.total, 0);

        router.push({
            pathname: '/payment',
            params: {
                orderId: selectedOrders.join(','),
                amount: totalAmount
            }
        });
    };

    const toggleOrderSelection = (orderId: number) => {
        setSelectedOrders(prev =>
            prev.includes(orderId)
                ? prev.filter(id => id !== orderId)
                : [...prev, orderId]
        );
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

    const handleEditOrder = (order: Order) => {
        setSelectedOrder(order);
        setEditQuantity(order.quantity.toString());
        setIsEditModalVisible(true);
    };

    const updateOrderQuantity = async () => {
        if (!selectedOrder) return;
        const newQty = parseInt(editQuantity);
        if (isNaN(newQty) || newQty < 1) {
            Alert.alert('Invalid Quantity', 'Please enter a valid number greater than 0');
            return;
        }

        try {
            const unitPrice = selectedOrder.total / selectedOrder.quantity;
            const newTotal = unitPrice * newQty;
            await api.put(`/orders/${selectedOrder.id}`, {
                quantity: newQty,
                total: newTotal
            });

            setOrders(prev => prev.map(o =>
                o.id === selectedOrder.id ? { ...o, quantity: newQty, total: newTotal } : o
            ));
            setIsEditModalVisible(false);
            setSelectedOrder(null);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update order');
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return '#4CAF50';
            case 'PENDING': return '#FFC107';
            case 'REJECTED': return '#F44336';
            default: return '#999';
        }
    };

    const renderItem = ({ item, index }: { item: Order; index: number }) => (
        <Animatable.View animation="fadeInUp" delay={index * 100} style={styles.card}>
            <View style={styles.header}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    {item.status === 'APPROVED' && (
                        <TouchableOpacity
                            onPress={() => toggleOrderSelection(item.id)}
                            style={styles.checkbox}
                        >
                            <Ionicons
                                name={selectedOrders.includes(item.id) ? "checkbox" : "square-outline"}
                                size={24}
                                color="#FF4A1C"
                            />
                        </TouchableOpacity>
                    )}
                    <Text style={styles.serviceTitle}>{item.service.title}</Text>
                </View>
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

            {(item.status === 'PENDING' || item.status === 'REJECTED') && (
                <View style={styles.actionRow}>
                    {item.status === 'PENDING' && (
                        <TouchableOpacity style={styles.editButton} onPress={() => handleEditOrder(item)}>
                            <Ionicons name="create-outline" size={18} color="#FF4A1C" />
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
                        <Ionicons name="trash-outline" size={18} color="#F44336" />
                        <Text style={styles.deleteButtonText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}

            {item.status === 'REJECTED' && (
                <View style={styles.rejectedMessage}>
                    <Ionicons name="information-circle-outline" size={16} color="#d32f2f" />
                    <Text style={styles.rejectedText}>This order was rejected. Please contact support.</Text>
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
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.title}>Active Order</Text>
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => router.push('/bookchoice')}
                    style={[styles.refreshButton, { marginRight: 10, backgroundColor: '#FF4A1C' }]}
                >
                    <Ionicons name="add" size={22} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={onRefresh} style={styles.refreshButton} disabled={refreshing}>
                    {refreshing ? (
                        <ActivityIndicator size="small" color="#FF4A1C" />
                    ) : (
                        <Ionicons name="refresh" size={22} color="#333" />
                    )}
                </TouchableOpacity>
            </View>

            <FlatList
                data={orders}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={[
                    styles.listContent,
                    selectedOrders.length > 0 ? { paddingBottom: 160 } : { paddingBottom: 100 }
                ]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                ListEmptyComponent={
                    <Animatable.View animation="fadeIn" style={styles.emptyContainer}>
                        <Ionicons name="time-outline" size={80} color="#ddd" />
                        <Text style={styles.emptyTitle}>No Orders</Text>
                        <Text style={styles.emptyText}>You don't have any pending or approved orders</Text>
                        <TouchableOpacity
                            style={styles.browseButton}
                            onPress={() => router.push('/bookchoice')}
                        >
                            <Text style={styles.browseButtonText}>Browse Services</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                }
            />

            {selectedOrders.length > 0 && (
                <Animatable.View animation="slideInUp" duration={300} style={styles.paymentFooter}>
                    <View style={styles.paymentFooterInfo}>
                        <Text style={styles.selectedCount}>{selectedOrders.length} orders selected</Text>
                        <Text style={styles.totalPrice}>
                            Total: {orders
                                .filter(o => selectedOrders.includes(o.id))
                                .reduce((sum, o) => sum + o.total, 0)
                                .toLocaleString()} RWF
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.paySelectedButton} onPress={handlePaySelected}>
                        <Text style={styles.paySelectedText}>Pay Total</Text>
                        <Ionicons name="card-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </Animatable.View>
            )}

            <Modal
                visible={isEditModalVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={() => setIsEditModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Animatable.View animation="zoomIn" duration={300} style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Quantity</Text>
                        <Text style={styles.modalSubtitle}>{selectedOrder?.service.title}</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Quantity</Text>
                            <TextInput
                                style={styles.input}
                                value={editQuantity}
                                onChangeText={setEditQuantity}
                                keyboardType="numeric"
                                placeholder="Enter quantity"
                                autoFocus
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setIsEditModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.confirmButton, { backgroundColor: '#FF4A1C' }]}
                                onPress={updateOrderQuantity}
                            >
                                <Text style={styles.confirmButtonText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                    </Animatable.View>
                </View>
            </Modal>

            <SharedBottomNav />
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
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FF4A1C',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    title: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 24,
        color: '#333',
    },
    brandName: {
        fontFamily: 'Satisfy_400Regular',
        fontSize: 18,
        color: '#FF4A1C',
        marginBottom: -5,
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
    checkbox: {
        marginRight: 12,
    },
    serviceTitle: {
        fontFamily: 'Outfit_500Medium',
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
        fontFamily: 'Outfit_500Medium',
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
        fontFamily: 'Outfit_500Medium',
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
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 74, 28, 0.1)',
        marginRight: 10,
    },
    editButtonText: {
        color: '#FF4A1C',
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        marginLeft: 5,
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
    rejectedMessage: {
        marginTop: 12,
        padding: 10,
        backgroundColor: '#FFF5F5',
        borderRadius: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    rejectedText: {
        color: '#d32f2f',
        fontSize: 12,
        fontFamily: 'Outfit_400Regular',
        marginLeft: 8,
        flex: 1,
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
        marginBottom: 30,
    },
    browseButton: {
        backgroundColor: '#FF4A1C',
        paddingHorizontal: 30,
        paddingVertical: 12,
        borderRadius: 25,
    },
    browseButtonText: {
        color: '#fff',
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
    },
    paymentFooter: {
        position: 'absolute',
        bottom: 85,
        left: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    paymentFooterInfo: {
        flex: 1,
    },
    selectedCount: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
        color: '#666',
    },
    totalPrice: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 18,
        color: '#333',
    },
    paySelectedButton: {
        backgroundColor: '#FF4A1C',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    paySelectedText: {
        color: '#fff',
        fontFamily: 'Outfit_700Bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 15,
        elevation: 10,
    },
    modalTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 22,
        color: '#333',
        marginBottom: 5,
    },
    modalSubtitle: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F5F6FA',
        borderRadius: 12,
        padding: 15,
        fontFamily: 'Outfit_400Regular',
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#E1E4F2',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 12,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    cancelButtonText: {
        fontFamily: 'Outfit_500Medium',
        color: '#666',
        fontSize: 16,
    },
    confirmButton: {
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 12,
    },
    confirmButtonText: {
        fontFamily: 'Outfit_700Bold',
        color: '#fff',
        fontSize: 16,
    },
});
