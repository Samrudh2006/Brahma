const express = require('express');
const router = express.Router();
const voxCpmVoiceEngine = require('../services/voxCpmVoiceEngine');

// GET /api/voice/deities — List all 13 deity voice specifications
router.get('/deities', (req, res) => {
  res.json({
    engine: 'OpenBMB VoxCPM Neural Speech Foundation Engine',
    totalVoices: 13,
    deities: voxCpmVoiceEngine.getDeityVoices()
  });
});

// POST /api/voice/synthesize — Synthesize conversational speech
router.post('/synthesize', async (req, res) => {
  try {
    const { text, deity = 'brahma', language = 'te', speed = 1.0 } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required for voice synthesis' });
    const audio = await voxCpmVoiceEngine.synthesizeSpeech({ text, deity, language, speed });
    res.json(audio);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/voice/stream — Low-latency streaming speech chunks (<80ms first chunk)
router.post('/stream', async (req, res) => {
  try {
    const { text, deity = 'brahma', language = 'te', speed = 1.0, chunkSizeWords = 4 } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required for streaming voice synthesis' });
    const streamData = await voxCpmVoiceEngine.synthesizeStreamingSpeech({ text, deity, language, speed, chunkSizeWords });
    res.json(streamData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/voice/clone — Zero-shot clone voice from reference sample
router.post('/clone', async (req, res) => {
  try {
    const { name, referenceAudioBase64, language = 'te' } = req.body;
    if (!referenceAudioBase64) return res.status(400).json({ error: 'Reference audio base64 is required' });
    const cloned = await voxCpmVoiceEngine.cloneVoice({ name, referenceAudioBase64, language });
    res.json(cloned);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
