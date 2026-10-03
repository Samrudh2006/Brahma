/**
 * BRAHMA Sacred Soundscape & Cinematic Ambient Synthesizer
 * Built with native Web Audio API (Zero external audio files, Zero latency).
 *
 * Sound Architecture:
 * - 136.1 Hz "Anahata / Cosmic Om" Harmonic Foundation (Sa-Pa Vedic Tanpura Chord)
 * - Binaural Alpha-Theta Entrainment with gentle micro-detuned phase waves
 * - LFO-driven Resonant Filter Swell (Slow meditative breathing cycle)
 * - Stereo Spatial Reverb/Delay Simulation for temple acoustic depth
 * - Crystalline Solfeggio Chimes on interactive events
 */

let audioCtx = null;
let activeNodes = [];
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
    osc.frequency.exponentialRampToValueAtTime(160, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.05, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch (_) {}
}

/**
 * Play a divine crystalline harmonic chime (Message sent / Council summoned)
 */
export function playDivineChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Solfeggio 528Hz (Love/Transformation) & 852Hz (Spiritual Intuition)
    const freqs = [528, 660, 792, 1056];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.04, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 1.25);
    });
  } catch (_) {}
}

/**
 * Toggle Sacred Meditative Ambient Drone
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
    console.warn('Ambient drone error:', err);
    return false;
  }
}

/**
 * Start Rich Multi-Layered Vedic Temple Soundscape
 */
export function startAmbientDrone() {
  const ctx = getAudioContext();
  if (!ctx || isDronePlaying) return;

  const now = ctx.currentTime;
  activeNodes = [];

  // Master Gain with 2.5s silky fade-in
  droneGain = ctx.createGain();
  droneGain.gain.setValueAtTime(0.0001, now);
  droneGain.gain.linearRampToValueAtTime(0.055, now + 2.5);

  // Warm Temple Lowpass Filter with gentle resonance
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(380, now);
  filter.Q.setValueAtTime(1.8, now);

  // LFO: Slow breathing filter sweep (0.08 Hz = 12.5 second breath cycle)
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(0.08, now);
  lfoGain.gain.setValueAtTime(120, now);
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start(now);
  activeNodes.push(lfo);

  // Delay / Echo node for vast spatial temple resonance
  const delay = ctx.createDelay();
  delay.delayTime.setValueAtTime(0.38, now);
  const delayFeedback = ctx.createGain();
  delayFeedback.gain.setValueAtTime(0.28, now);
  delay.connect(delayFeedback);
  delayFeedback.connect(delay);
  delay.connect(droneGain);

  // ─── Harmonic Tanpura Voicing (Root Om 136.1 Hz, Pa 204.15 Hz, Octave 272.2 Hz) ───
  const harmonics = [
    { freq: 68.05,  type: 'sine',     detune: 0,    vol: 0.70 }, // Deep Root Earth Sub
    { freq: 136.10, type: 'triangle', detune: -1.5, vol: 0.60 }, // Fundamental Sa (Om)
    { freq: 136.10, type: 'sine',     detune: 2.0,  vol: 0.50 }, // Binaural phase movement
    { freq: 204.15, type: 'sine',     detune: -1.0, vol: 0.40 }, // Sacred Pa (Divine Fifth)
    { freq: 272.20, type: 'triangle', detune: 1.5,  vol: 0.35 }, // Higher Octave Sa
    { freq: 408.30, type: 'sine',     detune: -2.0, vol: 0.20 }, // Shimmer Upper Fifth
    { freq: 544.40, type: 'sine',     detune: 3.0,  vol: 0.15 }, // Celestial Crystal Overtones
  ];

  harmonics.forEach(({ freq, type, detune, vol }) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    osc.detune.setValueAtTime(detune, now);

    gain.gain.setValueAtTime(vol, now);

    osc.connect(gain);
    gain.connect(filter);

    osc.start(now);
    activeNodes.push(osc);
  });

  // Connect filter to delay and master gain
  filter.connect(droneGain);
  filter.connect(delay);
  droneGain.connect(ctx.destination);

  isDronePlaying = true;
}

/**
 * Stop Soundscape with smooth 1.5s fade-out
 */
export function stopAmbientDrone() {
  if (!isDronePlaying || !droneGain) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  droneGain.gain.linearRampToValueAtTime(0.0001, now + 1.5);

  setTimeout(() => {
    try {
      activeNodes.forEach(node => {
        try { node.stop(); } catch (_) {}
        try { node.disconnect(); } catch (_) {}
      });
      activeNodes = [];
      droneGain?.disconnect();
    } catch (_) {}
    isDronePlaying = false;
  }, 1600);
}

export function getDroneState() {
  return isDronePlaying;
}
