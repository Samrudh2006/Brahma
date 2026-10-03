/**
 * BRAHMA — Utility Functions
 * Pure helpers — no side effects, no imports from the app.
 */

// ─── String helpers ───────────────────────────────────────────────────────────

/** Truncate string to max chars, appending ellipsis */
export const truncate = (str, max = 60) =>
  str && str.length > max ? str.slice(0, max).trimEnd() + '…' : str;

/** Convert a prompt to a session title (first 45 chars, cleaned) */
export const promptToTitle = (prompt) =>
  truncate(prompt.replace(/\n/g, ' ').trim(), 45) || 'Untitled Session';

/** Capitalize first letter */
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// ─── Date/time helpers ────────────────────────────────────────────────────────

/** Format timestamp as "2 hours ago", "just now", "Yesterday", etc. */
export function timeAgo(date) {
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 172800) return 'Yesterday';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Format a Date to "Mon, 21 Sep · 9:15 PM" */
export const formatDateTime = (date) =>
  new Date(date).toLocaleString('en-US', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: 'numeric', minute: '2-digit', hour12: true,
  });

// ─── ID generators ────────────────────────────────────────────────────────────

/** Generate a short unique ID (not cryptographically secure — just for UI keys) */
export const uid = () => Math.random().toString(36).slice(2, 10);

// ─── File helpers ─────────────────────────────────────────────────────────────

/** Format file size in human-readable form */
export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
};

/** Trigger a file download from text content */
export function downloadTextFile(content, filename = 'brahma-export.md') {
  const blob = new Blob([content], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Color helpers ────────────────────────────────────────────────────────────

/** Convert hex color to rgba string */
export function hexToRgba(hex, alpha = 1) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return `rgba(212, 175, 55, ${alpha})`;
  return `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})`;
}

// ─── LocalStorage helpers ─────────────────────────────────────────────────────

export function lsGet(key, fallback = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function lsSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded — fail silently
  }
}

export const lsDel = (key) => localStorage.removeItem(key);

// ─── Chat session helpers ─────────────────────────────────────────────────────

const SESSIONS_KEY = 'brahma-chat-sessions';
const MAX_SESSIONS = 20;

export function saveChatSession(messages, identity) {
  if (!messages.length) return;
  const sessions = lsGet(SESSIONS_KEY, []);
  const session = {
    id: uid(),
    title: promptToTitle(messages[0]?.text || 'Session'),
    identityId: identity.id,
    identityName: identity.name,
    portrait: identity.portrait,
    messages,
    savedAt: new Date().toISOString(),
  };
  const updated = [session, ...sessions].slice(0, MAX_SESSIONS);
  lsSet(SESSIONS_KEY, updated);
  return session.id;
}

export function getChatSessions() {
  return lsGet(SESSIONS_KEY, []);
}

export function deleteChatSession(id) {
  const sessions = lsGet(SESSIONS_KEY, []);
  lsSet(SESSIONS_KEY, sessions.filter((s) => s.id !== id));
}

// ─── Recent prompts ───────────────────────────────────────────────────────────

const RECENT_KEY = 'brahma-recent-prompts';
const MAX_RECENT = 5;

export function saveRecentPrompt(text) {
  const recents = lsGet(RECENT_KEY, []);
  const filtered = recents.filter((r) => r !== text);
  lsSet(RECENT_KEY, [text, ...filtered].slice(0, MAX_RECENT));
}

export function getRecentPrompts() {
  return lsGet(RECENT_KEY, []);
}
