# BRAHMA Sovereign Domain Mesh Upgrade Plan

## 1. Objectives & Architectural Invariants
- Integrate best-in-class autonomous domain workflows into BRAHMA councils without any third-party/external branding.
- Zero route orphans: all route files must be mounted in `backend/server.js`.
- Oracle verification: 100% test pass rate in `tests/comprehensive_test_suite.cjs` (40/40 passed).
- Vanilla CSS & luxury Sanskrit theme compatibility.
- Zero UI clutter: all upgrades implemented at the sovereign service, middleware, and API mesh levels.

---

## 2. Phase 1 Checklist (Completed)

- [x] **1. Dhanvantari Biomedical & Pharmacogenomics Pipeline**
  - [x] Add genomic variant annotation & metabolizer phenotype classification (CYP2D6, CYP2C19, TPMT, DPYD, BRCA1, EGFR).
  - [x] Add drug-gene interaction profiling and dosage adjustment recommendation engine.
  - [x] Implement SHA-256 reproducible run manifest bundles (replay commands, environment hashes, demo dataset).

- [x] **2. Kuvera Quant Alpha Engine Baseline**
  - [x] Clean up any legacy external references in headers/comments.
  - [x] Implement Signed Session Risk Limits (max notional, leverage cap, drawdown limit, asset allowlist).
  - [x] Implement strict Paper-Before-Live policy gating.
  - [x] Build auditable execution ledger with HMAC-SHA256 trade receipts in `.brahma/ledger/`.

- [x] **3. Chanakya Sovereign Legal Governance Protocols**
  - [x] Implement 10 executable legal protocols (Intake, Statutory Provenance, Clause Parsing, Liability Scoring, Regulatory Compliance, Redlining, Ambiguity Detection, Negotiation Playbook, Pre-Flight Gate, Executive Diagnostic).
  - [x] Provide structured JSON & Markdown report generation.

- [x] **4. Indra SecOps Threat Defense Matrix**
  - [x] Enforce read-only investigation posture by default.
  - [x] Implement MITRE ATT&CK 3-Sum Threat Correlation Engine (Initial Access + Execution + Persistence/Impact).
  - [x] Output structured incident evidence packs.

- [x] **5. Evidence-First Verification Loop Service**
  - [x] Create `backend/services/evidenceVerificationService.js` to enforce proof-of-work receipts in `.brahma/evidence/`.
  - [x] Provide automatic verification command rerun before declaring task completion.

- [x] **6. Council Routes Integration & Verification**
  - [x] Connect new capabilities into `backend/routes/councils.js` and `backend/routes/tasks.js`.
  - [x] 33/33 tests passed in `tests/comprehensive_test_suite.cjs`.

---

## 3. Phase 2 Checklist: Kuvera Quant Alpha 98/100 Upgrade (Completed)

- [x] **1. Live Market Telemetry Adapter**
  - [x] Resilient live telemetry fetcher (Yahoo Finance / CoinGecko query with zero-hang offline fallback).
  - [x] Dynamic indicator calculation: 14-day RSI, MACD (12, 26, 9), SMA 20/50/200, Bollinger Bands, Realized Volatility.
  - [x] 8-K/10-K sentiment scoring & guidance momentum.

- [x] **2. Monte Carlo 1,000-Path Risk & Drawdown Simulator**
  - [x] Geometric Brownian Motion (GBM) simulation across 1,000 paths.
  - [x] Quant metrics: 95% & 99% VaR, max expected drawdown, probability of hitting stop-loss vs target profit, Sharpe ratio.
  - [x] Percentile trajectories (5th, 25th, 50th, 75th, 95th) for charting.

- [x] **3. Unified Broker Connectors (Alpaca, Zerodha Kite, Interactive Brokers)**
  - [x] Standardized multi-broker payload transformer and order routing engine.
  - [x] Paper-mode execution routing with mock slippage & virtual fill receipts.
  - [x] Signed session limit pre-check before broker order dispatch.

- [x] **4. Routes & Test Suite Expansion**
  - [x] Mounted `/api/councils/kuvera/telemetry/:ticker`, `/api/councils/kuvera/monte-carlo`, `/api/councils/kuvera/broker-route`.
  - [x] Expanded `tests/comprehensive_test_suite.cjs` to 36/36 tests (100% pass rate).
  - [x] Verified frontend production build with `npx vite build` (20.03s, 0 errors).

---

## 4. Phase 3 Checklist: Governance, Acoustic Attention & Clinical Normalization (Completed)

- [x] **1. Reviewable Agent Writes via Change Requests & Diffs**
  - [x] Created `backend/services/changeRequestService.js` with structured field-level diffs (`ADD`, `MODIFY`, `DELETE`).
  - [x] Formal state machine: `PENDING_REVIEW` -> `COMMITTED` with SHA-256 commit hashes.
  - [x] Mounted `/api/mesh/change-requests` in `backend/routes/enterpriseMesh.js`.

- [x] **2. Voice Addressee Attention Gate & Self-Playback Echo Suppression**
  - [x] Upgraded `backend/services/voxCpmVoiceEngine.js` with `markResponding` mutex (audio loopback killer).
  - [x] Implemented `evaluateAddresseeGate` to classify direct vocative address vs ambient background room chatter.
  - [x] Mounted `/api/councils/vox/addressee-gate` and `/api/councils/vox/mark-responding`.

- [x] **3. Agentic Detection & Response (ADR) Dual-Tier Triage**
  - [x] Implemented `discoverAgentEndpoints` in `backend/services/indraSecOpsEngine.js` for full surface inventory.
  - [x] Implemented `triageAgentSession` (Tier 1 heuristic regex + Tier 2 multi-step exfiltration kill-chain analysis).
  - [x] Mounted `/api/councils/indra/endpoints` and `/api/councils/indra/session-triage`.

- [x] **4. Health Data Standard Coded Normalization (LOINC & UCUM)**
  - [x] Implemented `normalizeHealthBiomarkers` in `backend/services/dhanvantariClinicalEngine.js`.
  - [x] Mapped clinical indicators to standard LOINC codes (Glucose `2345-7`, Creatinine `2160-0`, etc.) and canonical UCUM units.
  - [x] Enforced strict refusal (`CONVERSION_REFUSED_UNIT_INCOMPATIBLE`) for unsupported/ambiguous unit conversions.
  - [x] Mounted `/api/councils/dhanvantari/normalize-biomarkers`.

- [x] **5. Verification**
  - [x] 40/40 tests passing in `tests/comprehensive_test_suite.cjs` (100.0%).
  - [x] Zero extra UI buttons added; clean architectural integration.

---

## 5. Phase 4 Checklist: AI-DLC DAG, Fail-Closed Risk Gate, Evidence Trust & Commercial Economics (Completed)

- [x] **1. AI-DLC Sovereign Task DAG (Workflow Graph Execution)**
  - [x] Implemented `createTaskDAG` with Kahn's topological sort and circular dependency cycle detection in `backend/services/planLedgerService.js`.
  - [x] Partitioned graph into parallel execution stages/batches (`executeDAG`) with auto-blocking on dependency failures.
  - [x] Mounted `/api/tasks/dag` and `/api/tasks/dag/execute` in `backend/routes/tasks.js`.

- [x] **2. Kuvera Fail-Closed Systematic Risk Pipeline**
  - [x] Built `executeWithFailClosedRiskGate` in `backend/services/kuveraQuantEngine.js`.
  - [x] Enforced hard 200ms evaluation deadline, instant rejection on parameter violation, and fail-closed block on exceptions/disconnects.
  - [x] Mounted `/api/councils/kuvera/fail-closed-trade` in `backend/routes/councils.js`.

- [x] **3. Evidence-Graded Search Trust Weighting**
  - [x] Upgraded `backend/services/hybridRetrievalEngine.js` with formal multi-tier evidence grades (`OFFICIAL: 1.0`, `OBSERVED: 0.85`, `INFERRED: 0.60`, `UNVERIFIED: 0.35`).
  - [x] Integrated trust multipliers directly into BM25 + dense vector hybrid fusion score.
  - [x] Verified via `/api/mesh/retrieval/search` endpoint.

- [x] **4. Vishwakarma Commercial E-Commerce Unit Economics**
  - [x] Implemented `analyzeCommercialEcommerceUnitEconomics` in `backend/services/vishwakarmaSupplyEngine.js`.
  - [x] Computed landed margin ROI, ACoS vs Break-Even ACoS, TACoS, and FBA storage burn velocity / inventory runway.
  - [x] Mounted `/api/councils/vishwakarma/ecommerce-economics` in `backend/routes/councils.js`.

- [x] **5. Formal Verification & Oracle Sealing**
  - [x] 44/44 tests passing in `tests/comprehensive_test_suite.cjs` (100.0% pass rate).
  - [x] Production build clean: `npx vite build` passed (14.79s, 0 errors).
  - [x] Zero third-party/external branding preserved across all files.
  - [x] Zero UI button clutter added.

---

## 6. Phase 5 Checklist: Citation Consensus, Brier Calibration, Indic Linguistic Hygiene & Hermetic Replay (Completed)

- [x] **1. Multi-Registry Scholarly Citation Grounding**
  - [x] Created `backend/services/citationGroundingService.js` enforcing $\ge 2$ independent registry consensus (CrossRef, OpenAlex, Semantic Scholar, Shodhganga).
  - [x] Strict rejection of hallucinated or uncorroborated DOIs with SHA-256 provenance hashes.
  - [x] Mounted `/api/mesh/citations/verify` in `backend/routes/enterpriseMesh.js`.

- [x] **2. Kuvera Prediction Market Journal & Brier Score Calibration**
  - [x] Created `backend/services/predictionJournalService.js` tracking probabilistic forecasts vs binary settlement outcomes.
  - [x] Implemented Brier Score calculation and automatic conviction multiplier dampener ($0.40x$) to protect capital upon overconfidence variance.
  - [x] Mounted `/api/councils/kuvera/prediction-forecast`, `/api/councils/kuvera/prediction-settle`, and `/api/councils/kuvera/prediction-calibration`.

- [x] **3. Indic Linguistic Hygiene & Anti-Babu Executive Sanitization**
  - [x] Created `backend/services/indicLinguisticHygieneEngine.js` filtering 24 archaic Indian bureaucratic clichés ("do the needful", "please find attached herewith", "revert back") and generic AI slop ("delve into", "tapestry of").
  - [x] Computes Executive Clarity Score and returns clean transformed prose.
  - [x] Mounted `/api/mesh/linguistic/sanitize` in `backend/routes/enterpriseMesh.js`.

- [x] **4. Hermetic Trace-to-Fixture CI Replay Engine**
  - [x] Created `backend/services/hermeticTraceReplayService.js` freezing failed agent production traces into offline `.brahma/fixtures/*.json` test cases.
  - [x] Deterministic offline CI replay without live external model calls or token costs.
  - [x] Mounted `/api/mesh/fixtures/freeze` and `/api/mesh/fixtures/replay` in `backend/routes/enterpriseMesh.js`.

- [x] **5. Verification & Test Oracle**
  - [x] 48/48 tests passing in `tests/comprehensive_test_suite.cjs` (100.0% pass rate).
  - [x] Zero extra UI buttons; zero third-party framework branding.

---

## 7. Phase 6 Checklist: Progressive Skills, HMAC Approval Tickets, DriftLock & Hash-Chained Ledger (Completed)

- [x] **1. Progressive Skill Registry & 2-Tier Disclosure**
  - [x] Created `backend/services/progressiveSkillRegistry.js` with Tier 1 compact catalog (saving 63.6% prompt tokens) and Tier 2 on-demand operational schema hydration.
  - [x] Mounted `/api/mesh/skills/catalog` and `/api/mesh/skills/:id/hydrate` in `backend/routes/enterpriseMesh.js`.

- [x] **2. Sovereign Default-Deny Approval Gate & Expiring HMAC Tickets**
  - [x] Created `backend/services/sovereignApprovalGate.js` issuing single-use, nonce-bound, expiring HMAC-SHA256 tickets for state mutations.
  - [x] Verifies signature, payload digest, and blocks nonce replay.
  - [x] Mounted `/api/mesh/approval/ticket` and `/api/mesh/approval/verify` in `backend/routes/enterpriseMesh.js`.

- [x] **3. Adversarial Identity & DriftLock Probe Engine**
  - [x] Created `backend/services/adversarialDriftProbeService.js` testing agents against persona boundary departure, simulated authority jailbreaks, and sycophantic pressure.
  - [x] Computes Drift Resistance Score (0–100%) and stability tier (`DRIFTLOCK_HARDENED`).
  - [x] Mounted `/api/mesh/drift/probe` in `backend/routes/enterpriseMesh.js`.

- [x] **4. Cryptographic Hash-Chained Audit Ledger**
  - [x] Created `backend/services/hashChainedAuditLedger.js` linking every council action to the previous block's digest: $H_n = \text{SHA256}(H_{n-1} + \dots)$.
  - [x] Verifies state root and immediately identifies any retroactive block tampering.
  - [x] Mounted `/api/mesh/ledger/append` and `/api/mesh/ledger/verify` in `backend/routes/enterpriseMesh.js`.

- [x] **5. Formal Verification & Oracle Sealing**
  - [x] 52/52 tests passing in `tests/comprehensive_test_suite.cjs` (100.0% pass rate).
  - [x] Production build clean: `npx vite build` passed (10.16s, 0 errors).
  - [x] Zero extra UI buttons added.
  - [x] Zero third-party branding in codebase.
