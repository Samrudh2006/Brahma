/**
 * BRAHMA Councils Route — Multi-Domain Sovereign Intelligence Councils
 * 
 * Clinical & Biomedical:
 * - POST /api/councils/dhanvantari/clinical-triage
 * - POST /api/councils/dhanvantari/pharmacogenomics
 * - GET  /api/councils/dhanvantari/demo-cases
 * 
 * Legal Governance:
 * - POST /api/councils/chanakya/legal-audit
 * - POST /api/councils/chanakya/protocols
 * 
 * Quantitative Finance:
 * - POST /api/councils/kuvera/trading-session
 * - POST /api/councils/kuvera/trade-order
 * - GET  /api/councils/kuvera/ledger
 * 
 * Industrial & Cyber Defense:
 * - POST /api/councils/vishwakarma/supply-telemetry
 * - POST /api/councils/indra/secops-triage
 * - POST /api/councils/indra/mitre-correlation
 * - GET  /api/councils/indra/benchmarks
 * - POST /api/councils/indra/benchmark-scorecard
 * 
 * Cognitive & Swarm Deliberation:
 * - POST /api/councils/saraswati/cognitive-graph
 * - POST /api/councils/dispatch
 * - GET  /api/councils/status
 * - GET  /api/councils/deliberations/topologies
 * - POST /api/councils/deliberations
 * - POST /api/councils/handoff
 * - GET  /api/councils/handoff/pending/:agentId
 * - POST /api/councils/handoff/:id/consume
 */

const router = require('express').Router();
const dhanvantari = require('../services/dhanvantariClinicalEngine');
const chanakya = require('../services/chanakyaLegalEngine');
const kuvera = require('../services/kuveraQuantEngine');
const vishwakarma = require('../services/vishwakarmaSupplyEngine');
const indra = require('../services/indraSecOpsEngine');
const saraswati = require('../services/saraswatiCognitiveEngine');
const deliberationEngine = require('../services/councilDeliberationEngine');
const handoffService = require('../services/agentHandoffService');
const voxEngine = require('../services/voxCpmVoiceEngine');
const predictionJournal = require('../services/predictionJournalService');

// ─── 1. Dhanvantari: Clinical & Pharmacogenomics ──────────────────────────────
router.post('/dhanvantari/clinical-triage', async (req, res) => {
  try {
    const result = await dhanvantari.triageClinicalCase(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/dhanvantari/pharmacogenomics', async (req, res) => {
  try {
    const result = await dhanvantari.analyzePharmacogenomics(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/dhanvantari/demo-cases', (req, res) => {
  try {
    const demoCases = dhanvantari.getBioinformaticsDemoCases();
    res.json({ success: true, count: demoCases.length, demoCases });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/dhanvantari/normalize-biomarkers', (req, res) => {
  try {
    const result = dhanvantari.normalizeHealthBiomarkers(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 2. Chanakya: Legal Intelligence & Protocols ─────────────────────────────
router.post('/chanakya/legal-audit', async (req, res) => {
  try {
    const result = await chanakya.auditContract(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/chanakya/protocols', async (req, res) => {
  try {
    const result = await chanakya.executeProtocolSuite(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 3. Kuvera: Quant Intelligence & Signed Execution ─────────────────────────
router.post('/kuvera/trading-session', (req, res) => {
  try {
    const session = kuvera.createSignedTradingSession(req.body);
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/kuvera/trade-order', async (req, res) => {
  try {
    const result = await kuvera.executeTradeOrder(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/kuvera/ledger', (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const ledger = kuvera.getTradeLedger({ limit });
    res.json({ success: true, ...ledger });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/kuvera/telemetry/:ticker', async (req, res) => {
  try {
    const telemetry = await kuvera.fetchLiveMarketTelemetry(req.params.ticker);
    res.json({ success: true, telemetry });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/kuvera/monte-carlo', (req, res) => {
  try {
    const result = kuvera.runMonteCarloSimulation(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/kuvera/broker-route', async (req, res) => {
  try {
    const result = await kuvera.routeOrderToBroker(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/kuvera/fail-closed-trade', async (req, res) => {
  try {
    const result = await kuvera.executeWithFailClosedRiskGate(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/kuvera/prediction-forecast', (req, res) => {
  try {
    const result = predictionJournal.recordForecast(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/kuvera/prediction-settle', (req, res) => {
  try {
    const { predictionId, outcome } = req.body;
    const result = predictionJournal.settleForecast(predictionId, outcome);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/kuvera/prediction-calibration', (req, res) => {
  try {
    const result = predictionJournal.getCalibrationScore();
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 4. Vishwakarma: Supply Chain Telemetry & Commercial Economics ───────────
router.post('/vishwakarma/supply-telemetry', async (req, res) => {
  try {
    const result = await vishwakarma.optimizeSupplyChain(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/vishwakarma/ecommerce-economics', (req, res) => {
  try {
    const result = vishwakarma.analyzeCommercialEcommerceUnitEconomics(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 5. Indra: SecOps & Threat Correlation ───────────────────────────────────
router.post('/indra/secops-triage', async (req, res) => {
  try {
    const result = await indra.triageSecOps(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/indra/mitre-correlation', async (req, res) => {
  try {
    const result = await indra.correlateMitreThreats(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/indra/endpoints', (req, res) => {
  try {
    const inventory = indra.discoverAgentEndpoints();
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/indra/session-triage', (req, res) => {
  try {
    const result = indra.triageAgentSession(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/indra/benchmarks', (req, res) => {
  try {
    const benchmarks = indra.listBenchmarkTargets();
    res.json(benchmarks);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/indra/benchmark-scorecard', (req, res) => {
  try {
    const result = indra.evaluateVulnerabilityAuditScorecard(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 6. VoxCPM Neural Voice & Acoustic Attention Gate ─────────────────────────
router.post('/vox/addressee-gate', (req, res) => {
  try {
    const result = voxEngine.evaluateAddresseeGate(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/vox/mark-responding', (req, res) => {
  try {
    const result = voxEngine.markResponding(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 6. Saraswati: Cognitive Knowledge Graphs ─────────────────────────────────
router.post('/saraswati/cognitive-graph', async (req, res) => {
  try {
    const result = await saraswati.buildCognitiveGraph(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 7. Unified Dispatcher & Status ──────────────────────────────────────────
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
      case 'pgx':
      case 'pharmacogenomics':
        result = await dhanvantari.analyzePharmacogenomics(payload);
        break;
      case 'legal':
      case 'chanakya':
      case 'contract':
        result = await chanakya.auditContract(payload);
        break;
      case 'quant':
      case 'kuvera':
        result = await kuvera.executeTradeOrder(payload);
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
      case 'mitre':
        result = await indra.correlateMitreThreats(payload);
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

router.get('/status', (req, res) => {
  res.json({
    success: true,
    ecosystem: 'Brahma Sovereign Intelligence Councils',
    status: 'ONLINE',
    councils: [
      { id: 'dhanvantari', name: 'Dhanvantari Clinical Council', status: 'ACTIVE', focus: 'Biomedical & Pharmacogenomics Pipeline' },
      { id: 'chanakya', name: 'Chanakya Legal Governance', status: 'ACTIVE', focus: '10 Executable Legal Protocols & Regulatory Autonomy' },
      { id: 'kuvera', name: 'Kuvera Sovereign Quant', status: 'ACTIVE', focus: 'Signed Session Limits & Paper-Before-Live Execution' },
      { id: 'vishwakarma', name: 'Vishwakarma Industrial Operations', status: 'ACTIVE', focus: 'Supply Telemetry & Inventory Optimization' },
      { id: 'indra', name: 'Indra Autonomous SecOps', status: 'ACTIVE', focus: 'Zero-Trust Shield & MITRE 3-Sum Threat Correlation' },
      { id: 'saraswati', name: 'Saraswati Cognitive Engine', status: 'ACTIVE', focus: 'Pedagogical Graphs & Curated Concept Synthesis' }
    ]
  });
});

// ─── 8. Sovereign Deliberation & Delta Context Handoff Mesh ───────────────────
router.get('/deliberations/topologies', (req, res) => {
  try {
    const topologies = deliberationEngine.listTopologies();
    res.json({ success: true, count: topologies.length, topologies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/deliberations', async (req, res) => {
  try {
    const result = await deliberationEngine.deliberate(req.body);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/handoff', (req, res) => {
  try {
    const manifest = handoffService.createHandoff(req.body);
    res.json({ success: true, manifest });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/handoff/pending/:agentId', (req, res) => {
  try {
    const pending = handoffService.listPendingHandoffs(req.params.agentId);
    res.json({ success: true, count: pending.length, pending });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/handoff/:id/consume', (req, res) => {
  try {
    const result = handoffService.consumeHandoff(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
