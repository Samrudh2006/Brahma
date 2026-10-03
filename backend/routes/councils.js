/**
 * BRAHMA Councils Route — Multi-Domain Sovereign Intelligence Councils
 * POST /api/councils/dhanvantari/clinical-triage
 * POST /api/councils/chanakya/legal-audit
 * POST /api/councils/vishwakarma/supply-telemetry
 * POST /api/councils/indra/secops-triage
 * POST /api/councils/saraswati/cognitive-graph
 * POST /api/councils/dispatch
 * GET  /api/councils/status
 */

const router = require('express').Router();
const dhanvantari = require('../services/dhanvantariClinicalEngine');
const chanakya = require('../services/chanakyaLegalEngine');
const vishwakarma = require('../services/vishwakarmaSupplyEngine');
const indra = require('../services/indraSecOpsEngine');
const saraswati = require('../services/saraswatiCognitiveEngine');

// 1. Dhanvantari: Clinical & Biomedical Triage
router.post('/dhanvantari/clinical-triage', async (req, res) => {
  try {
    const result = await dhanvantari.triageClinicalCase(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Chanakya: Legal & Regulatory Contract Risk Audit
router.post('/chanakya/legal-audit', async (req, res) => {
  try {
    const result = await chanakya.auditContract(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Vishwakarma: Supply Chain & Industrial Operations Telemetry
router.post('/vishwakarma/supply-telemetry', async (req, res) => {
  try {
    const result = await vishwakarma.optimizeSupplyChain(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Indra: Autonomous SecOps & Threat Hunting
router.post('/indra/secops-triage', async (req, res) => {
  try {
    const result = await indra.triageSecOps(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Saraswati: Cognitive Knowledge Graphs & Pedagogical Mastery
router.post('/saraswati/cognitive-graph', async (req, res) => {
  try {
    const result = await saraswati.buildCognitiveGraph(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Dynamic Council Autonomous Dispatcher
router.post('/dispatch', async (req, res) => {
  const { domain, payload = {} } = req.body;
  try {
    let result = null;
    switch (String(domain).toLowerCase()) {
      case 'clinical':
      case 'dhanvantari':
      case 'biomedical':
        result = await dhanvantari.triageClinicalCase(payload);
        break;
      case 'legal':
      case 'chanakya':
      case 'contract':
        result = await chanakya.auditContract(payload);
        break;
      case 'supply':
      case 'vishwakarma':
      case 'operations':
        result = await vishwakarma.optimizeSupplyChain(payload);
        break;
      case 'secops':
      case 'indra':
      case 'cybersecurity':
        result = await indra.triageSecOps(payload);
        break;
      case 'cognitive':
      case 'saraswati':
      case 'learning':
        result = await saraswati.buildCognitiveGraph(payload);
        break;
      default:
        return res.status(400).json({ success: false, error: `Unknown council domain: ${domain}` });
    }
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Councils Health & Status Manifest
router.get('/status', (req, res) => {
  res.json({
    success: true,
    ecosystem: 'Brahma Sovereign Intelligence Councils',
    status: 'ONLINE',
    councils: [
      { id: 'dhanvantari', name: 'Dhanvantari Clinical Council', status: 'ACTIVE', focus: 'Biomedical & Clinical Decision Support' },
      { id: 'chanakya', name: 'Chanakya Legal Governance', status: 'ACTIVE', focus: 'Contract Risk & Regulatory Autonomy' },
      { id: 'vishwakarma', name: 'Vishwakarma Industrial Operations', status: 'ACTIVE', focus: 'Supply Telemetry & Inventory Optimization' },
      { id: 'indra', name: 'Indra Autonomous SecOps', status: 'ACTIVE', focus: 'Zero-Trust Shield & Threat Hunting' },
      { id: 'saraswati', name: 'Saraswati Cognitive Mastery', status: 'ACTIVE', focus: 'Adaptive Knowledge Graphs & Pedagogical Scaffolding' }
    ]
  });
});

module.exports = router;
