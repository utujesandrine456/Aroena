import { Link, Stack } from 'expo-router';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
      <View style={styles.container}>
        <Animatable.View
          animation="bounceIn"
          duration={1500}
          style={styles.iconContainer}
        >
          <Ionicons name="alert-circle" size={100} color="#FF4A1C" />
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          delay={500}
          style={styles.textContainer}
        >
          <Text style={styles.title}>Lost in the Hotel?</Text>
          <Text style={styles.description}>
            The page you are looking for seems to have checked out early or never existed.
          </Text>
        </Animatable.View>

        <Animatable.View
          animation="fadeInUp"
          delay={800}
          style={styles.buttonContainer}
        >
          <Link href="/bookchoice" asChild>
            <TouchableOpacity style={styles.button} activeOpacity={0.8}>
              <Ionicons name="home" size={20} color="#fff" />
              <Text style={styles.buttonText}>Back to Services</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/active-orders" asChild>
            <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.8}>
              <Text style={styles.secondaryButtonText}>View My Orders</Text>
            </TouchableOpacity>
          </Link>
        </Animatable.View>

        <Animatable.Text
          animation="fadeIn"
          delay={1200}
          style={styles.errorCode}
        >
          Error 404
        </Animatable.Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#fff',
  },
  iconContainer: {
    marginBottom: 20,
    shadowColor: '#FF4A1C',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Outfit_700Bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Outfit_400Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  button: {
    backgroundColor: '#FF4A1C',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 15,
    gap: 10,
    shadowColor: '#FF4A1C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Outfit_600SemiBold',
  },
  secondaryButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FF4A1C',
    fontSize: 16,
    fontFamily: 'Outfit_500Medium',
  },
  errorCode: {
    position: 'absolute',
    bottom: 40,
    fontSize: 14,
    color: '#ddd',
    fontFamily: 'Outfit_400Regular',
    letterSpacing: 2,
  },
});