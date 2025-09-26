import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import React from 'react';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0b3d2e' },
          headerTintColor: '#e6edf3',
          contentStyle: { backgroundColor: '#0b3d2e' },
        }}
      >
        <Stack.Screen name="index" options={{ title: 'Menu' }} />
        <Stack.Screen name="game" options={{ title: 'Game' }} />
        <Stack.Screen name="settings" options={{ title: 'Settings' }} />
      </Stack>
    </SafeAreaProvider>
  );
}
