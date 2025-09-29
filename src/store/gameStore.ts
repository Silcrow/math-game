import { create } from 'zustand';

export type GameState = {
  health: number;
  score: number;
  isRunning: boolean;
  // actions
  decreaseHealth: (amount: number) => void;
  increaseHealth: (amount: number) => void;
  increaseScore: (amount: number) => void;
  setRunning: (running: boolean) => void;
  reset: () => void;
};

export const useGameStore = create<GameState>((set, get) => ({
  health: 100,
  score: 0,
  isRunning: true,

  decreaseHealth: (amount: number) => {
    const next = Math.max(0, get().health - amount);
    set({ health: next });
    // Optionally pause when health hits 0
    if (next === 0) set({ isRunning: false });
  },

  increaseHealth: (amount: number) => {
    set({ health: get().health + amount });
  },

  increaseScore: (amount: number) => set({ score: get().score + amount }),

  setRunning: (running: boolean) => set({ isRunning: running }),

  reset: () => set({ health: 100, score: 0, isRunning: true }),
}));
