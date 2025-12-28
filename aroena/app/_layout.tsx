import { useEffect } from 'react';
import { setCustomText } from 'react-native-global-props';
import { Stack, useRouter, usePathname } from 'expo-router';
import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Text, View } from 'react-native';
import { Satisfy_400Regular } from '@expo-google-fonts/satisfy';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
    Satisfy_400Regular,
  });

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (fontsLoaded) {
      setCustomText({
        style: { fontFamily: 'Outfit_400Regular' },
      });
    }
  }, [fontsLoaded]);

  useEffect(() => {
    if (!fontsLoaded) return;

    const checkAuth = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const isHome = pathname === '/';

        if (!userData && !isHome) {
          router.replace('/');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };

    checkAuth();
  }, [pathname, fontsLoaded]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontSize: 24, fontFamily: 'Outfit_500Medium' }}>Loading ...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="details" options={{ title: 'Home' }} />
    </Stack>
  );
}
