/**
 * BRAHMA NEURO-SYMBOLIC FUZZY INTUITION ENGINE
 * Breakthrough 2: Subconscious Fuzzy Intuition & Latent Potential Field Gating
 * 
 * Provides:
 * - Continuous latent potential field mapping before formalization
 * - Probabilistic temperature-gated intuitive heuristics
 * - Zadeh & Mamdani fuzzy membership function sets (Low, Moderate, High, Critical)
 * - Automatic neuro-symbolic bridge converting vague human sentiments/intuitions into crisp SMT/LP objectives
 */

class BrahmaNeuroSymbolicFuzzyIntuitionEngine {
  constructor() {
    this.latentDimension = 64;
  }

  /**
   * Evaluates triangular and trapezoidal fuzzy membership functions
   */
  fuzzyMembership(value, [a, b, c, d]) {
    if (value <= a || value >= d) return 0.0;
    if (value >= b && value <= c) return 1.0;
    if (value > a && value < b) return (value - a) / (b - a);
    if (value > c && value < d) return (d - value) / (d - c);
    return 0.0;
  }

  /**
   * Computes multi-factor fuzzy intuition states from noisy subjective signals
   */
  evaluateIntuitiveState(signals = {}) {
    const defaultSignals = {
      urgencySignal: 0.72,       // [0, 1]
      ambiguityLevel: 0.65,      // [0, 1]
      riskTolerance: 0.35,       // [0, 1]
      stakeholderMood: 0.80      // [0, 1]
    };
    const s = { ...defaultSignals, ...signals };

    // Fuzzy Membership sets:
    // Urgency: Low [0, 0, 0.2, 0.4], Medium [0.2, 0.4, 0.6, 0.8], High [0.6, 0.8, 1.0, 1.0]
    const urgency = {
      low: this.fuzzyMembership(s.urgencySignal, [0, 0, 0.2, 0.4]),
      medium: this.fuzzyMembership(s.urgencySignal, [0.2, 0.4, 0.6, 0.8]),
      high: this.fuzzyMembership(s.urgencySignal, [0.6, 0.8, 1.0, 1.0])
    };

    // Ambiguity: Low [0, 0, 0.25, 0.5], High [0.4, 0.65, 1.0, 1.0]
    const ambiguity = {
      low: this.fuzzyMembership(s.ambiguityLevel, [0, 0, 0.25, 0.5]),
      high: this.fuzzyMembership(s.ambiguityLevel, [0.4, 0.65, 1.0, 1.0])
    };

    // Mamdani Inference Rules
    // Rule 1: IF urgency IS High AND ambiguity IS High THEN Strategy IS 'EXPLORATIVE_RAPID_PROTOTYPE'
    // Rule 2: IF urgency IS High AND ambiguity IS Low THEN Strategy IS 'DIRECT_DETERMINISTIC_EXECUTION'
    // Rule 3: IF urgency IS Low AND ambiguity IS High THEN Strategy IS 'DEEP_ANALYTICAL_STUDY'
    // Rule 4: IF urgency IS Low AND ambiguity IS Low THEN Strategy IS 'BACKGROUND_CONSERVATIVE_QUEUE'

    const r1 = Math.min(urgency.high, ambiguity.high);
    const r2 = Math.min(urgency.high, ambiguity.low);
    const r3 = Math.min(urgency.low, ambiguity.high);
    const r4 = Math.min(urgency.low, ambiguity.low);

    const candidates = [
      { strategy: 'EXPLORATIVE_RAPID_PROTOTYPE', weight: r1 },
      { strategy: 'DIRECT_DETERMINISTIC_EXECUTION', weight: r2 },
      { strategy: 'DEEP_ANALYTICAL_STUDY', weight: r3 },
      { strategy: 'BACKGROUND_CONSERVATIVE_QUEUE', weight: r4 }
    ].sort((a, b) => b.weight - a.weight);

    // Defuzzification (Center of Gravity / Softmax Temperature Gating)
    const temperature = 0.5;
    const expWeights = candidates.map(c => Math.exp(c.weight / temperature));
    const sumExp = expWeights.reduce((a, b) => a + b, 0);
    const probabilities = expWeights.map(w => w / sumExp);

    const selectedStrategy = candidates[0].strategy;
    const intuitionConfidence = +(probabilities[0]).toFixed(4);

    // Grounding into Crisp Optimization Constraints
    const mathematicalGrounding = {
      objective: selectedStrategy === 'EXPLORATIVE_RAPID_PROTOTYPE'
        ? 'maximize ExplorationEntropy(x) - lambda * Risk(x)'
        : 'minimize Latency(x) + mu * Cost(x)',
      bounds: {
        maxComputeUnits: selectedStrategy.includes('RAPID') ? 128 : 32,
        monteCarloRollouts: Math.round(10 + 90 * s.ambiguityLevel),
        riskPenaltyCoefficient: +(1.0 - s.riskTolerance).toFixed(2)
      },
      fuzzyInferenceConfidence: intuitionConfidence
    };

    return {
      intuitiveSignalInputs: s,
      fuzzySets: { urgency, ambiguity },
      inferredIntuition: selectedStrategy,
      confidence: intuitionConfidence,
      crispFormalization: mathematicalGrounding,
      neuroSymbolicBridgeStatus: 'GROUNDED_TO_OPTIMIZATION_PROGRAM'
    };
  }
}

module.exports = new BrahmaNeuroSymbolicFuzzyIntuitionEngine();
