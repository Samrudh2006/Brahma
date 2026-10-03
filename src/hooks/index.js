/**
 * BRAHMA — Custom React Hooks
 * All reusable stateful logic lives here.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { API_BASE } from '../api/client';

// ─── useTypewriter ────────────────────────────────────────────────────────────
/**
 * Cycles through an array of phrases with a typewriter effect.
 * @param {string[]} phrases - Array of text strings to cycle
 * @param {number} typeSpeed  - MS per character while typing (default 55)
 * @param {number} deleteSpeed - MS per character while deleting (default 30)
 * @param {number} pauseMs    - MS to hold completed text before deleting (default 2200)
 */
export function useTypewriter(phrases = [], typeSpeed = 55, deleteSpeed = 30, pauseMs = 2200) {
  const [displayText, setDisplayText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!phrases.length) return;
    const current = phrases[phraseIndex % phrases.length];

    const tick = () => {
      if (!isDeleting) {
        if (displayText.length < current.length) {
          setDisplayText(current.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), pauseMs);
          return;
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(current.slice(0, displayText.length - 1));
        } else {
          setIsDeleting(false);
          setPhraseIndex((i) => i + 1);
          return;
        }
      }
    };

    const timer = setTimeout(tick, isDeleting ? deleteSpeed : typeSpeed);
    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex, phrases, typeSpeed, deleteSpeed, pauseMs]);

  return displayText;
}

// ─── useStreamText ────────────────────────────────────────────────────────────
/**
 * Simulates streaming text by revealing words progressively.
 * Used when backend is offline — creates a "streaming feel" from a full string.
 * @param {string} fullText  - Complete text to stream
 * @param {number} delay     - MS between words (default 40)
 */
export function useStreamText(fullText = '', delay = 40) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    if (!fullText) return;
    const words = fullText.split(' ');
    let index = 0;
    const timer = setInterval(() => {
      if (index < words.length) {
        setDisplayed((prev) => (prev ? prev + ' ' + words[index] : words[index]));
        index++;
      } else {
        clearInterval(timer);
      }
    }, delay);
    return () => clearInterval(timer);
  }, [fullText, delay]);

  return displayed;
}

// ─── useLocalStorage ─────────────────────────────────────────────────────────
/**
 * useState but persisted to localStorage.
 */
export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        localStorage.setItem(key, JSON.stringify(valueToStore));
      } catch {
        // silent
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
}

// ─── useKeyPress ──────────────────────────────────────────────────────────────
/**
 * Calls handler when a key combination is pressed.
 * @param {string} key   - e.g. 'k', 'Escape', 'Enter'
 * @param {Function} fn  - handler
 * @param {boolean} ctrl - require Ctrl/Cmd held down
 */
export function useKeyPress(key, fn, ctrl = false) {
  useEffect(() => {
    const handler = (e) => {
      const modOk = ctrl ? e.ctrlKey || e.metaKey : true;
      if (e.key === key && modOk) {
        e.preventDefault();
        fn();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, fn, ctrl]);
}

// ─── useAutoScroll ────────────────────────────────────────────────────────────
/**
 * Returns a ref to attach to a scroll container.
 * Auto-scrolls to bottom whenever deps change (e.g., new messages).
 */
export function useAutoScroll(deps = []) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTo({ top: ref.current.scrollHeight, behavior: 'smooth' });
    }
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
  return ref;
}

// ─── useClickOutside ─────────────────────────────────────────────────────────
/**
 * Calls handler when user clicks outside the ref element.
 */
export function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (e) => {
      if (!ref.current || ref.current.contains(e.target)) return;
      handler(e);
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
}

// ─── useVoiceInput ────────────────────────────────────────────────────────────
/**
 * Handles Web Speech API with graceful fallback.
 * @param {Function} onResult - called with final transcript
 */
export function useVoiceInput(onResult) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const start = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported — using simulation');
      setIsListening(true);
      setTimeout(() => {
        onResult('Tell me about the current identity and its capabilities');
        setIsListening(false);
      }, 2500);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.onresult = (e) => onResult(e.results[0][0].transcript);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [onResult]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const toggle = useCallback(() => {
    isListening ? stop() : start();
  }, [isListening, start, stop]);

  return { isListening, toggle, start, stop };
}

// ─── useBackendHealth ─────────────────────────────────────────────────────────
/**
 * Polls the backend health endpoint every 30s.
 * Returns { backendOnline, ollamaOnline }.
 */
export function useBackendHealth() {
  const [status, setStatus] = useState({ backendOnline: false, ollamaOnline: false });

  useEffect(() => {
    const check = async () => {
      try {
        const healthUrl = `${API_BASE}/health`;
        const res = await fetch(healthUrl, { signal: AbortSignal.timeout(3000) });
        if (res.ok) {
          const contentType = res.headers.get('content-type') || '';
          if (contentType.includes('application/json')) {
            const data = await res.json();
            setStatus({ backendOnline: true, ollamaOnline: data.ollamaOnline || false });
            return;
          }
        }
        setStatus({ backendOnline: false, ollamaOnline: false });
      } catch {
        setStatus({ backendOnline: false, ollamaOnline: false });
      }
    };

    check(); // immediate
    const interval = setInterval(check, 30_000);
    return () => clearInterval(interval);
  }, []);

  return status;
}
