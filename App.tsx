import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { GameScreen, type GridPos } from './src/screens/GameScreen';

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Math Game</Text>
        <Text style={styles.version}>v0.0.1</Text>
      </View>

      <View style={styles.hud}>
        <Text style={styles.hudText}>Health: 100</Text>
        <Text style={styles.hudText}>Score: 0</Text>
      </View>

      <GameScreen
        onTilePress={(pos: GridPos) => {
          // Placeholder: later will move player / solve problem
          console.log('Tile pressed', pos);
        }}
      />

      <Text style={[styles.subtitle, { marginTop: 16 }]}>Tap tiles to select (placeholder interaction).</Text>

      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b3d2e', // felt green table
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#e6edf3',
    fontSize: 28,
    fontWeight: '700',
  },
  version: {
    color: '#8b949e',
    marginTop: 4,
  },
  hud: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  hudText: {
    color: '#58a6ff',
    fontSize: 18,
    fontWeight: '600',
  },
  subtitle: {
    color: '#c9d1d9',
    textAlign: 'center',
  },
});
