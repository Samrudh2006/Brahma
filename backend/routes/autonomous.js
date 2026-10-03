/**
 * BRAHMA Autonomous Workflows API Routes
 */
const express = require('express');
const router = express.Router();
const autonomousService = require('../services/autonomousWorkflowsService');

// GET /api/autonomous/status
router.get('/status', (req, res) => {
  res.json({
    engine: 'Brahma Autonomous Cron & Workflow Agent',
    activeCrons: [
      { name: 'Daily 8:00 AM arXiv Tanglish Research Digest', time: '08:00 AM IST', status: 'ACTIVE' },
      { name: '6x 2-Min Video Storyboard Synthesizer', status: 'ACTIVE' },
      { name: 'GitHub & LinkedIn Engineering Portfolio Auditor', status: 'ACTIVE' }
    ]
  });
});

// POST /api/autonomous/morning-briefing
router.post('/morning-briefing', async (req, res) => {
  try {
    const { topic = 'artificial intelligence' } = req.body;
    const result = await autonomousService.generateMorningResearchDigest(topic);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/autonomous/video-series
router.post('/video-series', async (req, res) => {
  try {
    const { topic = 'How DeepSeek R1 Reasoning Works', targetAudience = 'Tech Founders' } = req.body;
    const result = await autonomousService.generateVideoSeries(topic, targetAudience);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/autonomous/profile-audit
router.post('/profile-audit', async (req, res) => {
  try {
    const { githubUsername = 'Samrudh2006', linkedinUrl = '' } = req.body;
    const result = await autonomousService.auditEngineerProfile(githubUsername, linkedinUrl);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
