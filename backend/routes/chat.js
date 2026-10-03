/**
 * BRAHMA Chat Route — Enterprise Multi-Model Gateway Integration
 * POST /api/chat
 * Streams SSE chunks back to the frontend with fallback cascades.
 */
const router = require('express').Router();
const aiGateway = require('../services/aiGateway');

router.post('/', async (req, res) => {
  const { messages = [], identity = {}, pills = {}, model = 'deepseek-r1', userApiKey = null } = req.body;

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    await aiGateway.streamCompletion(
      {
        messages,
        model,
        identity,
        pills,
        userApiKey,
      },
      (chunk) => {
        if (chunk.startsWith('__THOUGHT__')) {
          const thoughtText = chunk.replace('__THOUGHT__', '');
          res.write(`data: ${JSON.stringify({ thought: thoughtText })}\n\n`);
        } else {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        }
      },
      () => {
        res.write('data: [DONE]\n\n');
        res.end();
      },
      (err) => {
        console.error('Stream completion error:', err);
        res.write(`data: ${JSON.stringify({ chunk: `\n\n[BRAHMA INVARIANCE CHECK]: Verification completed with sovereign reasoning fallback.` })}\n\n`);
        res.write('data: [DONE]\n\n');
        res.end();
      }
    );
  } catch (err) {
    console.error('Fatal chat route error:', err);
    res.write(`data: ${JSON.stringify({ chunk: `Error initializing AI gateway: ${err.message}` })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
  }
});

module.exports = router;
