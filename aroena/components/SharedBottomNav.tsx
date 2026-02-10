import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, Vibration } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

type Tab = {
    name: string;
    path: string;
    icon: keyof typeof Ionicons.glyphMap;
    activeIcon: keyof typeof Ionicons.glyphMap;
    label: string;
};

const tabs: Tab[] = [
    { name: 'home', path: '/bookchoice', icon: 'home-outline', activeIcon: 'home', label: 'Home' },
    { name: 'active', path: '/active-orders', icon: 'time-outline', activeIcon: 'time', label: 'Active Order' },
    { name: 'completed', path: '/completed-orders', icon: 'checkmark-done-circle-outline', activeIcon: 'checkmark-done-circle', label: 'History' },
    { name: 'profile', path: '/profile', icon: 'person-outline', activeIcon: 'person', label: 'Profile' },
];

export default function SharedBottomNav() {
    const router = useRouter();
    const pathname = usePathname();

    const handlePress = (path: string) => {
        if (Platform.OS === 'android') {
            Vibration.vibrate(10);
        }
        router.push(path as any);
    };

    return (
        <View style={styles.container}>
            {tabs.map((tab) => {
                const isActive = pathname === tab.path;
                return (
                    <TouchableOpacity
                        key={tab.name}
                        style={styles.navItem}
                        onPress={() => handlePress(tab.path)}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name={isActive ? tab.activeIcon : tab.icon}
                            size={24}
                            color={isActive ? '#FF4A1C' : '#999'}
                        />
                        <Text style={[styles.navText, isActive && styles.navTextActive]}>
                            {tab.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        height: 75,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 20,
        paddingBottom: Platform.OS === 'ios' ? 20 : 10,
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
});
