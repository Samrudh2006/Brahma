/**
 * BRAHMA Progressive Skill Registry Engine
 * 
 * Invariant: 2-Tier Progressive Disclosure Architecture.
 * Tier 1: Lightweight indexed catalog (names + concise 1-line signatures) to prevent context bloat.
 * Tier 2: Dynamic zero-hop on-demand hydration of full operational schemas, validation rules,
 * and execution handlers only when referenced or invoked.
 */

class ProgressiveSkillRegistry {
  constructor() {
    this.name = 'ProgressiveSkillRegistry';
    this.skills = new Map();
    this._registerDefaultCouncilSkills();
  }

  _registerDefaultCouncilSkills() {
    // 1. Dhanvantari Clinical Engine
    this.registerSkill({
      id: 'dhanvantari_pharmacogenomics',
      name: 'Dhanvantari Pharmacogenomics Triage',
      category: 'CLINICAL',
      summary: 'Analyze patient genomic variants and CPIC drug-gene metabolizer phenotypes.',
      tier1Keys: ['variants', 'patientId', 'targetDrugs'],
      fullSchema: {
        type: 'object',
        properties: {
          variants: { type: 'array', description: 'List of rsIDs or star alleles (e.g. CYP2D6*4)' },
          patientId: { type: 'string', description: 'De-identified patient ID' },
          targetDrugs: { type: 'array', description: 'Drugs under consideration for prescription' }
        },
        required: ['variants']
      },
      executionMetadata: {
        service: 'dhanvantariClinicalEngine',
        action: 'analyzePharmacogenomics',
        sandboxIsolation: 'STRICT_READ_ONLY'
      }
    });

    // 2. Kuvera Quant Engine
    this.registerSkill({
      id: 'kuvera_monte_carlo',
      name: 'Kuvera Monte Carlo Tail Risk Simulation',
      category: 'QUANT_FINANCE',
      summary: 'Run 1,000-path Geometric Brownian Motion simulation for 95% VaR and drawdown analysis.',
      tier1Keys: ['symbol', 'days', 'simulations', 'dailyVolatility'],
      fullSchema: {
        type: 'object',
        properties: {
          symbol: { type: 'string', description: 'Stock or crypto ticker' },
          days: { type: 'integer', description: 'Time horizon in trading days' },
          simulations: { type: 'integer', default: 1000 },
          dailyVolatility: { type: 'number', description: 'Realized daily standard deviation' }
        },
        required: ['symbol']
      },
      executionMetadata: {
        service: 'kuveraQuantEngine',
        action: 'runMonteCarloSimulation',
        sandboxIsolation: 'MATHEMATICAL_SANDBOX'
      }
    });

    // 3. Chanakya Legal Governance
    this.registerSkill({
      id: 'chanakya_contract_audit',
      name: 'Chanakya Contract Liability Audit',
      category: 'LEGAL_GOVERNANCE',
      summary: 'Audit agreements against 10 executable legal protocols and generate protective redlines.',
      tier1Keys: ['contractText', 'jurisdiction', 'riskThreshold'],
      fullSchema: {
        type: 'object',
        properties: {
          contractText: { type: 'string', description: 'Full text or excerpt of agreement' },
          jurisdiction: { type: 'string', default: 'India' },
          riskThreshold: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' }
        },
        required: ['contractText']
      },
      executionMetadata: {
        service: 'chanakyaLegalEngine',
        action: 'auditContract',
        sandboxIsolation: 'STATUTORY_REASONING'
      }
    });

    // 4. Vishwakarma Industrial Operations
    this.registerSkill({
      id: 'vishwakarma_ecommerce_economics',
      name: 'Vishwakarma E-Commerce Commercial Economics',
      category: 'INDUSTRIAL_SUPPLY',
      summary: 'Calculate unit economics, break-even ACoS, TACoS, and FBA storage burn velocity.',
      tier1Keys: ['sellingPrice', 'cogs', 'adSpend', 'adRevenue', 'inventoryUnits'],
      fullSchema: {
        type: 'object',
        properties: {
          sellingPrice: { type: 'number' },
          cogs: { type: 'number' },
          adSpend: { type: 'number' },
          adRevenue: { type: 'number' },
          inventoryUnits: { type: 'integer' }
        },
        required: ['sellingPrice', 'cogs']
      },
      executionMetadata: {
        service: 'vishwakarmaSupplyEngine',
        action: 'analyzeCommercialEcommerceUnitEconomics',
        sandboxIsolation: 'DETERMINISTIC_CALC'
      }
    });
  }

  /**
   * Register a new skill into the progressive disclosure registry
   */
  registerSkill(skillDef) {
    if (!skillDef.id || !skillDef.name) {
      throw new Error('Skill definition requires an id and name');
    }
    this.skills.set(skillDef.id, {
      id: skillDef.id,
      name: skillDef.name,
      category: skillDef.category || 'GENERAL',
      summary: skillDef.summary || '',
      tier1Keys: skillDef.tier1Keys || [],
      fullSchema: skillDef.fullSchema || {},
      executionMetadata: skillDef.executionMetadata || {},
      registeredAt: new Date().toISOString()
    });
    return { success: true, skillId: skillDef.id };
  }

  /**
   * Tier 1: Get compact catalog index for initial system prompt injection.
   * Consumes ~80% fewer tokens than dumping full schemas.
   */
  getCatalogIndex({ category = null } = {}) {
    const catalog = [];
    for (const skill of this.skills.values()) {
      if (category && skill.category !== category) continue;
      catalog.push({
        id: skill.id,
        name: skill.name,
        category: skill.category,
        summary: skill.summary,
        parameters: skill.tier1Keys
      });
    }

    // Estimate token savings (approx 4 chars per token)
    const tier1Json = JSON.stringify(catalog);
    const fullJson = JSON.stringify(Array.from(this.skills.values()));
    const tokenSavingsPercent = +(((fullJson.length - tier1Json.length) / fullJson.length) * 100).toFixed(1);

    return {
      success: true,
      totalSkills: catalog.length,
      tokenSavingsPercent,
      catalog
    };
  }

  /**
   * Tier 2: Hydrate full operational schema & execution metadata on-demand.
   */
  hydrateSkill(skillId) {
    const skill = this.skills.get(skillId);
    if (!skill) {
      return { success: false, error: `Skill '${skillId}' not found in registry.` };
    }
    return {
      success: true,
      skillId: skill.id,
      name: skill.name,
      category: skill.category,
      fullSchema: skill.fullSchema,
      executionMetadata: skill.executionMetadata,
      hydratedAt: new Date().toISOString()
    };
  }
}

module.exports = new ProgressiveSkillRegistry();
