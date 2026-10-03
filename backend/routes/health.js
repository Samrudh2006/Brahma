const router = require('express').Router();
const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

// Health check
router.get('/', async (req, res) => {
  let ollamaOnline = false;
  let ollamaModels = [];

  try {
    const r = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 2500 });
    ollamaOnline = true;
    ollamaModels = (r.data.models || []).map(m => m.name);
  } catch (_) {}

  res.json({
    status: 'ok',
    version: '1.0.0',
    uptime: process.uptime(),
    ollamaOnline,
    ollamaModels,
    timestamp: new Date().toISOString(),
  });
});

// Full system diagnostic doctor report
const systemDoctor = require('../services/systemDoctorService');
router.get('/doctor', async (req, res) => {
  try {
    const report = await systemDoctor.runDiagnostics();
    res.json(report);
  } catch (err) {
    res.status(500).json({ status: 'ERROR', error: err.message });
  }
});

module.exports = router;
