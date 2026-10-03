/**
 * BRAHMA Public Administration Sovereign Engine
 * Government Operations, RTI Compliance, GeM Procurement & Citizen Grievance Redressal
 * 
 * Capabilities:
 * 1. RTI Act 2005 Section 6(1) Structured Application Generator with Section 8 Exemption Filter
 * 2. GeM (Government e-Marketplace) Tender Eligibility & Bid Compliance Matrix Evaluator
 * 3. Citizen Charter Public Grievance Priority Classifier & Escalation SLA Monitor
 */

class BrahmaPublicAdminEngine {
  constructor() {
    this.grievanceSLAs = {
      POTABLE_WATER_SUPPLY_CONTAMINATION: { priority: 'URGENT', slaHours: 24, department: 'Public Health Engineering' },
      STREET_LIGHT_OUTAGE: { priority: 'ROUTINE', slaHours: 72, department: 'Municipal Electrical Wing' },
      ROAD_POTHOLE_HAZARD: { priority: 'ELEVATED', slaHours: 120, department: 'Public Works Department (PWD)' },
      TRADE_LICENSE_PROCESSING: { priority: 'NORMAL', slaHours: 360, department: 'Municipal Revenue Section' }
    };
  }

  /**
   * RTI Act 2005 Section 6(1) Application Formatter & Exemption Pre-Flight Filter
   */
  generateRTIApplication({
    applicantName = 'Citizen Applicant',
    applicantAddress = 'New Delhi, India',
    publicAuthority = 'Department of Telecommunications',
    pioDesignation = 'Central Public Information Officer (CPIO)',
    informationQueries = []
  }) {
    // Section 8(1) Exemption Keyword Filter
    const sensitiveTriggers = [
      { regex: /cabinet\s+papers/i, clause: 'Section 8(1)(i) - Cabinet papers' },
      { regex: /national\s+security|sovereignty|military/i, clause: 'Section 8(1)(a) - Security and strategic interests of State' },
      { regex: /commercial\s+confidence|trade\s+secret/i, clause: 'Section 8(1)(d) - Commercial confidence / Intellectual property' },
      { regex: /contempt\s+of\s+court/i, clause: 'Section 8(1)(b) - Forbidden by court of law' }
    ];

    const auditedQueries = informationQueries.map((q, idx) => {
      const match = sensitiveTriggers.find(t => t.regex.test(q));
      return {
        queryNumber: idx + 1,
        queryText: q,
        hasExemptionRisk: Boolean(match),
        potentialExemptionClause: match ? match.clause : null
      };
    });

    const hasAnyExemptionRisk = auditedQueries.some(q => q.hasExemptionRisk);

    const applicationDraft = [
      `FORM 'A'`,
      `[See Rule 3(1) of RTI Rules]`,
      `APPLICATION FOR OBTAINING INFORMATION UNDER SECTION 6(1) OF THE RIGHT TO INFORMATION ACT, 2005`,
      ``,
      `To:`,
      `The ${pioDesignation},`,
      `${publicAuthority}`,
      ``,
      `1. Name of the Applicant: ${applicantName}`,
      `2. Address for Correspondence: ${applicantAddress}`,
      `3. Particulars of Information Required:`,
      ...auditedQueries.map(q => `   (${q.queryNumber}) ${q.queryText}`),
      ``,
      `4. Period to which the information relates: Preceding 2 financial years`,
      `5. Application Fee: ₹10 (enclosed via Postal Order / Court Fee Stamp / Online Portal)`,
      `6. Non-Exemption Affirmation: The information sought does not fall within the restrictions contained in Section 8 or 9 of the RTI Act 2005.`,
      ``,
      `Date: ${new Date().toISOString().split('T')[0]}`,
      `Signature of Applicant`
    ].join('\n');

    return {
      success: true,
      applicantName,
      publicAuthority,
      totalQueries: auditedQueries.length,
      hasExemptionRisk: hasAnyExemptionRisk,
      auditedQueries,
      statutoryDeadlineDays: 30, // Section 7(1) deadline
      formattedApplicationText: applicationDraft
    };
  }

  /**
   * GeM / Public Procurement Tender Technical Compliance Evaluator
   */
  evaluateTenderCompliance({
    tenderCriteria = { minTurnoverLakhs: 50, minYearsExperience: 3, mandatoryCertifications: ['ISO_9001'] },
    bidderProfile = { averageTurnoverLakhs: 75, yearsInOperation: 5, certifications: ['ISO_9001', 'ISO_27001'], isMSMERegistered: true }
  }) {
    const checks = [];

    // 1. Turnover Check
    const turnoverPass = bidderProfile.averageTurnoverLakhs >= tenderCriteria.minTurnoverLakhs;
    checks.push({
      criterion: 'Average 3-Year Annual Turnover',
      required: `₹${tenderCriteria.minTurnoverLakhs} Lakhs`,
      bidderValue: `₹${bidderProfile.averageTurnoverLakhs} Lakhs`,
      compliant: turnoverPass
    });

    // 2. Years in Operation / Past Experience
    const expPass = bidderProfile.yearsInOperation >= tenderCriteria.minYearsExperience;
    checks.push({
      criterion: 'Operating Experience',
      required: `${tenderCriteria.minYearsExperience} Years`,
      bidderValue: `${bidderProfile.yearsInOperation} Years`,
      compliant: expPass
    });

    // 3. Certifications
    const certsPass = tenderCriteria.mandatoryCertifications.every(c => bidderProfile.certifications.includes(c));
    checks.push({
      criterion: 'Mandatory Technical Certifications',
      required: tenderCriteria.mandatoryCertifications.join(', '),
      bidderValue: bidderProfile.certifications.join(', '),
      compliant: certsPass
    });

    const isTechnicallyQualified = turnoverPass && expPass && certsPass;

    return {
      success: true,
      isTechnicallyQualified,
      emdExemptionEligible: bidderProfile.isMSMERegistered === true,
      disposition: isTechnicallyQualified ? 'TENDER_BID_TECHNICALLY_RESPONSIVE' : 'TENDER_BID_NON_RESPONSIVE',
      checks
    };
  }

  /**
   * Citizen Charter Public Grievance Priority Classifier
   */
  classifyCitizenGrievance({ grievanceCategory = 'POTABLE_WATER_SUPPLY_CONTAMINATION', citizenLocation = 'Ward 14' }) {
    const policy = this.grievanceSLAs[grievanceCategory] || { priority: 'ROUTINE', slaHours: 168, department: 'General Grievance Cell' };
    const registeredAt = new Date();
    const resolutionDeadline = new Date(registeredAt.getTime() + policy.slaHours * 60 * 60 * 1000);

    return {
      success: true,
      grievanceTicketId: `grv_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      grievanceCategory,
      citizenLocation,
      assignedDepartment: policy.department,
      priorityLevel: policy.priority,
      slaHours: policy.slaHours,
      registeredAt: registeredAt.toISOString(),
      statutoryEscalationDeadline: resolutionDeadline.toISOString(),
      escalationOfficer: policy.priority === 'URGENT' ? 'District Magistrate / Municipal Commissioner' : 'Executive Engineer'
    };
  }
}

module.exports = new BrahmaPublicAdminEngine();
