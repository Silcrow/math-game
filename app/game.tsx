import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { GameScreen } from '../src/screens/GameScreen';
import { useGameStore } from '../src/store/gameStore';
import { useGameTick } from '../src/hooks/useGameTick';

export default function GameRoute() {
  // Subscribe to store slices
  const health = useGameStore((s) => s.health);
  const score = useGameStore((s) => s.score);
  const reset = useGameStore((s) => s.reset);

  // Start ticking
  useGameTick();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Game</Text>
      <Text style={styles.hud}>Health: {health} | Score: {score}</Text>
      <GameScreen
        onTilePress={(pos) => {
          console.log('Tile pressed', pos);
          if (health === 0) reset(); // simple demo: reset on tap after death
        }}
      />
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
  hud: {
    color: '#58a6ff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
});
