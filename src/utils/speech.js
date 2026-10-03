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

/**
 * Text-to-Speech (TTS) Engine using Browser SpeechSynthesis
 */
export function speakText(text, langCode = 'en-US', onStart, onEnd) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this environment.');
    return null;
  }

  // Stop any currently playing audio
  window.speechSynthesis.cancel();

  // Strip markdown formatting for cleaner audio reading
  const cleanText = text
    .replace(/[#*_`$~\[\]\(\)]/g, '')
    .replace(/\\mathcal\{[^\}]+\}/g, 'Mathematical Formulation')
    .replace(/\\mathbb\{[^\}]+\}/g, '')
    .replace(/\$\$[\s\S]*?\$\$/g, 'Mathematical equation verified.')
    .trim();

  // Smart Indic & Telugu detection
  const isTeluguContent = /[\u0C00-\u0C7F]|(mawa|mowa|cheppu|ela unnav|enti|bhayya|manam|thaggipoye)/i.test(text);
  const effectiveLang = isTeluguContent ? 'te-IN' : langCode;

  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = effectiveLang;
  utterance.rate = isTeluguContent ? 0.95 : 1.0;
  utterance.pitch = 1.05;

  // Try to pick a matching voice (preferring Indic/Telugu voice if available)
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
    console.error('Speech synthesis error:', e);
    if (onEnd) onEnd();
  };

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
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
