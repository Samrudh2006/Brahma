/**
 * BRAHMA WhatsApp Autonomous Assistant Routes
 */
const express = require('express');
const router = express.Router();
const whatsappService = require('../services/whatsappGatewayService');

// GET /api/whatsapp/status
router.get('/status', (req, res) => {
  res.json({
    gateway: 'BRAHMA WhatsApp Autonomous Voice & Action Bridge',
    version: '2.4.0',
    capabilities: [
      'Voice Note Speech-to-Action (via OpenWhisper)',
      'Calendar Event Scheduling (Google & Apple Sync)',
      'Email Drafting & Auto Dispatch',
      'Daily 8:00 AM WhatsApp Morning Briefing',
      'Fable 5.1 Real-Time Q&A'
    ],
    webhookUrl: 'http://localhost:4000/api/whatsapp/webhook',
    verifyToken: whatsappService.verifyToken,
    configured: Boolean(whatsappService.accessToken || whatsappService.twilioAccountSid)
  });
});

// GET /api/whatsapp/webhook — Meta Webhook Verification
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === whatsappService.verifyToken) {
    console.log('[WHATSAPP WEBHOOK VERIFIED]');
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// POST /api/whatsapp/webhook — Meta & Twilio Incoming Webhook
router.post('/webhook', async (req, res) => {
  try {
    // 1. Twilio Format
    if (req.body.From) {
      const from = req.body.From;
      const body = req.body.Body || '';
      const mediaUrl = req.body.MediaUrl0 || null;
      const mediaType = req.body.MediaContentType0 || null;

      const result = await whatsappService.handleIncomingMessage({
        from,
        text: body,
        mediaUrl,
        mediaType
      });

      if (result.replyMessage) {
        await whatsappService.sendWhatsAppMessage(from, result.replyMessage);
      }
      return res.status(200).send('<Response></Response>');
    }

    // 2. Meta Cloud API Format
    const entry = req.body.entry?.[0]?.changes?.[0]?.value;
    if (entry && entry.messages?.[0]) {
      const msg = entry.messages[0];
      const from = msg.from;
      const text = msg.text?.body || '';
      const isAudio = msg.type === 'audio' || msg.type === 'voice';

      const result = await whatsappService.handleIncomingMessage({
        from,
        text,
        mediaUrl: isAudio ? msg.audio?.id : null
      });

      if (result.replyMessage) {
        await whatsappService.sendWhatsAppMessage(from, result.replyMessage);
      }
    }

    res.sendStatus(200);
  } catch (err) {
    console.error('[WhatsApp Webhook Error]:', err);
    res.sendStatus(500);
  }
});

// POST /api/whatsapp/simulate — Simulate sending voice/text from bus or bike!
router.post('/simulate', async (req, res) => {
  try {
    const { prompt = 'రేపు ఉదయం 10 గంటలకు టీమ్ మీటింగ్ క్యాలెండర్‌లో పెట్టు మవా', from = '+919876543210' } = req.body;
    const result = await whatsappService.handleIncomingMessage({
      from,
      text: prompt
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/whatsapp/send-briefing — Trigger 8 AM briefing dispatch to user WhatsApp
router.post('/send-briefing', async (req, res) => {
  try {
    const { phoneNumber = '+919876543210' } = req.body;
    const actionResult = await whatsappService.executeAutonomousAction('morning briefing', phoneNumber);
    const dispatchResult = await whatsappService.sendWhatsAppMessage(phoneNumber, actionResult.replyText);

    res.json({
      success: true,
      phoneNumber,
      briefingSummary: actionResult.replyText,
      dispatch: dispatchResult
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
