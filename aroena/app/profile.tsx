import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import SharedBottomNav from '../components/SharedBottomNav';

type User = {
    id: number;
    name: string;
    phone: string;
};

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');

    useEffect(() => {
        loadUserData();
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

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Profile</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Profile Card */}
                <Animatable.View animation="fadeInUp" delay={200} style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{user ? getInitials(user.name) : 'U'}</Text>
                        </View>
                    </View>

                    <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
                    <Text style={styles.userPhone}>{user?.phone || 'No phone number'}</Text>

                    <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
                        <Ionicons name="create-outline" size={18} color="#FF4A1C" />
                        <Text style={styles.editButtonText}>Edit Profile</Text>
                    </TouchableOpacity>
                </Animatable.View>

                {/* Quick Actions */}
                <Animatable.View animation="fadeInUp" delay={300} style={styles.actionsContainer}>
                    <TouchableOpacity style={styles.actionItem} onPress={() => router.push('/active-orders')}>
                        <Ionicons name="receipt-outline" size={24} color="#FF4A1C" />
                        <Text style={styles.actionText}>Active Order</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem}>
                        <Ionicons name="help-circle-outline" size={24} color="#FF4A1C" />
                        <Text style={styles.actionText}>Help & Support</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem}>
                        <Ionicons name="settings-outline" size={24} color="#FF4A1C" />
                        <Text style={styles.actionText}>Settings</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </Animatable.View>
            </ScrollView>

            <SharedBottomNav />

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
                                <Text style={styles.saveButtonText}>Save</Text>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#FF4A1C',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontFamily: 'Outfit_700Bold',
        fontSize: 20,
        color: '#fff',
    },
    scrollContent: {
        paddingBottom: 100,
    },
    profileCard: {
        backgroundColor: '#fff',
        marginHorizontal: 20,
        marginTop: 20,
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
    actionsContainer: {
        paddingHorizontal: 20,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
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
    actionText: {
        fontFamily: 'Outfit_500Medium',
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
        flex: 1,
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
