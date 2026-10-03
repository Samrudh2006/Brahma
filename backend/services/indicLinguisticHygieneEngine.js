/**
 * BRAHMA Indic Linguistic Hygiene & Executive Communication Engine
 * 
 * Invariant: Eliminate robotic AI "neuroslop" and archaic Indian bureaucratic jargon
 * ("babu-English"). Guarantees executive-grade clarity and precise prose for legal,
 * clinical, and policy correspondence.
 */

class IndicLinguisticHygieneEngine {
  constructor() {
    this.name = 'IndicLinguisticHygieneEngine';

    // 1. Archaic Indian Bureaucratic Clichés
    this.bureaucraticPatterns = [
      {
        pattern: /\bdo the needful\b/gi,
        replacement: 'take the required action',
        rule: 'CLICHE_BUREAUCRATIC_DO_THE_NEEDFUL',
        reason: 'Archaic administrative filler; specify exact action needed.'
      },
      {
        pattern: /\bplease find attached herewith\b/gi,
        replacement: 'attached is',
        rule: 'REDUNDANT_ATTACHED_HEREWITH',
        reason: '"Herewith" is redundant when attached is already stated.'
      },
      {
        pattern: /\brevert back\b/gi,
        replacement: 'reply',
        rule: 'PLEONASM_REVERT_BACK',
        reason: '"Revert back" is a pleonasm; "revert" means return to a previous state, use "reply".'
      },
      {
        pattern: /\bthe undersigned is directed to\b/gi,
        replacement: 'I am instructed to',
        rule: 'ARCHAIC_PASSIVE_UNDERSIGNED',
        reason: 'Overly formal colonial passive voice; use direct attribution.'
      },
      {
        pattern: /\bas per our discussion\b/gi,
        replacement: 'following our discussion',
        rule: 'OFFICE_JARGON_AS_PER',
        reason: 'Preferred modern executive phrasing is "following our discussion".'
      },
      {
        pattern: /\bintimated in due course\b/gi,
        replacement: 'notified shortly',
        rule: 'VAGUE_DELAY_INTIMATED_DUE_COURSE',
        reason: 'Vague timeframe; use explicit delivery timeline.'
      },
      {
        pattern: /\bkindly expedite\b/gi,
        replacement: 'please prioritize',
        rule: 'FORMALISM_KINDLY_EXPEDITE',
        reason: 'Outdated phrasing; use modern direct priority instruction.'
      }
    ];

    // 2. Synthetic AI "Neuroslop" & Pretentious Filler
    this.slopPatterns = [
      {
        pattern: /\bdelve into\b/gi,
        replacement: 'examine',
        rule: 'AI_FILLER_DELVE_INTO',
        reason: 'High-frequency synthetic AI trope; use "examine" or "analyze".'
      },
      {
        pattern: /\b(?:rich\s+)?tapestry of\b/gi,
        replacement: 'diversity of',
        rule: 'AI_FILLER_TAPESTRY',
        reason: 'Overused generative metaphor devoid of concrete meaning.'
      },
      {
        pattern: /\ba testament to\b/gi,
        replacement: 'evidence of',
        rule: 'AI_FILLER_TESTAMENT_TO',
        reason: 'Overdramatic rhetorical phrase; use "evidence of" or "demonstrates".'
      },
      {
        pattern: /\bbeacon of hope\b/gi,
        replacement: 'model',
        rule: 'AI_HYPERBOLE_BEACON',
        reason: 'Melodramatic non-technical hyperbole.'
      },
      {
        pattern: /\bnuanced landscape\b/gi,
        replacement: 'complex domain',
        rule: 'AI_FILLER_NUANCED_LANDSCAPE',
        reason: 'Vague filler phrase indicating lack of domain precision.'
      },
      {
        pattern: /\bpivotal moment\b/gi,
        replacement: 'turning point',
        rule: 'AI_CLICHE_PIVOTAL_MOMENT',
        reason: 'Overused dramatic cliché.'
      },
      {
        pattern: /\bin summary, it is important to remember that\b/gi,
        replacement: 'in summary,',
        rule: 'AI_PADDING_SUMMARY_REMEMBER',
        reason: 'Wordy transitional padding.'
      },
      {
        pattern: /\bever-evolving landscape\b/gi,
        replacement: 'evolving market',
        rule: 'AI_FILLER_EVER_EVOLVING',
        reason: 'Exhausted generative padding phrase.'
      }
    ];
  }

  /**
   * Audit text for bureaucratic clichés, generative slop, and typographical issues
   */
  sanitizeText(inputText = '') {
    const startTime = Date.now();
    let sanitizedText = String(inputText);
    const violations = [];

    // Check bureaucratic patterns
    for (const rule of this.bureaucraticPatterns) {
      const matches = sanitizedText.match(rule.pattern);
      if (matches) {
        violations.push({
          category: 'INDIC_BUREAUCRATIC_CLICHE',
          rule: rule.rule,
          occurrences: matches.length,
          matchedText: matches[0],
          suggestedReplacement: rule.replacement,
          explanation: rule.reason
        });
        sanitizedText = sanitizedText.replace(rule.pattern, rule.replacement);
      }
    }

    // Check AI slop patterns
    for (const rule of this.slopPatterns) {
      const matches = sanitizedText.match(rule.pattern);
      if (matches) {
        violations.push({
          category: 'GENERATIVE_SLOP_FILTER',
          rule: rule.rule,
          occurrences: matches.length,
          matchedText: matches[0],
          suggestedReplacement: rule.replacement,
          explanation: rule.reason
        });
        sanitizedText = sanitizedText.replace(rule.pattern, rule.replacement);
      }
    }

    // Typography sanitation: double spaces, hanging spaces
    const initialLength = sanitizedText.length;
    sanitizedText = sanitizedText.replace(/\s{2,}/g, ' ').trim();
    if (initialLength !== sanitizedText.length) {
      violations.push({
        category: 'TYPOGRAPHY_NORMALIZATION',
        rule: 'EXCESSIVE_WHITESPACE',
        occurrences: 1,
        matchedText: 'multiple spaces',
        suggestedReplacement: 'single space',
        explanation: 'Standardized spacing between words.'
      });
    }

    // Compute Executive Clarity Score (0 to 100)
    const penalty = violations.reduce((acc, v) => acc + (v.category === 'TYPOGRAPHY_NORMALIZATION' ? 2 : 12), 0);
    const executiveClarityScore = Math.max(0, 100 - penalty);

    return {
      success: true,
      engine: this.name,
      executionDurationMs: Date.now() - startTime,
      originalWordCount: inputText.split(/\s+/).filter(Boolean).length,
      sanitizedWordCount: sanitizedText.split(/\s+/).filter(Boolean).length,
      executiveClarityScore,
      qualityTier: executiveClarityScore >= 90 ? 'EXECUTIVE_GRADE' : executiveClarityScore >= 70 ? 'ACCEPTABLE_EDITS_APPLIED' : 'SLOP_HEAVY_REVISED',
      totalViolationsFound: violations.length,
      violations,
      cleanText: sanitizedText
    };
  }
}

module.exports = new IndicLinguisticHygieneEngine();
