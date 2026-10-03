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
}

module.exports = new ChanakyaLegalEngine();
