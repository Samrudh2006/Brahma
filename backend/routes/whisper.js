/**
 * BRAHMA OpenWhisper Audio Transcription Routes
 * Endpoints:
 * - POST /api/whisper/transcribe (Upload audio file or base64 audio payload)
 * - GET  /api/whisper/status (Check active Whisper neural models)
 */
const express = require('express');
const router = express.Router();
const multer = require('multer');
const whisperService = require('../services/whisperService');

// Memory storage for fast streaming without saving to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 } // 25MB max audio
});

// GET /api/whisper/status — Check health and active Whisper tiers
router.get('/status', (req, res) => {
  const hasGroq = Boolean(process.env.GROQ_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);
  const hasHf = Boolean(process.env.HF_API_TOKEN);

  res.json({
    engine: 'OpenWhisper Sovereign STT Engine',
    version: '3.0.0',
    availableTiers: [
      { name: 'Groq Whisper-Large-v3-Turbo', latency: '~120ms', active: hasGroq, quality: 'Supreme' },
      { name: 'OpenAI Whisper-1', latency: '~800ms', active: hasOpenAI, quality: 'Standard' },
      { name: 'HuggingFace Whisper-Large-v3', latency: '~1200ms', active: hasHf, quality: 'Open-Source' },
      { name: 'In-Browser WebSpeech Continuous VAD', latency: '0ms', active: true, quality: 'Local Native' }
    ],
    recommendedModel: hasGroq ? 'Groq Whisper-Large-v3-Turbo' : 'In-Browser WebSpeech VAD'
  });
});

// POST /api/whisper/transcribe — Transcribe audio (multipart/form-data or JSON base64)
router.post('/transcribe', upload.single('audio'), async (req, res) => {
  try {
    let audioBuffer = null;
    let mimeType = 'audio/webm';
    let { language = 'te', prompt = '', userApiKey = null } = req.body;

    // Option A: Multipart file upload
    if (req.file && req.file.buffer) {
      audioBuffer = req.file.buffer;
      mimeType = req.file.mimetype || 'audio/webm';
    } 
    // Option B: JSON payload with base64 audio
    else if (req.body.audioBase64) {
      const base64Data = req.body.audioBase64.replace(/^data:audio\/\w+;base64,/, '');
      audioBuffer = Buffer.from(base64Data, 'base64');
      mimeType = req.body.mimeType || 'audio/webm';
    }

    if (!audioBuffer || audioBuffer.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No audio data received. Provide a file in field "audio" or a base64 string in "audioBase64".'
      });
    }

    const result = await whisperService.transcribe(audioBuffer, {
      language,
      prompt,
      userApiKey,
      mimeType
    });

    res.json(result);
  } catch (err) {
    console.error('[Whisper Route Error]:', err);
    res.status(500).json({
      success: false,
      error: err.message,
      fallbackToWebSpeech: true
    });
  }
});

module.exports = router;
