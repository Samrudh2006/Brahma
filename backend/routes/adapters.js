/**
 * BRAHMA Council Adapters Route
 * GET  /api/adapters          — List all 13 Council QLoRA LoRA Adapters
 * GET  /api/adapters/active   — Retrieve active loaded adapter
 * POST /api/adapters/swap     — Hot-swap active council adapter (<15ms)
 * GET  /api/adapters/:id/recipe — Export Unsloth/PEFT QLoRA training script
 */

const router = require('express').Router();
const councilAdapterEngine = require('../services/councilAdapterEngine');

// 1. List all 13 Council QLoRA LoRA Adapters
router.get('/', (req, res) => {
  try {
    const data = councilAdapterEngine.listAdapters();
    res.json(data);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Retrieve Active Adapter
router.get('/active', (req, res) => {
  try {
    const active = councilAdapterEngine.getActiveAdapter();
    res.json({ success: true, activeAdapter: active });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Zero-Downtime Hot-Swap Adapter
router.post('/swap', (req, res) => {
  const { councilId } = req.body;
  if (!councilId) {
    return res.status(400).json({ success: false, error: 'councilId is required for hot-swap' });
  }
  try {
    const result = councilAdapterEngine.hotSwapAdapter(councilId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// 4. Export Ready-to-Run QLoRA Training Recipe
router.get('/:councilId/recipe', (req, res) => {
  try {
    const recipe = councilAdapterEngine.exportTrainingRecipe(req.params.councilId);
    res.json(recipe);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
