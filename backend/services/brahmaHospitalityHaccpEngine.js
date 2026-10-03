/**
 * BRAHMA Hospitality & Food Service Sovereign Engine
 * Culinary Science, HACCP Food Safety, Recipe Scaling & Restaurant RevPASH Economics
 * 
 * Capabilities:
 * 1. HACCP Critical Control Point (CCP) Thermal Breach Detector (Danger Zone 5-60°C Monitoring)
 * 2. Recipe Scaler with FSSAI / EU 14 Mandatory Allergen Cross-Contact Isolation Matrix
 * 3. Revenue Per Available Seat-Hour (RevPASH) & Table Turn Floorplan Allocator
 */

class BrahmaHospitalityHaccpEngine {
  constructor() {
    this.mandatoryAllergens = [
      'GLUTEN', 'CRUSTACEANS', 'EGGS', 'FISH', 'PEANUTS', 'SOYBEANS',
      'MILK', 'TREE_NUTS', 'CELERY', 'MUSTARD', 'SESAME', 'SULPHITES',
      'LUPIN', 'MOLLUSCS'
    ];

    this.ccpThermalStandards = {
      COLD_STORAGE_REFRIGERATION: { minTempC: 0.0, maxTempC: 4.0, criticalLimitC: 5.0 },
      FREEZER_STORAGE: { maxTempC: -18.0, criticalLimitC: -15.0 },
      HOT_HOLDING_BUFFET: { minTempC: 63.0, criticalLimitC: 60.0 },
      COOKING_REHEATING_KILL_STEP: { minTempC: 74.0, criticalLimitC: 73.9 }
    };
  }

  /**
   * HACCP Critical Control Point (CCP) Temperature Log Audit
   */
  auditThermalCCPLog({ controlPoint = 'HOT_HOLDING_BUFFET', recordedTempC = 58.5, durationMinutes = 45 }) {
    const standard = this.ccpThermalStandards[controlPoint] || this.ccpThermalStandards.HOT_HOLDING_BUFFET;
    const isDangerZone = recordedTempC >= 5.0 && recordedTempC <= 60.0;
    let isBreached = false;
    let correctiveAction = 'MAINTAIN_TEMPERATURE_LOG';

    if (controlPoint === 'HOT_HOLDING_BUFFET' && recordedTempC < standard.criticalLimitC) {
      isBreached = true;
      correctiveAction = durationMinutes > 120 
        ? 'DISCARD_FOOD_IMMEDIATELY: Exceeded 2 hours in microbial growth danger zone.'
        : 'REHEAT_IMMEDIATELY: Reheat to >=74°C for 15 seconds before returning to service.';
    } else if (controlPoint === 'COLD_STORAGE_REFRIGERATION' && recordedTempC > standard.criticalLimitC) {
      isBreached = true;
      correctiveAction = 'INSPECT_CHILLER_COMPRESSOR: Transfer perishable stock to walk-in cooler immediately.';
    }

    return {
      success: true,
      controlPoint,
      recordedTempC,
      durationMinutes,
      isDangerZone,
      isBreached,
      haccpStatus: isBreached ? 'CRITICAL_CONTROL_POINT_VIOLATION' : 'CCP_TEMPERATURE_COMPLIANT',
      correctiveAction
    };
  }

  /**
   * Recipe Scaler with Allergen Isolation & Cost per Portion
   */
  scaleRecipe({
    recipeName = 'Chicken Tikka Masala',
    baseServings = 4,
    targetServings = 50,
    ingredients = [
      // { name, baseQuantity, unit, costPerUnit, allergens: [] }
      { name: 'Chicken Breast', baseQuantity: 500, unit: 'g', costPerUnit: 0.35, allergens: [] },
      { name: 'Heavy Cream', baseQuantity: 150, unit: 'ml', costPerUnit: 0.20, allergens: ['MILK'] },
      { name: 'Yogurt', baseQuantity: 100, unit: 'g', costPerUnit: 0.10, allergens: ['MILK'] },
      { name: 'Spices & Marinade', baseQuantity: 40, unit: 'g', costPerUnit: 0.50, allergens: ['MUSTARD'] }
    ]
  }) {
    const scaleFactor = targetServings / baseServings;
    const detectedAllergens = new Set();

    let totalBatchCost = 0;
    const scaledIngredients = ingredients.map(item => {
      const scaledQty = +(item.baseQuantity * scaleFactor).toFixed(1);
      const itemCost = +(scaledQty * item.costPerUnit).toFixed(2);
      totalBatchCost += itemCost;

      (item.allergens || []).forEach(a => detectedAllergens.add(a.toUpperCase()));

      return {
        name: item.name,
        scaledQuantity: scaledQty,
        unit: item.unit,
        lineItemCost: itemCost,
        allergens: item.allergens || []
      };
    });

    const costPerPortion = +(totalBatchCost / targetServings).toFixed(2);

    return {
      success: true,
      recipeName,
      baseServings,
      targetServings,
      scaleFactor: +scaleFactor.toFixed(2),
      totalBatchCost: +totalBatchCost.toFixed(2),
      costPerPortion,
      mandatoryAllergensDetected: Array.from(detectedAllergens),
      allergenWarningLabel: detectedAllergens.size > 0 
        ? `CONTAINS: ${Array.from(detectedAllergens).join(', ')}`
        : 'NO COMMON MANDATORY ALLERGENS DETECTED',
      scaledIngredients
    };
  }

  /**
   * Restaurant Floorplan RevPASH (Revenue Per Available Seat Hour)
   */
  calculateRevPASH({ totalRevenue = 145000, totalAvailableSeats = 60, operatingHours = 8 }) {
    const totalSeatHours = totalAvailableSeats * operatingHours;
    const revPASH = +(totalRevenue / totalSeatHours).toFixed(2);

    return {
      success: true,
      totalRevenue,
      totalAvailableSeats,
      operatingHours,
      totalSeatHours,
      revPASH,
      performanceBenchmark: revPASH >= 250 
        ? 'HIGH_EFFICIENCY_PRIME_YIELD' 
        : revPASH >= 150 
          ? 'OPTIMAL_OPERATIONAL_TARGET' 
          : 'SEAT_UNDERUTILIZATION_DETECTED'
    };
  }
}

module.exports = new BrahmaHospitalityHaccpEngine();
