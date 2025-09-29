import { Audio } from 'expo-av';

let moveSound: Audio.Sound | null = null;
let snapSound: Audio.Sound | null = null;
let loading: Promise<void> | null = null;

async function ensureLoaded() {
  if (loading) return loading;
  loading = (async () => {
    try {
      // Allow playback in iOS silent mode and set sane defaults
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      // Local bundled assets
      const moveModule = require('../../assets/sfx/move.wav');
      const snapModule = require('../../assets/sfx/snap.wav');

      const move = await Audio.Sound.createAsync(moveModule, { volume: 0.7 }, undefined, false);
      const snap = await Audio.Sound.createAsync(snapModule, { volume: 0.8 }, undefined, false);
      moveSound = move.sound;
      snapSound = snap.sound;
    } catch {}
  })();
  return loading;
}

export async function playMove() {
  try {
    await ensureLoaded();
    if (moveSound) {
      try { await moveSound.stopAsync(); } catch {}
      try { await moveSound.setPositionAsync(0); } catch {}
      await moveSound.playAsync();
    } // else: not loaded yet
  } catch {}
}

export async function playSnap() {
  try {
    await ensureLoaded();
    if (snapSound) {
      try { await snapSound.stopAsync(); } catch {}
      try { await snapSound.setPositionAsync(0); } catch {}
      await snapSound.playAsync();
    } // else: not loaded yet
  } catch {}
}

export async function unloadSfx() {
  try {
    await moveSound?.unloadAsync();
    await snapSound?.unloadAsync();
  } catch {}
  moveSound = null;
  snapSound = null;
  loading = null;
}
