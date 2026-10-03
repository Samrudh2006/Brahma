const router = require('express').Router();
const db = require('../db/database');

// GET /api/notifications
router.get('/', (req, res) => {
  const { unread } = req.query;
  const rows = unread === 'true'
    ? db.prepare('SELECT * FROM notifications WHERE is_read = 0 ORDER BY created_at DESC').all()
    : db.prepare('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50').all();
  res.json(rows);
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

// PATCH /api/notifications/read-all
router.patch('/read-all', (req, res) => {
  db.prepare('UPDATE notifications SET is_read = 1').run();
  res.json({ success: true });
});

// POST /api/notifications — create notification (internal)
router.post('/', (req, res) => {
  const { type, title, body, related_id } = req.body;
  const r = db.prepare('INSERT INTO notifications (type, title, body, related_id) VALUES (?, ?, ?, ?)')
    .run(type || 'info', title, body || '', related_id || null);
  res.status(201).json({ id: r.lastInsertRowid });
});

module.exports = router;
