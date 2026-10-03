const router = require('express').Router();
const webcmdService = require('../services/webcmdService');

// GET /api/webcmd/status — Check health and capabilities of webcmd
router.get('/status', async (req, res) => {
  try {
    const status = await webcmdService.getStatus();
    res.json(status);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/webcmd/sites — List all registered website CLI interfaces
router.get('/sites', async (req, res) => {
  try {
    const sites = await webcmdService.listSites();
    res.json(sites);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/webcmd/execute — Execute deterministic web command
router.post('/execute', async (req, res) => {
  const { site, command, args = [] } = req.body;
  if (!site || !command) {
    return res.status(400).json({ error: 'site and command are required' });
  }

  try {
    const result = await webcmdService.execute(site, command, args);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
