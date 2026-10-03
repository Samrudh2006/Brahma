const express = require('express');
const router = express.Router();
const cloudflareHub = require('../services/cloudflareSovereignHubService');

// GET /api/cloudflare/features - Returns the full matrix of 25 Cloudflare sovereign capabilities
router.get('/features', (req, res) => {
  try {
    const data = cloudflareHub.getAllFeatures();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve Cloudflare capabilities', details: err.message });
  }
});

// POST /api/cloudflare/tunnel-config - Generates zero-trust named tunnel scripts
router.post('/tunnel-config', (req, res) => {
  try {
    const { domain, localPort } = req.body || {};
    const config = cloudflareHub.generateTunnelScript({ domain, localPort });
    res.json({ status: 'success', config });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate tunnel script', details: err.message });
  }
});

// POST /api/cloudflare/wrangler-config - Generates wrangler.toml for Workers, D1, KV, R2 & Crons
router.post('/wrangler-config', (req, res) => {
  try {
    const { projectName, accountId, d1Name, kvName, r2Bucket } = req.body || {};
    const toml = cloudflareHub.generateWranglerConfig({ projectName, accountId, d1Name, kvName, r2Bucket });
    res.json({ status: 'success', wranglerToml: toml });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate wrangler configuration', details: err.message });
  }
});

// POST /api/cloudflare/turnstile-snippet - Returns Turnstile code for React + Express
router.post('/turnstile-snippet', (req, res) => {
  try {
    const { siteKey } = req.body || {};
    const snippet = cloudflareHub.generateTurnstileSnippet({ siteKey });
    res.json({ status: 'success', snippet });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate Turnstile snippet', details: err.message });
  }
});

module.exports = router;
