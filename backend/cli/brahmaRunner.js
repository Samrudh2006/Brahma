#!/usr/bin/env node
/**
 * BRAHMA Headless CLI Runner for CI/CD Pipelines & Automation Scripts
 * Usage:
 *   node backend/cli/brahmaRunner.js --prompt "Audit project security invariants" --headless
 */

const layaJevRouter = require('../services/layaJevRouter');
const ragEngine = require('../services/ragEngine');
const swarmDispatcher = require('../services/swarmDispatcher');

async function runHeadlessCLI() {
  const args = process.argv.slice(2);
  const promptArgIdx = args.indexOf('--prompt');
  const prompt = promptArgIdx !== -1 ? args[promptArgIdx + 1] : 'Brahma Headless System Diagnostic';
  const isHeadless = args.includes('--headless');

  console.log(`\n======================================================`);
  console.log(`🌌 BRAHMA HEADLESS CLI RUNNER (CI/CD Pipeline Mode)`);
  console.log(`======================================================`);
  console.log(`Prompt: "${prompt}"`);
  console.log(`Headless Mode: ${isHeadless ? 'ENABLED (Non-Interactive)' : 'DISABLED'}`);

  // 1. System-1 Pre-Flight Decision
  const layaDecision = layaJevRouter.classify(prompt);
  console.log(`\n⚡ [System-1 Decision @ ${layaDecision.latencyMs}ms]`);
  console.log(`   Intent: ${layaDecision.intent}`);
  console.log(`   Council: ${layaDecision.council.name}`);
  console.log(`   Model: ${layaDecision.routingDecision.targetModel}`);

  // 2. RAG Contextual Search
  const ragResults = await ragEngine.search(prompt, 2);
  console.log(`\n📚 [Contextual RAG Results: ${ragResults.length} chunks retrieved]`);
  ragResults.forEach((res, idx) => {
    console.log(`   [${idx + 1}] Title: ${res.title} | Score: ${res.score}`);
  });

  // 3. Council Debate Execution
  console.log(`\n🏛️  [Executing 13-Council Swarm Dispatch...]`);
  const debate = await swarmDispatcher.runCouncilDebate({ query: prompt, rounds: 1 });
  console.log(`   Swarm Consensus Reached: ${debate.rounds} round(s) completed.`);

  const output = {
    timestamp: new Date().toISOString(),
    prompt,
    system1: layaDecision,
    contextualRAG: ragResults,
    swarmDebate: debate,
    status: 'CI_CD_EXECUTION_SUCCESS'
  };

  if (isHeadless) {
    console.log(`\n[JSON OUTPUT SUMMARY]:`);
    console.log(JSON.stringify(output, null, 2));
  }

  console.log(`======================================================\n`);
  process.exit(0);
}

if (require.main === module) {
  runHeadlessCLI().catch(err => {
    console.error('Brahma Headless CLI Error:', err);
    process.exit(1);
  });
}

module.exports = { runHeadlessCLI };
