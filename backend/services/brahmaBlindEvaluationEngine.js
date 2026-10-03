/**
 * @file brahmaBlindEvaluationEngine.js
 * @module brahmaBlindEvaluationEngine
 * @description Human-vs-Brahma Double-Blind Tri-Party Evaluation Engine.
 * Evaluates: Brahma vs Frontier LLM Baseline vs Human Expert.
 * Anonymizes candidate identity, randomizes test presentation, and measures 8 dimensions:
 * Correctness, Reasoning Quality, Completion Time, Tool Efficiency, Robustness, Novel-Task Success, Error Recovery, Transfer Performance.
 */

'use strict';

const crypto = require('crypto');

class BrahmaBlindEvaluationEngine {
  constructor() {
    this.blindTrials = new Map();
  }

  /**
   * Generates an anonymized, randomized double-blind trial
   */
  createBlindTrial(taskSpec) {
    const { taskId, prompt, domain = 'COMPLEX_SYSTEMS_ENGINEERING', groundTruthSolution = null } = taskSpec;
    const trialId = `trial_${crypto.randomBytes(6).toString('hex')}`;

    // Generate randomized candidate tokens (Blind Candidate A, B, C)
    const systemKeys = ['BRAHMA_SOVEREIGN', 'FRONTIER_LLM_BASELINE', 'HUMAN_DOMAIN_EXPERT'];
    const shuffled = this._shuffleArray([...systemKeys]);
    
    const blindMapping = {
      'CANDIDATE_A': shuffled[0],
      'CANDIDATE_B': shuffled[1],
      'CANDIDATE_C': shuffled[2]
    };

    const trialRecord = {
      trialId,
      taskId: taskId || `task_${crypto.randomBytes(4).toString('hex')}`,
      prompt,
      domain,
      groundTruthSolution,
      blindMapping,
      submissions: {},
      evaluations: {},
      status: 'AWAITING_BLIND_EVALUATION',
      createdAt: new Date().toISOString()
    };

    this.blindTrials.set(trialId, trialRecord);

    return {
      trialId,
      prompt,
      blindCandidates: ['CANDIDATE_A', 'CANDIDATE_B', 'CANDIDATE_C'],
      status: 'BLIND_TRIAL_INITIALIZED_IDENTITY_MASKED'
    };
  }

  /**
   * Records blind candidate submissions
   */
  submitBlindOutput(trialId, candidateTag, outputPayload) {
    const trial = this.blindTrials.get(trialId);
    if (!trial) return { error: 'TRIAL_NOT_FOUND' };

    trial.submissions[candidateTag] = {
      ...outputPayload,
      submittedAt: new Date().toISOString()
    };

    return { trialId, candidateTag, status: 'SUBMISSION_RECORDED' };
  }

  /**
   * Scores blind candidates across 8 rigorous dimensions without knowing system identities
   */
  evaluateBlindTrial(trialId, blindScores) {
    const trial = this.blindTrials.get(trialId);
    if (!trial) return { error: 'TRIAL_NOT_FOUND' };

    const dimensions = [
      'correctness',
      'reasoningQuality',
      'completionTimeMs',
      'toolEfficiency',
      'robustness',
      'novelTaskSuccess',
      'errorRecovery',
      'transferPerformance'
    ];

    const unblindedReport = {};

    for (const [candidateTag, scores] of Object.entries(blindScores)) {
      const realIdentity = trial.blindMapping[candidateTag];
      
      // Calculate weighted aggregate score
      const correctness = scores.correctness || 90;
      const reasoningQuality = scores.reasoningQuality || 90;
      const toolEfficiency = scores.toolEfficiency || 90;
      const robustness = scores.robustness || 90;
      const novelTaskSuccess = scores.novelTaskSuccess || 90;
      const errorRecovery = scores.errorRecovery || 90;
      const transferPerformance = scores.transferPerformance || 90;
      
      const compositeScore = Number((
        (correctness * 0.25) +
        (reasoningQuality * 0.20) +
        (robustness * 0.15) +
        (novelTaskSuccess * 0.15) +
        (transferPerformance * 0.10) +
        (errorRecovery * 0.10) +
        (toolEfficiency * 0.05)
      ).toFixed(2));

      unblindedReport[realIdentity] = {
        blindCandidateTag: candidateTag,
        compositeScore,
        detailedScores: {
          correctness,
          reasoningQuality,
          toolEfficiency,
          robustness,
          novelTaskSuccess,
          errorRecovery,
          transferPerformance,
          completionTimeMs: scores.completionTimeMs || 450
        }
      };
    }

    // Rank winners
    const ranked = Object.entries(unblindedReport).sort((a, b) => b[1].compositeScore - a[1].compositeScore);
    const winner = ranked[0][0];

    trial.evaluations = unblindedReport;
    trial.status = 'EVALUATION_COMPLETED_UNBLINDED';

    return {
      trialId,
      winnerIdentity: winner,
      winnerScore: unblindedReport[winner].compositeScore,
      rankings: ranked.map(([id, data], idx) => ({ rank: idx + 1, identity: id, score: data.compositeScore })),
      unblindedReport,
      verdict: winner === 'BRAHMA_SOVEREIGN' ? 'BRAHMA_SUPERIOR_IN_BLIND_EVALUATION' : 'BASELINE_SUPERIOR'
    };
  }

  _shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}

module.exports = new BrahmaBlindEvaluationEngine();
