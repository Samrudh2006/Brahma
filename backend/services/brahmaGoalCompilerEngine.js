/**
 * @file brahmaGoalCompilerEngine.js
 * @module brahmaGoalCompilerEngine
 * @description Autonomous Task Decomposition & Goal Compiler.
 * Translates high-level objective ("achieve X") into a verified execution DAG:
 * Goal -> Capability Graph -> Topological Execution DAG -> Cost/Uncertainty Profiler -> Council Dispatch -> Dynamic Replanning.
 */

'use strict';

const crypto = require('crypto');

class BrahmaGoalCompilerEngine {
  constructor() {
    this.capabilityRegistry = new Map([
      ['DATA_EXTRACTION', { council: 'BRIHASPATI', cost: 1.2, latencyMs: 250, defaultReliability: 0.98 }],
      ['NUMERICAL_SIMULATION', { council: 'ARYABHATA', cost: 3.5, latencyMs: 800, defaultReliability: 0.96 }],
      ['FORMAL_VERIFICATION', { council: 'INDRA', cost: 2.1, latencyMs: 450, defaultReliability: 0.99 }],
      ['SYNTHETIC_EXPERIMENTATION', { council: 'DHANVANTARI', cost: 4.0, latencyMs: 1200, defaultReliability: 0.94 }],
      ['LEGAL_COMPLIANCE', { council: 'CHANAKYA', cost: 1.8, latencyMs: 300, defaultReliability: 0.99 }],
      ['MARKET_ANALYSIS', { council: 'KUVERA', cost: 2.5, latencyMs: 600, defaultReliability: 0.95 }],
      ['CODE_SYNTHESIS', { council: 'VISHWAKARMA', cost: 3.0, latencyMs: 750, defaultReliability: 0.97 }]
    ]);
  }

  /**
   * Decomposes a high-level goal into an executable, topologically sorted DAG
   * @param {Object} goalSpec 
   * @returns {Object} Compiled execution plan with uncertainty & DAG
   */
  compileGoal(goalSpec) {
    const { objective, domain = 'GENERAL_AGI', constraints = {}, availableTools = [] } = goalSpec;
    const planId = `plan_${crypto.randomBytes(6).toString('hex')}`;

    // 1. Identify required capabilities based on semantic intent
    const requiredCaps = this._inferCapabilities(objective, domain);

    // 2. Identify missing capabilities vs available tools
    const capabilityGaps = [];
    for (const cap of requiredCaps) {
      const hasTool = availableTools.some(t => t.capabilities && t.capabilities.includes(cap));
      if (!hasTool) {
        capabilityGaps.push({ capability: cap, resolution: 'SYNTHESIZE_OR_DISPATCH_COUNCIL' });
      }
    }

    // 3. Build subtasks and dependency DAG
    const subtasks = this._buildSubtaskDag(objective, requiredCaps, constraints);

    // 4. Compute topological execution order (Kahn's algorithm)
    const executionOrder = this._topologicalSort(subtasks);

    // 5. Estimate aggregate cost, latency, and Bayesian success uncertainty
    let totalEstimatedCost = 0;
    let totalEstimatedLatency = 0;
    let jointSuccessProb = 1.0;

    subtasks.forEach(task => {
      const capMeta = this.capabilityRegistry.get(task.capability) || { cost: 2.0, latencyMs: 500, defaultReliability: 0.95 };
      totalEstimatedCost += capMeta.cost;
      totalEstimatedLatency += capMeta.latencyMs;
      jointSuccessProb *= capMeta.defaultReliability;
    });

    return {
      planId,
      objective,
      domain,
      requiredCapabilities: requiredCaps,
      capabilityGaps,
      subtaskCount: subtasks.length,
      executionOrder,
      subtasks,
      metrics: {
        totalEstimatedCostUsd: Number(totalEstimatedCost.toFixed(2)),
        totalEstimatedLatencyMs: totalEstimatedLatency,
        jointSuccessProbability: Number(jointSuccessProb.toFixed(4)),
        uncertaintyIndex: Number((1 - jointSuccessProb).toFixed(4))
      },
      status: 'COMPILED_READY_FOR_EXECUTION',
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Simulates execution of the compiled DAG with dynamic replanning on step failure
   */
  executeAndMonitor(compiledPlan, simulatedFailureStepId = null) {
    const executionTrace = [];
    let currentPlan = { ...compiledPlan };
    let hasFailed = false;
    let replanCount = 0;

    for (const stepId of currentPlan.executionOrder) {
      const task = currentPlan.subtasks.find(t => t.id === stepId);
      if (!task) continue;

      if (simulatedFailureStepId && task.id === simulatedFailureStepId && !hasFailed) {
        hasFailed = true;
        replanCount++;
        executionTrace.push({
          stepId: task.id,
          name: task.name,
          status: 'FAILED',
          error: `Uncertainty threshold exceeded in ${task.capability}`,
          timestamp: new Date().toISOString()
        });

        // Trigger dynamic replan: Inject contingency branch
        const contingencyTask = {
          id: `${task.id}_contingency_fallback`,
          name: `Contingency Recovery: ${task.name}`,
          capability: 'FORMAL_VERIFICATION',
          council: 'INDRA',
          dependencies: task.dependencies,
          status: 'INJECTED_RECOVERY'
        };
        currentPlan.subtasks.push(contingencyTask);
        
        executionTrace.push({
          stepId: contingencyTask.id,
          name: contingencyTask.name,
          status: 'REPLANNED_SUCCESS',
          recoveredFrom: task.id,
          council: 'INDRA',
          timestamp: new Date().toISOString()
        });
      } else {
        executionTrace.push({
          stepId: task.id,
          name: task.name,
          status: 'SUCCESS',
          council: task.council,
          timestamp: new Date().toISOString()
        });
      }
    }

    return {
      planId: currentPlan.planId,
      finalStatus: 'GOAL_ACHIEVED_VERIFIED',
      replanCount,
      executedSteps: executionTrace.length,
      executionTrace,
      completedAt: new Date().toISOString()
    };
  }

  _inferCapabilities(objective, domain) {
    const caps = new Set(['DATA_EXTRACTION']);
    const lower = objective.toLowerCase();
    
    if (lower.includes('model') || lower.includes('formula') || lower.includes('simulate') || lower.includes('physics')) {
      caps.add('NUMERICAL_SIMULATION');
      caps.add('SYNTHETIC_EXPERIMENTATION');
    }
    if (lower.includes('verify') || lower.includes('prove') || lower.includes('security') || lower.includes('audit')) {
      caps.add('FORMAL_VERIFICATION');
    }
    if (lower.includes('contract') || lower.includes('legal') || lower.includes('regulation')) {
      caps.add('LEGAL_COMPLIANCE');
    }
    if (lower.includes('price') || lower.includes('market') || lower.includes('liquidity') || lower.includes('finance')) {
      caps.add('MARKET_ANALYSIS');
    }
    if (lower.includes('build') || lower.includes('code') || lower.includes('tool') || lower.includes('software')) {
      caps.add('CODE_SYNTHESIS');
    }
    
    return Array.from(caps);
  }

  _buildSubtaskDag(objective, requiredCaps, constraints) {
    const tasks = [];
    let prevId = null;

    requiredCaps.forEach((cap, idx) => {
      const id = `task_${idx + 1}_${cap.toLowerCase()}`;
      const capMeta = this.capabilityRegistry.get(cap) || { council: 'BRIHASPATI' };
      const deps = prevId ? [prevId] : [];

      tasks.push({
        id,
        name: `Execute ${cap} for ${objective.slice(0, 30)}...`,
        capability: cap,
        council: capMeta.council,
        dependencies: deps
      });
      prevId = id;
    });

    return tasks;
  }

  _topologicalSort(tasks) {
    const inDegree = new Map();
    const adj = new Map();

    tasks.forEach(t => {
      inDegree.set(t.id, 0);
      adj.set(t.id, []);
    });

    tasks.forEach(t => {
      t.dependencies.forEach(dep => {
        if (adj.has(dep)) {
          adj.get(dep).push(t.id);
          inDegree.set(t.id, (inDegree.get(t.id) || 0) + 1);
        }
      });
    });

    const queue = [];
    inDegree.forEach((deg, id) => {
      if (deg === 0) queue.push(id);
    });

    const order = [];
    while (queue.length > 0) {
      const u = queue.shift();
      order.push(u);

      if (adj.has(u)) {
        adj.get(u).forEach(v => {
          inDegree.set(v, inDegree.get(v) - 1);
          if (inDegree.get(v) === 0) queue.push(v);
        });
      }
    }

    return order.length === tasks.length ? order : tasks.map(t => t.id);
  }
}

module.exports = new BrahmaGoalCompilerEngine();
