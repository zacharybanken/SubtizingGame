import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';

import { useRouter } from 'expo-router';

export default function LaunchScreen() {
  const router = useRouter();

  const handlePress = () => {
    router.push('./(tabs)');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subtizing Game</Text>
      <TouchableOpacity style={styles.button} onPress={handlePress}>
        <Text>Play</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25292e',
  },
  title: {
    fontSize: 24,
    color: '#ffd33d',
    marginBottom: 20,
},
button: {
  backgroundColor: '#ffd33d',
  paddingVertical: 10,
  paddingHorizontal: 20,
  borderRadius: 5,
},
buttonText: {
  color: '#25292e',
  fontSize: 18,
},
});