import { Tabs } from 'expo-router';
import React from 'react';
import BottomTabBar from '../../components/BottomTabBar';

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <BottomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                }}
            />
            <Tabs.Screen
                name="active-orders"
                options={{
                    title: 'Active Orders',
                }}
            />
            <Tabs.Screen
                name="completed-orders"
                options={{
                    title: 'Completed',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                }}
            />
        </Tabs>
    );
}
