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

// ─── Sovereign Plan Ledger Endpoints (Markdown Checklist Architecture) ────────
const planLedger = require('../services/planLedgerService');

// GET /api/tasks/plans — List all structured plans
router.get('/plans/all', (req, res) => {
  try {
    const plans = planLedger.listPlans();
    res.json({ success: true, count: plans.length, plans });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tasks/plans — Create structured markdown plan
router.post('/plans', (req, res) => {
  try {
    const { slug, title, objective, invariants, checklist } = req.body;
    const result = planLedger.createPlan(slug, { title, objective, invariants, checklist });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/tasks/plans/:slug — Read plan & checklist progress
router.get('/plans/:slug', (req, res) => {
  try {
    const result = planLedger.getPlan(req.params.slug);
    if (!result.success) return res.status(404).json(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/tasks/plans/:slug/checklist — Update checklist item
router.patch('/plans/:slug/checklist', (req, res) => {
  try {
    const { itemIndex, isCompleted } = req.body;
    const result = planLedger.updateChecklistItem(req.params.slug, itemIndex, isCompleted);
    res.json({ success: true, plan: result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/tasks/plans/:slug/verify — Oracle completion verification
router.get('/plans/:slug/verify', (req, res) => {
  try {
    const result = planLedger.verifyPlanCompletion(req.params.slug);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tasks/plans/:slug/refine — Multi-pass iterative plan critique
const planRefiner = require('../services/planRefinerService');
router.post('/plans/:slug/refine', async (req, res) => {
  try {
    const { reviewRounds } = req.body;
    const result = await planRefiner.refinePlan(req.params.slug, { reviewRounds });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Evidence-First Task Verification Endpoints ──────────────────────────────
const evidenceVerification = require('../services/evidenceVerificationService');

// POST /api/tasks/evidence — Record and seal evidence receipt
router.post('/evidence', async (req, res) => {
  try {
    const result = await evidenceVerification.recordEvidence(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/tasks/evidence — List all verified evidence receipts
router.get('/evidence/all', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const receipts = evidenceVerification.listEvidence({ limit });
    res.json({ success: true, count: receipts.length, receipts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/tasks/evidence/:taskId — Fetch evidence receipt by task ID
router.get('/evidence/:taskId', (req, res) => {
  try {
    const evidence = evidenceVerification.getEvidence(req.params.taskId);
    if (!evidence) {
      return res.status(404).json({ success: false, error: 'Evidence bundle not found' });
    }
    res.json({ success: true, evidence });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── AI-DLC Sovereign Task DAG Endpoints ─────────────────────────────────────
// POST /api/tasks/dag — Compile, topologically sort, and validate Task DAG
router.post('/dag', (req, res) => {
  try {
    const { tasks } = req.body;
    const result = planLedger.createTaskDAG(tasks);
    if (!result.success) return res.status(400).json(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tasks/dag/execute — Execute compiled DAG across parallel stages
router.post('/dag/execute', async (req, res) => {
  try {
    const { dag } = req.body;
    const result = await planLedger.executeDAG(dag);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
