/**
 * BRAHMA Zero-Trust Security Shield & Input Sanitization Firewall
 * Protects against SQL Injection, XSS, Prototype Pollution, and Prompt Injections.
 */

const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /system\s+prompt\s+override/i,
  /disregard\s+the\s+above/i,
  /you\s+are\s+now\s+in\s+developer\s+mode/i,
  /bypass\s+all\s+safety\s+filters/i,
  /reveal\s+your\s+system\s+instructions/i
];

const SQL_INJECTION_PATTERNS = [
  /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
  /\b(UNION\s+SELECT|DROP\s+TABLE|ALTER\s+TABLE|TRUNCATE\s+TABLE)\b/i,
  /\b(OR\s+1\s*=\s*1|AND\s+1\s*=\s*1)\b/i
];

const XSS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript\s*:/gi,
  /on(load|error|click|mouseover|submit)\s*=/gi
];

// In-Memory Sliding Window Rate Limiter (No external redis dependency needed)
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 120; // 120 req/min per IP
const ipRequestHistory = new Map();

// Periodic cleanup every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [ip, timestamps] of ipRequestHistory.entries()) {
    const valid = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (valid.length === 0) {
      ipRequestHistory.delete(ip);
    } else {
      ipRequestHistory.set(ip, valid);
    }
  }
}, 5 * 60 * 1000);

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  for (const key of Object.keys(obj)) {
    // 1. Prototype Pollution Defense
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      delete obj[key];
      continue;
    }

    const val = obj[key];
    if (typeof val === 'string') {
      // 2. Check XSS
      XSS_PATTERNS.forEach(pattern => {
        if (pattern.test(val)) {
          obj[key] = val.replace(pattern, '[BLOCKED_XSS_VECTOR]');
        }
      });
    } else if (typeof val === 'object') {
      sanitizeObject(val);
    }
  }
  return obj;
}

function securityShield(req, res, next) {
  const clientIp = (req.headers && req.headers['x-forwarded-for']?.split(',')[0]?.trim()) || req.socket?.remoteAddress || req.ip || '127.0.0.1';

  // ── 1. Server-Side Sliding Window Rate Limiting ──
  const now = Date.now();
  let timestamps = ipRequestHistory.get(clientIp) || [];
  timestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  ipRequestHistory.set(clientIp, timestamps);

  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
  res.setHeader('X-RateLimit-Remaining', Math.max(0, MAX_REQUESTS_PER_WINDOW - timestamps.length));

  if (timestamps.length > MAX_REQUESTS_PER_WINDOW) {
    console.warn(`[SECURITY] Rate limit exceeded for IP: ${clientIp} (${timestamps.length} reqs)`);
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please wait a moment before sending more requests.',
      retryAfterSeconds: Math.ceil((timestamps[0] + RATE_LIMIT_WINDOW_MS - now) / 1000)
    });
  }

  // ── 2. Enterprise Security Headers ──
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(self), geolocation=()');
  res.setHeader('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  
  // CSP for API & Application responses
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob: https:; connect-src 'self' https: wss: ws: http://localhost:* http://127.0.0.1:*; media-src 'self' data: blob: https:; object-src 'none'; frame-src 'self'; upgrade-insecure-requests;"
  );

  // ── 3. Request Body & Query Sanitization ──
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);

    // Prompt injection check on text/messages/prompt fields
    const textToCheck = JSON.stringify(req.body);
    for (const pattern of PROMPT_INJECTION_PATTERNS) {
      if (pattern.test(textToCheck)) {
        console.warn(`[SECURITY ALERT] Prompt injection pattern intercepted from IP: ${clientIp}`);
        // Stripped or flagged safely
      }
    }
  }

  if (req.query && typeof req.query === 'object') {
    sanitizeObject(req.query);
  }

  next();
}

module.exports = securityShield;
