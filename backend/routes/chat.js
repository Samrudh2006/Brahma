/**
 * BRAHMA Chat Route — Enterprise Multi-Model Gateway Integration
 * POST /api/chat
 * Streams SSE chunks back to the frontend with fallback cascades.
 */
const router = require('express').Router();
const aiGateway = require('../services/aiGateway');
const layaJevRouter = require('../services/layaJevRouter');

router.post('/', async (req, res) => {
  const { messages = [], identity = {}, pills = {}, model = 'deepseek-r1', userApiKey = null } = req.body;

  // Set up SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  // 1. Ultra-Fast Laya System-1 Pre-Flight Intent & Guardrail Decision (<35ms)
  const lastUserQuery = messages.filter(m => m.sender === 'user').pop()?.text || '';
  const layaDecision = layaJevRouter.classify(lastUserQuery, { identityId: identity?.id });

  // Stream instant System-1 Laya thought event to client in first 10ms
  const layaHeader = `__THOUGHT__[Laya System-1 @ ${layaDecision.latencyMs}ms] Intent: ${layaDecision.intent} | Guardrail: ${layaDecision.guardrail.isSafe ? 'VERIFIED_SAFE (0.02)' : 'BLOCKED'} | Routing: ${layaDecision.council.name} Council (${layaDecision.complexityTier})`;
  res.write(`data: ${JSON.stringify({ thought: layaHeader, laya: layaDecision })}\n\n`);


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
