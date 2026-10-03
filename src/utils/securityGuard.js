/**
 * BRAHMA Security & Anti-Spam Safeguard Suite
 * Protects frontend forms and LLM inference endpoints from automated bot spam, rapid burst requests, and malicious payload injections.
 */

// Rate limiter state: token bucket
const rateLimitState = {
  lastSubmitTime: 0,
  submitCount: 0,
  minIntervalMs: 800, // Min ms between requests
  maxRequestsPerMinute: 35,
};

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
