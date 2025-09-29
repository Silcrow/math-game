import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Vibration } from 'react-native';
import { playMove, playSnap } from '../sfx/sounds';
import { useSettingsStore } from '../store/settingsStore';
import { useGameStore } from '../store/gameStore';

export type GridPos = { row: number; col: number };

interface GameScreenProps {
  onTilePress?: (pos: GridPos) => void;
  selected?: GridPos | null;
}

// Layout & visual constants for the mahjong-like card appearance
const SIZE = 3;
const CARD_WIDTH_PERCENT = '30%';
const CARD_ASPECT_RATIO = 0.7; // taller than wide
const TABLE_BG = '#0b3d2e';
const TILE_FACE = '#fff9ee';
const TILE_EDGE = '#e6dfd4';
const TILE_BORDER = 'rgba(0,0,0,0.15)';
const GLYPH_RED = '#c0392b';
const GLYPH_GREEN = '#2e7d32';
const GOLD_EDGE = '#f4d03f';

export const GameScreen: React.FC<GameScreenProps> = ({ onTilePress, selected }) => {
  const [internalSelected, setInternalSelected] = useState<GridPos | null>(null);
  // Player starts in the middle card (row 1, col 1)
  const [playerPos, setPlayerPos] = useState<GridPos>({ row: 1, col: 1 });
  const [answerText, setAnswerText] = useState('');
  type Problem = { text: string; answer: number };
  const [problems, setProblems] = useState<Record<string, Problem | null>>({}); // null when occupied (player)
  const scale = useRef(new Animated.Value(1)).current;
  const translate = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const shake = useRef(new Animated.Value(0)).current; // -1..1
  const wrapperLayout = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const tileLayouts = useRef<Record<string, { x: number; y: number; width: number; height: number }>>({});
  const rowLayouts = useRef<Record<number, { x: number; y: number }>>({});
  const measuredKeys = useRef<Set<string>>(new Set());
  const [measured, setMeasured] = useState(0);

  const markerSize = 28;

  // Settings (SFX/Haptics)
  const enableSfx = useSettingsStore((s) => s.enableSfx);
  const enableHaptics = useSettingsStore((s) => s.enableHaptics);
  const setEnableSfx = useSettingsStore((s) => s.setEnableSfx);
  const setEnableHaptics = useSettingsStore((s) => s.setEnableHaptics);
  const increaseHealth = useGameStore((s) => s.increaseHealth);
  const isRunning = useGameStore((s) => s.isRunning);

  const keyFor = (r: number, c: number) => `${r}-${c}`;

  const moveMarkerTo = (r: number, c: number) => {
    const layout = tileLayouts.current[keyFor(r, c)];
    if (!layout) return; // not laid out yet
    // Center of the tile within wrapper
    const targetX = layout.x + layout.width / 2 - markerSize / 2;
    const targetY = layout.y + layout.height / 2 - markerSize / 2;
    Animated.spring(translate, {
      toValue: { x: targetX, y: targetY },
      useNativeDriver: true,
      friction: 12,
      tension: 180,
    }).start();
  };

  const invalidTapFeedback = () => {
    // brief vibrate (if supported)
    if (enableHaptics) {
      try { Vibration.vibrate(20); } catch {}
    }
    // shake animation sequence
    Animated.sequence([
      Animated.timing(shake, { toValue: -1, duration: 30, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 30, useNativeDriver: true }),
    ]).start();
  };

  // Initialize marker once all 9 tiles have measured
  useEffect(() => {
    if (measured >= 9) {
      moveMarkerTo(playerPos.row, playerPos.col);
    }
  }, [playerPos.row, playerPos.col, measured]);

  const isSelected = (r: number, c: number) => {
    const sel = selected ?? internalSelected;
    return sel?.row === r && sel?.col === c;
  };

  const tiles = useMemo(() => Array.from({ length: SIZE * SIZE }), []);

  // Build as 3 rows x 3 columns for consistent spacing between cards
  const rows = useMemo(() => [0, 1, 2], []);

  // Problem generation helpers
  const allTileKeys = useMemo(() =>
    Array.from({ length: SIZE * SIZE }, (_, i) => keyFor(Math.floor(i / SIZE), i % SIZE)),
  []);

  const generateProblem = (used: Set<number>): Problem => {
    // simple add/sub within 1..9 ensuring positive answers
    for (let tries = 0; tries < 100; tries++) {
      const a = Math.floor(Math.random() * 9) + 1;
      const b = Math.floor(Math.random() * 9) + 1;
      const useAdd = Math.random() < 0.5;
      const ans = useAdd ? a + b : a - b;
      if (ans <= 0) continue;
      if (used.has(ans)) continue;
      return { text: `${a} ${useAdd ? '+' : '-'} ${b}`, answer: ans };
    }
    // fallback unique pick
    let n = 1;
    while (used.has(n)) n++;
    return { text: `${n} + 0`, answer: n };
  };

  const regenerateBoardProblems = (pos: GridPos, prevPos?: GridPos) => {
    setProblems((prev) => {
      const next: Record<string, Problem | null> = { ...prev };
      const used = new Set<number>();
      // Collect existing answers excluding player tile and prev tile we'll regen
      for (const k of allTileKeys) {
        const [r, c] = k.split('-').map(Number);
        if ((r === pos.row && c === pos.col)) {
          next[k] = null; // occupied by player
          continue;
        }
        if (prevPos && r === prevPos.row && c === prevPos.col) continue; // will regenerate
        const p = next[k];
        if (p) used.add(p.answer);
      }
      // Ensure all non-player tiles have a unique problem
      for (const k of allTileKeys) {
        const [r, c] = k.split('-').map(Number);
        if (r === pos.row && c === pos.col) {
          next[k] = null;
          continue;
        }
        if (!next[k] || (prevPos && r === prevPos.row && c === prevPos.col)) {
          const prob = generateProblem(used);
          next[k] = prob;
          used.add(prob.answer);
        }
      }
      return next;
    });
  };

  // Initialize problems when ready
  useEffect(() => {
    if (measured >= 9) {
      regenerateBoardProblems(playerPos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measured]);

  // Typing to move: parse number and move to matching tile (rook one step)
  useEffect(() => {
    if (!answerText) return;
    if (!/^-?\d+$/.test(answerText)) return;
    if (!isRunning) return;
    const val = parseInt(answerText, 10);
    // Find adjacent tiles with this answer (rook one step)
    let target: GridPos | null = null;
    const { row: pr, col: pc } = playerPos;
    const adjacent = [
      { row: pr - 1, col: pc },
      { row: pr + 1, col: pc },
      { row: pr, col: pc - 1 },
      { row: pr, col: pc + 1 },
    ];
    for (const adj of adjacent) {
      if (adj.row < 0 || adj.row >= SIZE || adj.col < 0 || adj.col >= SIZE) continue;
      const p = problems[keyFor(adj.row, adj.col)];
      if (p && p.answer === val) {
        target = adj;
        break;
      }
    }
    if (!target) {
      // Invalid answer or not adjacent
      invalidTapFeedback();
      setAnswerText('');
      return;
    }

    // Move now
    const from = playerPos;
    const { row: r, col: c } = target;
    setAnswerText('');
    if (enableSfx) playMove();
    setPlayerPos(target);
    increaseHealth(1);
    const layout = tileLayouts.current[keyFor(r, c)];
    if (layout) {
      const targetX = layout.x + layout.width / 2 - markerSize / 2;
      const targetY = layout.y + layout.height / 2 - markerSize / 2;
      Animated.spring(translate, {
        toValue: { x: targetX, y: targetY },
        useNativeDriver: true,
        friction: 12,
        tension: 180,
      }).start(() => {
        if (enableSfx) playSnap();
      });
    } else {
      moveMarkerTo(r, c);
    }
    // Update problems: destination cleared (handled in regen), left tile gets a new one
    regenerateBoardProblems(target, from);
    // optional external callback
    onTilePress?.(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answerText]);

  return (
    <View
      style={styles.wrapper}
      onLayout={(e) => {
        const { x, y, width, height } = e.nativeEvent.layout;
        wrapperLayout.current = { x, y, width, height };
      }}
    >
      {rows.map((r) => (
        <View
          key={`row-${r}`}
          style={styles.row}
          onLayout={(e) => {
            const { x, y } = e.nativeEvent.layout;
            rowLayouts.current[r] = { x, y };
          }}
        >
          {rows.map((c) => {
            const selectedTile = isSelected(r, c);
            const idx = r * SIZE + c;
            const prob = problems[keyFor(r, c)];
            return (
              <Pressable
                key={`${r}-${c}`}
                disabled
                style={({ pressed }) => [
                  styles.card,
                  selectedTile && styles.cardSelected,
                  pressed && styles.cardPressed,
                ]}
              onLayout={(e) => {
                const { x, y, width, height } = e.nativeEvent.layout;
                const row = rowLayouts.current[r] || { x: 0, y: 0 };
                // Convert tile local coords (within row) to wrapper-relative coords
                const absX = row.x + x;
                const absY = row.y + y;
                tileLayouts.current[keyFor(r, c)] = { x: absX, y: absY, width, height };
                const k = keyFor(r, c);
                if (!measuredKeys.current.has(k)) {
                  measuredKeys.current.add(k);
                  setMeasured((m) => m + 1);
                }
              }}
              >
                <View style={styles.cardFace}>
                  {prob ? (
                    <>
                      <Text style={styles.problem}>{prob.text}</Text>
                      <Text style={styles.answerHint}>= ?</Text>
                    </>
                  ) : (
                    <Text style={styles.occupied}>You are here</Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
      {/* Floating player marker overlay */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.playerMarker,
          {
            transform: [
              { translateX: translate.x },
              { translateY: translate.y },
              { scale },
              { translateX: shake.interpolate({ inputRange: [-1, 1], outputRange: [-6, 6] }) },
            ],
          },
        ]}
      >
        <Text style={styles.playerText}>P</Text>
      </Animated.View>

      <Text style={[styles.help, !isRunning && { opacity: 0.6 }]}>
        {measured < 9 ? 'Preparing board…' : 'Move the player like a rook by one tile (up/down/left/right).'}
      </Text>
      {!isRunning && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
      )}

      {/* Number pad at the bottom */}
      <View style={styles.numPad}>
        <View style={styles.numDisplay}>
          <Text style={styles.numDisplayText}>{answerText || '–'}</Text>
          <Pressable onPress={() => setAnswerText('')} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕</Text>
          </Pressable>
        </View>
        <View style={styles.numGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((n) => (
            <Pressable
              key={n}
              onPress={() => setAnswerText((prev) => prev + String(n))}
              style={({ pressed }) => [styles.numBtn, pressed && styles.numBtnPressed]}
              disabled={!isRunning}
            >
              <Text style={styles.numBtnText}>{n}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
;

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 420,
    paddingHorizontal: 16,
    paddingVertical: 8,
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  card: {
    width: '30%', // three per row with spacing
    aspectRatio: 0.7, // taller than wide, like a mahjong tile
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    position: 'relative',
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    // Android elevation
    elevation: 3,
  },
  cardFace: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff9ee', // ivory tile face
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    // subtle inner border to mimic tile edge
    borderWidth: 1,
    borderColor: '#e6dfd4',
  },
  cardSelected: {
    borderColor: '#f4d03f', // gold edging when selected
    borderWidth: 2,
    shadowOpacity: 0.3,
    elevation: 5,
  },
  cardPressed: {
    opacity: 0.95,
    transform: [{ scale: 0.98 }],
  },
  tileGlyph: {
    color: '#c0392b', // top red glyph
    fontSize: 28,
    fontWeight: '800',
  },
  cardBottomGlyph: {
    color: '#2e7d32', // bottom green glyph
    fontSize: 24,
    fontWeight: '800',
  },
  playerMarker: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e63946',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.15)'
  },
  playerText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 14,
  },
  cardSubtitle: {
    color: '#6e7781',
    marginTop: 4,
    fontSize: 12,
  },
  help: {
    color: '#8b949e',
    marginTop: 6,
    textAlign: 'center',
  },
  problem: {
    color: '#0b3d2e',
    backgroundColor: '#fff',
    fontSize: 18,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 6,
  },
  answerHint: {
    color: '#6e7781',
    marginTop: 6,
    fontWeight: '700',
  },
  occupied: {
    color: '#58a6ff',
    fontWeight: '800',
  },
  numPad: {
    marginTop: 12,
    width: '100%',
  },
  numDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
  },
  numDisplayText: {
    color: '#e6edf3',
    fontSize: 20,
    fontWeight: '700',
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearBtnText: {
    color: '#e63946',
    fontSize: 18,
    fontWeight: '800',
  },
  numGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  numBtn: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: '#116329',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  numBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  numBtnText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
});
