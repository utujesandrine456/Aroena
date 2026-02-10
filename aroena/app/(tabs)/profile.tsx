import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api';

type User = {
    id: number;
    name: string;
    phone: string;
};

type OrderStats = {
    total: number;
    completed: number;
    pending: number;
    approved: number;
};

export default function Profile() {
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState<OrderStats>({ total: 0, completed: 0, pending: 0, approved: 0 });
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUserData();
        loadOrderStats();
    }, []);

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);
                setEditName(parsedUser.name);
                setEditPhone(parsedUser.phone);
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadOrderStats = async () => {
        try {
            const userData = await AsyncStorage.getItem('user');
            if (!userData) return;

            const parsedUser = JSON.parse(userData);
            const res = await api.get(`/orders/user/${parsedUser.id}`);
            const orders = res.data;

            const stats = {
                total: orders.length,
                completed: orders.filter((o: any) => o.status === 'PAID').length,
                pending: orders.filter((o: any) => o.status === 'PENDING').length,
                approved: orders.filter((o: any) => o.status === 'APPROVED').length,
            };

            setStats(stats);
        } catch (error) {
            console.error('Error loading order stats:', error);
        }
    };

    const handleUpdateProfile = async () => {
        if (!editName.trim() || !editPhone.trim()) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            const updatedUser = { ...user, name: editName, phone: editPhone };
            await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            setUser(updatedUser as User);
            setIsEditModalVisible(false);
            Alert.alert('Success', 'Profile updated successfully');
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'Failed to update profile');
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('user');
                        // Navigate to login screen - you may need to adjust this based on your navigation setup
                        Alert.alert('Logged Out', 'You have been logged out successfully');
                    },
                },
            ]
        );
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <Animatable.View animation="fadeInDown" delay={100} style={styles.header}>
                    <Text style={styles.headerTitle}>Profile</Text>
                </Animatable.View>

                {/* Profile Card */}
                <Animatable.View animation="fadeInUp" delay={200} style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{user ? getInitials(user.name) : 'U'}</Text>
                        </View>
                        <View style={styles.avatarBadge}>
                            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                        </View>
                    </View>

                    <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
                    <Text style={styles.userPhone}>{user?.phone || 'No phone number'}</Text>

                    <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
                        <Ionicons name="create-outline" size={18} color="#FF4A1C" />
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </Animatable.View>

                {/* Order Statistics */}
                <Animatable.View animation="fadeInUp" delay={300} style={styles.statsContainer}>
                    <Text style={styles.sectionTitle}>Order Statistics</Text>
                    <View style={styles.statsGrid}>
                        <View style={styles.statCard}>
                            <Ionicons name="receipt-outline" size={28} color="#FF4A1C" />
                            <Text style={styles.statValue}>{stats.total}</Text>
                            <Text style={styles.statLabel}>Total Orders</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="checkmark-done-circle-outline" size={28} color="#4CAF50" />
                            <Text style={styles.statValue}>{stats.completed}</Text>
                            <Text style={styles.statLabel}>Completed</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="time-outline" size={28} color="#FFC107" />
                            <Text style={styles.statValue}>{stats.pending}</Text>
                            <Text style={styles.statLabel}>Pending</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="checkmark-circle-outline" size={28} color="#2196F3" />
                            <Text style={styles.statValue}>{stats.approved}</Text>
                            <Text style={styles.statLabel}>Approved</Text>
                        </View>
                    </View>
                </Animatable.View>

                {/* Settings Section */}
                <Animatable.View animation="fadeInUp" delay={400} style={styles.settingsContainer}>
                    <Text style={styles.sectionTitle}>Settings</Text>

                    <View style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="notifications-outline" size={24} color="#333" />
                            <Text style={styles.settingText}>Notifications</Text>
                        </View>
                        <Switch
                            value={notificationsEnabled}
                            onValueChange={setNotificationsEnabled}
                            trackColor={{ false: '#ddd', true: '#FFB4A1' }}
                            thumbColor={notificationsEnabled ? '#FF4A1C' : '#f4f3f4'}
                        />
                    </View>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="language-outline" size={24} color="#333" />
                            <Text style={styles.settingText}>Language</Text>
                        </View>
                        <View style={styles.settingRight}>
                            <Text style={styles.settingValue}>English</Text>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="color-palette-outline" size={24} color="#333" />
                            <Text style={styles.settingText}>Theme</Text>
                        </View>
                        <View style={styles.settingRight}>
                            <Text style={styles.settingValue}>Light</Text>
                            <Ionicons name="chevron-forward" size={20} color="#999" />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.settingItem}>
                        <View style={styles.settingLeft}>
                            <Ionicons name="help-circle-outline" size={24} color="#333" />
                            <Text style={styles.settingText}>Help & Support</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </Animatable.View>

                {/* Logout Button */}
                <Animatable.View animation="fadeInUp" delay={500}>
                    <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                        <Ionicons name="log-out-outline" size={22} color="#F44336" />
                        <Text style={styles.logoutText}>Logout</Text>
                    </TouchableOpacity>
                </Animatable.View>
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal visible={isEditModalVisible} animationType="fade" transparent={true}>
                <View style={styles.modalOverlay}>
                    <Animatable.View animation="zoomIn" duration={300} style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                value={editName}
                                onChangeText={setEditName}
                                placeholder="Enter your name"
                                placeholderTextColor="#999"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={editPhone}
                                onChangeText={setEditPhone}
                                placeholder="Enter your phone"
                                placeholderTextColor="#999"
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditModalVisible(false)}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
                                <Text style={styles.saveButtonText}>Save Changes</Text>
                            </TouchableOpacity>
                        </View>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    loadingText: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 16,
        color: '#666',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
    },
    headerTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 32,
        color: '#333',
    },
    profileCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        borderRadius: 20,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
        marginBottom: 20,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FF4A1C',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#fff',
        shadowColor: '#FF4A1C',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarText: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 36,
        color: '#fff',
    },
    avatarBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 2,
    },
    userName: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 24,
        color: '#333',
        marginBottom: 5,
    },
    userPhone: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
    },
    editButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 74, 28, 0.1)',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#FF4A1C',
    },
    editButtonText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 14,
        color: '#FF4A1C',
        marginLeft: 8,
    },
    statsContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 20,
        color: '#333',
        marginBottom: 15,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#fff',
        width: '48%',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
    },
    statValue: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 28,
        color: '#333',
        marginTop: 10,
    },
    statLabel: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        textAlign: 'center',
    },
    settingsContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 18,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    settingText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
    },
    settingRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingValue: {
        fontFamily: 'Outfit_400Regular',
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        marginHorizontal: 20,
        padding: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#F44336',
    },
    logoutText: {
        fontFamily: 'Outfit_600SemiBold',
        fontSize: 16,
        color: '#F44336',
        marginLeft: 10,
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
        maxWidth: 400,
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
        marginTop: 10,
    },
    cancelButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginRight: 10,
    },
    cancelButtonText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        color: '#666',
    },
    saveButton: {
        backgroundColor: '#FF4A1C',
        paddingHorizontal: 25,
        paddingVertical: 12,
        borderRadius: 12,
    },
    saveButtonText: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 16,
        color: '#fff',
    },
});
