/**
 * BRAHMA Enterprise Mesh Route
 * POST /api/mesh/travel/search
 * POST /api/mesh/travel/price-alert
 * POST /api/mesh/telephony/call
 * POST /api/mesh/telephony/turn
 * POST /api/mesh/workspace/message
 * GET  /api/mesh/config/:platform
 */

const router = require('express').Router();
const garuda = require('../services/garudaTravelEngine');
const brihaspati = require('../services/brihaspatiTelephonyEngine');
const indraMesh = require('../services/indraSlackMeshService');

// 1. Garuda: Travel Search & Price Alerts
router.post('/travel/search', async (req, res) => {
  try {
    const result = await garuda.searchTravelFares(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/travel/price-alert', async (req, res) => {
  try {
    const result = await garuda.registerPriceAlert(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Brihaspati: Telephony & Voice Calls
router.post('/telephony/call', async (req, res) => {
  try {
    const result = await brihaspati.initiateCallSession(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/telephony/turn', async (req, res) => {
  try {
    const result = await brihaspati.processAudioTurn(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Indra: Workspace Mesh (Slack, Discord, Teams)
router.post('/workspace/message', async (req, res) => {
  try {
    const result = await indraMesh.handleWorkspaceMessage(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/config/:platform', (req, res) => {
  try {
    const result = indraMesh.getWebhookConfig(req.params.platform);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
