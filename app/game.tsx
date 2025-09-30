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
      {/* Top bar HUD */}
      <View style={styles.hud}>
        <Text style={styles.hudText}>HP: {health}</Text>
        <Text style={styles.hudText}>Score: {score}</Text>
      </View>
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
  },
  hud: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  hudText: {
    color: '#58a6ff',
    fontSize: 14,
    fontWeight: '700',
  },
  deadNote: {
    color: '#e6edf3',
    marginTop: 8,
    opacity: 0.8,
  },
});
