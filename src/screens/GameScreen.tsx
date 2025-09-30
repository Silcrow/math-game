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
  const wrapperLayout = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const tileLayouts = useRef<Record<string, { x: number; y: number; width: number; height: number }>>({});
  const rowLayouts = useRef<Record<number, { x: number; y: number }>>({});
  const measuredKeys = useRef<Set<string>>(new Set());
  const [measured, setMeasured] = useState(0);

  // Settings (SFX/Haptics)
  const enableSfx = useSettingsStore((s) => s.enableSfx);
  const enableHaptics = useSettingsStore((s) => s.enableHaptics);
  const setEnableSfx = useSettingsStore((s) => s.setEnableSfx);
  const setEnableHaptics = useSettingsStore((s) => s.setEnableHaptics);
  const increaseHealth = useGameStore((s) => s.increaseHealth);
  const isRunning = useGameStore((s) => s.isRunning);

  const keyFor = (r: number, c: number) => `${r}-${c}`;

  const invalidTapFeedback = () => {
    // brief vibrate (if supported)
    if (enableHaptics) {
      try { Vibration.vibrate(20); } catch {}
    }
  };

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

  const handleSubmit = () => {
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
    if (enableSfx) playSnap();
    // Update problems: destination cleared (handled in regen), left tile gets a new one
    regenerateBoardProblems(target, from);
    // optional external callback
    onTilePress?.(target);
  };

  return (
    <View style={styles.wrapper}>
      <View
        style={styles.boardWrapper}
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
                <View style={[styles.cardFace, !prob && styles.playerCard]}>
                  {prob ? (
                    <Text style={styles.problem}>{prob.text}</Text>
                  ) : (
                    <Text style={styles.playerEmoji}>🧙</Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
      {!isRunning && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
      )}
      </View>

      <Text style={[styles.help, !isRunning && { opacity: 0.6 }]}>
        {measured < 9 ? 'Preparing board…' : 'Move the player like a rook by one tile (up/down/left/right).'}
      </Text>

      {/* Number pad at the bottom */}
      <View style={styles.numPad}>
        <View style={styles.numDisplay}>
          <Text style={styles.numDisplayText}>{answerText || '–'}</Text>
          <Pressable onPress={() => setAnswerText('')} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>✕</Text>
          </Pressable>
        </View>
        <View style={styles.numGrid}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <Pressable
              key={n}
              onPress={() => setAnswerText((prev) => prev + String(n))}
              style={({ pressed }) => [styles.numBtn, pressed && styles.numBtnPressed]}
              disabled={!isRunning}
            >
              <Text style={styles.numBtnText}>{n}</Text>
            </Pressable>
          ))}
          <Pressable
            onPress={() => setAnswerText((prev) => prev.slice(0, -1))}
            style={({ pressed }) => [styles.numBtn, styles.backspaceBtn, pressed && styles.numBtnPressed]}
            disabled={!isRunning}
          >
            <Text style={styles.numBtnText}>←</Text>
          </Pressable>
          <Pressable
            onPress={() => setAnswerText((prev) => prev + '0')}
            style={({ pressed }) => [styles.numBtn, pressed && styles.numBtnPressed]}
            disabled={!isRunning}
          >
            <Text style={styles.numBtnText}>0</Text>
          </Pressable>
          <Pressable
            onPress={handleSubmit}
            style={({ pressed }) => [styles.numBtn, styles.enterBtn, pressed && styles.numBtnPressed]}
            disabled={!isRunning}
          >
            <Text style={styles.numBtnText}>↵</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  boardWrapper: {
    width: '100%',
    position: 'relative',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  card: {
    width: '30%', // three per row with spacing
    aspectRatio: 0.8, // slightly less tall
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.15)',
    position: 'relative',
    // iOS shadow
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    // Android elevation
    elevation: 2,
  },
  cardFace: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#fff9ee', // ivory tile face
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
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
  playerCard: {
    backgroundColor: 'rgba(88, 166, 255, 0.15)',
  },
  playerEmoji: {
    fontSize: 32,
  },
  cardSubtitle: {
    color: '#6e7781',
    marginTop: 4,
    fontSize: 12,
  },
  help: {
    color: '#8b949e',
    marginTop: 2,
    marginBottom: 2,
    textAlign: 'center',
    fontSize: 11,
  },
  problem: {
    color: '#0b3d2e',
    backgroundColor: '#fff',
    fontSize: 16,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderRadius: 4,
  },
  answerHint: {
    color: '#6e7781',
    marginTop: 6,
    fontWeight: '700',
  },
  numPad: {
    marginTop: 4,
    width: '100%',
  },
  numDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  numDisplayText: {
    color: '#e6edf3',
    fontSize: 16,
    fontWeight: '700',
  },
  clearBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  clearBtnText: {
    color: '#e63946',
    fontSize: 16,
    fontWeight: '800',
  },
  numGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  numBtn: {
    width: '30%',
    aspectRatio: 1.4,
    backgroundColor: '#116329',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 3,
  },
  backspaceBtn: {
    backgroundColor: '#6e7781',
  },
  enterBtn: {
    backgroundColor: '#1f6feb',
  },
  numBtnPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  numBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
});
