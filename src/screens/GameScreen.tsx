import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export type GridPos = { row: number; col: number };

interface GameScreenProps {
  onTilePress?: (pos: GridPos) => void;
  selected?: GridPos | null;
}

const SIZE = 3;

export const GameScreen: React.FC<GameScreenProps> = ({ onTilePress, selected }) => {
  const [internalSelected, setInternalSelected] = useState<GridPos | null>(null);

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
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
      <Text style={styles.help}>Tap a card to select it.</Text>
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
