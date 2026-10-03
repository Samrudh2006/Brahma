const router = require('express').Router();

// In-memory integration state (would be DB-backed in production)
let integrations = [
  { id: 'github',    name: 'GitHub',       connected: false, token: null },
  { id: 'drive',     name: 'Google Drive', connected: false, token: null },
  { id: 'notion',    name: 'Notion',       connected: false, token: null },
  { id: 'anytype',   name: 'Anytype',      connected: false, token: null },
];

// GET /api/integrations
router.get('/', (req, res) => {
  res.json(integrations.map(({ token, ...rest }) => rest));
});

// DELETE /api/integrations/:id — disconnect
router.delete('/:id', (req, res) => {
  const integration = integrations.find(i => i.id === req.params.id);
  if (!integration) return res.status(404).json({ error: 'Not found' });
  integration.connected = false;
  integration.token = null;
  res.json({ success: true });
});

// POST /api/integrations/set-key — store API key for non-OAuth services
router.post('/set-key', (req, res) => {
  const { integrationId, key } = req.body;
  const integration = integrations.find(i => i.id === integrationId);
  if (!integration) return res.status(404).json({ error: 'Not found' });
  integration.token = key;
  integration.connected = true;
  res.json({ success: true });
});

// ─── Nango Unified Integration Engine (250+ APIs) ─────────────────────────────
const nangoSyncService = require('../services/nangoSyncService');

// GET /api/integrations/nango/catalog
router.get('/nango/catalog', (req, res) => {
  res.json(nangoSyncService.getProvidersCatalog());
});

// POST /api/integrations/nango/session
router.post('/nango/session', (req, res) => {
  const { integrationId, returnUrl } = req.body;
  const session = nangoSyncService.createConnectSession({ integrationId, returnUrl });
  res.json(session);
});

// POST /api/integrations/nango/sync
router.post('/nango/sync', async (req, res) => {
  try {
    const { integrationId, model } = req.body;
    const syncResult = await nangoSyncService.syncProviderData({ integrationId, model });
    res.json(syncResult);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
