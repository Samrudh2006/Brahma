# BRAHMA Sovereign Frontier AI Matrix — Agent Operating Guidelines

This document provides durable architectural context, operational invariants, and execution guardrails for autonomous agents working within the BRAHMA codebase.

---

## 1. System Architecture

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        BRAHMA ARCHITECTURAL MESH                       │
├────────────────────────────────────────────────────────────────────────┤
│  Frontend (React 18 + Vite + Zustand)                                  │
│  ├─ Styling: Vanilla CSS & Inline Design Tokens (Luxury Sanskrit Themes)│
│  └─ State Management: Zustand stores (src/store/index.js)             │
│                                                                        │
│  Backend (Node.js CommonJS + Express)                                  │
│  ├─ Entry Point: backend/server.js                                     │
│  ├─ Routing Mesh: backend/routes/*.js (28 Specialized Mounts)          │
│  ├─ Intelligence: backend/services/ (44 Autonomous Engines)            │
│  └─ Multi-Channel Mesh: backend/services/agentIdentityService.js      │
│                                                                        │
│  Formal Verification & Tests                                           │
│  ├─ Test Suite: tests/comprehensive_test_suite.cjs (21 Invariants)     │
│  └─ Benchmarks: tests/agi_frontier_benchmarks.cjs                      │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Architectural Invariants (Must Never Be Broken)

1. **Zero Route Orphans:**
   - Every file created in `backend/routes/*.js` must be explicitly mounted via `app.use()` in [`backend/server.js`](backend/server.js).
   - This invariant is enforced by Test 4.2 in the comprehensive test suite.

2. **Oracle-Verified Task Completion:**
   - No autonomous feature or refactor is considered complete until verified by an automated test Oracle.
   - Run `npm run test:full` and confirm **100% test pass rate** before reporting completion.

3. **Plan-First Discipline for Complex Work:**
   - Before modifying multiple non-contiguous files, create or reference a structured plan in `plans/<task-slug>.md`.
   - Break changes into clear checklist items: `[ ] Pending` ➔ `[x] Verified`.

4. **Security & Input Sanitization:**
   - All inbound public API endpoints must route through [`backend/middleware/securityShield.js`](backend/middleware/securityShield.js) to strip XSS, script injection, and SQL tampering.

5. **Style Guidelines:**
   - Do NOT introduce TailwindCSS. Use pure Vanilla CSS in `src/styles/index.css` and dynamic inline styles tailored to the 5 luxury Sanskrit themes (Surya Gold, Mayura Peacock Teal, Cyberpunk Kashi, Himalaya Zen, Obsidian Dark).

---

## 3. Key Services & Extension Points

* **Agent Identity & Multi-Channel Communications:** [`backend/services/agentIdentityService.js`](backend/services/agentIdentityService.js)
  - Dedicated persistent identities for the 13 councils (Brihaspati, Garuda, Dhanvantari, etc.).
  - Handles mailboxes, SMS, real-time 2FA OTP auto-parsing, and AES-256-GCM encrypted vaults.
* **ReAct Interleaved Reasoning Engine:** [`backend/services/reactLoopEngine.js`](backend/services/reactLoopEngine.js)
  - Features 5 production defense gates: Context Compactor, Negative Circuit Breaker, Resilient Stale-Cache, Formal Pre/Post Invariant Asserts, and ToolMiddleware Gate.
* **Multi-Model AI Gateway:** [`backend/services/aiGateway.js`](backend/services/aiGateway.js)
  - Universal provider routing across Gemini, Anthropic, OpenAI, HuggingFace, and Groq.
* **Structured Plan Ledger:** [`backend/services/planLedgerService.js`](backend/services/planLedgerService.js)
  - Plan artifacts stored in `plans/<slug>.md`.

---

## 4. Verification Commands

```bash
# Full Invariant & Unit Test Suite
npm run test:full

# Frontend Production Build Verification
npx vite build

# Run Backend Watch Server
npm run dev:backend
```
