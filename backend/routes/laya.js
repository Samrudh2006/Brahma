/**
 * BRAHMA Laya & Jev System-1 Classification Route
 * POST /api/laya/classify
 * Returns <35ms pre-flight intent classification, council recommendation & guardrail analysis.
 */
const router = require('express').Router();
const layaJevRouter = require('../services/layaJevRouter');

router.post('/classify', (req, res) => {
  const { prompt = '', preferences = {} } = req.body;
  const decision = layaJevRouter.classify(prompt, preferences);
  return res.json(decision);
});

module.exports = router;
