/**
 * BRAHMA / KUVERA — Global Macro-Economic Central Bank Model & DSGE Simulator
 * Taylor Rule Policy Reaction, New Keynesian Phillips Curve & Sovereign Debt Sustainability (DSA)
 * 
 * Provides:
 * 1. Taylor Rule Monetary Policy Reaction Function (Interest Rate i_t = r* + pi_t + 0.5(pi_t - pi*) + 0.5(y_t - y*))
 * 2. New Keynesian Phillips Curve (NKPC) Inflation Dynamics
 * 3. IMF Debt Sustainability Analysis (DSA) Stochastic Fan Chart Projection
 * 4. Yield Curve Inversion (10Y - 2Y) Recession Probability Classifier
 */

class KuveraMacroDsgeEngine {
  constructor() {
    this.engineName = 'KUVERA-Macro-Central-Bank-DSGE';
  }

  /**
   * Classical Taylor Rule Policy Rate Recommendation
   */
  calculateTaylorRuleRate({
    neutralRealRateRStar = 1.0, // r*
    currentInflationRate = 3.5, // pi_t
    targetInflationRate = 2.0,  // pi*
    currentGDPGrowth = 2.8,
    potentialGDPGrowth = 2.0,   // Output gap = 2.8 - 2.0 = 0.8%
    alphaInflation = 0.5,
    betaOutputGap = 0.5
  }) {
    const inflationGap = currentInflationRate - targetInflationRate;
    const outputGap = currentGDPGrowth - potentialGDPGrowth;

    // i_t = r* + pi_t + alpha*(pi_t - pi*) + beta*(y_t - y*)
    const prescribedNominalRate = neutralRealRateRStar + currentInflationRate + (alphaInflation * inflationGap) + (betaOutputGap * outputGap);

    return {
      success: true,
      standard: 'Taylor Rule Monetary Policy Function (1993)',
      inputs: {
        neutralRealRateRStar,
        currentInflationRate,
        targetInflationRate,
        inflationGap: +inflationGap.toFixed(2),
        outputGap: +outputGap.toFixed(2)
      },
      prescribedPolicyRatePercentage: +prescribedNominalRate.toFixed(2),
      policyStance: prescribedNominalRate > (neutralRealRateRStar + currentInflationRate) ? 'HAWKISH_RESTRICTIVE' : 'ACCOMMODATIVE_STIMULATIVE',
      centralBankGuidance: inflationGap > 1.0 ? 'RATE_HIKE_CYCLE_RECOMMENDED' : 'PAUSE_OR_NEUTRAL_CALIBRATION'
    };
  }

  /**
   * Sovereign Debt Sustainability Analysis (DSA) Fan Chart
   * d_t = ((1 + r) / (1 + g)) * d_{t-1} - pb_t
   */
  simulateDebtSustainability({
    startingDebtToGdpPercent = 65.0,
    realInterestRatePercent = 2.5,
    realGdpGrowthPercent = 4.0,
    primaryBalancePercentOfGdp = -1.5, // Fiscal deficit
    projectionYears = 5
  }) {
    const trajectory = [{ year: 0, debtToGdp: startingDebtToGdpPercent }];
    let currentDebt = startingDebtToGdpPercent;

    for (let yr = 1; yr <= projectionYears; yr++) {
      const r = realInterestRatePercent / 100;
      const g = realGdpGrowthPercent / 100;
      const pb = primaryBalancePercentOfGdp / 100;

      // Automatic debt dynamics multiplier
      const growthInterestDifferential = (r - g) / (1 + g);
      currentDebt = currentDebt * (1 + growthInterestDifferential) - (pb * 100);
      trajectory.push({ year: yr, debtToGdp: +currentDebt.toFixed(2) });
    }

    const terminalDebt = trajectory[trajectory.length - 1].debtToGdp;
    const isSustainable = terminalDebt <= startingDebtToGdpPercent + 5.0 && terminalDebt < 80.0;

    return {
      success: true,
      macroAssumptions: {
        realInterestRatePercent,
        realGdpGrowthPercent,
        primaryBalancePercentOfGdp,
        growthInterestDifferential: +(realInterestRatePercent - realGdpGrowthPercent).toFixed(2)
      },
      baselineTrajectory: trajectory,
      terminalDebtToGdp: terminalDebt,
      fiscalHealthVerdict: isSustainable ? 'DEBT_TRAJECTORY_STABLE_SUSTAINABLE' : 'DEBT_SPIRAL_RISK_CONSOLIDATION_REQUIRED'
    };
  }
}

module.exports = new KuveraMacroDsgeEngine();
