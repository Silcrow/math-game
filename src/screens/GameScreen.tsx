import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

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

  const isSelected = (r: number, c: number) => {
    const sel = selected ?? internalSelected;
    return sel?.row === r && sel?.col === c;
  };

  const tiles = useMemo(() => Array.from({ length: SIZE * SIZE }), []);

  // Build as 3 rows x 3 columns for consistent spacing between cards
  const rows = useMemo(() => [0, 1, 2], []);

  return (
    <View style={styles.wrapper}>
      {rows.map((r) => (
        <View key={`row-${r}`} style={styles.row}>
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
                  if (isVertAdjacent || isHorzAdjacent) {
                    setPlayerPos(pos);
                  }
                  onTilePress?.(pos);
                }}
                style={({ pressed }) => [
                  styles.card,
                  selectedTile && styles.cardSelected,
                  pressed && styles.cardPressed,
                ]}
              >
                <View style={styles.cardFace}>
                  <Text style={styles.tileGlyph}>{glyph}</Text>
                  <Text style={styles.cardBottomGlyph}>{glyph}</Text>
                  {playerPos.row === r && playerPos.col === c && (
                    <View style={styles.playerMarker}>
                      <Text style={styles.playerText}>P</Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
      <Text style={styles.help}>Move the player like a rook by one tile (up/down/left/right).</Text>
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
    top: '40%',
    left: '50%',
    transform: [{ translateX: -14 }, { translateY: -14 }],
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
