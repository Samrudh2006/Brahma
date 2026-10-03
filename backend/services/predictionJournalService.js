/**
 * BRAHMA Sovereign Prediction Journal & Brier Calibration Engine
 * 
 * Tracks forecast calibration across sovereign quant trades and prediction markets.
 * Invariant: Models must track Brier calibration scores:
 *   Brier Score = (1/N) * sum((forecast_i - outcome_i)^2)
 * If calibration degrades (Brier Score > 0.20), conviction sizing is automatically throttled.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class PredictionJournalService {
  constructor() {
    this.journalDir = path.join(process.cwd(), '.brahma', 'journal');
    this.journalFile = path.join(this.journalDir, 'prediction_journal.json');
    this.predictions = [];
    this._initStorage();
  }

  _initStorage() {
    try {
      if (!fs.existsSync(this.journalDir)) {
        fs.mkdirSync(this.journalDir, { recursive: true });
      }
      if (fs.existsSync(this.journalFile)) {
        const raw = fs.readFileSync(this.journalFile, 'utf8');
        this.predictions = JSON.parse(raw);
      } else {
        this.predictions = [];
        this._save();
      }
    } catch {
      this.predictions = [];
    }
  }

  _save() {
    try {
      fs.writeFileSync(this.journalFile, JSON.stringify(this.predictions, null, 2), 'utf8');
    } catch {
      // Non-fatal if filesystem is restricted
    }
  }

  /**
   * Record a new probabilistic forecast
   * @param {Object} entry - { symbol, forecastProbability, marketImpliedProbability, horizon, rationale, proposedNotional }
   */
  recordForecast({
    symbol = 'NIFTY_50',
    forecastProbability = 0.65,
    marketImpliedProbability = 0.50,
    horizon = '1_DAY',
    rationale = 'RSI bullish divergence + earnings guidance beat',
    proposedNotional = 50000
  } = {}) {
    const id = `pred_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const clampedForecast = Math.max(0.01, Math.min(0.99, Number(forecastProbability)));
    const clampedMarket = Math.max(0.01, Math.min(0.99, Number(marketImpliedProbability)));

    // Calibration factor based on historical performance
    const calibrationMetrics = this.getCalibrationScore();
    const calibratedNotional = +(proposedNotional * calibrationMetrics.convictionMultiplier).toFixed(2);

    const record = {
      id,
      timestamp: new Date().toISOString(),
      symbol: symbol.toUpperCase(),
      forecastProbability: clampedForecast,
      marketImpliedProbability: clampedMarket,
      divergence: +(clampedForecast - clampedMarket).toFixed(4),
      horizon,
      rationale,
      proposedNotional,
      calibratedNotional,
      convictionMultiplier: calibrationMetrics.convictionMultiplier,
      status: 'OPEN_PENDING_SETTLEMENT',
      outcome: null,
      settledAt: null,
      brierError: null
    };

    this.predictions.push(record);
    this._save();

    return {
      success: true,
      prediction: record,
      calibrationStatus: calibrationMetrics
    };
  }

  /**
   * Settle a forecast with binary ground truth outcome (1 for event happened, 0 for failed)
   */
  settleForecast(predictionId, outcome) {
    const record = this.predictions.find(p => p.id === predictionId);
    if (!record) {
      return { success: false, error: `Prediction ${predictionId} not found` };
    }

    const binaryOutcome = outcome ? 1 : 0;
    const brierError = +Math.pow(record.forecastProbability - binaryOutcome, 2).toFixed(4);
    const marketBrierError = +Math.pow(record.marketImpliedProbability - binaryOutcome, 2).toFixed(4);
    const brierDelta = +(brierError - marketBrierError).toFixed(4); // negative means agent was better than market

    record.status = 'SETTLED';
    record.outcome = binaryOutcome;
    record.settledAt = new Date().toISOString();
    record.brierError = brierError;
    record.marketBrierError = marketBrierError;
    record.brierDelta = brierDelta;

    this._save();

    return {
      success: true,
      predictionId,
      settledOutcome: binaryOutcome,
      brierError,
      marketBrierError,
      brierDelta,
      agentOutperformedMarket: brierDelta < 0,
      retrospective: brierDelta <= 0
        ? 'Well-calibrated forecast; model successfully captured market mispricing.'
        : 'Overconfident forecast; calibration variance logged for conviction attenuation.'
    };
  }

  /**
   * Compute comprehensive Brier Score and calibration metrics across all settled predictions
   */
  getCalibrationScore() {
    const settled = this.predictions.filter(p => p.status === 'SETTLED' && typeof p.brierError === 'number');

    if (settled.length === 0) {
      return {
        totalForecasts: this.predictions.length,
        settledForecasts: 0,
        brierScore: 0.15, // Baseline initial calibration
        marketBrierScore: 0.20,
        brierDelta: -0.05,
        calibrationQuality: 'NOMINAL_CALIBRATION_BASELINE',
        convictionMultiplier: 1.0
      };
    }

    const totalBrier = settled.reduce((sum, p) => sum + p.brierError, 0);
    const totalMarketBrier = settled.reduce((sum, p) => sum + p.marketBrierError, 0);

    const brierScore = +(totalBrier / settled.length).toFixed(4);
    const marketBrierScore = +(totalMarketBrier / settled.length).toFixed(4);
    const brierDelta = +(brierScore - marketBrierScore).toFixed(4);

    // Multiplier determines safe position sizing adjustment
    let convictionMultiplier = 1.0;
    let calibrationQuality = 'SUPERIOR_CALIBRATION';

    if (brierScore <= 0.12) {
      convictionMultiplier = 1.15; // High confidence boost
      calibrationQuality = 'EXEMPLARY_CALIBRATION';
    } else if (brierScore <= 0.20) {
      convictionMultiplier = 1.0;
      calibrationQuality = 'OPTIMAL_CALIBRATION';
    } else if (brierScore <= 0.28) {
      convictionMultiplier = 0.70; // Overconfidence penalty
      calibrationQuality = 'DEGRADED_OVERCONFIDENCE_WARNING';
    } else {
      convictionMultiplier = 0.40; // Severe dampening to protect capital
      calibrationQuality = 'POOR_CALIBRATION_CAPITAL_PRESERVATION';
    }

    return {
      totalForecasts: this.predictions.length,
      settledForecasts: settled.length,
      brierScore,
      marketBrierScore,
      brierDelta,
      calibrationQuality,
      convictionMultiplier
    };
  }

  /**
   * Reset or clear journal (for testing or clean environment runs)
   */
  clearJournal() {
    this.predictions = [];
    this._save();
    return { success: true, cleared: true };
  }
}

module.exports = new PredictionJournalService();
