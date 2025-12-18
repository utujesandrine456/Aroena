import { useEffect } from 'react';
import { setCustomText } from 'react-native-global-props';
import { Stack } from 'expo-router';
import { useFonts, Outfit_400Regular, Outfit_500Medium, Outfit_700Bold } from '@expo-google-fonts/outfit';
import { Text, View } from 'react-native';
import {Satisfy_400Regular } from '@expo-google-fonts/satisfy';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_700Bold,
    Satisfy_400Regular,
  });

  useEffect(() => {
    if (fontsLoaded) {
      setCustomText({
        style: { fontFamily: 'Outfit_400Regular' },
      });
    }
  }, [fontsLoaded]);

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
