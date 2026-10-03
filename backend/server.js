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
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || 'http://localhost:3001';

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(helmet({ crossOriginEmbedderPolicy: false }));
app.use(cors({ origin: [ALLOWED_ORIGIN, 'http://localhost:3000', 'http://localhost:3001'], credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true }));

// Zero-Trust Security & Input Sanitization Shield
const securityShield = require('./middleware/securityShield');
app.use(securityShield);

// ─── Routes ────────────────────────────────────────────────────────────────────
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
app.use('/api/laya',           require('./routes/laya'));
app.use('/auth',               require('./routes/auth'));


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
