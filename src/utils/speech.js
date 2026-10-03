/**
 * BRAHMA Polyglot Voice Synthesis (TTS) and Speech Recognition (STT) Engine
 * Supports Multi-Lingual Speech Recognition & Neural Voice Output
 */

export const SUPPORTED_LANGUAGES = [
  { code: 'te-IN', name: 'Telugu (తెలుగు)', flag: '🇮🇳', nativeName: 'తెలుగు' },
  { code: 'en-US', name: 'English (United States)', flag: '🇺🇸', nativeName: 'English (US)' },
  { code: 'en-IN', name: 'English (India)', flag: '🇮🇳', nativeName: 'English (India)' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)', flag: '🇮🇳', nativeName: 'हिन्दी' },
  { code: 'ta-IN', name: 'Tamil (தமிழ்)', flag: '🇮🇳', nativeName: 'தமிழ்' },
  { code: 'kn-IN', name: 'Kannada (ಕನ್ನಡ)', flag: '🇮🇳', nativeName: 'ಕನ್ನಡ' },
  { code: 'es-ES', name: 'Spanish (Español)', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'fr-FR', name: 'French (Français)', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'de-DE', name: 'German (Deutsch)', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'ja-JP', name: 'Japanese (日本語)', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'zh-CN', name: 'Chinese (Mandarin)', flag: '🇨🇳', nativeName: '中文' }
];

let currentAudio = null;

/**
 * Text-to-Speech (TTS) Engine with Neural Indic & Vedic Sanskrit Acoustics
 */
export function speakText(text, langCode = 'en-US', onStart, onEnd) {
  if (typeof window === 'undefined') return null;

  // Stop any currently playing audio or speech
  stopSpeaking();

  // Strip markdown formatting for crystal clear reading
  const cleanText = text
    .replace(/[#*_`$~\[\]\(\)]/g, '')
    .replace(/\\mathcal\{[^\}]+\}/g, 'Mathematical Formulation')
    .replace(/\\mathbb\{[^\}]+\}/g, '')
    .replace(/\$\$[\s\S]*?\$\$/g, 'Mathematical equation verified.')
    .replace(/https?:\/\/\S+/g, 'link reference')
    .trim();

  // Smart Indic, Telugu & Sanskrit detection
  const isTeluguContent = /[\u0C00-\u0C7F]|(mawa|mowa|cheppu|ela unnav|enti|bhayya|manam|thaggipoye|kirrak|kirak|gammatt|chudabba)/i.test(text);
  const isSanskrit = /[\u0900-\u097F]|(oṁ|om |namo|namah|shloka|śloka|mantra|brahman|rigveda|saraswati|yantra)/i.test(text);

  const effectiveLang = isTeluguContent ? 'te-IN' : (isSanskrit ? 'hi-IN' : langCode);

  // If text is short (< 140 chars) and is Telugu, try high-fidelity native neural streaming voice
  if (isTeluguContent && cleanText.length < 140 && typeof Audio !== 'undefined') {
    try {
      const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=te&client=tw-ob&q=${encodeURIComponent(cleanText)}`;
      const audio = new Audio(audioUrl);
      currentAudio = audio;

      audio.onplay = () => { if (onStart) onStart(); };
      audio.onended = () => { currentAudio = null; if (onEnd) onEnd(); };
      audio.onerror = () => {
        // Fallback to speech synthesis on network error
        fallbackToSpeechSynthesis();
      };

      audio.play().catch(() => {
        fallbackToSpeechSynthesis();
      });
      return audio;
    } catch (_) {
      // Fallback
    }
  }

  function fallbackToSpeechSynthesis() {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = effectiveLang;
    utterance.rate = isTeluguContent ? 0.94 : (isSanskrit ? 0.88 : 1.0);
    utterance.pitch = isSanskrit ? 0.92 : 1.04;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === effectiveLang || v.lang.startsWith(effectiveLang.split('-')[0])) ||
                         voices.find(v => v.lang === 'en-IN') ||
                         voices[0];
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    utterance.onerror = (e) => {
      console.warn('Speech synthesis note:', e);
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  }

  fallbackToSpeechSynthesis();
  return null;
}

export function stopSpeaking() {
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch (_) {}
    currentAudio = null;
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

/**
 * Speech-to-Text (STT) Engine using Web Speech API
 */
export function createSpeechRecognizer(langCode = 'en-US', onResult, onError, onEnd) {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.warn('Web Speech API is not supported in this browser.');
    return null;
  }

  const recognizer = new SpeechRecognition();
  recognizer.continuous = false;
  recognizer.interimResults = true;
  recognizer.lang = langCode;

  recognizer.onresult = (event) => {
    let interim = '';
    let final = '';
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }
    if (onResult) {
      onResult({ final, interim, text: final || interim });
    }
  };

  recognizer.onerror = (event) => {
    console.warn('Speech recognition error:', event.error);
    if (onError) onError(event.error);
  };

  recognizer.onend = () => {
    if (onEnd) onEnd();
  };

  return recognizer;
}
