/**
 * BRAHMA Intelligence Route — /api/intelligence
 * Unified gateway to all free public APIs and MCP-powered research tools.
 * Sources: github.com/public-apis/public-apis
 *
 * Endpoints:
 *   GET  /api/intelligence/wiki?q=...
 *   GET  /api/intelligence/arxiv?q=...&limit=5
 *   GET  /api/intelligence/weather?lat=...&lon=...&city=...
 *   GET  /api/intelligence/nasa/apod
 *   GET  /api/intelligence/nasa/neo?start=YYYY-MM-DD&end=YYYY-MM-DD
 *   GET  /api/intelligence/country?name=...
 *   GET  /api/intelligence/crypto?coins=bitcoin,ethereum
 *   GET  /api/intelligence/forex?base=USD
 *   GET  /api/intelligence/books?q=...&limit=5
 *   GET  /api/intelligence/ip?ip=...
 *   GET  /api/intelligence/hf/models?q=...&limit=8
 *   GET  /api/intelligence/hf/datasets?q=...&limit=6
 *   GET  /api/intelligence/github?q=...&sort=stars
 *   GET  /api/intelligence/news?q=...
 *   GET  /api/intelligence/holidays?country=IN&year=2025
 *   GET  /api/intelligence/status  (health check for all APIs)
 */

const express = require('express');
const router = express.Router();
const apis = require('../services/publicApisService');

// ─── Helper ────────────────────────────────────────────────────────────────────
const wrap = (fn) => async (req, res) => {
  try {
    const result = await fn(req);
    res.json({ success: true, ...result, timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, timestamp: new Date().toISOString() });
  }
};

// ─── Wikipedia ────────────────────────────────────────────────────────────────
router.get('/wiki', wrap(async (req) => {
  const { q, mode } = req.query;
  if (!q) throw new Error('Query parameter ?q= is required');
  if (mode === 'list') {
    const results = await apis.searchWikipediaList(q);
    return { query: q, results };
  }
  // Try summary first; fallback to search list on 404
  try {
    const data = await apis.searchWikipedia(q);
    return data;
  } catch (err) {
    if (err.message.includes('404')) {
      const results = await apis.searchWikipediaList(q);
      return { query: q, fallback: true, results, source: 'Wikipedia Search (summary not found)' };
    }
    throw err;
  }
}));


// ─── arXiv Papers ─────────────────────────────────────────────────────────────
router.get('/arxiv', wrap(async (req) => {
  const { q, limit } = req.query;
  if (!q) throw new Error('Query parameter ?q= is required');
  return await apis.searchArxiv(q, parseInt(limit) || 5);
}));

// ─── Weather (Open-Meteo, no key) ─────────────────────────────────────────────
router.get('/weather', wrap(async (req) => {
  const { lat, lon, city } = req.query;
  return await apis.getWeather(
    parseFloat(lat) || 17.385,
    parseFloat(lon) || 78.4867,
    city || 'Hyderabad'
  );
}));

// ─── NASA APOD ────────────────────────────────────────────────────────────────
router.get('/nasa/apod', wrap(async (req) => {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  return await apis.getNasaApod(apiKey);
}));

// ─── NASA Near Earth Objects ──────────────────────────────────────────────────
router.get('/nasa/neo', wrap(async (req) => {
  const { start, end } = req.query;
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  return await apis.getNasaNeo(start, end, apiKey);
}));

// ─── Country Info ─────────────────────────────────────────────────────────────
router.get('/country', wrap(async (req) => {
  const { name } = req.query;
  if (!name) throw new Error('Query parameter ?name= is required');
  return await apis.getCountryInfo(name);
}));

// ─── Crypto Prices ────────────────────────────────────────────────────────────
router.get('/crypto', wrap(async (req) => {
  const coins = req.query.coins ? req.query.coins.split(',') : ['bitcoin', 'ethereum', 'solana', 'binancecoin'];
  return await apis.getCryptoPrices(coins);
}));

// ─── Forex Exchange Rates ─────────────────────────────────────────────────────
router.get('/forex', wrap(async (req) => {
  return await apis.getExchangeRates(req.query.base || 'USD');
}));

// ─── Books (Open Library) ─────────────────────────────────────────────────────
router.get('/books', wrap(async (req) => {
  const { q, limit } = req.query;
  if (!q) throw new Error('Query parameter ?q= is required');
  return await apis.searchBooks(q, parseInt(limit) || 5);
}));

// ─── IP Geolocation ───────────────────────────────────────────────────────────
router.get('/ip', wrap(async (req) => {
  return await apis.getIpGeo(req.query.ip || '');
}));

// ─── HuggingFace Models ───────────────────────────────────────────────────────
router.get('/hf/models', wrap(async (req) => {
  const { q, limit } = req.query;
  if (!q) throw new Error('Query parameter ?q= is required');
  return await apis.searchHuggingFaceModels(q, parseInt(limit) || 8);
}));

// ─── HuggingFace Datasets ─────────────────────────────────────────────────────
router.get('/hf/datasets', wrap(async (req) => {
  const { q, limit } = req.query;
  if (!q) throw new Error('Query parameter ?q= is required');
  return await apis.searchHuggingFaceDatasets(q, parseInt(limit) || 6);
}));

// ─── GitHub Repo Search ───────────────────────────────────────────────────────
router.get('/github', wrap(async (req) => {
  const { q, sort, limit } = req.query;
  if (!q) throw new Error('Query parameter ?q= is required');
  return await apis.searchGitHub(q, sort || 'stars', parseInt(limit) || 8);
}));

// ─── News (requires free NewsAPI key) ─────────────────────────────────────────
router.get('/news', wrap(async (req) => {
  const { q, key } = req.query;
  if (!q) throw new Error('Query parameter ?q= is required');
  return await apis.searchNews(q, key || process.env.NEWS_API_KEY);
}));

// ─── Public Holidays ──────────────────────────────────────────────────────────
router.get('/holidays', wrap(async (req) => {
  const { country, year } = req.query;
  return await apis.getPublicHolidays(country || 'IN', parseInt(year) || new Date().getFullYear());
}));

// ─── Unified Research (combines wiki + arxiv + github) ────────────────────────
router.get('/research', wrap(async (req) => {
  const { q } = req.query;
  if (!q) throw new Error('Query parameter ?q= is required');
  const [wikiList, arxivResults, githubResults] = await Promise.allSettled([
    apis.searchWikipediaList(q),
    apis.searchArxiv(q, 3),
    apis.searchGitHub(q, 'stars', 5)
  ]);
  return {
    query: q,
    wikipedia: wikiList.status === 'fulfilled' ? wikiList.value : [],
    arxiv: arxivResults.status === 'fulfilled' ? arxivResults.value : { error: arxivResults.reason?.message },
    github: githubResults.status === 'fulfilled' ? githubResults.value : { error: githubResults.reason?.message },
    source: 'BRAHMA Intelligence — Wikipedia + arXiv + GitHub'
  };
}));

// ─── Status / Health Check ────────────────────────────────────────────────────
router.get('/status', async (req, res) => {
  const checks = [
    { name: 'Wikipedia', url: 'https://en.wikipedia.org/api/rest_v1/page/summary/India' },
    { name: 'arXiv', url: 'https://export.arxiv.org/api/query?search_query=all:AI&max_results=1' },
    { name: 'Open-Meteo', url: 'https://api.open-meteo.com/v1/forecast?latitude=17.4&longitude=78.5&current=temperature_2m' },
    { name: 'CoinCap', url: 'https://api.coincap.io/v2/assets?limit=1' },
    { name: 'RestCountries', url: 'https://restcountries.com/v3.1/name/india?fields=name' },
    { name: 'HuggingFace', url: 'https://huggingface.co/api/models?limit=1' },
    { name: 'GitHub', url: 'https://api.github.com/rate_limit' },
    { name: 'NASA (DEMO_KEY)', url: `https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY || 'DEMO_KEY'}` },
    { name: 'Exchange Rates', url: 'https://open.er-api.com/v6/latest/USD' },
    { name: 'OpenLibrary', url: 'https://openlibrary.org/search.json?q=artificial+intelligence&limit=1&fields=title' }
  ];

  const results = await Promise.allSettled(
    checks.map(async (check) => {
      const start = Date.now();
      const res = await fetch(check.url, { signal: AbortSignal.timeout(5000) });
      return { name: check.name, status: res.ok ? 'online' : 'error', latencyMs: Date.now() - start, httpStatus: res.status };
    })
  );

  const statuses = results.map((r, i) =>
    r.status === 'fulfilled' ? r.value : { name: checks[i].name, status: 'offline', error: r.reason?.message }
  );

  const online = statuses.filter(s => s.status === 'online').length;
  res.json({
    success: true,
    summary: `${online}/${statuses.length} APIs online`,
    apis: statuses,
    mcpServers: [
      { name: 'fetch', status: 'available', key: 'none required' },
      { name: 'memory', status: 'available', key: 'none required' },
      { name: 'github', status: 'available', key: 'optional (set GITHUB_TOKEN in .env for higher rate limits)' },
      { name: 'brave-search', status: 'available', key: 'set BRAVE_API_KEY in .env (free at api.search.brave.com)' },
      { name: 'filesystem', status: 'available', key: 'none required' },
      { name: 'sequential-thinking', status: 'available', key: 'none required' }
    ],
    timestamp: new Date().toISOString()
  });
});

// ─── Flowsint OSINT Intelligence Graph Route ─────────────────────────────────
const flowsintOsintEngine = require('../services/flowsintOsintEngine');

router.post('/osint/investigate', async (req, res) => {
  try {
    const { target = 'brahma.ai', type = 'domain' } = req.body;
    const report = await flowsintOsintEngine.investigateTarget({ target, type });
    res.json(report);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
