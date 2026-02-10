import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Vibration, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function BottomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const slideAnim = useRef(new Animated.Value(0)).current;
    const scaleAnims = useRef(state.routes.map(() => new Animated.Value(1))).current;

    useEffect(() => {
        // Animate the active indicator to the current tab
        Animated.spring(slideAnim, {
            toValue: state.index,
            useNativeDriver: true,
            tension: 68,
            friction: 12,
        }).start();

        // Scale animation for active tab
        scaleAnims.forEach((anim, index) => {
            Animated.spring(anim, {
                toValue: state.index === index ? 1.1 : 1,
                useNativeDriver: true,
                tension: 100,
                friction: 7,
            }).start();
        });
    }, [state.index]);

    const getTabIcon = (routeName: string, isFocused: boolean) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        switch (routeName) {
            case 'index':
                iconName = isFocused ? 'home' : 'home-outline';
                break;
            case 'active-orders':
                iconName = isFocused ? 'time' : 'time-outline';
                break;
            case 'completed-orders':
                iconName = isFocused ? 'checkmark-done-circle' : 'checkmark-done-circle-outline';
                break;
            case 'profile':
                iconName = isFocused ? 'person' : 'person-outline';
                break;
            default:
                iconName = 'ellipse-outline';
        }

        return iconName;
    };

    const getTabLabel = (routeName: string) => {
        switch (routeName) {
            case 'index':
                return 'Home';
            case 'active-orders':
                return 'Active';
            case 'completed-orders':
                return 'Completed';
            case 'profile':
                return 'Profile';
            default:
                return routeName;
        }
    };

    const handleTabPress = (route: any, index: number, isFocused: boolean) => {
        // Haptic feedback
        if (Platform.OS === 'android') {
            Vibration.vibrate(10);
        }

        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
        }
    };

    const tabWidth = 100 / state.routes.length;
    const indicatorTranslateX = slideAnim.interpolate({
        inputRange: state.routes.map((_, i) => i),
        outputRange: state.routes.map((_, i) => i * (100 / state.routes.length)),
    });

    return (
        <View style={styles.container}>
            {/* Animated Active Indicator */}
            <Animated.View
                style={[
                    styles.activeIndicator,
                    {
                        width: `${tabWidth}%`,
                        transform: [
                            {
                                translateX: indicatorTranslateX.interpolate({
                                    inputRange: [0, 100],
                                    outputRange: ['0%', '100%'],
                                }),
                            },
                        ],
                    },
                ]}
            />

            {/* Tab Buttons */}
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const isFocused = state.index === index;
                const iconName = getTabIcon(route.name, isFocused);
                const label = getTabLabel(route.name);

                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={(options as any).tabBarTestID}
                        onPress={() => handleTabPress(route, index, isFocused)}
                        style={styles.tabButton}
                        activeOpacity={0.7}
                    >
                        <Animated.View
                            style={[
                                styles.tabContent,
                                {
                                    transform: [{ scale: scaleAnims[index] }],
                                },
                            ]}
                        >
                            {/* Icon with animation */}
                            <Animatable.View
                                animation={isFocused ? 'bounceIn' : undefined}
                                duration={500}
                                style={styles.iconContainer}
                            >
                                <Ionicons
                                    name={iconName}
                                    size={24}
                                    color={isFocused ? '#FF4A1C' : '#999'}
                                />

                                {/* Badge for active orders */}
                                {route.name === 'active-orders' && (
                                    <Animatable.View
                                        animation="pulse"
                                        iterationCount="infinite"
                                        duration={1500}
                                        style={styles.badge}
                                    >
                                        <View style={styles.badgeDot} />
                                    </Animatable.View>
                                )}
                            </Animatable.View>

                            {/* Label */}
                            <Text
                                style={[
                                    styles.tabLabel,
                                    {
                                        color: isFocused ? '#FF4A1C' : '#999',
                                        fontFamily: isFocused ? 'Outfit_600SemiBold' : 'Outfit_400Regular',
                                    },
                                ]}
                            >
                                {label}
                            </Text>
                        </Animated.View>

                        {/* Ripple Effect */}
                        {isFocused && (
                            <Animatable.View
                                animation="zoomIn"
                                duration={300}
                                style={styles.ripple}
                            />
                        )}
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
        height: 70,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 20,
        paddingBottom: 5,
        position: 'relative',
    },
    activeIndicator: {
        position: 'absolute',
        top: 0,
        height: 3,
        backgroundColor: '#FF4A1C',
        borderRadius: 2,
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        position: 'relative',
        marginBottom: 4,
    },
    tabLabel: {
        fontSize: 11,
        marginTop: 2,
    },
    badge: {
        position: 'absolute',
        top: -2,
        right: -6,
        backgroundColor: '#FF4A1C',
        borderRadius: 6,
        width: 12,
        height: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#fff',
    },
    badgeDot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#fff',
    },
    ripple: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 74, 28, 0.1)',
    },
});
