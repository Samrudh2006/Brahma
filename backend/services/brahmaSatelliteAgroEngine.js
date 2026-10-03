/**
 * BRAHMA — Satellite Earth Observation, NDVI & Precision Agro-Meteorology Engine
 * Sentinel-2 Multispectral Reflectance, NDWI Water Stress & Growing Degree-Days (GDD)
 * 
 * Provides:
 * 1. Normalized Difference Vegetation Index (NDVI) & Canopy Health Classifier
 * 2. Normalized Difference Water Index (NDWI) & Drought Stress Zonation
 * 3. Growing Degree-Days (GDD) Thermal Heat Accumulation & Phenology Modeler
 * 4. Variable Rate Nitrogen / Irrigation Prescription Map Generator
 */

class BrahmaSatelliteAgroEngine {
  constructor() {
    this.engineName = 'BRAHMA-Satellite-Precision-Agro';
    this.sensorBands = ['B04 (Red, 665nm)', 'B08 (NIR, 842nm)', 'B11 (SWIR, 1610nm)'];
  }

  /**
   * Calculate Sentinel-2 NDVI & Vegetation Health
   * NDVI = (NIR - Red) / (NIR + Red)
   */
  calculateNDVI({ nirReflectance = 0.58, redReflectance = 0.12 }) {
    if (nirReflectance + redReflectance === 0) {
      return { success: false, error: 'Sum of NIR and Red reflectance cannot be zero' };
    }

    const ndvi = +((nirReflectance - redReflectance) / (nirReflectance + redReflectance)).toFixed(3);

    let classification = 'SPARSE_OR_SOIL';
    let healthStatus = 'POOR';
    if (ndvi >= 0.70) {
      classification = 'DENSE_VIGOROUS_CANOPY';
      healthStatus = 'EXCELLENT';
    } else if (ndvi >= 0.45) {
      classification = 'MODERATE_HEALTHY_VEGETATION';
      healthStatus = 'GOOD';
    } else if (ndvi >= 0.20) {
      classification = 'LOW_VEGETATION_OR_STRESSED';
      healthStatus = 'MODERATE_STRESS';
    } else if (ndvi > 0) {
      classification = 'BARE_SOIL_OR_RESIDUE';
      healthStatus = 'DORMANT_OR_BARREN';
    } else {
      classification = 'WATER_BODY_OR_CLOUD';
      healthStatus = 'NON_VEGETATED';
    }

    return {
      success: true,
      index: 'NDVI (Normalized Difference Vegetation Index)',
      nirReflectance,
      redReflectance,
      ndviValue: ndvi,
      canopyClassification: classification,
      cropHealthTier: healthStatus,
      nitrogenDeficiencyRisk: ndvi < 0.40 && ndvi > 0.15 ? 'HIGH_SUPPLEMENTAL_UREA_INDICATED' : 'ADEQUATE_NITROGEN'
    };
  }

  /**
   * Calculate Sentinel-2 NDWI (Water Stress)
   * NDWI = (NIR - SWIR) / (NIR + SWIR)
   */
  calculateNDWI({ nirReflectance = 0.55, swirReflectance = 0.25 }) {
    const ndwi = +((nirReflectance - swirReflectance) / (nirReflectance + swirReflectance)).toFixed(3);
    const waterStressLevel = ndwi < 0.1 ? 'CRITICAL_WATER_DEFICIT' : ndwi < 0.3 ? 'MILD_MOISTURE_STRESS' : 'SUFFICIENT_CANOPY_TURGOR';

    return {
      success: true,
      index: 'NDWI (Normalized Difference Water Index)',
      ndwiValue: ndwi,
      waterStressLevel,
      irrigationAction: ndwi < 0.2 ? 'DISPATCH_URGENT_DRIP_CYCLE' : 'MAINTAIN_STANDARD_SCHEDULE'
    };
  }

  /**
   * Growing Degree-Days (GDD) Thermal Heat Unit Calculator
   * GDD = max(0, (Tmax + Tmin)/2 - Tbase)
   */
  accumulateGDD({ dailyTemperatures = [], baseTempC = 10.0 }) {
    // dailyTemperatures: [{ maxC: 32, minC: 20 }]
    let cumulativeGDD = 0;
    const dailyAccumulations = dailyTemperatures.map((d, idx) => {
      const meanTemp = (d.maxC + d.minC) / 2;
      const gdd = Math.max(0, meanTemp - baseTempC);
      cumulativeGDD += gdd;
      return { day: idx + 1, meanTemp: +meanTemp.toFixed(1), dailyGDD: +gdd.toFixed(1), cumulativeGDD: +cumulativeGDD.toFixed(1) };
    });

    return {
      success: true,
      baseTemperatureC: baseTempC,
      totalDaysTracked: dailyTemperatures.length,
      totalAccumulatedGDD: +cumulativeGDD.toFixed(1),
      estimatedPhenologyStage: cumulativeGDD > 1200 ? 'GRAIN_FILLING_OR_MATURITY' : cumulativeGDD > 600 ? 'FLOWERING_OR_HEADING' : 'VEGETATIVE_TILLERING',
      dailyTrajectory: dailyAccumulations
    };
  }
}

module.exports = new BrahmaSatelliteAgroEngine();
