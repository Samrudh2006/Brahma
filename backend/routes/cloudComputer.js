/**
 * BRAHMA Cloud Computer Routes
 * /api/cloud/* — Endpoints for managing 24/7 cloud runners, headless jobs, and templates.
 */
const express = require('express');
const router = express.Router();
const cloudComputerService = require('../services/cloudComputerService');

// GET /api/cloud/status — Live telemetry of cloud instance & environment
router.get('/status', (req, res) => {
  try {
    const telemetry = cloudComputerService.getTelemetry();
    return res.json(telemetry);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/cloud/tasks — List all background cloud jobs
router.get('/tasks', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = cloudComputerService.listTasks(limit);
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/cloud/tasks/:taskId — Get specific task status & log output
router.get('/tasks/:taskId', (req, res) => {
  try {
    const task = cloudComputerService.getTask(req.params.taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    return res.json({ success: true, task });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/cloud/tasks/dispatch — Dispatch a new background task
router.post('/tasks/dispatch', async (req, res) => {
  try {
    const { name, type, command, args, env } = req.body || {};
    const result = await cloudComputerService.dispatchTask({
      name: name || 'Autonomous Cloud Job',
      type: type || 'SHELL_COMMAND',
      command: command || 'node --version',
      args: Array.isArray(args) ? args : [],
      env: env || {}
    });
    return res.json(result);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/cloud/templates — Get 1-click cloud deploy templates
router.get('/templates', (req, res) => {
  try {
    const templates = cloudComputerService.getDeployTemplates();
    return res.json({ success: true, templates });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/cloud/heartbeat — Remote worker heartbeat sync
router.post('/heartbeat', (req, res) => {
  const { nodeName, timestamp, status } = req.body || {};
  return res.json({
    success: true,
    acknowledgedAt: new Date().toISOString(),
    node: nodeName || 'remote_cloud_worker',
    status: status || 'HEALTHY'
  });
});

module.exports = router;
