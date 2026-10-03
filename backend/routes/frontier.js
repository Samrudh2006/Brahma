const router = require('express').Router();
const ragEngine = require('../services/ragEngine');
const cudaEngine = require('../services/cudaEngine');
const visionEngine = require('../services/visionEngine');
const swarmDispatcher = require('../services/swarmDispatcher');

// POST /api/frontier/rag/search
router.post('/rag/search', async (req, res) => {
  const { query, topK = 4 } = req.body;
  if (!query) return res.status(400).json({ error: 'Query is required' });
  const results = await ragEngine.search(query, topK);
  res.json({ query, totalResults: results.length, results });
});

// POST /api/frontier/cuda/profile
router.post('/cuda/profile', (req, res) => {
  const { code, matrixDim = 4096, precision = '1.58-bit' } = req.body;
  const profile = cudaEngine.profileKernel({ code, matrixDim, precision });
  res.json(profile);
});

// POST /api/frontier/vision/analyze
router.post('/vision/analyze', async (req, res) => {
  const { base64Data, mimeType, task = 'diagram_to_code' } = req.body;
  const analysis = await visionEngine.analyzeImage({ base64Data, mimeType, task });
  res.json(analysis);
});

// POST /api/frontier/swarm/debate
router.post('/swarm/debate', async (req, res) => {
  const { query = 'AGI Architecture Validation', rounds = 3 } = req.body;
  const debate = await swarmDispatcher.runCouncilDebate({ query, rounds });
  res.json(debate);
});

module.exports = router;
