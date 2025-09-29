import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';

export default function HighScoreRoute() {
  const router = useRouter();
  const score = useGameStore((s) => s.score);
  const reset = useGameStore((s) => s.reset);

  const onRestart = () => {
    reset();
    router.replace('/game');
  };

  const onMenu = () => {
    reset();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.subTitle}>Your Score</Text>
      <Text style={styles.score}>{score}</Text>

      <View style={styles.buttons}>
        <Pressable onPress={onRestart} style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}>
          <Text style={styles.btnText}>Restart</Text>
        </Pressable>
        <Pressable onPress={onMenu} style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}>
          <Text style={styles.btnText}>Menu</Text>
        </Pressable>
      </View>

      <Text style={styles.hint}>Best score persistence coming later.</Text>
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
  },
  title: {
    color: '#e6edf3',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 8,
  },
  subTitle: {
    color: '#8b949e',
    fontSize: 14,
    marginBottom: 4,
  },
  score: {
    color: '#58a6ff',
    fontSize: 48,
    fontWeight: '900',
    marginBottom: 24,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    backgroundColor: '#116329',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
  hint: {
    color: '#8b949e',
    marginTop: 16,
  },
});
