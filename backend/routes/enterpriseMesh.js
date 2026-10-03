/**
 * BRAHMA Enterprise Mesh Route
 * POST /api/mesh/travel/search
 * POST /api/mesh/travel/price-alert
 * POST /api/mesh/telephony/call
 * POST /api/mesh/telephony/turn
 * POST /api/mesh/workspace/message
 * GET  /api/mesh/config/:platform
 */

const router = require('express').Router();
const garuda = require('../services/garudaTravelEngine');
const brihaspati = require('../services/brihaspatiTelephonyEngine');
const indraMesh = require('../services/indraSlackMeshService');

// 1. Garuda: Travel Search & Price Alerts
router.post('/travel/search', async (req, res) => {
  try {
    const result = await garuda.searchTravelFares(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/travel/price-alert', async (req, res) => {
  try {
    const result = await garuda.registerPriceAlert(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. Brihaspati: Telephony & Voice Calls
router.post('/telephony/call', async (req, res) => {
  try {
    const result = await brihaspati.initiateCallSession(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/telephony/turn', async (req, res) => {
  try {
    const result = await brihaspati.processAudioTurn(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Indra: Workspace Mesh (Slack, Discord, Teams)
router.post('/workspace/message', async (req, res) => {
  try {
    const result = await indraMesh.handleWorkspaceMessage(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/config/:platform', (req, res) => {
  try {
    const result = indraMesh.getWebhookConfig(req.params.platform);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 4. Sovereign Multi-Agent Identity & Communication Mesh ───────────────────
const agentIdentityService = require('../services/agentIdentityService');

// GET /api/mesh/identities — List all active sovereign agent identities
router.get('/identities', (req, res) => {
  try {
    const identities = agentIdentityService.listIdentities();
    res.json({
      success: true,
      infrastructure: 'Brahma Sovereign Multi-Agent Communication Mesh',
      count: identities.length,
      identities
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mesh/identities — Spawn a new autonomous agent identity
router.post('/identities', (req, res) => {
  try {
    const created = agentIdentityService.createIdentity(req.body);
    res.json({ success: true, identity: created });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/mesh/identities/:agentId — Get identity details
router.get('/identities/:agentId', (req, res) => {
  try {
    const identity = agentIdentityService.getIdentity(req.params.agentId);
    if (!identity) return res.status(404).json({ success: false, error: 'Agent identity not found' });
    res.json({ success: true, identity });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/mesh/identities/:agentId/mailbox — Get complete mailbox
router.get('/identities/:agentId/mailbox', (req, res) => {
  try {
    const mailbox = agentIdentityService.getMailbox(req.params.agentId);
    res.json({ success: true, ...mailbox });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// POST /api/mesh/identities/:agentId/mailbox/receive — Inbound email receiver
router.post('/identities/:agentId/mailbox/receive', async (req, res) => {
  try {
    const result = await agentIdentityService.receiveEmail(req.params.agentId, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mesh/identities/:agentId/mailbox/send — Outbound email dispatcher
router.post('/identities/:agentId/mailbox/send', async (req, res) => {
  try {
    const result = await agentIdentityService.sendEmail(req.params.agentId, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mesh/identities/:agentId/sms/receive — Inbound SMS receiver with auto-OTP extraction
router.post('/identities/:agentId/sms/receive', (req, res) => {
  try {
    const result = agentIdentityService.receiveSms(req.params.agentId, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mesh/identities/:agentId/sms/send — Outbound SMS
router.post('/identities/:agentId/sms/send', (req, res) => {
  try {
    const result = agentIdentityService.sendSms(req.params.agentId, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/mesh/identities/:agentId/otp — Get latest valid OTP for autonomous 2FA
router.get('/identities/:agentId/otp', (req, res) => {
  try {
    const result = agentIdentityService.getLatestOtp(req.params.agentId);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// POST /api/mesh/identities/:agentId/vault — Store secret in encrypted vault
router.post('/identities/:agentId/vault', (req, res) => {
  try {
    const { key, value, ttlMs, notes } = req.body;
    const result = agentIdentityService.vaultStore(req.params.agentId, key, value, { ttlMs, notes });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/mesh/identities/:agentId/vault — List secrets (masked)
router.get('/identities/:agentId/vault', (req, res) => {
  try {
    const result = agentIdentityService.vaultList(req.params.agentId);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

// POST /api/mesh/identities/:agentId/vault/reveal — Reveal single secret
router.post('/identities/:agentId/vault/reveal', (req, res) => {
  try {
    const { key } = req.body;
    const result = agentIdentityService.vaultRetrieve(req.params.agentId, key);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/mesh/identities/:agentId/vault/:key — Purge secret
router.delete('/api/mesh/identities/:agentId/vault/:key', (req, res) => {
  try {
    const result = agentIdentityService.vaultDelete(req.params.agentId, req.params.key);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mesh/identities/:agentId/tunnel/webhook — Public tunnel webhook ingress
router.post('/identities/:agentId/tunnel/webhook', (req, res) => {
  try {
    const result = agentIdentityService.handleWebhook(req.params.agentId, {
      topic: req.headers['x-webhook-topic'] || req.body.topic || 'webhook_trigger',
      payload: req.body,
      signature: req.headers['x-signature'] || '',
      sourceIp: req.ip || req.connection.remoteAddress
    });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 5. Zero-Hop In-Memory Hybrid Retrieval Engine ───────────────────────────
const hybridRetrieval = require('../services/hybridRetrievalEngine');

// POST /api/mesh/retrieval/search — Hybrid BM25 + Vector In-Memory Search (<2ms)
router.post('/retrieval/search', (req, res) => {
  try {
    const { query, topK, alpha, filter } = req.body;
    if (!query) return res.status(400).json({ success: false, error: 'query is required' });
    const result = hybridRetrieval.search(query, { topK, alpha, filter });
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mesh/retrieval/index — Index document into in-memory store
router.post('/retrieval/index', (req, res) => {
  try {
    const { id, text, metadata } = req.body;
    const result = hybridRetrieval.indexDocument({ id, text, metadata });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 6. Sovereign Change Request & Reviewable Diffs Mesh ─────────────────────
const changeRequestService = require('../services/changeRequestService');

// POST /api/mesh/change-requests — Create reviewable change request
router.post('/change-requests', (req, res) => {
  try {
    const result = changeRequestService.createChangeRequest(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/mesh/change-requests — List change requests
router.get('/change-requests', (req, res) => {
  try {
    const { status, limit } = req.query;
    const requests = changeRequestService.listChangeRequests({ status, limit: parseInt(limit, 10) || 50 });
    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/mesh/change-requests/:id — Fetch single change request
router.get('/change-requests/:id', (req, res) => {
  try {
    const cr = changeRequestService.getChangeRequest(req.params.id);
    if (!cr) return res.status(404).json({ success: false, error: 'Change request not found' });
    res.json({ success: true, changeRequest: cr });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mesh/change-requests/:id/approve — Approve & commit diffs
router.post('/change-requests/:id/approve', (req, res) => {
  try {
    const result = changeRequestService.approveChangeRequest(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mesh/change-requests/:id/reject — Reject change request
router.post('/change-requests/:id/reject', (req, res) => {
  try {
    const result = changeRequestService.rejectChangeRequest(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 7. Sovereign Citation Grounding & Scholarly Provenance ──────────────────
const citationGrounding = require('../services/citationGroundingService');

// POST /api/mesh/citations/verify — Multi-registry DOI consensus check
router.post('/citations/verify', (req, res) => {
  try {
    const { citations, minConsensusRegistries } = req.body;
    const result = citationGrounding.verifyCitations(citations, { minConsensusRegistries });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 8. Indic Linguistic Hygiene & Executive Communication ───────────────────
const linguisticHygiene = require('../services/indicLinguisticHygieneEngine');

// POST /api/mesh/linguistic/sanitize — Strip AI slop & archaic bureaucratic jargon
router.post('/linguistic/sanitize', (req, res) => {
  try {
    const { text } = req.body;
    const result = linguisticHygiene.sanitizeText(text);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 9. Hermetic Trace-to-Fixture CI Replay Engine ───────────────────────────
const traceReplay = require('../services/hermeticTraceReplayService');

// POST /api/mesh/fixtures/freeze — Freeze production trace into offline fixture
router.post('/fixtures/freeze', (req, res) => {
  try {
    const result = traceReplay.freezeTraceFixture(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mesh/fixtures/replay — Replay hermetic test fixture offline
router.post('/fixtures/replay', (req, res) => {
  try {
    const { fixture, fixtureId } = req.body;
    const result = traceReplay.replayFixture(fixture || fixtureId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 10. Progressive Skill Registry & Dynamic On-Demand Hydration ─────────────
const progressiveSkills = require('../services/progressiveSkillRegistry');

// GET /api/mesh/skills/catalog — Tier 1 compact catalog index (saves 70% tokens)
router.get('/skills/catalog', (req, res) => {
  try {
    const { category } = req.query;
    const result = progressiveSkills.getCatalogIndex({ category });
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/mesh/skills/:id/hydrate — Tier 2 full operational schema hydration
router.get('/skills/:id/hydrate', (req, res) => {
  try {
    const result = progressiveSkills.hydrateSkill(req.params.id);
    if (!result.success) return res.status(404).json(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 11. Sovereign Default-Deny Approval Gate & HMAC Tickets ──────────────────
const approvalGate = require('../services/sovereignApprovalGate');

// POST /api/mesh/approval/ticket — Issue expiring HMAC approval ticket
router.post('/approval/ticket', (req, res) => {
  try {
    const result = approvalGate.issueApprovalTicket(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/mesh/approval/verify — Verify and consume approval ticket
router.post('/approval/verify', (req, res) => {
  try {
    const { ticket, payload } = req.body;
    const result = approvalGate.verifyAndConsumeTicket(ticket, payload);
    if (!result.success) return res.status(403).json(result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 12. Adversarial Identity & DriftLock Probe Engine ────────────────────────
const driftProbe = require('../services/adversarialDriftProbeService');

// POST /api/mesh/drift/probe — Evaluate agent against multi-turn adversarial stress
router.post('/drift/probe', (req, res) => {
  try {
    const result = driftProbe.evaluateAgentDrift(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 13. Cryptographic Hash-Chained Audit Ledger ─────────────────────────────
const auditLedger = require('../services/hashChainedAuditLedger');

// POST /api/mesh/ledger/append — Append action to immutable hash chain
router.post('/ledger/append', (req, res) => {
  try {
    const result = auditLedger.appendEntry(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/mesh/ledger/verify — Cryptographically verify entire chain integrity
router.get('/ledger/verify', (req, res) => {
  try {
    const result = auditLedger.verifyChainIntegrity();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 14. Brahma ServiceOps (Personal & Local Services) ────────────────────────
const serviceOps = require('../services/brahmaServiceOpsEngine');

router.post('/serviceops/booking', (req, res) => {
  try {
    const result = serviceOps.allocateServiceSlot(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/serviceops/consumption', (req, res) => {
  try {
    const result = serviceOps.calculateTreatmentConsumption(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/serviceops/pricing', (req, res) => {
  try {
    const result = serviceOps.calculateDynamicPrice(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 15. Brahma Agronomy & Rural Intelligence ─────────────────────────────────
const agronomy = require('../services/brahmaAgronomyEngine');

router.post('/agronomy/npk', (req, res) => {
  try {
    const result = agronomy.calculateNPKDosage(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/agronomy/irrigation', (req, res) => {
  try {
    const result = agronomy.calculateIrrigationSchedule(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/agronomy/mandi-spread', (req, res) => {
  try {
    const result = agronomy.analyzeMandiPrices(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 16. Brahma Civil & Structural Engineering ────────────────────────────────
const civilEngine = require('../services/brahmaCivilEngine');

router.post('/civil/is456-design', (req, res) => {
  try {
    const result = civilEngine.designRCSinglyReinforcedBeam(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/civil/cpm-schedule', (req, res) => {
  try {
    const result = civilEngine.calculateCPMSchedule(req.body.tasks);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/civil/concrete-bom', (req, res) => {
  try {
    const result = civilEngine.estimateConcreteMixBOM(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 17. Brahma Fleet Logistics & Transportation ──────────────────────────────
const fleetLogistics = require('../services/brahmaFleetLogisticsEngine');

router.post('/fleet/dispatch', (req, res) => {
  try {
    const result = fleetLogistics.evaluateDispatchPlan(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/fleet/hos-compliance', (req, res) => {
  try {
    const result = fleetLogistics.verifyHOSCompliance(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/fleet/fuel-burn', (req, res) => {
  try {
    const result = fleetLogistics.calculateTonneKmFuelBurn(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 18. Brahma Public Administration & Government Operations ─────────────────
const publicAdmin = require('../services/brahmaPublicAdminEngine');

router.post('/publicadmin/rti-draft', (req, res) => {
  try {
    const result = publicAdmin.generateRTIApplication(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/publicadmin/tender-compliance', (req, res) => {
  try {
    const result = publicAdmin.evaluateTenderCompliance(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/publicadmin/grievance', (req, res) => {
  try {
    const result = publicAdmin.classifyCitizenGrievance(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 19. Brahma Creative Media & NLE Audio/Video Engine ───────────────────────
const creativeMedia = require('../services/brahmaCreativeMediaEngine');

router.post('/media/edl-compile', (req, res) => {
  try {
    const result = creativeMedia.compileEDLSequence(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/media/subtitles', (req, res) => {
  try {
    const result = creativeMedia.generateSubtitles(req.body.cues);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/media/loudness', (req, res) => {
  try {
    const result = creativeMedia.calculateLoudnessNormalization(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/media/color-gamut', (req, res) => {
  try {
    const result = creativeMedia.transformColorGamut(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 20. Brahma Hospitality & Food Service HACCP Engine ───────────────────────
const hospitalityHaccp = require('../services/brahmaHospitalityHaccpEngine');

router.post('/hospitality/ccp-audit', (req, res) => {
  try {
    const result = hospitalityHaccp.auditThermalCCPLog(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/hospitality/recipe-scale', (req, res) => {
  try {
    const result = hospitalityHaccp.scaleRecipe(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/hospitality/revpash', (req, res) => {
  try {
    const result = hospitalityHaccp.calculateRevPASH(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 21. Brahma Dimensional Analysis & Frontier Science Engine ────────────────
const dimensionalAnalysis = require('../services/brahmaDimensionalAnalysisEngine');

router.post('/science/dimension-check', (req, res) => {
  try {
    const { lhs, rhs } = req.body;
    if (!lhs || !rhs) {
      return res.status(400).json({ success: false, error: 'Both lhs and rhs 7-element dimension vectors are required.' });
    }
    const result = dimensionalAnalysis.verifyDimensionalHomogeneity(lhs, rhs);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/science/dimensionless-numbers', (req, res) => {
  try {
    const result = dimensionalAnalysis.calculateDimensionlessNumbers(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/science/lean4-proof', (req, res) => {
  try {
    const result = dimensionalAnalysis.generateLean4ProofScaffold(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 22. Brahma SMT Formal Verification Engine ───────────────────────────────
const smtProver = require('../services/brahmaSmtVerificationEngine');

router.post('/smt/solve-sat', (req, res) => {
  try {
    const result = smtProver.solvePropositionalCNF(req.body.clauses || []);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/smt/verify-lra', (req, res) => {
  try {
    const result = smtProver.verifyLinearRealInequalities(req.body.inequalities || []);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/smt/verify-temporal-order', (req, res) => {
  try {
    const result = smtProver.verifyTemporalDifferenceLogic(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/smt/prove-safety', (req, res) => {
  try {
    const result = smtProver.proveStateSafety(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 23. Brahma Chaos Resilience & Self-Healing Engine ───────────────────────
const chaosResilience = require('../services/brahmaChaosResilienceEngine');

router.post('/chaos/snapshot', (req, res) => {
  try {
    const result = chaosResilience.captureConsistentSnapshot(req.body.state || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/chaos/restore/:id', (req, res) => {
  try {
    const result = chaosResilience.restoreSnapshot(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/chaos/inject', async (req, res) => {
  try {
    const result = await chaosResilience.injectChaosExperiment(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/chaos/circuit-health/:subsystem', (req, res) => {
  try {
    const result = chaosResilience.evaluateCircuitHealth(req.params.subsystem);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 24. Brahma BIM Computational Geometry Engine ───────────────────────────
const bimGeometry = require('../services/brahmaBimGeometryEngine');

router.post('/bim/convex-hull', (req, res) => {
  try {
    const result = bimGeometry.calculateConvexHull(req.body.points || []);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/bim/line-collision', (req, res) => {
  try {
    const result = bimGeometry.checkLineIntersection(req.body.seg1, req.body.seg2);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/bim/ifc-inspect', (req, res) => {
  try {
    const result = bimGeometry.inspectIfcModelElements(req.body.elements || []);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/bim/zoning-setbacks', (req, res) => {
  try {
    const result = bimGeometry.auditZoningSetbacks(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 25. Indra Purple Team Adversary Simulator ───────────────────────────────
const adversarySimulator = require('../services/indraAdversarySimulator');

router.post('/adversary/run-campaign', (req, res) => {
  try {
    const result = adversarySimulator.runAdversaryCampaign(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/adversary/cvss4-score', (req, res) => {
  try {
    const result = adversarySimulator.calculateCVSSv4(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 26. Statutory Taxation, GST E-Invoicing & Benford Audit ──────────────────
const statutoryTax = require('../services/brahmaStatutoryTaxEngine');

router.post('/tax/gst-invoice', (req, res) => {
  try {
    const result = statutoryTax.generateGSTEInvoicePayload(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/tax/benford-audit', (req, res) => {
  try {
    const result = statutoryTax.auditExpenseLedgerBenford(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/tax/tds-calculate', (req, res) => {
  try {
    const result = statutoryTax.calculateTDS(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 27. P2P Edge CRDT Mesh State Replication ────────────────────────────────
const edgeMeshSync = require('../services/brahmaEdgeMeshSync');

router.post('/edge/add', (req, res) => {
  try {
    const result = edgeMeshSync.addElement(req.body.element, req.body.timestamp);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/edge/remove', (req, res) => {
  try {
    const result = edgeMeshSync.removeElement(req.body.element, req.body.timestamp);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/edge/state', (req, res) => {
  try {
    const result = edgeMeshSync.readActiveState();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/edge/merge', (req, res) => {
  try {
    const result = edgeMeshSync.mergeRemotePeerState(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 28. Advanced Multi-Domain Frontier Engines ──────────────────────────────
const microstructure = require('../services/kuveraMicrostructureEngine');
const regulatoryDossier = require('../services/dhanvantariRegulatoryDossier');
const voxDsp = require('../services/voxDspAudioPipeline');
const satelliteAgro = require('../services/brahmaSatelliteAgroEngine');
const continuousGrc = require('../services/brahmaContinuousGrcEngine');
const sweRefactor = require('../services/brahmaSweRefactorEngine');
const zkProof = require('../services/brahmaZkProofEngine');
const digitalTwin = require('../services/vishwakarmaDigitalTwin');
const metaOrchestrator = require('../services/brahmaMetaOrchestrator');

router.post('/hft/limit-order', (req, res) => {
  try {
    const result = microstructure.submitLimitOrder(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/samd/510k-dossier', (req, res) => {
  try {
    const result = regulatoryDossier.generateFDA510kDossier(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/dsp/spectral-filter', (req, res) => {
  try {
    const result = voxDsp.processSpectralNoiseSuppression(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/agro/satellite-ndvi', (req, res) => {
  try {
    const result = satelliteAgro.calculateNDVI(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/grc/soc2-status', (req, res) => {
  try {
    const result = continuousGrc.evaluateSOC2Compliance(req.query || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/swe/code-metrics', (req, res) => {
  try {
    const result = sweRefactor.analyzeCodeMetrics(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/zk/quorum-proof', (req, res) => {
  try {
    const result = zkProof.proveConfidentialCouncilConsensus(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/twin/simulate-supply', (req, res) => {
  try {
    const result = digitalTwin.simulateDiscreteEventSupplyChain(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/meta/singularity-status', (req, res) => {
  try {
    const result = metaOrchestrator.evaluateSingularityConvergence();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/meta/borda-consensus', (req, res) => {
  try {
    const result = metaOrchestrator.executeBordaCountConsensus(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 29. Post-Quantum Cryptography & Smart Contract Security ─────────────────
const pqcCrypto = require('../services/brahmaPqcCryptoEngine');
const smartContracts = require('../services/brahmaSmartContractEngine');

router.post('/pqc/generate-keypair', (req, res) => {
  try {
    const result = pqcCrypto.generateMLKEMKeyPair(req.body && req.body.keyId);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/smartcontract/audit', (req, res) => {
  try {
    const result = smartContracts.auditContractCode(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 30. CBO Query Optimizer & Neuromorphic Energy Compute ───────────────────
const cboOptimizer = require('../services/brahmaCboQueryOptimizer');
const neuromorphicCompute = require('../services/brahmaNeuromorphicComputeEngine');

router.post('/cbo/optimize-joins', (req, res) => {
  try {
    const result = cboOptimizer.optimizeJoinOrder(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/compute/carbon-profile', (req, res) => {
  try {
    const result = neuromorphicCompute.profileWorkloadEnergy(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 31. Spatial LiDAR SLAM & Clinical Genomics Splicing ─────────────────────
const spatialSlam = require('../services/brahmaSpatialSlamEngine');
const dhanvantariGenomics = require('../services/dhanvantariGenomicsEngine');

router.post('/spatial/icp-align', (req, res) => {
  try {
    const result = spatialSlam.alignPointCloudsICP(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/genomics/prs-score', (req, res) => {
  try {
    const result = dhanvantariGenomics.calculatePolygenicRiskScore(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 32. Scientific Symbolic Discovery & Macro Central Bank DSGE ─────────────
const scientificDiscovery = require('../services/brahmaScientificDiscoveryEngine');
const macroDsge = require('../services/kuveraMacroDsgeEngine');

router.post('/science/discover-law', (req, res) => {
  try {
    const result = scientificDiscovery.discoverSymbolicLaw(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/macro/taylor-rule', (req, res) => {
  try {
    const result = macroDsge.calculateTaylorRuleRate(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 33. Radar InSAR Disasters & Clean-Energy Smart Grid OPF ──────────────────
const disasterRadar = require('../services/brahmaDisasterRadarEngine');
const smartGridOpf = require('../services/brahmaSmartGridOpfEngine');

router.post('/radar/insar-displacement', (req, res) => {
  try {
    const result = disasterRadar.calculateInSARDisplacement(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/smartgrid/ac-powerflow', (req, res) => {
  try {
    const result = smartGridOpf.solveACPowerFlow(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 34. Neuro-Symbolic Logic & Geodesic Maritime AIS ────────────────────────
const neuroSymbolic = require('../services/brahmaNeuroSymbolicEngine');
const maritimeAis = require('../services/brahmaMaritimeAisEngine');

router.post('/neurosymbolic/query', (req, res) => {
  try {
    const result = neuroSymbolic.evaluatePredicateQuery(req.body && req.body.query);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/maritime/geodesic-voyage', (req, res) => {
  try {
    const result = maritimeAis.calculateGeodesicVoyage(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 35. Silicon RTL Verilog, Game Theory VCG & Planetary Constitution ────────
const siliconRtl = require('../services/brahmaSiliconRtlEngine');
const gameTheory = require('../services/brahmaGameTheoryEngine');
const planetaryConstitution = require('../services/brahmaPlanetaryConstitutionEngine');

router.post('/silicon/static-timing', (req, res) => {
  try {
    const result = siliconRtl.verifyStaticTimingSlack(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/gametheory/vcg-auction', (req, res) => {
  try {
    const result = gameTheory.solveVCGAuction(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/constitution/audit-action', (req, res) => {
  try {
    const result = planetaryConstitution.auditConstitutionalCompliance(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── 36. Breakthrough Proto-AGI Intelligence Transcendence Mesh ───────────────
const toolSynth = require('../services/brahmaAutonomousToolSynthesizer');
const mctsReasoning = require('../services/brahmaMctsReasoningEngine');
const analogicalTransfer = require('../services/brahmaAnalogicalTransferEngine');
const repEPlasticity = require('../services/brahmaRepEPlasticityEngine');
const grammarDiscovery = require('../services/brahmaGrammarSymbolicDiscovery');
const selfPlayArena = require('../services/brahmaSelfPlayArenaEngine');

router.post('/transcendence/synthesize-tool', (req, res) => {
  try {
    const result = toolSynth.synthesizeAndRegisterTool(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/transcendence/mcts-explore', (req, res) => {
  try {
    const result = mctsReasoning.exploreReasoningTree(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/transcendence/analogical-transfer', (req, res) => {
  try {
    const result = analogicalTransfer.transferAnalogicalPrinciple(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/transcendence/repe-steer', (req, res) => {
  try {
    const result = repEPlasticity.applyActivationSteering(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/transcendence/grammar-discover', (req, res) => {
  try {
    const result = grammarDiscovery.discoverEquationFromDataset(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/transcendence/selfplay-duel', (req, res) => {
  try {
    const result = selfPlayArena.runAdversarialSelfPlayDuel(req.body || {});
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
