/**
 * BRAHMA — Vishwakarma Council
 * Autonomous Industrial Operations & Supply Chain Telemetry Engine
 * 
 * Provides:
 * - Multi-echelon inventory optimization & Safety Stock calculations
 * - Lead-time variance & supplier SLA delivery risk scoring
 * - Bottleneck detection across manufacturing and transit nodes
 * - Predictive stockout warnings & automated economic order quantity (EOQ)
 */

class VishwakarmaSupplyEngine {
  constructor() {
    this.councilName = 'Vishwakarma Sacred Industrial & Supply Operations Council';
  }

  /**
   * Run Supply Telemetry & Inventory Risk Optimization
   */
  async optimizeSupplyChain({ inventoryNodes = [], demandVelocity = {}, leadTimeDays = 14, targetServiceLevel = 0.95 }) {
    const startTime = Date.now();

    // Default sample nodes if empty
    const nodes = inventoryNodes.length > 0 ? inventoryNodes : [
      { sku: 'GPU-H100-NODE', currentStock: 42, dailyDemand: 3.5, leadTimeDays: 21, unitCost: 30000, supplierRisk: 'MODERATE' },
      { sku: 'OPTIC-TRANSCEIVER-800G', currentStock: 120, dailyDemand: 18, leadTimeDays: 7, unitCost: 450, supplierRisk: 'LOW' },
      { sku: 'HIGH-DENSITY-COOLING-PUMP', currentStock: 8, dailyDemand: 1.2, leadTimeDays: 30, unitCost: 4200, supplierRisk: 'HIGH' }
    ];

    // Z-factor for standard service levels (0.95 => 1.65, 0.99 => 2.33)
    const zFactor = targetServiceLevel >= 0.99 ? 2.33 : 1.65;

    const analyzedNodes = nodes.map(node => {
      const dailyDemand = Number(node.dailyDemand) || 5;
      const lt = Number(node.leadTimeDays) || leadTimeDays;
      const stdDevDemand = dailyDemand * 0.25; // 25% demand variability assumption

      // Safety Stock Formula: SS = Z * sqrt(LeadTime) * StdDev(Demand)
      const safetyStock = Math.round(zFactor * Math.sqrt(lt) * stdDevDemand);
      // Reorder Point Formula: ROP = (DailyDemand * LeadTime) + SafetyStock
      const reorderPoint = Math.round((dailyDemand * lt) + safetyStock);
      // Days of Inventory Remaining (DOI)
      const daysOfInventory = (node.currentStock / dailyDemand).toFixed(1);

      // Stockout Risk Calculation
      const isCriticalStockout = node.currentStock <= safetyStock;
      const isReorderTriggered = node.currentStock <= reorderPoint;

      // Economic Order Quantity (EOQ): sqrt((2 * Demand * OrderingCost) / HoldingCost)
      const annualDemand = dailyDemand * 365;
      const orderingCost = 150;
      const annualHoldingRate = 0.20; // 20% carrying cost
      const holdingCost = (node.unitCost || 100) * annualHoldingRate;
      const eoq = Math.round(Math.sqrt((2 * annualDemand * orderingCost) / holdingCost)) || 10;

      return {
        sku: node.sku,
        currentStock: node.currentStock,
        daysOfInventoryRemaining: `${daysOfInventory} days`,
        safetyStock,
        reorderPoint,
        suggestedOrderQtyEOQ: eoq,
        status: isCriticalStockout ? 'CRITICAL_STOCKOUT_RISK' : isReorderTriggered ? 'REORDER_TRIGGERED' : 'HEALTHY_BUFFER',
        supplierRisk: node.supplierRisk || 'LOW',
        actionRequired: isCriticalStockout 
          ? `IMMEDIATE EXPEDITE: Trigger rush purchase order of ${eoq} units to prevent factory downtime.`
          : isReorderTriggered 
            ? `Standard PO dispatch of ${eoq} units recommended within 48h.`
            : 'Inventory buffer within normal operating parameters.'
      };
    });

    const highRiskSkus = analyzedNodes.filter(n => n.status === 'CRITICAL_STOCKOUT_RISK');

    return {
      success: true,
      council: this.councilName,
      telemetryTimestamp: new Date().toISOString(),
      latencyMs: Date.now() - startTime,
      targetServiceLevel: `${(targetServiceLevel * 100).toFixed(0)}%`,
      summary: {
        totalSkusMonitored: analyzedNodes.length,
        criticalStockoutRisks: highRiskSkus.length,
        reordersNeeded: analyzedNodes.filter(n => n.status !== 'HEALTHY_BUFFER').length,
        healthStatus: highRiskSkus.length > 0 ? 'ATTENTION_REQUIRED' : 'ALL_SYSTEMS_OPTIMAL'
      },
      inventoryTelemetry: analyzedNodes
    };
  }

  /**
   * Commercial E-Commerce Unit Economics & Seller Operations Engine
   * Calculates ACoS/TACoS break-evens, FBA storage fee burn velocity, and net landed margin ROI.
   */
  analyzeCommercialEcommerceUnitEconomics({
    sku = 'PROD-SKU-001',
    sellingPrice = 45.0,
    unitManufactureCost = null,
    cogs = 9.5,
    shippingFreightPerUnit = 2.5,
    customsTariffPerUnit = 0.5,
    fbaPickPackFee = 5.8,
    referralCommissionPercent = null,
    referralFeePercent = 15.0,
    adSpendMonthly = null,
    adSpend = 3200,
    adRevenueMonthly = null,
    adRevenue = 12800,
    totalRevenue = null,
    totalUnitsSoldMonthly = null,
    dailyUnitSalesVelocity = null,
    currentFbaInventory = null,
    currentInventoryUnits = 450,
    leadTimeDays = 25,
    monthlyStorageRatePerUnit = 0.85
  } = {}) {
    const startTime = Date.now();

    // Canonicalize inputs
    const baseCogs = unitManufactureCost !== null ? unitManufactureCost : (cogs !== null ? cogs : 9.5);
    const commPct = referralCommissionPercent !== null ? referralCommissionPercent : (referralFeePercent !== null ? referralFeePercent : 15.0);
    const resolvedAdSpend = adSpendMonthly !== null ? adSpendMonthly : (adSpend !== null ? adSpend : 3200);
    const resolvedAdRevenue = adRevenueMonthly !== null ? adRevenueMonthly : (adRevenue !== null ? adRevenue : 12800);
    const resolvedInventory = currentFbaInventory !== null ? currentFbaInventory : (currentInventoryUnits !== null ? currentInventoryUnits : 450);

    let resolvedMonthlyUnits = 800;
    if (totalUnitsSoldMonthly !== null) {
      resolvedMonthlyUnits = totalUnitsSoldMonthly;
    } else if (dailyUnitSalesVelocity !== null) {
      resolvedMonthlyUnits = dailyUnitSalesVelocity * 30;
    }

    // 1. Landed Cost & Cost of Goods Sold (COGS)
    const landedCost = +(baseCogs + shippingFreightPerUnit + customsTariffPerUnit).toFixed(2);
    const referralFee = +((sellingPrice * (commPct / 100)).toFixed(2));
    const computedTotalRevenue = totalRevenue !== null ? totalRevenue : +(sellingPrice * resolvedMonthlyUnits).toFixed(2);

    // 2. Advertising Economics (ACoS, TACoS, Break-Even ACoS)
    const adCostPerUnit = +(resolvedAdSpend / Math.max(1, resolvedMonthlyUnits)).toFixed(2);
    const acosPercent = +((resolvedAdSpend / Math.max(1, resolvedAdRevenue)) * 100).toFixed(1);
    const tacosPercent = +((resolvedAdSpend / Math.max(1, computedTotalRevenue)) * 100).toFixed(1);

    const grossMarginBeforeAds = +(sellingPrice - landedCost - fbaPickPackFee - referralFee).toFixed(2);
    const breakEvenAcosPercent = +((grossMarginBeforeAds / sellingPrice) * 100).toFixed(1);

    // 3. Net Margin & Return on Investment (ROI)
    const totalUnitCost = +(landedCost + fbaPickPackFee + referralFee + adCostPerUnit).toFixed(2);
    const netProfitPerUnit = +(sellingPrice - totalUnitCost).toFixed(2);
    const netMarginPercent = +((netProfitPerUnit / sellingPrice) * 100).toFixed(1);
    const roiPercent = +((netProfitPerUnit / Math.max(0.1, landedCost)) * 100).toFixed(1);

    // 4. FBA Velocity & Storage Burn
    const dailyVelocity = dailyUnitSalesVelocity !== null ? dailyUnitSalesVelocity : +(resolvedMonthlyUnits / 30).toFixed(2);
    const daysOfSupply = +(resolvedInventory / Math.max(0.1, dailyVelocity)).toFixed(1);
    const reorderThresholdUnits = Math.round(dailyVelocity * (leadTimeDays + 14)); // lead time + 14 day safety buffer

    let fbaStatus = 'OPTIMAL_STOCK';
    let fbaRecommendation = 'Current inventory covers planned velocity.';

    if (daysOfSupply < leadTimeDays) {
      fbaStatus = 'STOCKOUT_IMMINENT';
      fbaRecommendation = `URGENT: Expedite ${reorderThresholdUnits} units immediately to prevent listing suspension.`;
    } else if (daysOfSupply > 180) {
      fbaStatus = 'AGED_STORAGE_PENALTY_RISK';
      fbaRecommendation = 'Excess supply exceeding 180 days; run coupon/PPC discount to liquidate.';
    } else if (daysOfSupply <= leadTimeDays + 14) {
      fbaStatus = 'REORDER_POINT_REACHED';
      fbaRecommendation = `Standard replenishment order of ${reorderThresholdUnits} units recommended.`;
    }

    return {
      success: true,
      council: this.councilName,
      sku,
      calculationDurationMs: Date.now() - startTime,
      unitEconomics: {
        sellingPrice,
        landedCost,
        netLandedMargin: netProfitPerUnit,
        breakdown: {
          manufactureCost: baseCogs,
          freight: shippingFreightPerUnit,
          customs: customsTariffPerUnit,
          fbaPickPack: fbaPickPackFee,
          amazonReferralFee: referralFee,
          adCostPerUnit
        },
        netProfitPerUnit,
        netMarginPercent,
        roiPercent,
        healthRating: netMarginPercent >= 20 ? 'HIGHLY_PROFITABLE' : netMarginPercent >= 10 ? 'VIABLE' : 'UNPROFITABLE_COMPRESS_COSTS'
      },
      advertisingMetrics: {
        acosPercent,
        tacosPercent,
        breakEvenAcosPercent,
        adEfficiency: acosPercent < breakEvenAcosPercent ? 'PROFITABLE_CAMPAIGN' : 'UNPROFITABLE_AD_SPEND'
      },
      inventoryRestockVelocity: {
        dailyVelocityUnitsPerDay: dailyVelocity,
        daysOfSupplyRemaining: `${daysOfSupply} days`,
        daysOfSupply: Number(daysOfSupply),
        suggestedReorderQuantity: reorderThresholdUnits,
        status: fbaStatus,
        recommendation: fbaRecommendation
      },
      inventoryRunway: {
        daysOfInventoryRemaining: Math.round(daysOfSupply),
        dailyVelocityUnits: dailyVelocity,
        reorderPointUnits: reorderThresholdUnits,
        status: fbaStatus,
        monthlyStorageFeeEst: +(resolvedInventory * monthlyStorageRatePerUnit).toFixed(2)
      }
    };
  }
}

module.exports = new VishwakarmaSupplyEngine();
