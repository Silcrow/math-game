# Implementation Summaries per Commit

This document captures a brief summary of what was implemented in each commit for review.

## Commit: chore: bootstrap Expo app (TypeScript) with minimal Math Game HUD; preserve docs/ and update RUNNING.md & ROADMAP.md
Date: 2025-09-22 (local)

### Summary
- Switched the project from web (Vite + React) to native-focused stack using **Expo (React Native)**, while preserving `docs/`.
- Created a minimal app shell showing a basic HUD with title, version, health, and score.
- Updated documentation to reflect the new development workflow using Expo.
- Updated roadmap to reflect the Expo bootstrap step and acceptance criteria.

### Key changes
- Added: `App.tsx` (Expo RN template, customized HUD)
- Added/Updated: `package.json` (Expo scripts), `app.json`
- Docs updated:
  - `docs/RUNNING.md` (Expo quick start, phone testing via Expo Go)
  - `docs/ROADMAP.md` (Phase 1.0 changed to "Bootstrap Expo Runnable Game Shell")

### How to run
- `npm install`
- `npm run start` then open on iOS/Android simulator or scan QR in Expo Go

---

## Commit: feat(router): integrate expo-router with Menu, Game, Settings screens; wire GameScreen into /game
Date: 2025-09-26 (local)

### Summary
- Integrated **expo-router** and reorganized the app into three navigable screens: **Menu**, **Game**, **Settings**.
- Kept the shared felt-green background style and consistent header styling.
- Wired the existing `GameScreen` (3x3 mahjong-style cards with touch) into the `/game` route.

### Key changes
- Routing structure:
  - Added: `app/_layout.tsx` (Stack layout, shared header/content styles)
  - Added: `app/index.tsx` (Menu screen with navigation to Game and Settings)
  - Added: `app/game.tsx` (Game route rendering `GameScreen`)
  - Added: `app/settings.tsx` (Settings placeholder)
- Configuration:
  - Updated: `package.json` → `main: "expo-router/entry"`, dependencies for `expo-router`, `react-native-safe-area-context`, `react-native-screens`
- Game UI:
  - Existing: `src/screens/GameScreen.tsx` (used by `/game`)

### How to run
- `npm install`
- `npm run start`
- From the Menu screen: tap "Start Game" → Game screen; tap "Settings" → Settings screen

---

## Uncommitted changes note (if any)
- The game card visuals were iteratively refined to look like standalone mahjong-style tiles:
  - File: `src/screens/GameScreen.tsx`
  - Changes: ivory card face, rounded corners, inner face panel, red/green glyphs, shadows, selected gold edge
- If you’d like, we can create a dedicated visual-tuning commit to capture those changes explicitly.

---

## Commit: style(cards): restyle 3x3 tiles into standalone mahjong-like cards; extract visual constants
Date: 2025-09-26 (local)

### Summary
- Reworked the visual look of the 3x3 tiles to resemble standalone mahjong-style cards placed on a table.
- Added an inner face panel, ivory palette, rounded corners, subtle edge border, and drop shadows.
- Introduced top/bottom glyphs per tile and a gold-edged selected state.
- Extracted visual constants (sizes, colors) to the top of `GameScreen` for easier future tuning.

### Key changes
- Updated: `src/screens/GameScreen.tsx`
  - New constants: `CARD_WIDTH_PERCENT`, `CARD_ASPECT_RATIO`, `TABLE_BG`, `TILE_FACE`, `TILE_EDGE`, `TILE_BORDER`, `GLYPH_RED`, `GLYPH_GREEN`, `GOLD_EDGE`
  - New styles: `card`, `cardFace`, `cardSelected`, `cardPressed`, `tileGlyph`, `cardBottomGlyph`
  - Layout switched to spaced 3-per-row cards (no enclosing frame).

### How to view
- `npm run start`
- Open Game screen → observe ivory cards with shadows and red/green glyphs; tap to see pressed/selected states.

---

## Commit: feat(store): add Zustand game store (health/score/run) and 1s tick; show live HUD on Game
Date: 2025-09-26 (local)

### Summary
- Installed Zustand and introduced a centralized game store with `health`, `score`, and `isRunning`.
- Added a reusable tick hook that updates health (-1) and score (+1) every second while the game is running.
- Integrated the store into the Game route to display a live HUD and reset behavior when health reaches 0.

### Key changes
- Added: `src/store/gameStore.ts` — Zustand store with actions `decreaseHealth`, `increaseScore`, `setRunning`, `reset`.
- Added: `src/hooks/useGameTick.ts` — 1-second interval tick that mutates store state when `isRunning` is true.
- Updated: `app/game.tsx` — subscribes to store slices, renders `Health: X | Score: Y`, runs `useGameTick()`.

### How to view
- `npm run start`
- Open Game screen; observe health decrease and score increase each second.

---

## Commit: chore(deps): bump expo to ~54.0.10 for compatibility
Date: 2025-09-27 (local)

### Summary
- Updated `expo` to the expected version for this SDK to improve compatibility and reduce startup warnings.

### Key changes
- Updated: `package.json`
  - `expo`: `~54.0.9` → `~54.0.10`

### How to verify
- Run `npm install`
- Start the project: `npm run start`
- Confirm the version mismatch warning is gone from the Expo CLI output.
