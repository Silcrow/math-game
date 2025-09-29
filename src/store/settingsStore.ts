import { create } from 'zustand';

interface SettingsState {
  enableSfx: boolean;
  enableHaptics: boolean;
  setEnableSfx: (v: boolean) => void;
  setEnableHaptics: (v: boolean) => void;
  toggleSfx: () => void;
  toggleHaptics: () => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  enableSfx: true,
  enableHaptics: true,
  setEnableSfx: (v) => set({ enableSfx: v }),
  setEnableHaptics: (v) => set({ enableHaptics: v }),
  toggleSfx: () => set((s) => ({ enableSfx: !s.enableSfx })),
  toggleHaptics: () => set((s) => ({ enableHaptics: !s.enableHaptics })),
}));
