/**
 * BRAHMA — Sovereign Luxury Ambient Soundscape Engine (Web Audio API)
 * Zero external audio files, Zero latency, 100% Procedural Generative Soundscapes.
 *
 * Tailored Theme Soundscapes:
 * 1. Obsidian / Cosmic Gold: 432 Hz Deep Velvety Cosmic Warmth (Brian Eno / Interstellar style)
 * 2. Mayūra Teal: 528 Hz Solfeggio Harmonic Water & Peacock Breeze
 * 3. Cyberpunk Kashi: Warm Analog Vangelis / Blade Runner Neon Synth Pad
 * 4. Sūrya Solar: Sacred Vedic Tanpura & Radiant Morning Solar Resonance (136.1 Hz Om)
 * 5. Himālaya Zen: Pure Tibetan Singing Bowl & Mountain Breath Resonance (396 Hz)
 */

let audioCtx = null;
let activeNodes = [];
let masterGain = null;
let currentTheme = 'obsidian';
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
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
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
    const freqs = [528, 660, 792, 1056];

    freqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.05);

      gain.gain.setValueAtTime(0.035, now + idx * 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 1.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.05);
      osc.stop(now + idx * 0.05 + 1.45);
    });
  } catch (_) {}
}

/**
 * Toggle Ambient Soundscape with Theme Awareness
 */
export function toggleAmbientDrone(callback, theme = 'obsidian') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (isDronePlaying) {
      stopAmbientDrone();
      if (callback) callback(false);
      return false;
    } else {
      startAmbientDrone(theme);
      if (callback) callback(true);
      return true;
    }
  } catch (err) {
    console.warn('Ambient sound error:', err);
    return false;
  }
}

/**
 * Start Silky, Soothing Ambient Soundscape
 */
export function startAmbientDrone(theme = 'obsidian') {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (isDronePlaying) {
    stopAmbientDrone();
  }

  currentTheme = theme;
  const now = ctx.currentTime;
  activeNodes = [];

  // Master Gain with 3.0s silky soft fade-in
  masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(0.0001, now);
  masterGain.gain.linearRampToValueAtTime(0.038, now + 3.0); // Gentle, soothing volume

  // Warm Spatial Convolver / Reverb & Filter
  const mainFilter = ctx.createBiquadFilter();
  mainFilter.type = 'lowpass';

  // LFO for slow meditative breathing swell
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(0.065, now); // ~15 second breathing cycle

  // Spatial Stereo Delay / Echo for cathedral acoustic depth
  const delay = ctx.createDelay();
  delay.delayTime.setValueAtTime(0.42, now);
  const delayFeedback = ctx.createGain();
  delayFeedback.gain.setValueAtTime(0.32, now);
  delay.connect(delayFeedback);
  delayFeedback.connect(delay);
  delay.connect(masterGain);

  activeNodes.push(lfo, delay, delayFeedback);

  // ─── Theme-Specific Procedural Harmonic Voicings ───
  switch (theme) {
    case 'teal': {
      // 528 Hz Solfeggio Healing Water & Emerald Breeze
      mainFilter.frequency.setValueAtTime(480, now);
      mainFilter.Q.setValueAtTime(1.4, now);
      lfoGain.gain.setValueAtTime(140, now);

      const tealPitches = [
        { freq: 132.0, type: 'sine', detune: 0, vol: 0.6 },
        { freq: 264.0, type: 'triangle', detune: -2.0, vol: 0.4 },
        { freq: 528.0, type: 'sine', detune: 1.5, vol: 0.5 },  // Miracle 528Hz
        { freq: 660.0, type: 'sine', detune: -1.0, vol: 0.25 },
        { freq: 792.0, type: 'sine', detune: 3.0, vol: 0.15 }
      ];
      spawnHarmonics(ctx, tealPitches, mainFilter);
      break;
    }

    case 'cyberpunk': {
      // Warm Analog Vangelis / Blade Runner Neon Synth Pad
      mainFilter.frequency.setValueAtTime(320, now);
      mainFilter.Q.setValueAtTime(2.2, now);
      lfoGain.gain.setValueAtTime(180, now);

      const cyberPitches = [
        { freq: 55.0,  type: 'triangle', detune: 0, vol: 0.75 }, // Warm 55Hz Sub
        { freq: 110.0, type: 'sawtooth', detune: -3.0, vol: 0.35 },
        { freq: 164.8, type: 'triangle', detune: 2.0, vol: 0.45 },
        { freq: 220.0, type: 'sine',     detune: -1.5, vol: 0.40 },
        { freq: 329.6, type: 'sine',     detune: 2.5, vol: 0.20 }
      ];
      spawnHarmonics(ctx, cyberPitches, mainFilter);
      break;
    }

    case 'surya': {
      // 136.1 Hz Sacred Cosmic Om & Radiant Solar Tanpura
      mainFilter.frequency.setValueAtTime(360, now);
      mainFilter.Q.setValueAtTime(1.8, now);
      lfoGain.gain.setValueAtTime(120, now);

      const suryaPitches = [
        { freq: 68.05,  type: 'sine', detune: 0, vol: 0.7 },
        { freq: 136.10, type: 'triangle', detune: -1.5, vol: 0.6 }, // Anahata Om
        { freq: 204.15, type: 'sine', detune: 1.8, vol: 0.45 },     // Sacred Pa
        { freq: 272.20, type: 'triangle', detune: -2.0, vol: 0.35 },
        { freq: 408.30, type: 'sine', detune: 2.5, vol: 0.18 }
      ];
      spawnHarmonics(ctx, suryaPitches, mainFilter);
      break;
    }

    case 'zen': {
      // 396 Hz Pure Tibetan Singing Bowl & Mountain Air
      mainFilter.frequency.setValueAtTime(340, now);
      mainFilter.Q.setValueAtTime(2.8, now); // Pure bell resonance
      lfoGain.gain.setValueAtTime(90, now);

      const zenPitches = [
        { freq: 99.0,  type: 'sine', detune: 0, vol: 0.7 },
        { freq: 198.0, type: 'sine', detune: -1.0, vol: 0.5 },
        { freq: 396.0, type: 'sine', detune: 1.2, vol: 0.55 }, // 396Hz Grounding
        { freq: 594.0, type: 'sine', detune: -2.0, vol: 0.2 },
        { freq: 792.0, type: 'sine', detune: 2.0, vol: 0.12 }
      ];
      spawnHarmonics(ctx, zenPitches, mainFilter);
      break;
    }

    case 'obsidian':
    default: {
      // 432 Hz Deep Velvety Cosmic Gold Pad (Brian Eno Warmth)
      mainFilter.frequency.setValueAtTime(300, now);
      mainFilter.Q.setValueAtTime(1.6, now);
      lfoGain.gain.setValueAtTime(110, now);

      const cosmicPitches = [
        { freq: 54.0,  type: 'sine', detune: 0, vol: 0.75 },
        { freq: 108.0, type: 'sine', detune: -1.2, vol: 0.60 },
        { freq: 216.0, type: 'triangle', detune: 1.5, vol: 0.45 },
        { freq: 432.0, type: 'sine', detune: -0.8, vol: 0.40 }, // Pure 432Hz
        { freq: 648.0, type: 'sine', detune: 2.0, vol: 0.15 }
      ];
      spawnHarmonics(ctx, cosmicPitches, mainFilter);
      break;
    }
  }

  // Connect LFO modulation to Filter
  lfo.connect(lfoGain);
  lfoGain.connect(mainFilter.frequency);
  lfo.start(now);

  mainFilter.connect(masterGain);
  mainFilter.connect(delay);
  masterGain.connect(ctx.destination);

  isDronePlaying = true;
}

/**
 * Spawn individual harmonic oscillator voices with gentle panning
 */
function spawnHarmonics(ctx, pitches, destination) {
  const now = ctx.currentTime;

  pitches.forEach((p, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = p.type || 'sine';
    osc.frequency.setValueAtTime(p.freq, now);
    if (p.detune) osc.detune.setValueAtTime(p.detune, now);

    gain.gain.setValueAtTime(p.vol * 0.18, now);

    // Subtle stereo panner if supported
    if (ctx.createStereoPanner) {
      const panner = ctx.createStereoPanner();
      const panVal = (idx % 2 === 0 ? -1 : 1) * 0.35 * (idx / pitches.length);
      panner.pan.setValueAtTime(panVal, now);
      osc.connect(gain);
      gain.connect(panner);
      panner.connect(destination);
      activeNodes.push(panner);
    } else {
      osc.connect(gain);
      gain.connect(destination);
    }

    osc.start(now);
    activeNodes.push(osc, gain);
  });
}

/**
 * Stop Ambient Soundscape with 1.2s smooth decay
 */
export function stopAmbientDrone() {
  if (!isDronePlaying || !audioCtx) return;

  try {
    const now = audioCtx.currentTime;
    if (masterGain) {
      masterGain.gain.linearRampToValueAtTime(0.0001, now + 1.2);
    }

    setTimeout(() => {
      activeNodes.forEach(node => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (_) {}
      });
      activeNodes = [];
      isDronePlaying = false;
    }, 1250);
  } catch (_) {
    isDronePlaying = false;
  }
}

/**
 * Live Crossfade when User Changes Theme
 */
export function updateAmbientTheme(newTheme) {
  if (isDronePlaying && currentTheme !== newTheme) {
    startAmbientDrone(newTheme);
  }
}

export function getDroneState() {
  return isDronePlaying;
}
