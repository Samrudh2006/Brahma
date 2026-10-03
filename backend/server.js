/**
 * BRAHMA Backend — Phase 8: Express API Server
 * Handles chat inference, file uploads, integrations, scheduled tasks, notifications
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 4000;
const defaultOrigins = [
  'https://brahma-web.antideploy.com',
  'https://brahma-ai-hmcd.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4000'
];
const rawCors = process.env.CORS_ORIGIN;
const allowedOrigins = (rawCors && rawCors !== '*')
  ? rawCors.split(',').map(s => s.trim())
  : defaultOrigins;

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile apps, server-to-server, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    try {
      const parsed = new URL(origin);
      if (
        parsed.hostname.endsWith('.onrender.com') ||
        parsed.hostname.endsWith('.antideploy.com') ||
        parsed.hostname === 'localhost' ||
        parsed.hostname === '127.0.0.1'
      ) {
        return callback(null, true);
      }
    } catch (_) {}
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

// Zero-Trust Security & Input Sanitization Shield
const securityShield = require('./middleware/securityShield');
app.use(securityShield);

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use('/health',             require('./routes/health'));
app.use('/api/health',         require('./routes/health'));
app.use('/api/models',         require('./routes/models'));
app.use('/api/chat',           require('./routes/chat'));
app.use('/api/upload',         require('./routes/upload'));
app.use('/api/tasks',          require('./routes/tasks'));
app.use('/api/notifications',  require('./routes/notifications'));
app.use('/api/integrations',   require('./routes/integrations'));
app.use('/api/execute',        require('./routes/execute'));
app.use('/api/billing',        require('./routes/billing'));
app.use('/api/frontier',       require('./routes/frontier'));
app.use('/api/hub',            require('./routes/hub'));
app.use('/api/images',         require('./routes/images'));
app.use('/api/remote',         require('./routes/remote'));
app.use('/api/research',       require('./routes/research'));
app.use('/api/intelligence',   require('./routes/intelligence'));
app.use('/api/whisper',        require('./routes/whisper'));
app.use('/api/autonomous',     require('./routes/autonomous'));
app.use('/api/whatsapp',       require('./routes/whatsapp'));
app.use('/api/laya',           require('./routes/laya'));
app.use('/api/feedback',       require('./routes/feedback'));
app.use('/api/webcmd',         require('./routes/webcmd'));
app.use('/api/voice',          require('./routes/voice'));
app.use('/api/video',          require('./routes/video'));
app.use('/api/councils',       require('./routes/councils'));
app.use('/api/mesh',           require('./routes/enterpriseMesh'));
app.use('/api/evolution',      require('./routes/evolution'));
app.use('/auth',               require('./routes/auth'));
app.use('/api/auth',           require('./routes/auth'));


// ─── Serve built frontend (when deployed together in container) ────────────────
const fs = require('fs');
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    if (req.path.startsWith('/api') || req.path.startsWith('/auth') || req.path.startsWith('/ws')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// ─── Global Centralized Error Handler Middleware ────────────────────────────────
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// ─── Start ─────────────────────────────────────────────────────────────────────
const http = require('http');
const collabSocket = require('./services/collabSocket');

const server = http.createServer(app);
collabSocket.attach(server);

server.listen(PORT, () => {
  console.log(`\n🔱 BRAHMA Backend running on http://localhost:${PORT}`);
  console.log(`   WebSocket Gateway: ws://localhost:${PORT}/ws/collab`);
  console.log(`   Ollama: ${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}`);
  console.log(`   HF Token: ${process.env.HF_API_TOKEN ? '✓ set' : '✗ not set (cloud fallback unavailable)'}`);
});

module.exports = app;
