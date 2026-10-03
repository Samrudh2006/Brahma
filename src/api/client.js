/**
 * BRAHMA — Frontend API Client
 * All backend calls go through here. Never call fetch() directly from components.
 */

const BASE_URL = '/api'; // Proxied to http://localhost:4000 via vite.config.js

// ─── Generic request helper ───────────────────────────────────────────────────
async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ─── Health Check ─────────────────────────────────────────────────────────────
export const checkHealth = () => request('/health');

// ─── Models ──────────────────────────────────────────────────────────────────
export const getAvailableModels = () => request('/models');

// ─── Chat ─────────────────────────────────────────────────────────────────────
/**
 * Send a message and get a streaming SSE response.
 * @param {Object} payload - { messages, identity, pills, modelSource }
 * @param {Function} onChunk - called with each text chunk
 * @param {Function} onDone  - called when stream ends
 * @param {Function} onError - called on error
 * @returns {Function} abort function to cancel the stream
 */
export function sendChatStream({ messages, identity, pills, modelSource }, onChunk, onDone, onError) {
  const controller = new AbortController();

  fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, identity, pills, modelSource }),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Stream error' }));
        onError(new Error(err.error));
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      const read = async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) { onDone(); break; }

            const lines = decoder.decode(value, { stream: true }).split('\n');
            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') { onDone(); return; }
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.chunk) onChunk(parsed.chunk);
                  if (parsed.thought) onChunk('__THOUGHT__' + parsed.thought);
                } catch (_) {
                  // ignore malformed lines
                }
              }
            }
          }
        } catch (err) {
          if (err.name !== 'AbortError') onError(err);
        }
      };

      read();
    })
    .catch((err) => {
      if (err.name !== 'AbortError') onError(err);
    });

  return () => controller.abort();
}

/**
 * Non-streaming fallback: simple JSON request/response.
 */
export const sendChatFallback = (payload) =>
  request('/chat', { method: 'POST', body: JSON.stringify(payload) });

// ─── File Upload ──────────────────────────────────────────────────────────────
export async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  const response = await fetch(`${BASE_URL}/upload`, { method: 'POST', body: formData });
  if (!response.ok) throw new Error('Upload failed');
  return response.json();
}

// ─── Integrations ─────────────────────────────────────────────────────────────
export const getIntegrations = () => request('/integrations');
export const disconnectIntegration = (id) =>
  request(`/integrations/${id}`, { method: 'DELETE' });

// ─── Notifications ────────────────────────────────────────────────────────────
export const fetchNotifications = (unreadOnly = false) =>
  request(`/notifications${unreadOnly ? '?unread=true' : ''}`);
export const markNotificationRead = (id) =>
  request(`/notifications/${id}/read`, { method: 'PATCH' });

// ─── Scheduled Tasks ─────────────────────────────────────────────────────────
export const getTasks = () => request('/tasks');
export const createTask = (task) =>
  request('/tasks', { method: 'POST', body: JSON.stringify(task) });
export const deleteTask = (id) =>
  request(`/tasks/${id}`, { method: 'DELETE' });
