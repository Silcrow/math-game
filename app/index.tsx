import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function MenuScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Math Game</Text>
      <Text style={styles.subtitle}>Choose an option</Text>

      <Link href="/game" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Start Game</Text>
        </Pressable>
      </Link>

      <Link href="/settings" asChild>
        <Pressable style={[styles.button, styles.secondary]}>
          <Text style={styles.buttonText}>Settings</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b3d2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  title: {
    color: '#e6edf3',
    fontSize: 32,
    fontWeight: '800',
  },
  subtitle: {
    color: '#c9d1d9',
    marginBottom: 16,
  },
  button: {
    width: 220,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#1f6feb',
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: '#2d6a4f',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});
