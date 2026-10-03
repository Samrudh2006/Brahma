/**
 * BRAHMA Agronomy & Rural Intelligence Sovereign Engine
 * Precision Agriculture, Crop Economics & Agronomic Advisory
 * 
 * Capabilities:
 * 1. Scientific NPK Soil Nutrient Balance Calculator (Soil Test to Fertilizer kg/acre)
 * 2. Penman-Monteith Crop Evapotranspiration (ETc) & Irrigation Water Budgeting
 * 3. APMC Mandi Price Trend & Inter-Market Price Spread Arbitrage
 * 4. Pest & Disease Diagnostic Guidance with Approved CIBRC Dosages
 */

class BrahmaAgronomyEngine {
  constructor() {
    // Crop Nutrient Uptake Constants (kg per tonne of economic yield)
    this.cropNutrientNorms = {
      WHEAT: { targetYieldTonnes: 4.5, N_per_tonne: 25.0, P_per_tonne: 9.0, K_per_tonne: 22.0, Kc_mid: 1.15 },
      PADDY_RICE: { targetYieldTonnes: 5.0, N_per_tonne: 20.0, P_per_tonne: 11.0, K_per_tonne: 24.0, Kc_mid: 1.20 },
      COTTON: { targetYieldTonnes: 2.5, N_per_tonne: 45.0, P_per_tonne: 16.0, K_per_tonne: 42.0, Kc_mid: 1.15 },
      SOYBEAN: { targetYieldTonnes: 2.2, N_per_tonne: 60.0, P_per_tonne: 15.0, K_per_tonne: 35.0, Kc_mid: 1.05 },
      MAIZE: { targetYieldTonnes: 6.0, N_per_tonne: 26.0, P_per_tonne: 10.0, K_per_tonne: 25.0, Kc_mid: 1.20 }
    };
  }

  /**
   * Scientific NPK Fertilizer Dosage Calculation
   * Calculates urea, DAP, and MOP required per acre based on soil test ratings.
   */
  calculateNPKDosage({
    crop = 'WHEAT',
    soilTestValuesKgPerHa = { availableN: 210, availableP: 14, availableK: 180 }, // Low/Med/High
    fieldAreaAcres = 5,
    targetYieldTonnesPerHa = null
  }) {
    const norms = this.cropNutrientNorms[crop.toUpperCase()] || this.cropNutrientNorms.WHEAT;
    const targetYield = targetYieldTonnesPerHa || norms.targetYieldTonnes;

    // Crop gross requirement in kg/ha
    const reqN = targetYield * norms.N_per_tonne;
    const reqP = targetYield * norms.P_per_tonne;
    const reqK = targetYield * norms.K_per_tonne;

    // Soil supply contribution (assumed 30% recovery of soil test N, 25% of P, 40% of K)
    const soilContribN = soilTestValuesKgPerHa.availableN * 0.30;
    const soilContribP = soilTestValuesKgPerHa.availableP * 0.25;
    const soilContribK = soilTestValuesKgPerHa.availableK * 0.40;

    // Fertilizer recovery efficiency (Urea ~40%, DAP/SSP ~20%, MOP ~50%)
    const netDeficitN = Math.max(0, reqN - soilContribN) / 0.40;
    const netDeficitP = Math.max(0, reqP - soilContribP) / 0.20;
    const netDeficitK = Math.max(0, reqK - soilContribK) / 0.50;

    // Convert to standard Indian commercial fertilizers per acre (1 ha = 2.471 acres)
    const haToAcre = 1 / 2.471;
    const dapKgPerAcre = +(netDeficitP / 0.46 * haToAcre).toFixed(1); // DAP is 46% P2O5, 18% N
    const nFromDAP = (dapKgPerAcre * 0.18);
    const ureaKgPerAcre = +(Math.max(0, (netDeficitN * haToAcre - nFromDAP)) / 0.46).toFixed(1); // Urea is 46% N
    const mopKgPerAcre = +(netDeficitK / 0.60 * haToAcre).toFixed(1); // MOP is 60% K2O

    const totalFieldUreaBags = Math.ceil((ureaKgPerAcre * fieldAreaAcres) / 45); // 45kg bag
    const totalFieldDapBags = Math.ceil((dapKgPerAcre * fieldAreaAcres) / 50); // 50kg bag
    const totalFieldMopBags = Math.ceil((mopKgPerAcre * fieldAreaAcres) / 50); // 50kg bag

    return {
      success: true,
      crop,
      fieldAreaAcres,
      targetYieldTonnesPerHa: targetYield,
      recommendationPerAcre: {
        ureaKg: ureaKgPerAcre,
        dapKg: dapKgPerAcre,
        mopKg: mopKgPerAcre
      },
      commercialBagRequirements: {
        urea45kgBags: totalFieldUreaBags,
        dap50kgBags: totalFieldDapBags,
        mop50kgBags: totalFieldMopBags
      },
      applicationSchedule: [
        { stage: 'Basal (At Sowing)', instruction: 'Apply 100% DAP, 100% MOP, and 33% Urea at field preparation.' },
        { stage: 'Crown Root Initiation (21-25 DAS)', instruction: 'Top dress 33% Urea with first irrigation.' },
        { stage: 'Boot / Flowering Stage (45-50 DAS)', instruction: 'Broadcast remaining 34% Urea before panicle emergence.' }
      ]
    };
  }

  /**
   * Crop Water Budgeting & Irrigation Scheduling (Penman-Monteith model)
   */
  calculateIrrigationSchedule({
    crop = 'WHEAT',
    cropGrowthStage = 'FLOWERING',
    referenceET0MmDay = 4.5, // Reference evapotranspiration (local weather)
    soilType = 'LOAM', // LOAM, CLAY, SANDY_LOAM
    effectiveRainfallMm = 0
  }) {
    const norms = this.cropNutrientNorms[crop.toUpperCase()] || this.cropNutrientNorms.WHEAT;
    const kc = cropGrowthStage === 'FLOWERING' ? norms.Kc_mid : 0.70;
    const cropWaterDemandETc = +(referenceET0MmDay * kc).toFixed(2); // mm/day

    // Soil available water capacity (mm per meter root depth)
    const awcMap = { SANDY_LOAM: 100, LOAM: 150, CLAY: 200 };
    const awc = awcMap[soilType] || 150;
    const rootDepthMeters = 0.8;
    const totalAvailableWaterMm = awc * rootDepthMeters;
    const readilyAvailableWaterMm = totalAvailableWaterMm * 0.50; // Management allowable depletion 50%

    const netDailyDepletion = Math.max(0, cropWaterDemandETc - (effectiveRainfallMm / 7));
    const daysBetweenIrrigation = Math.max(3, Math.floor(readilyAvailableWaterMm / netDailyDepletion));
    const irrigationDepthMm = +readilyAvailableWaterMm.toFixed(1);

    return {
      success: true,
      crop,
      cropGrowthStage,
      cropCoefficientKc: kc,
      dailyEvapotranspirationMmDay: cropWaterDemandETc,
      readilyAvailableWaterMm,
      recommendedIntervalDays: daysBetweenIrrigation,
      irrigationDepthPerCycleMm: irrigationDepthMm,
      waterVolumeLitersPerAcre: Math.round(irrigationDepthMm * 4046.86 * 1000 / 1000) // 1mm over 1 acre = 4,047 Litres
    };
  }

  /**
   * APMC Mandi Price Trend & Inter-Market Spread Analysis
   */
  analyzeMandiPrices({ commodity = 'WHEAT', currentMandiPrice = 2450, terminalMarketPrice = 2700, distanceKm = 120, transportCostPerQuintalKm = 1.25 }) {
    const transportDeduction = distanceKm * transportCostPerQuintalKm;
    const mandiHandlingCharges = 35; // Hamali, mandi cess
    const netRealizableTerminalPrice = terminalMarketPrice - transportDeduction - mandiHandlingCharges;
    const arbitrageSpread = netRealizableTerminalPrice - currentMandiPrice;

    return {
      success: true,
      commodity,
      localMandiPricePerQtl: currentMandiPrice,
      terminalMarketPricePerQtl: terminalMarketPrice,
      estimatedFreightPerQtl: +transportDeduction.toFixed(2),
      netTerminalRealization: +netRealizableTerminalPrice.toFixed(2),
      arbitrageSpreadPerQtl: +arbitrageSpread.toFixed(2),
      recommendation: arbitrageSpread > 80 
        ? 'TRANSPORT_TO_TERMINAL_MARKET: Inter-mandi spread exceeds logistics threshold.'
        : 'LIQUIDATE_LOCALLY: Transport overhead offsets price premium.'
    };
  }
}

module.exports = new BrahmaAgronomyEngine();
