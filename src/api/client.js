/**
 * BRAHMA — Frontend API Client
 * All backend calls go through here. Never call fetch() directly from components.
 */

const isAntideploy = typeof window !== 'undefined' && window.location.hostname.includes('antideploy.com');
const defaultBackend = isAntideploy ? 'https://brahma-ai-hmcd.onrender.com' : '';
const rawEnvUrl = (import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL || defaultBackend).trim().replace(/\/$/, '');
export const API_BASE = rawEnvUrl
  ? (rawEnvUrl.endsWith('/api') ? rawEnvUrl : `${rawEnvUrl}/api`)
  : '/api';
export const BACKEND_BASE = rawEnvUrl
  ? rawEnvUrl.replace(/\/api$/, '')
  : (typeof window !== 'undefined' && window.location.origin ? window.location.origin : '');
const BASE_URL = API_BASE;

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
export function sendChatStream({ messages, identity, pills, modelSource, userApiKey, model }, onChunk, onDone, onError) {
  const controller = new AbortController();

  const storedApiKey = typeof window !== 'undefined' ? localStorage.getItem('brahma-user-api-key') : null;
  const storedModel = typeof window !== 'undefined' ? localStorage.getItem('brahma-preferred-model') : null;

  fetch(`${BASE_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages,
      identity,
      pills,
      modelSource: modelSource || 'auto',
      userApiKey: userApiKey || storedApiKey || null,
      model: model || storedModel || 'deepseek-r1'
    }),
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
// ─── Scheduled Tasks ─────────────────────────────────────────────────────────
export const getTasks = () => request('/tasks');
export const createTask = (task) =>
  request('/tasks', { method: 'POST', body: JSON.stringify(task) });
export const deleteTask = (id) =>
  request(`/tasks/${id}`, { method: 'DELETE' });

// ─── Laya & Jev System-1 Classification ──────────────────────────────────────
export const classifyIntentWithLaya = (prompt, preferences = {}) =>
  request('/laya/classify', { method: 'POST', body: JSON.stringify({ prompt, preferences }) });


// ─── Intelligence APIs (Free Public APIs — no key or free key required) ───────
// Sources: github.com/public-apis/public-apis
const INTEL = '/intelligence';

/** Wikipedia — article summary or search list (no key required) */
export const wikiSearch = (q, mode = 'summary') =>
  request(`${INTEL}/wiki?q=${encodeURIComponent(q)}${mode === 'list' ? '&mode=list' : ''}`);

/** arXiv — research paper search (no key required) */
export const arxivSearch = (q, limit = 5) =>
  request(`${INTEL}/arxiv?q=${encodeURIComponent(q)}&limit=${limit}`);

/** Open-Meteo — real-time weather forecasts (no key required) */
export const getWeather = (lat = 17.385, lon = 78.4867, city = 'Hyderabad') =>
  request(`${INTEL}/weather?lat=${lat}&lon=${lon}&city=${encodeURIComponent(city)}`);

/** NASA APOD — Astronomy Picture of the Day (DEMO_KEY built-in) */
export const getNasaApod = () => request(`${INTEL}/nasa/apod`);

/** NASA NEO — Near Earth Objects asteroid tracker */
export const getNasaNeo = (start, end) =>
  request(`${INTEL}/nasa/neo${start ? `?start=${start}&end=${end || start}` : ''}`);

/** RestCountries — country data, flags, currencies (no key required) */
export const getCountryInfo = (name) =>
  request(`${INTEL}/country?name=${encodeURIComponent(name)}`);

/** CoinGecko — live crypto prices USD (no key required) */
export const getCryptoPrices = (coins = ['bitcoin', 'ethereum', 'solana']) =>
  request(`${INTEL}/crypto?coins=${coins.join(',')}`);

/** Open Exchange Rates — forex rates (no key required) */
export const getForexRates = (base = 'USD') =>
  request(`${INTEL}/forex?base=${base}`);

/** Open Library — book search (no key required) */
export const searchBooks = (q, limit = 5) =>
  request(`${INTEL}/books?q=${encodeURIComponent(q)}&limit=${limit}`);

/** ip-api.com — IP geolocation lookup (no key, 45 req/min) */
export const getIpGeo = (ip = '') =>
  request(`${INTEL}/ip${ip ? `?ip=${ip}` : ''}`);

/** HuggingFace — live model search (no key for public models) */
export const searchHfModels = (q, limit = 8) =>
  request(`${INTEL}/hf/models?q=${encodeURIComponent(q)}&limit=${limit}`);

/** HuggingFace — live dataset search (no key required) */
export const searchHfDatasets = (q, limit = 6) =>
  request(`${INTEL}/hf/datasets?q=${encodeURIComponent(q)}&limit=${limit}`);

/** GitHub — public repository search (no key = 60 req/hr; set GITHUB_TOKEN for 5000/hr) */
export const searchGitHub = (q, sort = 'stars', limit = 8) =>
  request(`${INTEL}/github?q=${encodeURIComponent(q)}&sort=${sort}&limit=${limit}`);

/** NewsAPI — news articles (free key: newsapi.org/register, 100 req/day) */
export const searchNews = (q) =>
  request(`${INTEL}/news?q=${encodeURIComponent(q)}`);

/** Nager.Date — public holidays for any country (no key required) */
export const getHolidays = (country = 'IN', year = new Date().getFullYear()) =>
  request(`${INTEL}/holidays?country=${country}&year=${year}`);

/** Unified Research — Wikipedia + arXiv + GitHub in parallel */
export const unifiedResearch = (q) =>
  request(`${INTEL}/research?q=${encodeURIComponent(q)}`);

/** Intelligence Status — health check for all free APIs + MCP servers */
export const getIntelligenceStatus = () => request(`${INTEL}/status`);
