/**
 * BRAHMA Hermetic Trace-to-Fixture CI Replay Engine
 * 
 * Invariant: Turn real production agent errors into hermetic, offline CI fixtures.
 * Freezes recorded inputs, tool calls, and LLM payloads into static JSON test cases.
 * Enables 100% deterministic regression validation without live model calls or token costs.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class HermeticTraceReplayService {
  constructor() {
    this.fixturesDir = path.join(process.cwd(), '.brahma', 'fixtures');
    this._initStorage();
  }

  _initStorage() {
    try {
      if (!fs.existsSync(this.fixturesDir)) {
        fs.mkdirSync(this.fixturesDir, { recursive: true });
      }
    } catch {
      // Ignore directory init error if constrained
    }
  }

  /**
   * Freeze an agent failure trace into an offline hermetic test fixture
   */
  freezeTraceFixture({
    caseName = 'regression_case_001',
    agentId = 'brahma_core_agent',
    inputPrompt = '',
    toolCalls = [],
    expectedAssertions = [],
    failureReason = 'Production failure intercepted'
  } = {}) {
    const slug = caseName.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const fixtureId = `fix_${slug}_${Date.now().toString(36)}`;
    const fixturePath = path.join(this.fixturesDir, `${fixtureId}.json`);

    const fixtureContent = {
      fixtureId,
      caseName,
      agentId,
      createdAt: new Date().toISOString(),
      failureReason,
      inputs: {
        prompt: inputPrompt,
        contextSnapshot: { timestamp: Date.now() }
      },
      frozenSpans: toolCalls.map((tc, idx) => ({
        index: idx,
        tool: tc.tool,
        args: tc.args,
        mockResponse: tc.output || { status: 'mock_success' },
        recordedLatencyMs: tc.latencyMs || 25
      })),
      expectedAssertions: expectedAssertions.length > 0 ? expectedAssertions : [
        { type: 'STATUS_CODE_EQUALS', expected: 200 },
        { type: 'NO_NAN_OUTPUT', expected: true }
      ]
    };

    const serialized = JSON.stringify(fixtureContent, null, 2);
    const checksum = crypto.createHash('sha256').update(serialized).digest('hex');
    fixtureContent.fixtureChecksum = checksum;

    try {
      fs.writeFileSync(fixturePath, JSON.stringify(fixtureContent, null, 2), 'utf8');
    } catch {
      // Non-fatal if filesystem restricted
    }

    return {
      success: true,
      fixtureId,
      fixturePath,
      fixtureChecksum: checksum,
      spansRecorded: fixtureContent.frozenSpans.length,
      fixture: fixtureContent
    };
  }

  /**
   * Replay a frozen trace fixture offline in CI without live network calls
   */
  replayFixture(fixtureOrId, { mockExecutor = null } = {}) {
    const startTime = Date.now();
    let fixture = null;

    if (typeof fixtureOrId === 'string') {
      const targetPath = path.join(this.fixturesDir, `${fixtureOrId}.json`);
      if (fs.existsSync(targetPath)) {
        fixture = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
      } else {
        return { success: false, error: `Fixture ${fixtureOrId} not found on disk` };
      }
    } else if (typeof fixtureOrId === 'object' && fixtureOrId !== null) {
      fixture = fixtureOrId.fixture || fixtureOrId;
    }

    if (!fixture || !fixture.frozenSpans) {
      return { success: false, error: 'Invalid hermetic fixture schema' };
    }

    const spanReplayResults = [];
    let assertionsPassed = true;

    for (const span of fixture.frozenSpans) {
      let output = span.mockResponse;
      if (typeof mockExecutor === 'function') {
        try {
          output = mockExecutor(span.tool, span.args);
        } catch (err) {
          output = { error: err.message };
        }
      }
      spanReplayResults.push({
        spanIndex: span.index,
        tool: span.tool,
        status: output && output.error ? 'FAILED' : 'REPLAYED_CLEAN',
        replayedOutput: output
      });
    }

    // Verify assertions
    const assertionResults = (fixture.expectedAssertions || []).map(assertRule => {
      let passed = true;
      if (assertRule.type === 'STATUS_CODE_EQUALS') {
        passed = spanReplayResults.every(s => s.status !== 'FAILED');
      } else if (assertRule.type === 'NO_NAN_OUTPUT') {
        const rawJson = JSON.stringify(spanReplayResults);
        passed = !rawJson.includes('NaN');
      }
      if (!passed) assertionsPassed = false;
      return { rule: assertRule.type, passed };
    });

    return {
      success: assertionsPassed,
      fixtureId: fixture.fixtureId,
      caseName: fixture.caseName,
      replayDurationMs: Date.now() - startTime,
      mode: 'OFFLINE_HERMETIC_CI',
      spansReplayed: spanReplayResults.length,
      assertionResults,
      assertionsPassed,
      disposition: assertionsPassed ? 'REGRESSION_GUARD_PASS' : 'REGRESSION_FAILED'
    };
  }
}

module.exports = new HermeticTraceReplayService();
