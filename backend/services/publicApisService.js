/**
 * BRAHMA — Public APIs Intelligence Service
 * Integrates 12+ free public APIs (no key or free key required)
 * Sources: github.com/public-apis/public-apis
 */

const BASE_HEADERS = {
  'User-Agent': 'BrahmaAI/1.0 (github.com/Samrudh2006/Brahma)',
  'Accept': 'application/json'
};

// ─── 4-Layer Defense: 3.5s Hard Race Timeout & Stale Snapshot Cache ───────────
const CIRCUIT_BREAKER_TIMEOUT_MS = 3500;
const STALE_SNAPSHOT_CACHE = new Map();

const timeout = (ms = CIRCUIT_BREAKER_TIMEOUT_MS) => ({ signal: AbortSignal.timeout(ms) });

async function withResilientSnapshotCache(cacheKey, fetchFn) {
  try {
    const data = await fetchFn();
    STALE_SNAPSHOT_CACHE.set(cacheKey, data);
    return data;
  } catch (err) {
    if (STALE_SNAPSHOT_CACHE.has(cacheKey)) {
      console.warn(`[Resilience Cache] Flaky network for "${cacheKey}". Serving verified snapshot cache.`);
      return STALE_SNAPSHOT_CACHE.get(cacheKey);
    }
    throw err;
  }
}


// ─── Wikipedia ────────────────────────────────────────────────────────────────
async function searchWikipedia(query, sentences = 3) {
  return withResilientSnapshotCache(`wiki:${query}`, async () => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
    const res = await fetch(url, { headers: BASE_HEADERS, ...timeout() });
    if (!res.ok) throw new Error(`Wikipedia: ${res.status}`);
    const data = await res.json();
    return {
      title: data.title,
      description: data.description,
      extract: (data.extract || '').slice(0, 400),
      url: data.content_urls?.desktop?.page,
      thumbnail: data.thumbnail?.source || null,
      lang: 'en',
      source: 'Wikipedia REST API'
    };
  });
}

async function searchWikipediaList(query) {
  return withResilientSnapshotCache(`wiki_list:${query}`, async () => {
    const url = `https://en.wikipedia.org/w/api.php?action=search&srsearch=${encodeURIComponent(query)}&format=json&srlimit=5&origin=*`;
    const res = await fetch(url, { headers: BASE_HEADERS, ...timeout() });
    if (!res.ok) throw new Error(`Wikipedia Search: ${res.status}`);
    const data = await res.json();
    return data.query?.search?.map(r => ({
      title: r.title,
      snippet: r.snippet.replace(/<[^>]+>/g, '').slice(0, 250),
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(r.title)}`
    })) || [];
  });
}

// ─── arXiv ────────────────────────────────────────────────────────────────────
async function searchArxiv(query, maxResults = 5) {
  return withResilientSnapshotCache(`arxiv:${query}`, async () => {
    const url = `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&max_results=${maxResults}&sortBy=relevance`;
    const res = await fetch(url, { headers: { 'User-Agent': BASE_HEADERS['User-Agent'] }, ...timeout() });
    if (!res.ok) throw new Error(`arXiv: ${res.status}`);
    const xml = await res.text();

  // Parse XML entries
  const entries = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];
    const get = (tag) => {
      const m = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].trim().replace(/\s+/g, ' ') : '';
    };
    const idRaw = get('id');
    const arxivId = idRaw.split('/abs/')[1] || idRaw;
    entries.push({
      id: arxivId,
      title: get('title'),
      summary: get('summary').slice(0, 400) + '...',
      authors: entry.match(/<name>([^<]+)<\/name>/g)?.map(a => a.replace(/<\/?name>/g, '')).join(', ') || 'Unknown',
      published: get('published').split('T')[0],
      url: `https://arxiv.org/abs/${arxivId}`,
      pdfUrl: `https://arxiv.org/pdf/${arxivId}`
    });
  }
  return { query, total: entries.length, papers: entries, source: 'arXiv Open Access' };
});
}

// ─── Open-Meteo (Weather — no key needed) ────────────────────────────────────
async function getWeather(lat = 17.385, lon = 78.4867, city = 'Hyderabad') {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&forecast_days=3&timezone=auto`;
  const res = await fetch(url, { headers: BASE_HEADERS, ...timeout() });
  if (!res.ok) throw new Error(`Open-Meteo: ${res.status}`);
  const data = await res.json();
  const wmo = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
    45: 'Foggy', 51: 'Drizzle', 61: 'Rain', 71: 'Snow', 95: 'Thunderstorm'
  };
  return {
    city,
    latitude: lat,
    longitude: lon,
    timezone: data.timezone,
    current: {
      temperature: data.current?.temperature_2m,
      feelsLike: data.current?.apparent_temperature,
      humidity: data.current?.relative_humidity_2m,
      windSpeed: data.current?.wind_speed_10m,
      condition: wmo[data.current?.weather_code] || 'Unknown',
      unit: data.current_units?.temperature_2m
    },
    forecast: data.daily?.time?.map((date, i) => ({
      date,
      maxTemp: data.daily.temperature_2m_max[i],
      minTemp: data.daily.temperature_2m_min[i],
      precipitation: data.daily.precipitation_sum[i]
    })) || [],
    source: 'Open-Meteo (free, no key)'
  };
}

// ─── NASA APOD (Astronomy Picture of the Day) ─────────────────────────────────
async function getNasaApod(apiKey = 'DEMO_KEY') {
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
  const res = await fetch(url, { headers: BASE_HEADERS, ...timeout() });
  if (!res.ok) throw new Error(`NASA APOD: ${res.status}`);
  const data = await res.json();
  return {
    title: data.title,
    date: data.date,
    explanation: data.explanation,
    mediaType: data.media_type,
    url: data.url,
    hdUrl: data.hdurl || data.url,
    copyright: data.copyright || 'NASA',
    source: 'NASA Open API (DEMO_KEY)'
  };
}

// ─── NASA Near Earth Objects ──────────────────────────────────────────────────
async function getNasaNeo(startDate, endDate, apiKey = 'DEMO_KEY') {
  const today = new Date().toISOString().split('T')[0];
  const start = startDate || today;
  const end = endDate || today;
  const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${apiKey}`;
  const res = await fetch(url, { headers: BASE_HEADERS, ...timeout() });
  if (!res.ok) throw new Error(`NASA NEO: ${res.status}`);
  const data = await res.json();
  const allNeos = Object.values(data.near_earth_objects || {}).flat();
  return {
    elementCount: data.element_count,
    period: { start, end },
    hazardous: allNeos.filter(n => n.is_potentially_hazardous_asteroid).length,
    objects: allNeos.slice(0, 10).map(n => ({
      name: n.name,
      hazardous: n.is_potentially_hazardous_asteroid,
      diameter_km: n.estimated_diameter?.kilometers?.estimated_diameter_max?.toFixed(3),
      closestApproach: n.close_approach_data?.[0]?.close_approach_date,
      missDistance_km: Math.round(Number(n.close_approach_data?.[0]?.miss_distance?.kilometers)).toLocaleString(),
      velocity_kph: Math.round(Number(n.close_approach_data?.[0]?.relative_velocity?.kilometers_per_hour)).toLocaleString()
    })),
    source: 'NASA NeoWs API'
  };
}

// ─── RestCountries ────────────────────────────────────────────────────────────
async function getCountryInfo(nameOrCode) {
  const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(nameOrCode)}?fullText=false&fields=name,capital,population,area,region,subregion,languages,currencies,flags,timezones,latlng,cca2,cca3`;
  const res = await fetch(url, { headers: BASE_HEADERS, ...timeout() });
  if (!res.ok) throw new Error(`RestCountries: ${res.status}`);
  const data = await res.json();
  if (!data || !data[0]) throw new Error(`Country not found: ${nameOrCode}`);
  const c = data[0];
  return {
    name: c.name?.common || nameOrCode,
    officialName: c.name?.official,
    capital: c.capital?.[0] || 'N/A',
    population: c.population?.toLocaleString() || 'N/A',
    area_km2: c.area?.toLocaleString() || 'N/A',
    region: c.region || 'N/A',
    subregion: c.subregion || 'N/A',
    languages: c.languages ? Object.values(c.languages).join(', ') : 'N/A',
    currencies: c.currencies ? Object.values(c.currencies).map(cur => `${cur.name} (${cur.symbol || '?'})`).join(', ') : 'N/A',
    flag: c.flags?.svg || c.flags?.png || null,
    timezones: c.timezones?.join(', ') || 'N/A',
    coordinates: c.latlng || [],
    iso2: c.cca2,
    iso3: c.cca3,
    source: 'RestCountries v3.1 (free, no key)'
  };
}

// ─── Crypto Prices (CoinCap — truly no key required) ─────────────────────────
async function getCryptoPrices(coinIds = ['bitcoin', 'ethereum', 'solana']) {
  // CoinCap API — truly free, no key required
  const ids = coinIds.join(',');
  const url = `https://api.coincap.io/v2/assets?ids=${ids}&limit=${coinIds.length}`;
  const res = await fetch(url, { headers: BASE_HEADERS, ...timeout() });
  if (!res.ok) throw new Error(`CoinCap: ${res.status}`);
  const data = await res.json();
  return {
    currency: 'USD',
    coins: data.data.map(c => ({
      id: c.id,
      name: c.name,
      symbol: c.symbol,
      price: parseFloat(c.priceUsd).toFixed(2),
      marketCap: parseFloat(c.marketCapUsd).toFixed(0),
      change24h: parseFloat(c.changePercent24Hr).toFixed(2),
      volume24h: parseFloat(c.volumeUsd24Hr).toFixed(0),
      rank: c.rank,
      supply: parseFloat(c.supply).toFixed(0)
    })),
    source: 'CoinCap.io API v2 (free, no key required)'
  };
}

// ─── Exchange Rates ────────────────────────────────────────────────────────────
async function getExchangeRates(base = 'USD') {
  const url = `https://open.er-api.com/v6/latest/${base}`;
  const res = await fetch(url, { headers: BASE_HEADERS, ...timeout() });
  if (!res.ok) throw new Error(`Exchange Rates: ${res.status}`);
  const data = await res.json();
  const popular = ['EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CNY', 'SGD', 'CHF', 'AED'];
  const rates = {};
  popular.forEach(code => {
    if (data.rates[code]) rates[code] = data.rates[code];
  });
  return {
    base,
    rates,
    allRates: data.rates,
    nextUpdate: data.time_next_update_utc,
    source: 'Open Exchange Rates (free, no key)'
  };
}

// ─── Open Library (Books) ─────────────────────────────────────────────────────
async function searchBooks(query, limit = 5) {
  const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}&fields=title,author_name,first_publish_year,isbn,subject,cover_i,key`;
  const res = await fetch(url, { headers: BASE_HEADERS, ...timeout() });
  if (!res.ok) throw new Error(`OpenLibrary: ${res.status}`);
  const data = await res.json();
  return {
    query,
    totalFound: data.numFound,
    books: data.docs.map(b => ({
      title: b.title,
      authors: b.author_name?.join(', ') || 'Unknown',
      year: b.first_publish_year,
      isbn: b.isbn?.[0] || null,
      subjects: b.subject?.slice(0, 5) || [],
      coverUrl: b.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg` : null,
      url: `https://openlibrary.org${b.key}`
    })),
    source: 'Open Library (free, no key)'
  };
}

// ─── IP Geolocation ───────────────────────────────────────────────────────────
async function getIpGeo(ip = '') {
  const url = `https://ip-api.com/json/${ip}?fields=status,country,regionName,city,zip,lat,lon,timezone,isp,org,as,query`;
  const res = await fetch(url, { headers: BASE_HEADERS, ...timeout() });
  if (!res.ok) throw new Error(`IP-API: ${res.status}`);
  const data = await res.json();
  return {
    ip: data.query,
    country: data.country,
    region: data.regionName,
    city: data.city,
    zip: data.zip,
    lat: data.lat,
    lon: data.lon,
    timezone: data.timezone,
    isp: data.isp,
    org: data.org,
    asn: data.as,
    source: 'ip-api.com (free, no key, 45 req/min)'
  };
}

// ─── HuggingFace Live Model Search ────────────────────────────────────────────
async function searchHuggingFaceModels(query, limit = 8) {
  const url = `https://huggingface.co/api/models?search=${encodeURIComponent(query)}&limit=${limit}&sort=downloads&direction=-1`;
  const res = await fetch(url, { headers: BASE_HEADERS, ...timeout() });
  if (!res.ok) throw new Error(`HuggingFace: ${res.status}`);
  const data = await res.json();
  return {
    query,
    total: data.length,
    models: data.map(m => ({
      id: m.id,
      author: m.id.split('/')[0],
      name: m.id.split('/')[1],
      downloads: m.downloads?.toLocaleString() || '0',
      likes: m.likes || 0,
      tags: m.tags?.slice(0, 6) || [],
      pipeline: m.pipeline_tag,
      updatedAt: m.lastModified?.split('T')[0]
    })),
    source: 'HuggingFace API (free, no key for public models)'
  };
}

// ─── HuggingFace Dataset Search ───────────────────────────────────────────────
async function searchHuggingFaceDatasets(query, limit = 6) {
  const url = `https://huggingface.co/api/datasets?search=${encodeURIComponent(query)}&limit=${limit}&sort=downloads&direction=-1`;
  const res = await fetch(url, { headers: BASE_HEADERS, ...timeout() });
  if (!res.ok) throw new Error(`HuggingFace Datasets: ${res.status}`);
  const data = await res.json();
  return {
    query,
    total: data.length,
    datasets: data.map(d => ({
      id: d.id,
      author: d.id.split('/')[0],
      name: d.id.split('/')[1],
      downloads: d.downloads?.toLocaleString() || '0',
      likes: d.likes || 0,
      tags: d.tags?.slice(0, 5) || [],
      updatedAt: d.lastModified?.split('T')[0]
    })),
    source: 'HuggingFace Datasets API (free, no key)'
  };
}

// ─── GitHub Public Repo Search ────────────────────────────────────────────────
async function searchGitHub(query, sort = 'stars', limit = 8) {
  const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}&sort=${sort}&order=desc&per_page=${limit}`;
  const githubToken = process.env.GITHUB_TOKEN || '';
  const headers = { ...BASE_HEADERS, 'Accept': 'application/vnd.github.v3+json' };
  if (githubToken) headers['Authorization'] = `token ${githubToken}`;
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`GitHub: ${res.status}`);
  const data = await res.json();
  return {
    query,
    totalCount: data.total_count,
    repos: data.items?.map(r => ({
      name: r.full_name,
      description: r.description,
      stars: r.stargazers_count?.toLocaleString(),
      forks: r.forks_count?.toLocaleString(),
      language: r.language,
      license: r.license?.name,
      url: r.html_url,
      topics: r.topics?.slice(0, 5) || [],
      updatedAt: r.updated_at?.split('T')[0],
      openIssues: r.open_issues_count
    })) || [],
    source: 'GitHub REST API (free, public repos)'
  };
}

// ─── NewsAPI (requires free key) ─────────────────────────────────────────────
async function searchNews(query, apiKey = '') {
  const key = apiKey || process.env.NEWS_API_KEY || '';
  if (!key) {
    return {
      error: 'NewsAPI key required. Get free key at https://newsapi.org/register (100 req/day)',
      keyRequired: true
    };
  }
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&pageSize=8&sortBy=publishedAt&language=en&apiKey=${key}`;
  const res = await fetch(url, { headers: BASE_HEADERS, ...timeout() });
  if (!res.ok) throw new Error(`NewsAPI: ${res.status}`);
  const data = await res.json();
  return {
    query,
    totalResults: data.totalResults,
    articles: data.articles?.map(a => ({
      title: a.title,
      source: a.source?.name,
      author: a.author,
      description: a.description,
      url: a.url,
      publishedAt: a.publishedAt?.split('T')[0],
      imageUrl: a.urlToImage
    })) || [],
    source: 'NewsAPI.org (free 100 req/day)'
  };
}

// ─── Public Holidays ──────────────────────────────────────────────────────────
async function getPublicHolidays(countryCode = 'IN', year = new Date().getFullYear()) {
  const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/${countryCode}`;
  const res = await fetch(url, { headers: BASE_HEADERS, ...timeout() });
  if (!res.ok) throw new Error(`Nager Date: ${res.status}`);
  const data = await res.json();
  return {
    country: countryCode,
    year,
    count: data.length,
    holidays: data.map(h => ({
      date: h.date,
      name: h.name,
      localName: h.localName,
      types: h.types,
      global: h.global
    })),
    source: 'Nager.Date Public Holidays API (free, no key)'
  };
}

module.exports = {
  searchWikipedia,
  searchWikipediaList,
  searchArxiv,
  getWeather,
  getNasaApod,
  getNasaNeo,
  getCountryInfo,
  getCryptoPrices,
  getExchangeRates,
  searchBooks,
  getIpGeo,
  searchHuggingFaceModels,
  searchHuggingFaceDatasets,
  searchGitHub,
  searchNews,
  getPublicHolidays
};
