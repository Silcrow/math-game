# Running the Math Game (Development)

This guide helps you get to a visible, runnable game screen quickly. The project now uses **Expo (React Native)** as the primary stack. Legacy web (Vite) notes are preserved below.

## Expo Quick Start (Current)

### Prerequisites
- Node.js 20.19.4+ recommended (Expo/React Native toolchain requires >=20.19.4)
- iOS: Xcode (simulator) or iPhone with Expo Go
- Android: Android Studio (emulator) or Android device with Expo Go

### 1) Install dependencies
```bash
npm install
```

### 2) Start Expo dev server
```bash
npm run start
# or
npm run ios     # open iOS Simulator
npm run android # open Android Emulator
npm run web     # optional: web preview
```

### 3) Test on your phone with Expo Go
- Install Expo Go from App Store / Google Play.
- After `npm run start`, a terminal or browser tab (Expo CLI) shows a QR code.
- Scan the QR code with your phone’s camera (iOS) or Expo Go (Android).
- The app should open showing:
  - Title: "Math Game v0.0.1"
  - HUD text: "Health: 100" and "Score: 0"

Troubleshooting (Expo/phone):
- Ensure phone and computer are on the same Wi‑Fi.
- If QR connect fails, press `s` in the Expo CLI to switch connection mode (LAN/Tunnel/Local). "Tunnel" is most reliable on restricted networks.
- On iOS Simulator: open via `npm run ios`.
- On Android Emulator: ensure an emulator is running or a device is connected (USB, with debugging enabled) and run `npm run android`.

---

## Prerequisites
- Node.js v18+
- npm (comes with Node) or yarn
- Git (optional but recommended)

---

## Legacy: Vite (Web) Instructions (previous stack)

These remain for reference if you ever want a web preview build. The current app is an Expo (React Native) project.

## 1) Bootstrap the Project
If you have not yet initialized the project with Vite + React + TypeScript:

```bash
# In the project root
/Users/sangsan/CascadeProjects/math-game

# Initialize a React + TypeScript project with Vite
npm create vite@latest . -- --template react-ts

# Install base dependencies
npm install

# Install game dependencies
npm install phaser zustand dexie
# Note: Phaser ships its own TypeScript types. Do NOT install @types/phaser.

# (Optional) UI and tooling suggested by docs
npm install tailwindcss styled-components @headlessui/react
npm install -D @types/styled-components autoprefixer postcss
npm install -D eslint prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-react eslint-plugin-react-hooks
```

## 2) Add a Minimal Phaser Game Shell
Create a placeholder Game Canvas and Scene so the app renders a canvas and simple HUD text.

- Create file: `src/game/config.ts`
```ts
import Phaser from 'phaser';

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0d1117',
  parent: 'game-container',
  scene: [], // we will inject scenes from code
};
```

- Create file: `src/game/scenes/GameScene.ts`
```ts
import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // Placeholder HUD text
    this.add.text(16, 16, 'Math Game\nHealth: 100 | Score: 0', {
      color: '#ffffff',
      fontFamily: 'monospace',
      fontSize: '18px',
    });
  }
}
```

- Update `src/App.tsx` to mount Phaser into a React component:
```tsx
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { phaserConfig } from './game/config';
import { GameScene } from './game/scenes/GameScene';

function App() {
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) {
      const config = { ...phaserConfig, scene: [GameScene] };
      gameRef.current = new Phaser.Game(config);
    }

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: 8, color: '#c9d1d9' }}>
        <strong>Math Game</strong> <span style={{ opacity: 0.7 }}>v0.0.1</span>
      </header>
      <div id="game-container" style={{ flex: 1 }} />
    </div>
  );
}

export default App;
```

- Ensure `src/main.tsx` renders the `App` component (Vite template already does this):
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 3) Run the Dev Server
```bash
npm run dev
```

- Open the printed local URL (usually http://localhost:5173).
- You should see a canvas with a dark background and the placeholder HUD text:
  - "Math Game"
  - "Health: 100 | Score: 0"

### Test on your phone (same Wi‑Fi)

If you want to view the game on your phone while developing:

1. Expose the dev server on your network
   - Option A (one-off):
     ```bash
     npm run dev -- --host
     ```
   - Option B (easier next time): add a script in `package.json` and run it
     ```json
     {
       "scripts": {
         "dev:host": "vite --host"
       }
     }
     ```
     Then start with:
     ```bash
     npm run dev:host
     ```

2. Find your computer's local IP address
   - macOS:
     ```bash
     ipconfig getifaddr en0   # Wi‑Fi usually en0; try en1 if needed
     ```
   - Or check System Settings → Network → Wi‑Fi → Details → IP Address

3. On your phone (same Wi‑Fi), open the URL:
   - `http://<your-mac-ip>:5173/`
   - Example: `http://192.168.1.23:5173/`

4. You should see the same placeholder canvas and HUD text.

Troubleshooting (phone testing):
- If it doesn't load, confirm your phone is on the same network (not cellular/guest network).
- macOS firewall may block incoming connections. Allow Node/Vite:
  - System Settings → Network → Firewall → Options → Allow incoming connections for your terminal/node.
- Some routers block peer-to-peer on guest networks. Switch to main Wi‑Fi.
- If networking is restricted, use a tunnel service like `ngrok` or `cloudflared`:
  ```bash
  # Example with Cloudflare Tunnel (free, no signup needed for quick tunnel)
  npx cloudflared tunnel --url http://localhost:5173
  # or ngrok (requires account)
  npx ngrok http 5173
  ```

## 4) Expected Acceptance Criteria
- `npm run dev` starts without errors.
- A Phaser canvas is visible with a solid background color.
- Placeholder HUD text is visible over the canvas.

## Troubleshooting
- If you see a blank page:
  - Check the browser console for errors.
  - Ensure `#game-container` exists in `App.tsx` and `Phaser.Game` is created once.
- If TypeScript complains about Phaser types:
  - Make sure `@types/phaser` is installed as a dev dependency.
- If the canvas does not resize:
  - Adjust `width`/`height` in `phaserConfig` or implement a resize handler later.

Once this is working, move to `docs/ROADMAP.md` step `1.1 Basic Game Engine Setup`.
