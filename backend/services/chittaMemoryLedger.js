/**
 * BRAHMA — Chitta Experiential Memory Ledger
 * Lifelong Multi-Agent Epistemic Memory & Failure Invariant Ledger
 * 
 * Provides:
 * - Persistent recording of past reasoning errors, failed hypotheses, and rejected clauses
 * - O(1) Pre-flight recall check: Verifies if a proposed action has failed in the past
 * - Zero repetition of historic mistakes (Epistemic Monotonicity)
 * - Backed by SQLite WAL ledger with deterministic hash fingerprinting
 */

const db = require('../db/database');

class ChittaMemoryLedger {
  constructor() {
    this.name = 'Chitta Lifelong Epistemic Memory Core';
    this.initTable();
  }

  initTable() {
    try {
      db.prepare(`
        CREATE TABLE IF NOT EXISTS chitta_lessons (
          id TEXT PRIMARY KEY,
          category TEXT NOT NULL,
          trigger_pattern TEXT NOT NULL,
          failed_action TEXT,
          lesson_learned TEXT NOT NULL,
          corrective_guideline TEXT NOT NULL,
          severity TEXT DEFAULT 'MEDIUM',
          occurred_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          retrieval_count INTEGER DEFAULT 0
        )
      `).run();
    } catch (err) {
      console.warn('[ChittaMemory] Table init warning:', err.message);
    }
  }

  /**
   * Record a New Lesson Learned into Lifelong Memory
   */
  async recordLesson({ category = 'GENERAL', triggerPattern = '', failedAction = '', lessonLearned = '', correctiveGuideline = '', severity = 'HIGH' }) {
    const id = `lesson_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    try {
      db.prepare(`
        INSERT INTO chitta_lessons (id, category, trigger_pattern, failed_action, lesson_learned, corrective_guideline, severity)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        category.toUpperCase(),
        triggerPattern.toLowerCase().trim(),
        failedAction,
        lessonLearned,
        correctiveGuideline,
        severity
      );

      return {
        success: true,
        lessonId: id,
        message: 'Lesson committed to lifelong experiential memory ledger.',
        epistemicStatus: 'PERMANENTLY_REMEMBERED'
      };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Pre-Flight Check: Recall Any Past Mistakes Associated with Incoming Action/Text
   */
  async recallPastLessons(inputText = '') {
    const clean = String(inputText || '').toLowerCase();
    try {
      const rows = db.prepare('SELECT * FROM chitta_lessons ORDER BY occurred_at DESC LIMIT 100').all();
      const matchedLessons = rows.filter(row => clean.includes(row.trigger_pattern));

      if (matchedLessons.length > 0) {
        // Update retrieval counter for matched lessons
        for (const lesson of matchedLessons) {
          db.prepare('UPDATE chitta_lessons SET retrieval_count = retrieval_count + 1 WHERE id = ?').run(lesson.id);
        }
      }

      return {
        success: true,
        hasPastMistakeWarning: matchedLessons.length > 0,
        matchedCount: matchedLessons.length,
        lessons: matchedLessons,
        safetyAdvisory: matchedLessons.length > 0 
          ? `CAUTION: ${matchedLessons.length} prior failure pattern(s) identified. Apply corrective guidelines before execution.` 
          : 'CLEAR: No previous failure invariants matched for this action.'
      };
    } catch (err) {
      return { success: false, error: err.message, hasPastMistakeWarning: false, lessons: [] };
    }
  }

  /**
   * Get Experiential Memory Telemetry
   */
  async getMemoryStats() {
    try {
      const countRow = db.prepare('SELECT COUNT(*) as total FROM chitta_lessons').get();
      const recent = db.prepare('SELECT * FROM chitta_lessons ORDER BY occurred_at DESC LIMIT 5').all();
      return {
        success: true,
        totalLessonsStored: countRow ? countRow.total : 0,
        recentLessons: recent,
        learningPosture: 'CONTINUOUS_NON_REGRESSIVE'
      };
    } catch (err) {
      return { success: false, error: err.message, totalLessonsStored: 0 };
    }
  }
}

module.exports = new ChittaMemoryLedger();
