/**
 * BRAHMA Civil & Structural Engineering Sovereign Engine
 * Construction Scheduling, Structural Mechanics & Quantity Surveying
 * 
 * Capabilities:
 * 1. IS 456:2000 Limit State Flexural Design for Reinforced Concrete Beams (Mu, Ast, Limiting Moment)
 * 2. Critical Path Method (CPM) Forward/Backward Pass & Total Float Analysis
 * 3. Construction Quantity Surveying BOM Estimator (Dry Volume, Cement/Sand/Coarse Aggregates)
 */

class BrahmaCivilEngine {
  constructor() {
    // Concrete & Steel Grade Coefficients (IS 456:2000)
    this.limitingNeutralAxisRatio = {
      FE250: 0.53,
      FE415: 0.48,
      FE500: 0.46,
      FE550: 0.44
    };
  }

  /**
   * IS 456:2000 Limit State Design: Singly Reinforced Rectangular Beam
   */
  designRCSinglyReinforcedBeam({
    widthB = 300, // mm
    effectiveDepthD = 500, // mm
    factoredMomentMuKnm = 180, // kNm
    fck = 25, // N/mm2 (e.g. M25)
    fy = 500 // N/mm2 (e.g. Fe500)
  }) {
    const xuMaxRatio = this.limitingNeutralAxisRatio[`FE${fy}`] || 0.46;
    const muLimKnm = +(0.36 * fck * widthB * Math.pow(effectiveDepthD, 2) * xuMaxRatio * (1 - 0.42 * xuMaxRatio) / 1e6).toFixed(2);

    const isUnderReinforced = factoredMomentMuKnm <= muLimKnm;
    if (!isUnderReinforced) {
      return {
        success: true,
        designStatus: 'DOUBLY_REINFORCED_REQUIRED',
        factoredMomentMuKnm,
        limitingMomentMuLimKnm: muLimKnm,
        recommendation: `Section is over-reinforced (Mu > Mu,lim). Increase effective depth D or design as doubly-reinforced beam.`
      };
    }

    // Required Tension Steel Area Ast (IS 456 Annex G equation)
    const muNmm = factoredMomentMuKnm * 1e6;
    const term = 1 - (4.6 * muNmm) / (fck * widthB * Math.pow(effectiveDepthD, 2));
    const astRequiredMm2 = Math.round((0.5 * fck / fy) * (1 - Math.sqrt(Math.max(0, term))) * widthB * effectiveDepthD);

    // Minimum & Maximum Steel Check (Clause 26.5.1.1)
    const astMinMm2 = Math.round((0.85 * widthB * effectiveDepthD) / fy);
    const astMaxMm2 = Math.round(0.04 * widthB * effectiveDepthD);

    const finalAstMm2 = Math.max(astRequiredMm2, astMinMm2);
    const rebarDiameterMm = 20;
    const singleBarArea = Math.PI * Math.pow(rebarDiameterMm / 2, 2);
    const numberOfBars = Math.ceil(finalAstMm2 / singleBarArea);

    return {
      success: true,
      designStatus: 'SINGLY_REINFORCED_ADEQUATE',
      dimensions: { widthMm: widthB, effectiveDepthMm: effectiveDepthD },
      materialGrades: { concrete: `M${fck}`, steel: `Fe${fy}` },
      factoredMomentMuKnm,
      limitingMomentMuLimKnm: muLimKnm,
      steelRequirements: {
        astRequiredMm2,
        astMinMm2,
        astMaxMm2,
        recommendedBarDiameterMm: rebarDiameterMm,
        recommendedBarCount: numberOfBars,
        providedAstMm2: +(numberOfBars * singleBarArea).toFixed(1)
      }
    };
  }

  /**
   * Critical Path Method (CPM) Forward & Backward Pass Analyzer
   */
  calculateCPMSchedule(tasks = []) {
    if (!tasks || tasks.length === 0) {
      throw new Error('Task network cannot be empty');
    }

    const taskMap = {};
    tasks.forEach(t => {
      taskMap[t.id] = { ...t, ES: 0, EF: 0, LS: Infinity, LF: Infinity, TF: 0, successors: [] };
    });

    // Populate successors
    tasks.forEach(t => {
      (t.predecessors || []).forEach(predId => {
        if (taskMap[predId]) {
          taskMap[predId].successors.push(t.id);
        }
      });
    });

    // 1. Forward Pass (Early Start, Early Finish)
    const taskIds = Object.keys(taskMap);
    taskIds.forEach(id => {
      const task = taskMap[id];
      if (!task.predecessors || task.predecessors.length === 0) {
        task.ES = 0;
      } else {
        task.ES = Math.max(...task.predecessors.map(p => taskMap[p].EF));
      }
      task.EF = task.ES + task.duration;
    });

    const projectDuration = Math.max(...taskIds.map(id => taskMap[id].EF));

    // 2. Backward Pass (Late Start, Late Finish)
    taskIds.slice().reverse().forEach(id => {
      const task = taskMap[id];
      if (task.successors.length === 0) {
        task.LF = projectDuration;
      } else {
        task.LF = Math.min(...task.successors.map(s => taskMap[s].LS));
      }
      task.LS = task.LF - task.duration;
      task.TF = task.LS - task.ES; // Total float
    });

    const criticalPath = taskIds.filter(id => taskMap[id].TF === 0);

    return {
      success: true,
      totalProjectDurationDays: projectDuration,
      criticalPath,
      criticalTaskCount: criticalPath.length,
      scheduleTable: taskIds.map(id => ({
        id,
        duration: taskMap[id].duration,
        ES: taskMap[id].ES,
        EF: taskMap[id].EF,
        LS: taskMap[id].LS,
        LF: taskMap[id].LF,
        totalFloat: taskMap[id].TF,
        isCritical: taskMap[id].TF === 0
      }))
    };
  }

  /**
   * Quantity Surveying Concrete Mix Estimator (Dry volume factor: 1.54)
   */
  estimateConcreteMixBOM({ wetVolumeCum = 100, mixGrade = 'M25' }) {
    // Volumetric proportions [Cement, Sand, Coarse Aggregate]
    const mixProportions = {
      M15: [1, 2, 4],
      M20: [1, 1.5, 3],
      M25: [1, 1, 2]
    };
    const prop = mixProportions[mixGrade] || [1, 1, 2];
    const sumProp = prop[0] + prop[1] + prop[2];

    const dryVolumeCum = wetVolumeCum * 1.54; // 54% allowance for voids and shrinkage
    const cementVolumeCum = (dryVolumeCum * prop[0]) / sumProp;
    const sandVolumeCum = (dryVolumeCum * prop[1]) / sumProp;
    const coarseVolumeCum = (dryVolumeCum * prop[2]) / sumProp;

    // Density of cement = 1440 kg/m3; 1 bag = 50 kg (~0.0347 m3)
    const cementWeightKg = cementVolumeCum * 1440;
    const cement50kgBags = Math.ceil(cementWeightKg / 50);

    return {
      success: true,
      mixGrade,
      wetVolumeCum,
      dryVolumeCum: +dryVolumeCum.toFixed(2),
      billOfQuantities: {
        cementBags50kg: cement50kgBags,
        cementWeightTonnes: +(cementWeightKg / 1000).toFixed(2),
        sandTonnes: +(sandVolumeCum * 1.6).toFixed(2), // Bulk density sand ~1.6 t/m3
        coarseAggregateTonnes: +(coarseVolumeCum * 1.55).toFixed(2) // Bulk density aggregate ~1.55 t/m3
      }
    };
  }
}

module.exports = new BrahmaCivilEngine();
