import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameScreen } from '../src/screens/GameScreen';

export default function GameRoute() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Game</Text>
      <GameScreen onTilePress={(pos) => console.log('Tile pressed', pos)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b3d2e',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    color: '#e6edf3',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
});
