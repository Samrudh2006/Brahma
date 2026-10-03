/**
 * BRAHMA Security, Risk-Tiered Action Approval & Anti-Spam Safeguard Suite
 * Inspired by Andrew Ng's OpenWorker Risk-Tiered Action Model & Zero-Trust Defense.
 * Classifies AI Agent & System actions into 4 Risk Tiers for safety, control, and privacy.
 */

// ─── OpenWorker-Inspired Risk Tiers ──────────────────────────────────────────
export const RISK_TIERS = {
  TIER_0_READ: {
    level: 0,
    name: 'TIER 0: Read-Only Passive',
    color: '#38bdf8',
    requiresApproval: false,
    description: 'Safe passive operations (searching memory, vector retrieval, reading files, reading settings).'
  },
  TIER_1_LOCAL_WRITE: {
    level: 1,
    name: 'TIER 1: Local File / State Mutation',
    color: '#fbbf24',
    requiresApproval: false, // Auto-logged, soft notify
    description: 'Modifying local component files, updating settings, saving session states.'
  },
  TIER_2_SYSTEM_EXEC: {
    level: 2,
    name: 'TIER 2: High-Risk System Execution',
    color: '#f97316',
    requiresApproval: true,
    description: 'Running shell commands, installing packages, compiling native code, executing background tasks.'
  },
  TIER_3_DESTRUCTIVE: {
    level: 3,
    name: 'TIER 3: Critical Destructive Action',
    color: '#ef4444',
    requiresApproval: true,
    description: 'Deleting database tables, wiping workspace files, dropping schemas, executing destructive terminal scripts.'
  }
};

// Rate limiter state: token bucket
const rateLimitState = {
  lastSubmitTime: 0,
  submitCount: 0,
  minIntervalMs: 800, // Min ms between requests
  maxRequestsPerMinute: 35,
};

/**
 * OpenWorker Risk Classifier: Evaluates an incoming Agent Action and returns its Risk Tier
 * @param {object} action - { type: string, target?: string, payload?: any }
 * @returns {object} Risk Tier definition with evaluation metadata
 */
export function evaluateActionRisk(action = {}) {
  const type = (action.type || '').toLowerCase();
  const target = (action.target || '').toLowerCase();
  const command = (action.command || '').toLowerCase();

  // 1. Check Tier 3: Destructive
  if (
    type.includes('delete') ||
    type.includes('drop') ||
    type.includes('purge') ||
    command.includes('rm -rf') ||
    command.includes('del /f') ||
    command.includes('drop table') ||
    command.includes('truncate')
  ) {
    return {
      tier: RISK_TIERS.TIER_3_DESTRUCTIVE,
      action,
      timestamp: new Date().toISOString(),
      reason: 'Action involves permanent deletion or destructive system mutations.'
    };
  }

  // 2. Check Tier 2: System Execution
  if (
    type.includes('exec') ||
    type.includes('command') ||
    type.includes('terminal') ||
    type.includes('install') ||
    type.includes('build') ||
    command.includes('npm') ||
    command.includes('node') ||
    command.includes('git')
  ) {
    return {
      tier: RISK_TIERS.TIER_2_SYSTEM_EXEC,
      action,
      timestamp: new Date().toISOString(),
      reason: 'Action executes native shell operations or system process commands.'
    };
  }

  // 3. Check Tier 1: Local Mutation
  if (
    type.includes('write') ||
    type.includes('save') ||
    type.includes('update') ||
    type.includes('edit') ||
    type.includes('store')
  ) {
    return {
      tier: RISK_TIERS.TIER_1_LOCAL_WRITE,
      action,
      timestamp: new Date().toISOString(),
      reason: 'Action mutates local file contents or application state.'
    };
  }

  // 4. Default: Tier 0 Read-Only
  return {
    tier: RISK_TIERS.TIER_0_READ,
    action,
    timestamp: new Date().toISOString(),
    reason: 'Read-only operation with zero side effects.'
  };
}

/**
 * Validates user prompt input
 * @param {string} input - Text to validate
 * @param {object} options - Validation constraints
 * @returns {{ valid: boolean, error?: string, sanitized: string }}
 */
export function validatePromptInput(input, options = {}) {
  const { minLength = 1, maxLength = 8000 } = options;

  if (typeof input !== 'string') {
    return { valid: false, error: 'Input must be a valid text string.', sanitized: '' };
  }

  const trimmed = input.trim();

  if (trimmed.length < minLength) {
    return { valid: false, error: 'Prompt cannot be empty.', sanitized: '' };
  }

  if (trimmed.length > maxLength) {
    return {
      valid: false,
      error: `Prompt exceeds maximum character boundary (${trimmed.length}/${maxLength} chars).`,
      sanitized: trimmed.slice(0, maxLength)
    };
  }

  // Basic client-side HTML / script sanitization
  const sanitized = trimmed
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  return { valid: true, sanitized };
}

/**
 * Anti-Spam / Rate-limiting throttle check
 * @returns {{ allowed: boolean, waitTimeMs?: number }}
 */
export function checkRateLimit() {
  const now = Date.now();
  const timeSinceLast = now - rateLimitState.lastSubmitTime;

  if (timeSinceLast < rateLimitState.minIntervalMs) {
    return {
      allowed: false,
      waitTimeMs: rateLimitState.minIntervalMs - timeSinceLast,
      error: 'Please pause briefly between transmissions to preserve model synchronization.'
    };
  }

  // Reset minute counter if window passed
  if (timeSinceLast > 60000) {
    rateLimitState.submitCount = 0;
  }

  if (rateLimitState.submitCount >= rateLimitState.maxRequestsPerMinute) {
    return {
      allowed: false,
      waitTimeMs: 60000 - timeSinceLast,
      error: 'Neural transmission threshold reached. Please wait a moment before sending more queries.'
    };
  }

  rateLimitState.lastSubmitTime = now;
  rateLimitState.submitCount += 1;
  return { allowed: true };
}

/**
 * Validates honeypot field (should always be empty for legitimate humans)
 * @param {string} honeypotValue
 * @returns {boolean} True if human, false if bot triggered
 */
export function verifyHoneypot(honeypotValue) {
  return !honeypotValue || honeypotValue.trim() === '';
}
