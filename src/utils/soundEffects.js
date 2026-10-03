/**
 * BRAHMA Soundscape & Sacred Acoustic Frequency Synthesizer
 * Built entirely with native Web Audio API (Zero external audio files, Zero latency).
 * Features:
 * - 432 Hz "AUM / Pranava" Harmonic Meditative Drone with Binaural Beat (432Hz + 434Hz)
 * - Divine Crystal Chime on Message Send / Response
 * - Subtle Micro-Haptic Click on UI interactions
 */

let audioCtx = null;
let droneOsc1 = null;
let droneOsc2 = null;
let droneSub = null;
let droneGain = null;
let isDronePlaying = false;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Play a delicate, luxury tactile click
 */
export function playTactileClick() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (_) {
    // Ignore audio autoplay restrictions
  }
}

/**
 * Play a divine crystalline harmonic chime (Message sent / Council summoned)
 */
export function playDivineChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const freqs = [528, 660, 792]; // Solfeggio 528Hz Transformation chord

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.05, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.04 + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.85);
    });
  } catch (_) {
    // Ignore
  }
}

/**
 * Toggle Sacred 432 Hz Drone (Continuous meditative acoustic grounding)
 */
export function toggleAmbientDrone(callback) {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (isDronePlaying) {
      stopAmbientDrone();
      if (callback) callback(false);
      return false;
    } else {
      startAmbientDrone();
      if (callback) callback(true);
      return true;
    }
  } catch (err) {
    console.warn('Drone toggle error:', err);
    return false;
  }
}

export function startAmbientDrone() {
  const ctx = getAudioContext();
  if (!ctx || isDronePlaying) return;

  const now = ctx.currentTime;

  // Master Drone Gain Node with soft fade-in
  droneGain = ctx.createGain();
  droneGain.gain.setValueAtTime(0.0001, now);
  droneGain.gain.linearRampToValueAtTime(0.045, now + 2.0); // Gentle 2s fade-in

  // Lowpass filter for warm temple acoustic resonance
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(450, now);

  // Oscillator 1: 432 Hz (Universal Harmonic Resonance)
  droneOsc1 = ctx.createOscillator();
  droneOsc1.type = 'sine';
  droneOsc1.frequency.setValueAtTime(216, now); // Sub-octave 216 Hz

  // Oscillator 2: 432 Hz root
  droneOsc2 = ctx.createOscillator();
  droneOsc2.type = 'sine';
  droneOsc2.frequency.setValueAtTime(432, now);

  // Oscillator 3: Sub-bass 108 Hz (Sacred 108)
  droneSub = ctx.createOscillator();
  droneSub.type = 'sine';
  droneSub.frequency.setValueAtTime(108, now);

  // Connect nodes
  droneOsc1.connect(filter);
  droneOsc2.connect(filter);
  droneSub.connect(filter);
  filter.connect(droneGain);
  droneGain.connect(ctx.destination);

  droneOsc1.start();
  droneOsc2.start();
  droneSub.start();

  isDronePlaying = true;
}

export function stopAmbientDrone() {
  if (!isDronePlaying || !droneGain) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  droneGain.gain.linearRampToValueAtTime(0.0001, now + 1.2); // 1.2s smooth fade-out

  setTimeout(() => {
    try {
      droneOsc1?.stop();
      droneOsc2?.stop();
      droneSub?.stop();
      droneOsc1?.disconnect();
      droneOsc2?.disconnect();
      droneSub?.disconnect();
    } catch (_) {}
    isDronePlaying = false;
  }, 1300);
}

export function getDroneState() {
  return isDronePlaying;
}
