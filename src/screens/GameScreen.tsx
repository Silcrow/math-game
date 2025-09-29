import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet, Animated, Vibration } from 'react-native';

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
  const scale = useRef(new Animated.Value(1)).current;
  const translate = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const shake = useRef(new Animated.Value(0)).current; // -1..1
  const wrapperLayout = useRef<{ x: number; y: number; width: number; height: number } | null>(null);
  const tileLayouts = useRef<Record<string, { x: number; y: number; width: number; height: number }>>({});
  const rowLayouts = useRef<Record<number, { x: number; y: number }>>({});
  const measuredKeys = useRef<Set<string>>(new Set());
  const [measured, setMeasured] = useState(0);

  const markerSize = 28;

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
      friction: 4,
      tension: 180,
    }).start();
  };

  const invalidTapFeedback = () => {
    // brief vibrate (if supported)
    try { Vibration.vibrate(20); } catch {}
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
            const glyphs = ['一', '二', '三'];
            const glyph = glyphs[idx % glyphs.length];
            return (
              <Pressable
                key={`${r}-${c}`}
                onPress={() => {
                  const pos = { row: r, col: c } as GridPos;
                  setInternalSelected(pos);
                  // Movement rule: rook-like one unit (horizontal or vertical by exactly one tile)
                  const sameCol = c === playerPos.col;
                  const sameRow = r === playerPos.row;
                  const isVertAdjacent = sameCol && Math.abs(r - playerPos.row) === 1;
                  const isHorzAdjacent = sameRow && Math.abs(c - playerPos.col) === 1;
                  if (measured < 9) {
                    // ignore taps until board is ready
                    return;
                  } else if (isVertAdjacent || isHorzAdjacent) {
                    setPlayerPos(pos);
                    moveMarkerTo(r, c);
                    // Scale pulse
                    Animated.sequence([
                      Animated.timing(scale, { toValue: 0.9, duration: 80, useNativeDriver: true }),
                      Animated.spring(scale, { toValue: 1, friction: 5, useNativeDriver: true }),
                    ]).start();
                  } else {
                    invalidTapFeedback();
                  }
                  onTilePress?.(pos);
                }}
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
                  <Text style={styles.tileGlyph}>{glyph}</Text>
                  <Text style={styles.cardBottomGlyph}>{glyph}</Text>
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

      <Text style={styles.help}>
        {measured < 9 ? 'Preparing board…' : 'Move the player like a rook by one tile (up/down/left/right).'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
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
});
