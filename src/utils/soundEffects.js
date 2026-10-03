let audioCtx = null;
let bgMusicAudio = null;
let isMusicPlaying = false;
let currentTheme = 'obsidian';

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
 * Toggle Brahma Cinematic Soundtrack Music with smooth fade
 */
export function toggleAmbientDrone(callback, theme = 'obsidian') {
  try {
    if (isMusicPlaying) {
      stopAmbientDrone();
      if (callback) callback(false);
      return false;
    } else {
      startAmbientDrone(theme);
      if (callback) callback(true);
      return true;
    }
  } catch (err) {
    console.warn('Brahma soundtrack error:', err);
    return false;
  }
}

/**
 * Start Authentic Brahma Cinematic Soundtrack Audio
 */
export function startAmbientDrone(theme = 'obsidian') {
  if (typeof window === 'undefined') return;

  try {
    if (!bgMusicAudio) {
      bgMusicAudio = new Audio('/assets/splash_video.mp4');
      bgMusicAudio.loop = true;
      bgMusicAudio.preload = 'auto';
    }

    bgMusicAudio.currentTime = bgMusicAudio.currentTime || 0;
    bgMusicAudio.volume = 0.35;

    const playPromise = bgMusicAudio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isMusicPlaying = true;
        })
        .catch((err) => {
          console.warn('Playback notice:', err.message);
        });
    }
    isMusicPlaying = true;
  } catch (err) {
    console.warn('Error starting soundtrack:', err);
  }
}

/**
 * Stop Authentic Brahma Soundtrack with smooth fade-out
 */
export function stopAmbientDrone() {
  if (!bgMusicAudio) {
    isMusicPlaying = false;
    return;
  }

  try {
    let currentVol = bgMusicAudio.volume;
    const fadeInterval = setInterval(() => {
      currentVol = Math.max(0, currentVol - 0.05);
      if (bgMusicAudio) bgMusicAudio.volume = currentVol;
      if (currentVol <= 0) {
        clearInterval(fadeInterval);
        if (bgMusicAudio) {
          bgMusicAudio.pause();
        }
        isMusicPlaying = false;
      }
    }, 40);
  } catch (_) {
    if (bgMusicAudio) bgMusicAudio.pause();
    isMusicPlaying = false;
  }
}

/**
 * Live theme update
 */
export function updateAmbientTheme(newTheme) {
  currentTheme = newTheme;
}

export function getDroneState() {
  return isMusicPlaying;
}

