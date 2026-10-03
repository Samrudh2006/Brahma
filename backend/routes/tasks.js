const router = require('express').Router();
const db = require('../db/database');
const crypto = require('crypto');

// GET /api/tasks
router.get('/', (req, res) => {
  const tasks = db.prepare('SELECT * FROM scheduled_tasks ORDER BY created_at DESC').all();
  res.json(tasks);
});

// POST /api/tasks
router.post('/', (req, res) => {
  const { name, prompt, identity_id, schedule, run_at } = req.body;
  const id = crypto.randomUUID();
  db.prepare('INSERT INTO scheduled_tasks (id, name, prompt, identity_id, schedule, run_at) VALUES (?, ?, ?, ?, ?, ?)')
    .run(id, name, prompt, identity_id || 'brahma', schedule || 'once', run_at || null);
  res.status(201).json({ id });
});

// PATCH /api/tasks/:id/status
router.patch('/:id/status', (req, res) => {
  const { status, last_result } = req.body;
  db.prepare('UPDATE scheduled_tasks SET status = ?, last_result = ? WHERE id = ?')
    .run(status, last_result || null, req.params.id);
  res.json({ success: true });
});

// DELETE /api/tasks/:id
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM scheduled_tasks WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
