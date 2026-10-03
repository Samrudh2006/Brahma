/**
 * @file brahmaComputeResourceOptimizer.js
 * @module brahmaComputeResourceOptimizer
 * @description Autonomous Resource & Compute Allocation Optimizer.
 * Optimizes the objective function: Efficiency = (Quality * Reliability) / (Cost * Latency).
 * Dynamically selects model tiers, reasoning rollouts (1 vs 50), local vs cloud compute, and compute stoppage policies.
 */

'use strict';

const crypto = require('crypto');

class BrahmaComputeResourceOptimizer {
  constructor() {
    this.allocationHistory = [];
  }

  /**
   * Optimizes compute budget and execution strategy for an incoming query or task
   * @param {Object} querySpec 
   * @returns {Object} Selected execution configuration with efficiency metric
   */
  optimizeComputePlan(querySpec) {
    const {
      taskComplexity = 'HIGH', // 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL_PLANETARY'
      latencyBudgetMs = 1500,
      costSensitivity = 'MEDIUM', // 'LOW', 'MEDIUM', 'HIGH'
      requiresFormalSoundness = true
    } = querySpec;

    const planId = `comp_opt_${crypto.randomBytes(6).toString('hex')}`;

    let selectedModelTier = 'LOCAL_SUB_MILLI_ROUTER';
    let reasoningRolloutCount = 1;
    let computeTarget = 'LOCAL_NODE_VM';
    let estimatedCostUsd = 0.0001;
    let estimatedLatencyMs = 15;
    let projectedQuality = 0.90;
    let projectedReliability = 0.95;

    if (taskComplexity === 'CRITICAL_PLANETARY' || (taskComplexity === 'HIGH' && requiresFormalSoundness)) {
      selectedModelTier = 'FRONTIER_REASONING_RE_ACT_MCTS';
      reasoningRolloutCount = 50;
      computeTarget = 'DISTRIBUTED_NEUROMORPHIC_CLUSTER';
      estimatedCostUsd = 0.045;
      estimatedLatencyMs = 450;
      projectedQuality = 0.99;
      projectedReliability = 0.995;
    } else if (taskComplexity === 'MEDIUM') {
      selectedModelTier = 'STANDARD_FAST_INFERENCE_GATEWAY';
      reasoningRolloutCount = 5;
      computeTarget = 'LOCAL_NODE_VM';
      estimatedCostUsd = 0.005;
      estimatedLatencyMs = 120;
      projectedQuality = 0.94;
      projectedReliability = 0.97;
    }

    // Efficiency Score = (Quality * Reliability) / (Cost * (Latency / 1000))
    const efficiencyNumerator = projectedQuality * projectedReliability;
    const efficiencyDenominator = Math.max(0.0001, estimatedCostUsd * (estimatedLatencyMs / 1000));
    const efficiencyScore = Number((efficiencyNumerator / efficiencyDenominator).toFixed(2));

    const plan = {
      planId,
      taskComplexity,
      selectedStrategy: {
        modelTier: selectedModelTier,
        mctsRolloutDepth: reasoningRolloutCount,
        computeTarget,
        earlyStopConfidenceThreshold: 0.98
      },
      estimates: {
        estimatedCostUsd,
        estimatedLatencyMs,
        projectedQuality,
        projectedReliability
      },
      efficiencyScore,
      actionableDirective: `DISPATCH_VIA_${selectedModelTier}_WITH_${reasoningRolloutCount}_ROLLOUTS`,
      timestamp: new Date().toISOString()
    };

    this.allocationHistory.push(plan);
    return plan;
  }
}

module.exports = new BrahmaComputeResourceOptimizer();
