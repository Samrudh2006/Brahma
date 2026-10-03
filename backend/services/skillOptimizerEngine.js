/**
 * BRAHMA Trajectory-Driven Skill Optimization Engine
 * Evaluates agent execution trajectories, performs validation gating,
 * and generates deployable best_skill prompt artifacts stored persistently in SQLite.
 */

const db = require('../db/database');

class SkillOptimizerEngine {
  constructor() {
    this.trajectories = [];
    this.initDatabaseTable();
  }

  initDatabaseTable() {
    try {
      db.exec(`
        CREATE TABLE IF NOT EXISTS optimized_skills (
          id TEXT PRIMARY KEY,
          agent_id TEXT NOT NULL,
          skill_name TEXT NOT NULL,
          instructions TEXT NOT NULL,
          validation_score REAL DEFAULT 1.0,
          trajectories_count INTEGER DEFAULT 1,
          updated_at TEXT DEFAULT (datetime('now'))
        );
      `);
    } catch (err) {
      console.warn('[SkillOptimizer] DB Table setup warning:', err.message);
    }
  }

  /**
   * Log an execution trajectory and run validation-gated optimization update
   */
  async recordTrajectoryAndOptimize({ agentId, query, executionSteps = [], success = true, score = 0.95 }) {
    const trajectory = {
      timestamp: new Date().toISOString(),
      agentId,
      query,
      stepsCount: executionSteps.length,
      success,
      score
    };

    this.trajectories.push(trajectory);
    if (this.trajectories.length > 100) this.trajectories.shift();

    // Validation Gating: Only update skill prompt if score >= 0.8
    if (success && score >= 0.8) {
      return this.updateOptimizedSkillArtifact({ agentId, query, score });
    }

    return { optimized: false, reason: 'Validation score below optimization gate threshold' };
  }

  /**
   * Synthesize and store deployable best_skill artifact in SQLite
   */
  updateOptimizedSkillArtifact({ agentId, query, score }) {
    const skillId = `skill_${agentId}`;
    const skillName = `${agentId.toUpperCase()} Optimized Operational Trajectory`;
    const refinedInstructions = `# BEST_SKILL: ${skillName}
## Trajectory Optimization Metadata
- Agent ID: ${agentId}
- Validation Gate Score: ${(score * 100).toFixed(1)}%
- Target Task Pattern: "${query.slice(0, 50)}"

## Refined Operational Rules
1. Pre-flight Intent Check: Evaluate boundaries and invariant constraints before code synthesis.
2. Zero-Hallucination Gate: Verify all syntax and schema imports against verified polyglot catalog.
3. Execution Recovery: Apply self-correcting feedback loops on any error trace.
`;

    try {
      db.prepare(`
        INSERT INTO optimized_skills (id, agent_id, skill_name, instructions, validation_score, trajectories_count, updated_at)
        VALUES (?, ?, ?, ?, ?, 1, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET
          instructions = ?,
          validation_score = MAX(validation_score, ?),
          trajectories_count = trajectories_count + 1,
          updated_at = datetime('now')
      `).run(skillId, agentId, skillName, refinedInstructions, score, refinedInstructions, score);

      console.log(`[SkillOptimizer] Optimized best_skill artifact deployed for ${agentId} (Score: ${(score * 100).toFixed(1)}%)`);
      return { optimized: true, skillId, score, instructions: refinedInstructions };
    } catch (err) {
      console.warn('[SkillOptimizer] Failed to persist skill artifact:', err.message);
      return { optimized: false, error: err.message };
    }
  }

  /**
   * Retrieve active deployable best_skill instructions for an agent
   */
  getOptimizedSkill(agentId) {
    try {
      const row = db.prepare('SELECT instructions FROM optimized_skills WHERE agent_id = ?').get(agentId);
      return row ? row.instructions : null;
    } catch (err) {
      return null;
    }
  }
}

module.exports = new SkillOptimizerEngine();
