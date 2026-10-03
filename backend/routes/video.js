const express = require('express');
const router = express.Router();
const videoGeneratorEngine = require('../services/videoGeneratorEngine');

// POST /api/video/generate-short — Generate 1-click viral short (MoneyPrinterTurbo + HyperFrames)
router.post('/generate-short', async (req, res) => {
  try {
    const { prompt, durationSec = 45, voiceDeity = 'brahma', aspectRatio = '9:16' } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required for video generation' });
    const videoProject = await videoGeneratorEngine.generateShortVideo({ prompt, durationSec, voiceDeity, aspectRatio });
    res.json(videoProject);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
