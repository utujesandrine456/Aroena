import { Link, Stack } from 'expo-router';
import { StyleSheet, TouchableOpacity, Animated, PanResponder } from 'react-native';
import { Text, View } from 'react-native';
import { useRef, useEffect, useState } from 'react';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';

export default function NotFoundScreen() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  
  const [tapCount, setTapCount] = useState(0);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        Animated.spring(slideAnim, {
          toValue: gestureState.dx * 0.1,
          useNativeDriver: true,
          friction: 8,
        }).start();
      },
      onPanResponderRelease: () => {
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
        }).start();
      },
    })
  ).current;


  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handle404Press = () => {
    setTapCount(prev => prev + 1);
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1.05,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ 
        title: 'Page Not Found',
        headerTitleStyle: {
          fontFamily: 'Poppins_600SemiBold',
          color: '#fff',
        },
        headerStyle: {
          backgroundColor: '#000',
        },
        headerTintColor: '#fff',
      }} />
      
      <View style={styles.container}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handle404Press}
            {...panResponder.panHandlers}
          >
            <Animated.Text 
              style={[
                styles.errorNumber, 
                { 
                  transform: [
                    { scale: pulseAnim },
                    { translateX: slideAnim }
                  ] 
                }
              ]}
            >
              404
            </Animated.Text>
          </TouchableOpacity>
          
          {tapCount > 0 && (
            <Animated.Text 
              style={[
                styles.tapMessage,
                { opacity: fadeAnim }
              ]}
            >
              Tapped {tapCount} time{tapCount !== 1 ? 's' : ''}
            </Animated.Text>
          )}
          
          <Text style={styles.title}>Lost in the void</Text>
          
          <Text style={styles.description}>
            This page drifted away into digital nothingness.
          </Text>
          
          <TouchableOpacity 
            activeOpacity={0.7}
            onPress={() => {
              Animated.sequence([
                Animated.timing(fadeAnim, {
                  toValue: 0.5,
                  duration: 200,
                  useNativeDriver: true,
                }),
                Animated.timing(fadeAnim, {
                  toValue: 1,
                  duration: 200,
                  useNativeDriver: true,
                }),
              ]).start();
            }}
          >
            <Animated.View 
              style={[
                styles.divider,
                { 
                  transform: [{ scaleX: pulseAnim }],
                  backgroundColor: isButtonHovered ? '#fff' : 'rgba(255, 255, 255, 0.3)'
                }
              ]} 
            />
          </TouchableOpacity>
          
          <Link href="/" asChild>
            <TouchableOpacity 
              style={[
                styles.button,
                isButtonHovered && styles.buttonHovered
              ]}
              activeOpacity={0.9}
              onPressIn={() => setIsButtonHovered(true)}
              onPressOut={() => setIsButtonHovered(false)}
            >
              <Animated.Text 
                style={[
                  styles.buttonText,
                  { 
                    color: isButtonHovered ? '#000' : '#fff',
                    transform: [{ scale: isButtonHovered ? 1.05 : 1 }]
                  }
                ]}
              >
                {isButtonHovered ? 'Take me home' : 'Return to safety'}
              </Animated.Text>
            </TouchableOpacity>
          </Link>
          

          {tapCount >= 5 && (
            <Animated.Text 
              style={[
                styles.secretMessage,
                { opacity: pulseAnim }
              ]}
            >
              You're persistent. I like that.
            </Animated.Text>
          )}
        </Animated.View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000',
  },
  content: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  loadingText: {
    fontFamily: 'Poppins_400Regular',
    color: '#fff',
    fontSize: 16,
  },
  errorNumber: {
    fontSize: 120,
    fontFamily: 'Poppins_700Bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(255, 255, 255, 0.2)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  tapMessage: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 5,
    fontStyle: 'italic',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins_600SemiBold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    maxWidth: 300,
  },
  divider: {
    height: 2,
    width: 180,
    marginVertical: 30,
    borderRadius: 1,
  },
  button: {
    backgroundColor: 'transparent',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#fff',
    marginTop: 10,
  },
  buttonHovered: {
    backgroundColor: '#fff',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    letterSpacing: 0.5,
  },
  secretMessage: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 20,
    fontStyle: 'italic',
  },
});