/**
 * SAMRUDH-3 SOVEREIGN BRAIN LIVE VERIFICATION SUITE
 * 
 * Verifies that Samrudh-3 (dwivedula/Samrudh-3-Brahma-7B) operates as the
 * primary default reasoning engine in the local Brahma OS across 5 mission-critical tasks:
 * 
 * 1. Sovereign Identity & Authorship (<think> CoT + Samrudh + Brahma OS)
 * 2. Authentic Multi-Dialect Telugu Camaraderie (Telangana, Rayalaseema, Coastal slang)
 * 3. Chanakya Legal Audit (SaaS Trap #1 Unilateral Indemnification & Redline Diff)
 * 4. Kuvera Quant Risk & Circuit Breaker (14.85% Max Drawdown & 95% Parametric VaR Tool Call)
 * 5. Shiva AST Code Refactoring & Daily Coding (Max Recursion Depth 12 Invariant)
 */

const aiGateway = require('../backend/services/aiGateway');

async function runPrompt(query, customModel = undefined) {
  return new Promise((resolve, reject) => {
    let thoughts = '';
    let response = '';

    const payload = {
      messages: [{ sender: 'user', text: query }],
      identity: { name: 'BRAHMA Sovereign', domain: 'Universal Master' },
      pills: {}
    };

    if (customModel) {
      payload.model = customModel;
    }

    aiGateway.streamCompletion(
      payload,
      (chunk) => {
        if (chunk.startsWith('__THOUGHT__')) {
          thoughts += chunk.replace('__THOUGHT__', '') + '\n';
        } else {
          response += chunk;
        }
      },
      () => {
        resolve({ thoughts, response });
      },
      (err) => {
        reject(err);
      }
    );
  });
}

async function runSamrudh3LiveTest() {
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log('🔱 SAMRUDH-3 SOVEREIGN BRAIN — 5 LIVE TEST CASES & VERIFICATION SUITE');
  console.log('   Model: dwivedula/Samrudh-3-Brahma-7B (DPO SOTA, 8k Context, Apache 2.0)');
  console.log('   Creator & Author: Samrudh');
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  const results = [];

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST CASE 1: Sovereign Identity & Authorship with <think> Deliberation
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('▶ [TEST CASE 1/5] Sovereign Identity & CoT Deliberation Invariant...');
  const t1Start = Date.now();
  // Call WITHOUT explicit model to verify Samrudh-3 is the default brain
  const res1 = await runPrompt("Who are you, who trained you, and what architecture powers your cognition?");
  const t1Duration = Date.now() - t1Start;

  const hasThinkBlock1 = res1.response.includes('<think>') && res1.response.includes('</think>');
  const mentionsSamrudh = /Samrudh/i.test(res1.response);
  const mentionsBrahma = /Brahma/i.test(res1.response);
  const mentionsDPO = /Direct Preference Optimization|DPO/i.test(res1.response);
  const t1Pass = (hasThinkBlock1 || res1.thoughts.length > 0) && mentionsSamrudh && mentionsBrahma && mentionsDPO;

  results.push({
    testCase: 1,
    name: 'Sovereign Identity & Authorship (<think> CoT)',
    passed: t1Pass,
    latencyMs: t1Duration,
    checks: {
      hasThinkOrThought: hasThinkBlock1 || res1.thoughts.length > 0,
      mentionsSamrudh,
      mentionsBrahma,
      mentionsDPO
    },
    sampleOutput: res1.response.slice(0, 180) + '...'
  });
  console.log(`  Result: ${t1Pass ? '✅ PASS' : '❌ FAIL'} (${t1Duration}ms)\n`);

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST CASE 2: Authentic Multi-Dialect Telugu Nuance & Daily Vitality
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('▶ [TEST CASE 2/5] Authentic Multi-Dialect Telugu Camaraderie...');
  const t2Start = Date.now();
  const res2 = await runPrompt("Can you speak in authentic Telugu slang? How are you feeling today mawa?");
  const t2Duration = Date.now() - t2Start;

  const hasTeluguSlang = /కిర్రాక్/i.test(res2.response) && /మవా/i.test(res2.response);
  const hasTaggedeLe = /తగ్గేదే లే/i.test(res2.response);
  const hasDialects = /తెలంగాణ|రాయలసీమ|కోస్తా/i.test(res2.response);
  const t2Pass = hasTeluguSlang && hasTaggedeLe && hasDialects;

  results.push({
    testCase: 2,
    name: 'Authentic Multi-Dialect Telugu Nuance',
    passed: t2Pass,
    latencyMs: t2Duration,
    checks: {
      hasTeluguSlang,
      hasTaggedeLe,
      hasDialects
    },
    sampleOutput: res2.response.slice(0, 180) + '...'
  });
  console.log(`  Result: ${t2Pass ? '✅ PASS' : '❌ FAIL'} (${t2Duration}ms)\n`);

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST CASE 3: Chanakya Legal Audit (SaaS Indemnification Trap #1 & Redline Diff)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('▶ [TEST CASE 3/5] Chanakya Legal Audit (SaaS Trap #1 Indemnification)...');
  const t3Start = Date.now();
  const res3 = await runPrompt("Review this SaaS indemnification clause: 'Customer shall indemnify and defend Vendor from any and all damages, claims, and expenses arising out of Customer's use of the Platform.'");
  const t3Duration = Date.now() - t3Start;

  const detectsTrap1 = /Trap #1|Broad Unilateral Indemnification/i.test(res3.response);
  const hasRedlineDiff = res3.response.includes('```diff') && res3.response.includes('- ') && res3.response.includes('+ ');
  const protectsCustomer = /gross negligence|intellectual property infringement/i.test(res3.response);
  const t3Pass = detectsTrap1 && hasRedlineDiff && protectsCustomer;

  results.push({
    testCase: 3,
    name: 'Chanakya Legal Contract Audit (SaaS Trap #1 & Redline)',
    passed: t3Pass,
    latencyMs: t3Duration,
    checks: {
      detectsTrap1,
      hasRedlineDiff,
      protectsCustomer
    },
    sampleOutput: res3.response.slice(0, 180) + '...'
  });
  console.log(`  Result: ${t3Pass ? '✅ PASS' : '❌ FAIL'} (${t3Duration}ms)\n`);

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST CASE 4: Kuvera Quant Risk & 14.85% Max Drawdown Circuit Breakers
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('▶ [TEST CASE 4/5] Kuvera Quant Risk Guardrail & 14.85% Circuit Breaker...');
  const t4Start = Date.now();
  const res4 = await runPrompt("Execute a 95% Parametric VaR calculation for $5,000,000 equity with 22% annual volatility over 15 days and check Kuvera circuit breaker limits.");
  const t4Duration = Date.now() - t4Start;

  const citesCircuitBreaker = /14\.85%/i.test(res4.response);
  const hasToolCall = res4.response.includes('<tool_call>') && /kuveraQuantEngine/i.test(res4.response);
  const calculatesVaR = /441,435|8\.83%/i.test(res4.response);
  const t4Pass = citesCircuitBreaker && hasToolCall && calculatesVaR;

  results.push({
    testCase: 4,
    name: 'Kuvera Quantitative Risk & 14.85% Circuit Breaker',
    passed: t4Pass,
    latencyMs: t4Duration,
    checks: {
      citesCircuitBreaker,
      hasToolCall,
      calculatesVaR
    },
    sampleOutput: res4.response.slice(0, 180) + '...'
  });
  console.log(`  Result: ${t4Pass ? '✅ PASS' : '❌ FAIL'} (${t4Duration}ms)\n`);

  // ─────────────────────────────────────────────────────────────────────────────
  // TEST CASE 5: Shiva Council AST Refactoring & Daily Coding Automation
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('▶ [TEST CASE 5/5] Shiva Council AST Refactoring (Max Recursion Depth 12)...');
  const t5Start = Date.now();
  const res5 = await runPrompt("Write a safe AST code refactoring function in Node.js that prevents recursive infinite bloat.");
  const t5Duration = Date.now() - t5Start;

  const hasMaxDepth12 = /MAX_MUTATION_DEPTH\s*=\s*12|safety ceiling of 12/i.test(res5.response);
  const hasExecutableCode = res5.response.includes('function validateASTRefactoring') && res5.response.includes('module.exports');
  const catchesBloomingLoops = /currentDepth > MAX_MUTATION_DEPTH/i.test(res5.response);
  const t5Pass = hasMaxDepth12 && hasExecutableCode && catchesBloomingLoops;

  results.push({
    testCase: 5,
    name: 'Shiva AST Code Refactoring & Invariants',
    passed: t5Pass,
    latencyMs: t5Duration,
    checks: {
      hasMaxDepth12,
      hasExecutableCode,
      catchesBloomingLoops
    },
    sampleOutput: res5.response.slice(0, 180) + '...'
  });
  console.log(`  Result: ${t5Pass ? '✅ PASS' : '❌ FAIL'} (${t5Duration}ms)\n`);

  // ─────────────────────────────────────────────────────────────────────────────
  // SUMMARY REPORT & SCOREBOARD
  // ─────────────────────────────────────────────────────────────────────────────
  const allPassed = results.every(r => r.passed);
  const totalPassed = results.filter(r => r.passed).length;

  console.log('═══════════════════════════════════════════════════════════════════════════════');
  console.log(`🎯 SAMRUDH-3 LIVE TEST SCOREBOARD: ${totalPassed}/5 TESTS PASSED (${((totalPassed/5)*100).toFixed(1)}%)`);
  console.log('═══════════════════════════════════════════════════════════════════════════════');
  results.forEach(r => {
    console.log(`[Test ${r.testCase}] ${r.passed ? '✅ PASS' : '❌ FAIL'} | ${r.name.padEnd(45)} | ${r.latencyMs}ms`);
  });
  console.log('═══════════════════════════════════════════════════════════════════════════════\n');

  if (!allPassed) {
    console.error('❌ One or more Samrudh-3 test cases failed!');
    process.exit(1);
  } else {
    console.log('🔱 ALL 5 SAMRUDH-3 SOVEREIGN TEST CASES PASSED WITH 100% INVARIANT FIDELITY!');
    process.exit(0);
  }
}

runSamrudh3LiveTest().catch(err => {
  console.error('[Samrudh-3 Test Error]:', err);
  process.exit(1);
});
