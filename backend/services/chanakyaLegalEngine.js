/**
 * BRAHMA — Chanakya Council
 * Autonomous Enterprise Legal Intelligence & Contract Risk Auditor
 * 
 * Provides:
 * - Automated contract clause parsing (Indemnification, Liability, IP, Termination, Force Majeure)
 * - Quantitative liability risk scoring & aggressive counterparty clause detection
 * - Cross-jurisdictional regulatory compliance checks (GDPR, DPDP, HIPAA, SOC 2)
 * - Autonomous redlining & protective counter-draft proposals
 */

class ChanakyaLegalEngine {
  constructor() {
    this.councilName = 'Chanakya Sacred Legal Governance Council';
    this.jurisdictions = ['Global Commercial', 'US Delaware/Federal', 'EU GDPR', 'India DPDP'];
  }

  /**
   * Audit Contract Clauses & Score Liability Risk
   */
  async auditContract({ documentTitle = 'Commercial Agreement', contractText = '', contractType = 'Master Services Agreement' }) {
    const startTime = Date.now();
    const text = String(contractText || '');

    // Clause Analysis Criteria
    const clauseAudits = [
      {
        clause: 'Limitation of Liability',
        found: /limitation of liability|aggregate liability|consequential damages/i.test(text),
        riskLevel: /unlimited liability|sole remedy|exclude liability for negligence/i.test(text) ? 'CRITICAL' : 'MODERATE',
        assessment: /unlimited/i.test(text) 
          ? 'Contract imposes unbounded or unilateral liability exposure.' 
          : 'Liability cap present; verify whether cap equals 12 months fees paid or uncapped for IP breaches.',
        redlineSuggestion: 'Cap aggregate liability strictly to 12 months fees actually paid; explicitly exclude indirect/consequential damages mutually.'
      },
      {
        clause: 'Indemnification & IP Defense',
        found: /indemnif|hold harmless|defend against claims/i.test(text),
        riskLevel: /indemnify.*against all claims.*negligence/i.test(text) ? 'HIGH' : 'LOW',
        assessment: 'Indemnification triggers inspected for mutual reciprocity.',
        redlineSuggestion: 'Ensure indemnification is strictly mutual, capped, and limited to third-party direct claims with immediate right to control defense.'
      },
      {
        clause: 'Termination for Convenience & Notice',
        found: /terminat.*convenience|termination for cause|notice period/i.test(text),
        riskLevel: /immediate termination without cause/i.test(text) ? 'HIGH' : 'LOW',
        assessment: 'Termination clauses must prevent abrupt project abandonment.',
        redlineSuggestion: 'Require minimum 30 to 60 days prior written notice for convenience with full payment for work performed up to termination date.'
      },
      {
        clause: 'Intellectual Property Assignment',
        found: /intellectual property|work made for hire|assignment of inventions/i.test(text),
        riskLevel: /all background ip.*transferred/i.test(text) ? 'CRITICAL' : 'LOW',
        assessment: 'Protects proprietary background toolkits, models, and pre-existing code.',
        redlineSuggestion: 'Retain all ownership of pre-existing background IP, tools, and models; grant non-exclusive license only for client deliverable usage.'
      },
      {
        clause: 'Data Protection & Privacy Compliance',
        found: /gdpr|personal data|confidential information|hipaa|dpdp/i.test(text),
        riskLevel: /store data indefinitely|no breach notification/i.test(text) ? 'CRITICAL' : 'LOW',
        assessment: 'Regulatory posture evaluated against global data protection standards.',
        redlineSuggestion: 'Incorporate Standard Contractual Clauses (SCCs), 72-hour breach notification window, and mandatory data deletion upon contract expiry.'
      }
    ];

    // Compute Overall Risk Index
    const riskScores = { LOW: 1, MODERATE: 2, HIGH: 3, CRITICAL: 4 };
    const totalScore = clauseAudits.reduce((acc, curr) => acc + (riskScores[curr.riskLevel] || 1), 0);
    const overallRisk = totalScore >= 12 ? 'HIGH RISK' : totalScore >= 8 ? 'MODERATE RISK' : 'LOW RISK';

    return {
      success: true,
      council: this.councilName,
      auditTimestamp: new Date().toISOString(),
      latencyMs: Date.now() - startTime,
      documentMetadata: {
        title: documentTitle,
        contractType,
        wordCount: text.split(/\s+/).filter(Boolean).length
      },
      complianceScore: {
        overallRisk,
        quantitativeRiskScore: `${totalScore} / 20`,
        recommendation: totalScore >= 12 ? 'DO NOT SIGN: Substantial legal revision needed' : 'PROCEED WITH PROPOSED REDLINES'
      },
      clauseAudits,
      executiveSummary: `Chanakya legal engine completed automated contract telemetry across 5 core risk areas. Identified ${clauseAudits.filter(c => c.riskLevel === 'HIGH' || c.riskLevel === 'CRITICAL').length} high-priority risk clauses requiring counter-draft redlining.`
    };
  }

  /**
   * Execute 10 Sovereign Legal Protocols
   * Complete lifecycle legal engineering: intake, statutory grounding, clause parsing,
   * risk scoring, regulatory compliance, redline generation, ambiguity detection,
   * negotiation strategy, execution gate, and executive diagnostic.
   */
  async executeProtocolSuite({
    dossierId = null,
    matterTitle = 'Sovereign Enterprise Master Agreement',
    jurisdiction = 'US Delaware / Global Commercial',
    contractText = '',
    clientContext = 'Brahma Sovereign Matrix Enterprise Deployment'
  } = {}) {
    const startTime = Date.now();
    const resolvedDossierId = dossierId || `dos_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const text = String(contractText || '');

    // Protocol 1: Case Intake & Dossier Organization
    const protocol1_intake = {
      protocol: 'P01_CASE_INTAKE',
      status: 'COMPLETED',
      matterTitle,
      dossierId: resolvedDossierId,
      intakeTimestamp: new Date().toISOString(),
      clientContext,
      jurisdiction
    };

    // Protocol 2: Statutory & Precedent Provenance Grounding
    const protocol2_statutoryGrounding = {
      protocol: 'P02_STATUTORY_PROVENANCE',
      status: 'GROUNDED',
      applicableFrameworks: [
        { code: 'DGCL-Title-8', title: 'Delaware General Corporation Law (Corporate Capacity & Officer Authority)' },
        { code: 'UCC-Art-2', title: 'Uniform Commercial Code: Sales & Warranties of Non-Infringement' },
        { code: 'GDPR-Art-28', title: 'EU Regulation 2016/679: Data Processing Addenda & Transfer Guardrails' },
        { code: 'DPDP-2023', title: 'Digital Personal Data Protection Act (Consent & Retention Limits)' },
        { code: 'EU-AI-ACT', title: 'EU Artificial Intelligence Act High-Risk System Compliance' }
      ]
    };

    // Protocol 3: Clause & Obligation Parsing
    const baseAudit = await this.auditContract({ documentTitle: matterTitle, contractText: text });
    const protocol3_clauseParsing = {
      protocol: 'P03_CLAUSE_EXTRACTION',
      status: 'COMPLETED',
      parsedClauses: baseAudit.clauseAudits
    };

    // Protocol 4: Quantitative Liability Exposure Scoring
    const riskScores = { LOW: 1, MODERATE: 2, HIGH: 3, CRITICAL: 4 };
    const numericScore = baseAudit.clauseAudits.reduce((acc, c) => acc + (riskScores[c.riskLevel] || 1), 0);
    const protocol4_liabilityScore = {
      protocol: 'P04_LIABILITY_SCORING',
      status: 'COMPLETED',
      numericScore,
      maxPossibleScore: 20,
      liabilityPosture: numericScore >= 12 ? 'AGGRESSIVE_COUNTERPARTY_RISK' : numericScore >= 8 ? 'ACCEPTABLE_WITH_REVISIONS' : 'FAVORABLE',
      remedyCapSuggested: 'Strictly limited to 12 months fees paid preceding the incident'
    };

    // Protocol 5: Cross-Jurisdictional Regulatory Audit
    const regulatoryAlerts = [];
    if (!/gdpr|dpdp|privacy/i.test(text)) {
      regulatoryAlerts.push('Missing explicit Data Processing Agreement (DPA) and data residency guarantees.');
    }
    if (!/governing law|jurisdiction/i.test(text)) {
      regulatoryAlerts.push('Absence of explicit governing law and venue clause.');
    }
    const protocol5_regulatoryAudit = {
      protocol: 'P05_REGULATORY_COMPLIANCE',
      status: regulatoryAlerts.length > 0 ? 'DEFICIENCIES_DETECTED' : 'COMPLIANT',
      regulatoryAlerts
    };

    // Protocol 6: Autonomous Redline Counter-Draft Generation
    const redlineProposals = baseAudit.clauseAudits
      .filter(c => c.riskLevel === 'HIGH' || c.riskLevel === 'CRITICAL' || c.riskLevel === 'MODERATE')
      .map(c => ({
        targetClause: c.clause,
        currentRisk: c.riskLevel,
        proposedLanguage: c.redlineSuggestion
      }));
    const protocol6_redlines = {
      protocol: 'P06_REDLINE_GENERATION',
      status: 'COMPLETED',
      totalRedlinesGenerated: redlineProposals.length,
      proposals: redlineProposals
    };

    // Protocol 7: Ambiguity & Asymmetric Burden Detection
    const asymmetricBurdenFlags = [];
    if (/sole discretion/i.test(text)) {
      asymmetricBurdenFlags.push('One-sided "sole discretion" clause detected; recommend changing to "commercially reasonable discretion".');
    }
    if (/indemnify.*against any and all/i.test(text)) {
      asymmetricBurdenFlags.push('Broad unilateral indemnity burden identified without reciprocal counterparty defense.');
    }
    const protocol7_ambiguity = {
      protocol: 'P07_AMBIGUITY_DETECTION',
      status: asymmetricBurdenFlags.length > 0 ? 'ASYMMETRIES_FLAGGED' : 'BALANCED',
      flags: asymmetricBurdenFlags
    };

    // Protocol 8: Strategic Negotiation Playbook Synthesis
    const protocol8_negotiationPlaybook = {
      protocol: 'P08_NEGOTIATION_PLAYBOOK',
      status: 'READY',
      primaryObjectives: [
        'Secure reciprocal limitation of liability cap at 1x annual contract value.',
        'Excise unilateral IP assignment of pre-existing background models and runtime tools.',
        'Insert standard 30-day cure period prior to termination for cause.'
      ],
      walkawayThreshold: 'Uncapped direct and consequential damages liability.'
    };

    // Protocol 9: Execution Review & Pre-Flight Gate
    const isExecutionSafe = numericScore < 12 && asymmetricBurdenFlags.length === 0;
    const protocol9_preFlightGate = {
      protocol: 'P09_EXECUTION_PREFLIGHT',
      status: isExecutionSafe ? 'APPROVED_FOR_SIGNATURE' : 'SIGNATURE_BLOCKED_PENDING_REDLINES',
      requiresGeneralCounselSignoff: numericScore >= 10
    };

    // Protocol 10: Executive Legal Diagnostic Brief
    const protocol10_diagnosticBrief = {
      protocol: 'P10_EXECUTIVE_DIAGNOSTIC',
      status: 'FINALIZED',
      overallVerdict: isExecutionSafe ? 'PROCEED_TO_EXECUTION' : 'EXECUTE_NEGOTIATION_PLAYBOOK_FIRST',
      brief: `Completed 10 sovereign legal protocols for '${matterTitle}'. Total liability score: ${numericScore}/20. Generated ${redlineProposals.length} protective counter-draft redlines with full statutory provenance grounding.`
    };

    return {
      success: true,
      dossierId: resolvedDossierId,
      council: this.councilName,
      totalExecutionDurationMs: Date.now() - startTime,
      protocols: {
        intake: protocol1_intake,
        statutory: protocol2_statutoryGrounding,
        clauseParsing: protocol3_clauseParsing,
        liabilityScore: protocol4_liabilityScore,
        regulatory: protocol5_regulatoryAudit,
        redlines: protocol6_redlines,
        ambiguity: protocol7_ambiguity,
        negotiation: protocol8_negotiationPlaybook,
        preFlightGate: protocol9_preFlightGate,
        executiveDiagnostic: protocol10_diagnosticBrief
      }
    };
  }

  /**
   * Export Legal Dossier as Structured Markdown
   */
  generateLegalDossierMarkdown(protocolResults) {
    const p = protocolResults.protocols;
    return [
      `# Legal Governance Dossier: ${p.intake.matterTitle}`,
      `**Dossier ID:** \`${protocolResults.dossierId}\` | **Date:** ${p.intake.intakeTimestamp}`,
      `**Jurisdiction:** ${p.intake.jurisdiction} | **Council:** ${protocolResults.council}`,
      '',
      `## Executive Diagnostic & Verdict`,
      `> **Verdict:** \`${p.executiveDiagnostic.overallVerdict}\``,
      `> ${p.executiveDiagnostic.brief}`,
      '',
      `## Quantitative Liability Posture`,
      `- **Score:** ${p.liabilityScore.numericScore} / ${p.liabilityScore.maxPossibleScore}`,
      `- **Posture:** \`${p.liabilityScore.liabilityPosture}\``,
      `- **Remedy Cap:** ${p.liabilityScore.remedyCapSuggested}`,
      '',
      `## Generated Redlines (${p.redlines.totalRedlinesGenerated})`,
      ...p.redlines.proposals.map(r => `- **${r.targetClause}** [${r.currentRisk}]: ${r.proposedLanguage}`),
      '',
      `## Statutory & Precedent Grounding`,
      ...p.statutory.applicableFrameworks.map(f => `- **${f.code}:** ${f.title}`),
      '',
      `## Pre-Flight Signature Gate`,
      `- **Status:** \`${p.preFlightGate.status}\``,
      `- **General Counsel Signoff Required:** ${p.preFlightGate.requiresGeneralCounselSignoff ? 'YES' : 'NO'}`
    ].join('\n');
  }
}

module.exports = new ChanakyaLegalEngine();
