import { useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

/**
 * useGameTick - runs a 1-second tick while the game is running.
 * - Decreases health by 1
 */
export function useGameTick() {
  const isRunning = useGameStore((s) => s.isRunning);
  const decreaseHealth = useGameStore((s) => s.decreaseHealth);

  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      decreaseHealth(1);
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, decreaseHealth]);
}
