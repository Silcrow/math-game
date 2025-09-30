import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Share, ScrollView } from 'react-native';
import { captureRef } from 'react-native-view-shot';
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
  type ScoreEntry = { score: number; ts: number };
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [rank, setRank] = useState<number | null>(null);
  const [totalRuns, setTotalRuns] = useState<number>(0);
  const viewRef = useRef<View>(null);
  const [currentTs] = useState<number>(() => Date.now());

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
        // Best score
        const rawBest = await mod.default.getItem('bestScore');
        const prevBest = rawBest ? parseInt(rawBest, 10) : 0;
        if (!mounted) return;
        if (score > prevBest) {
          setBest(score);
          setNewBest(true);
          await mod.default.setItem('bestScore', String(score));
        } else {
          setBest(prevBest);
        }

        // Scoreboard list + rank (with timestamps, latest ranks higher on tie)
        const rawList = await mod.default.getItem('scores');
        const parsed: any = rawList ? JSON.parse(rawList) : [];
        let list: ScoreEntry[] = [];
        if (Array.isArray(parsed)) {
          if (parsed.length && typeof parsed[0] === 'number') {
            // Backward-compat: old numeric entries
            list = (parsed as number[]).map((n) => ({ score: n, ts: 0 }));
          } else {
            list = parsed.filter((e: any) => e && typeof e.score === 'number').map((e: any) => ({ score: e.score, ts: typeof e.ts === 'number' ? e.ts : 0 }));
          }
        }
        const current: ScoreEntry = { score, ts: currentTs };
        list.push(current);
        list.sort((a, b) => (b.score - a.score) || (b.ts - a.ts));
        const idx = list.findIndex((e) => e.score === current.score && e.ts === current.ts);
        setRank(idx >= 0 ? idx + 1 : null);
        setTotalRuns(list.length);
        // Save back (keep last 100 entries to avoid unbounded growth)
        const capped = list.slice(0, 100);
        await mod.default.setItem('scores', JSON.stringify(capped));
        setScores(capped.slice(0, 10)); // show top 10
      } catch {
        // Fallback: no storage available
        setBest(null);
        setScores([] as ScoreEntry[]);
        setRank(null);
        setTotalRuns(0);
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
      let uri: string | undefined;
      // Capture screenshot
      if (viewRef.current) {
        try {
          uri = await captureRef(viewRef, {
            format: 'png',
            quality: 0.8,
          });
        } catch (e) {
          console.warn('Screenshot capture failed', e);
        }
      }
      // Share with screenshot if available
      const shareMessage = `🧙✨ Math Game Score ✨🧙\n\n🎯 Score: ${score}\n${rank ? `🏆 Rank: ${rank}/${totalRuns}\n` : ''}${newBest ? '⭐ NEW BEST! ⭐\n' : ''}\nCan you beat me? 🔥\n\n📱 Play Math Game`;
      await Share.share(
        {
          message: shareMessage,
          url: uri,
        },
        {
          dialogTitle: 'Share your score',
        }
      );
    } catch {}
  };

  return (
    <View style={styles.container} ref={viewRef} collapsable={false}>
      <Text style={styles.title}>Game Over</Text>
      <Text style={styles.subTitle}>Your Score</Text>
      <Text style={styles.score}>{score}</Text>
      {newBest && <Text style={styles.badge}>New Best!</Text>}
      {best !== null && !newBest && (
        <Text style={styles.best}>Best: {best}</Text>
      )}
      {rank !== null && (
        <Text style={styles.rank}>Your Rank: {rank}{totalRuns ? ` / ${totalRuns}` : ''}</Text>
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

      {!!scores.length && (
        <View style={styles.board}>
          <Text style={styles.boardTitle}>Top Scores</Text>
          <ScrollView style={{ maxHeight: 200 }}>
            {scores.map((e, i) => (
              <View key={`${e.score}-${e.ts}-${i}`} style={[styles.item, rank === i + 1 && styles.itemHighlight]}>
                <Text style={styles.itemPos}>{i + 1}.</Text>
                <Text style={styles.itemScore}>{e.score}</Text>
                {rank === i + 1 && <Text style={styles.itemYou}>← you</Text>}
              </View>
            ))}
          </ScrollView>
        </View>
      )}

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
  rank: {
    color: '#e6edf3',
    marginBottom: 12,
    fontWeight: '700',
  },
  board: {
    width: '100%',
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
  },
  boardTitle: {
    color: '#e6edf3',
    fontWeight: '800',
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  itemHighlight: {
    backgroundColor: 'rgba(88,166,255,0.12)',
  },
  itemPos: {
    width: 28,
    color: '#8b949e',
  },
  itemScore: {
    color: '#e6edf3',
    fontWeight: '700',
  },
  itemYou: {
    color: '#ffd700',
    marginLeft: 8,
    fontWeight: '800',
  },
});
