import React, { useEffect, useLayoutEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Share } from 'react-native';
import { useRouter, useNavigation } from 'expo-router';
import { useGameStore } from '../src/store/gameStore';
import { useSettingsStore } from '../src/store/settingsStore';

export default function HighScoreRoute() {
  const router = useRouter();
  const score = useGameStore((s) => s.score);
  const reset = useGameStore((s) => s.reset);
  const [best, setBest] = useState<number | null>(null);
  const [newBest, setNewBest] = useState(false);
  const nav = useNavigation();

  // Mute SFX/Haptics while on the High Score screen
  const enableSfx = useSettingsStore((s) => s.enableSfx);
  const enableHaptics = useSettingsStore((s) => s.enableHaptics);
  const setEnableSfx = useSettingsStore((s) => s.setEnableSfx);
  const setEnableHaptics = useSettingsStore((s) => s.setEnableHaptics);

  useEffect(() => {
    const prevSfx = enableSfx;
    const prevHaptics = enableHaptics;
    setEnableSfx(false);
    setEnableHaptics(false);
    return () => {
      setEnableSfx(prevSfx);
      setEnableHaptics(prevHaptics);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Dynamic import so the app still runs if the package isn't installed yet
        const mod: any = await import('@react-native-async-storage/async-storage');
        const raw = await mod.default.getItem('bestScore');
        const prev = raw ? parseInt(raw, 10) : 0;
        if (!mounted) return;
        if (score > prev) {
          setBest(score);
          setNewBest(true);
          await mod.default.setItem('bestScore', String(score));
        } else {
          setBest(prev);
        }
      } catch {
        // Fallback: no storage available
        setBest(null);
      }
    })();
    return () => { mounted = false; };
  }, [score]);

  const onRestart = () => {
    reset();
    router.replace('/game');
  };

  const onMenu = () => {
    reset();
    router.replace('/');
  };

  const onShare = async () => {
    try {
      await Share.share({
        message: `I scored ${score} in Math Game! Can you beat me?`,
      });
    } catch {}
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.subTitle}>Your Score</Text>
      <Text style={styles.score}>{score}</Text>
      {newBest && <Text style={styles.badge}>New Best!</Text>}
      {best !== null && !newBest && (
        <Text style={styles.best}>Best: {best}</Text>
      )}

      <View style={styles.buttons}>
        <Pressable onPress={onRestart} style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}>
          <Text style={styles.btnText}>Restart</Text>
        </Pressable>
        <Pressable onPress={onMenu} style={({ pressed }) => [styles.btn, pressed && styles.btnPressed]}>
          <Text style={styles.btnText}>Menu</Text>
        </Pressable>
        <Pressable onPress={onShare} style={({ pressed }) => [styles.btnAlt, pressed && styles.btnPressed]}>
          <Text style={styles.btnText}>Share</Text>
        </Pressable>
      </View>

      <Text style={styles.hint}>Tip: try to chain moves to out-heal the timer.</Text>
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
    marginBottom: 8,
  },
  badge: {
    color: '#ffd700',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 4,
  },
  best: {
    color: '#8b949e',
    marginBottom: 16,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  btn: {
    backgroundColor: '#116329',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  btnAlt: {
    backgroundColor: '#1f6feb',
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
