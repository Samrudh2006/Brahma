/**
 * BRAHMA — User Experience & Product Feedback API
 * Captures 5-minute feedback popups, star ratings, bug reports, and improvement recommendations.
 */
const router = require('express').Router();
const db = require('../db/database');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const FEEDBACK_LOG_DIR = path.join(__dirname, '../data');
if (!fs.existsSync(FEEDBACK_LOG_DIR)) {
  fs.mkdirSync(FEEDBACK_LOG_DIR, { recursive: true });
}
const FEEDBACK_LOG_FILE = path.join(FEEDBACK_LOG_DIR, 'user_feedback.jsonl');

// GET /api/feedback - Retrieve all submitted feedbacks
router.get('/', (req, res) => {
  try {
    const feedbacks = db.prepare('SELECT * FROM user_feedback ORDER BY created_at DESC LIMIT 100').all();
    res.json({
      success: true,
      count: feedbacks.length,
      data: feedbacks.map(f => ({
        ...f,
        improve_regions: f.improve_regions ? JSON.parse(f.improve_regions) : [],
        broken_issues: f.broken_issues ? JSON.parse(f.broken_issues) : []
      }))
    });
  } catch (err) {
    console.error('[Feedback API] Error fetching feedback:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/feedback/summary - Aggregate analytics on ratings and issues
router.get('/summary', (req, res) => {
  try {
    const feedbacks = db.prepare('SELECT stars, improve_regions, broken_issues FROM user_feedback').all();
    if (feedbacks.length === 0) {
      return res.json({
        total_responses: 0,
        average_stars: 5.0,
        top_regions_to_improve: {},
        top_broken_issues: {}
      });
    }

    const total = feedbacks.length;
    const avgStars = (feedbacks.reduce((acc, cur) => acc + (cur.stars || 5), 0) / total).toFixed(2);
    const regionCounts = {};
    const issueCounts = {};

    feedbacks.forEach(f => {
      try {
        const regions = f.improve_regions ? JSON.parse(f.improve_regions) : [];
        regions.forEach(r => { regionCounts[r] = (regionCounts[r] || 0) + 1; });
      } catch (_) {}

      try {
        const issues = f.broken_issues ? JSON.parse(f.broken_issues) : [];
        issues.forEach(i => { issueCounts[i] = (issueCounts[i] || 0) + 1; });
      } catch (_) {}
    });

    res.json({
      success: true,
      total_responses: total,
      average_stars: parseFloat(avgStars),
      top_regions_to_improve: regionCounts,
      top_broken_issues: issueCounts
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/feedback - Save new feedback submission
router.post('/', (req, res) => {
  try {
    const {
      stars = 5,
      rating_label = 'Great Experience',
      improve_regions = [],
      broken_issues = [],
      bug_description = '',
      suggestions = '',
      user_contact = '',
      session_duration_sec = 0,
      user_agent = req.headers['user-agent'] || 'Browser'
    } = req.body;

    const id = 'fb_' + crypto.randomUUID().slice(0, 12);
    const regionsJson = JSON.stringify(Array.isArray(improve_regions) ? improve_regions : [improve_regions]);
    const issuesJson = JSON.stringify(Array.isArray(broken_issues) ? broken_issues : [broken_issues]);

    db.prepare(`
      INSERT INTO user_feedback (
        id, stars, rating_label, improve_regions, broken_issues,
        bug_description, suggestions, user_contact, session_duration_sec, user_agent
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      Math.min(5, Math.max(1, parseInt(stars, 10) || 5)),
      String(rating_label || ''),
      regionsJson,
      issuesJson,
      String(bug_description || ''),
      String(suggestions || ''),
      String(user_contact || ''),
      parseInt(session_duration_sec, 10) || 0,
      String(user_agent || '')
    );

    // Also persist append-only to disk JSONL for durability
    const logEntry = JSON.stringify({
      id,
      stars,
      rating_label,
      improve_regions,
      broken_issues,
      bug_description,
      suggestions,
      user_contact,
      session_duration_sec,
      timestamp: new Date().toISOString()
    }) + '\n';

    fs.appendFile(FEEDBACK_LOG_FILE, logEntry, () => {});

    // Create a high-priority notification in BRAHMA Notifications table so developers/users see feedback was captured
    try {
      db.prepare(`
        INSERT INTO notifications (type, title, body)
        VALUES (?, ?, ?)
      `).run(
        'feedback',
        `🙏 Feedback Received (${stars}⭐ - ${rating_label})`,
        `Feedback ${id} submitted. Areas for improvement: ${Array.isArray(improve_regions) ? improve_regions.slice(0, 2).join(', ') : 'None'}. Suggestions logged to Sovereign Ledger.`
      );
    } catch (_) {}

    console.log(`[Feedback] 🌟 New feedback logged: ${stars} Stars from ${user_contact || 'Anonymous'} (${id})`);

    res.status(201).json({
      success: true,
      message: 'Dhanyavadah! Your feedback has been recorded into the sovereign ledger.',
      id
    });
  } catch (err) {
    console.error('[Feedback API] Submission error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
