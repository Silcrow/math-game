import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { GameScreen } from '../src/screens/GameScreen';
import { useGameStore } from '../src/store/gameStore';
import { useGameTick } from '../src/hooks/useGameTick';

export default function GameRoute() {
  // Subscribe to store slices
  const health = useGameStore((s) => s.health);
  const score = useGameStore((s) => s.score);
  const reset = useGameStore((s) => s.reset);
  const router = useRouter();

  // Start ticking
  useGameTick();

  // When health hits 0, navigate to High Score screen
  useEffect(() => {
    if (health === 0) {
      // slight delay to allow last UI update
      const t = setTimeout(() => router.replace('/highscore'), 150);
      return () => clearTimeout(t);
    }
  }, [health]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Game</Text>
      <Text style={styles.hud}>Health: {health} | Score: {score}</Text>
      <GameScreen
        onTilePress={(pos) => {
          console.log('Tile pressed', pos);
        }}
      />
      {health === 0 && (
        <Text style={styles.deadNote}>You died. Showing High Score…</Text>
      )}
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
  deadNote: {
    color: '#e6edf3',
    marginTop: 8,
    opacity: 0.8,
  },
});
