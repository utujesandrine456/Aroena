import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, RefreshControl, Image, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api';
import * as Animatable from 'react-native-animatable';
import { useFocusEffect, useRouter } from 'expo-router';
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

            if (!user || !user.id) {
                Alert.alert('Debug Info', 'User ID not found in storage');
                setLoading(false);
                return;
            }

            const res = await api.get(`/orders/user/${user.id}`);
            const completedOrders = res.data.filter((order: Order) => order.status === 'PAID');
            setOrders(completedOrders);
        } catch (error: any) {
            if (error.response) {
                console.error('Server Response:', error.response.data);
            } else if (error.request) {
                Alert.alert('Network Error', 'No response received from server. Please check your internet connection.');
            } else {
                Alert.alert('Error', error.message);
            }
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

    const [selectedReceipt, setSelectedReceipt] = useState<Order | null>(null);
    const [isReceiptVisible, setIsReceiptVisible] = useState(false);

    const handleViewReceipt = (order: Order) => {
        setSelectedReceipt(order);
        setIsReceiptVisible(true);
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
                    <Text style={styles.receiptButtonText}>Receipt</Text>
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
                    <Text style={styles.title}>History</Text>
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
                        <Text style={styles.emptyTitle}>No History</Text>
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

            <SharedBottomNav />

            <Modal visible={isReceiptVisible} transparent animationType="fade" onRequestClose={() => setIsReceiptVisible(false)}>
                <View style={styles.modalOverlay}>
                    <Animatable.View animation="zoomIn" duration={400} style={styles.receiptContainer}>
                        <View style={styles.receiptHeader}>
                            <Text style={styles.receiptBrand}>Aroena</Text>
                            <View style={styles.receiptBadge}>
                                <Text style={styles.receiptBadgeText}>OFFICIAL RECEIPT</Text>
                            </View>
                        </View>

                        <View style={styles.receiptContent}>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Order ID</Text>
                                <Text style={styles.receiptValue}>#{selectedReceipt?.id}</Text>
                            </View>
                            <View style={styles.receiptRow}>
                                <Text style={styles.receiptLabel}>Date</Text>
                                <Text style={styles.receiptValue}>{selectedReceipt ? new Date(selectedReceipt.date).toLocaleDateString() : ''}</Text>
                            </View>

                            <View style={styles.receiptDivider} />

                            <View style={styles.receiptItem}>
                                <Text style={styles.receiptItemTitle}>{selectedReceipt?.service.title}</Text>
                                <View style={styles.receiptItemDetails}>
                                    <Text style={styles.receiptItemQty}>x{selectedReceipt?.quantity}</Text>
                                    <Text style={styles.receiptItemPrice}>{selectedReceipt?.service.price.toLocaleString()} RWF</Text>
                                </View>
                            </View>

                            <View style={styles.receiptDivider} />

                            <View style={styles.receiptTotalRow}>
                                <Text style={styles.totalLabel}>Total Amount</Text>
                                <Text style={styles.totalValue}>{selectedReceipt?.total.toLocaleString()} RWF</Text>
                            </View>

                            <View style={styles.receiptFooter}>
                                <View style={styles.qrPlaceholder}>
                                    <Ionicons name="qr-code-outline" size={50} color="#333" />
                                </View>
                                <Text style={styles.footerText}>Thank you for choosing Aroena!</Text>
                                <Text style={styles.footerSubtext}>Your comfort is our priority.</Text>
                            </View>
                        </View>

                        <TouchableOpacity style={styles.closeReceipt} onPress={() => setIsReceiptVisible(false)}>
                            <Text style={styles.closeReceiptText}>Close</Text>
                        </TouchableOpacity>
                    </Animatable.View>
                </View>
            </Modal>
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
    brandName: {
        fontFamily: 'Satisfy_400Regular',
        fontSize: 20,
        color: '#FF4A1C',
        marginBottom: -5,
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
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: 70,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 20,
        paddingBottom: 5,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    navText: {
        fontSize: 11,
        marginTop: 4,
        color: '#999',
        fontFamily: 'Outfit_400Regular',
    },
    navTextActive: {
        color: '#FF4A1C',
        fontFamily: 'Outfit_600SemiBold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    receiptContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
    },
    receiptHeader: {
        backgroundColor: '#FF4A1C',
        paddingVertical: 15,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    receiptBrand: {
        fontFamily: 'Satisfy_400Regular',
        fontSize: 28,
        color: '#fff',
    },
    receiptBadge: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 10,
        marginTop: 5,
    },
    receiptBadgeText: {
        color: '#fff',
        fontSize: 10,
        fontFamily: 'Outfit_700Bold',
        letterSpacing: 1,
    },
    receiptContent: {
        padding: 15,
    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    receiptLabel: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: '#999',
    },
    receiptValue: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        color: '#333',
    },
    receiptDivider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderRadius: 1,
    },
    receiptItem: {
        marginVertical: 10,
    },
    receiptItemTitle: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 18,
        color: '#333',
        marginBottom: 5,
    },
    receiptItemDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    receiptItemQty: {
        fontFamily: 'Outfit_400Regular',
        color: '#666',
    },
    receiptItemPrice: {
        fontFamily: 'Outfit_500Medium',
        color: '#333',
    },
    receiptTotalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    totalLabel: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 18,
        color: '#333',
    },
    totalValue: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 22,
        color: '#FF4A1C',
    },
    receiptFooter: {
        alignItems: 'center',
        marginTop: 15,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    qrPlaceholder: {
        marginBottom: 10,
        opacity: 0.8,
    },
    footerText: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 14,
        color: '#333',
    },
    footerSubtext: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    closeReceipt: {
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    closeReceiptText: {
        fontFamily: 'Outfit_700Bold',
        color: '#666',
        fontSize: 16,
    },
});
