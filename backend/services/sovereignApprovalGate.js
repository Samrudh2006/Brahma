/**
 * BRAHMA Sovereign Approval Gate & Expiring HMAC Ticket Engine
 * 
 * Invariant: Default-Deny Security Gate for Agent State Mutations.
 * - Pure queries and read actions are permitted freely.
 * - Any state-changing mutation (fund movement, live order, ledger write, DB schema modification)
 *   strictly requires an expiring HMAC-SHA256 Approval Ticket.
 * - Tickets are single-use, nonce-bound, and auto-expire after TTL (default: 60s).
 */

const crypto = require('crypto');

class SovereignApprovalGate {
  constructor() {
    this.name = 'SovereignApprovalGate';
    this.vaultSecret = process.env.BRAHMA_GATE_SECRET || 'brahma_sovereign_bastion_vault_hmac_secret_2026';
    this.consumedNonces = new Set();
  }

  /**
   * Determine whether an action requires an approval ticket
   */
  isMutationAction(action = '') {
    const act = action.toUpperCase();
    return act.startsWith('CREATE_') ||
      act.startsWith('UPDATE_') ||
      act.startsWith('DELETE_') ||
      act.startsWith('EXECUTE_') ||
      act.startsWith('MUTATE_') ||
      act.includes('TRADE') ||
      act.includes('WRITE') ||
      act.includes('DISPATCH') ||
      act.includes('TRANSFER');
  }

  /**
   * Issue an expiring HMAC-SHA256 Approval Ticket
   */
  issueApprovalTicket({
    actorId = 'brahma_core_agent',
    action = 'MUTATE_STATE',
    payload = {},
    ttlSeconds = 60
  } = {}) {
    const nonce = crypto.randomBytes(8).toString('hex');
    const issuedAt = Date.now();
    const expiresAt = issuedAt + (ttlSeconds * 1000);
    const payloadDigest = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');

    const message = `${actorId}:${action}:${nonce}:${expiresAt}:${payloadDigest}`;
    const signature = crypto.createHmac('sha256', this.vaultSecret).update(message).digest('hex');

    const ticket = {
      ticketId: `tkt_${Date.now().toString(36)}_${nonce.slice(0, 4)}`,
      actorId,
      action,
      nonce,
      issuedAt: new Date(issuedAt).toISOString(),
      expiresAt: new Date(expiresAt).toISOString(),
      expiresAtMs: expiresAt,
      payloadDigest,
      signature
    };

    return {
      success: true,
      ticket,
      notice: `Expiring approval ticket issued. Valid for ${ttlSeconds} seconds.`
    };
  }

  /**
   * Verify and consume an approval ticket before executing a state mutation
   */
  verifyAndConsumeTicket(ticket, incomingPayload = {}) {
    if (!ticket || !ticket.signature || !ticket.nonce || !ticket.expiresAtMs) {
      return {
        success: false,
        status: 'DENIED_INVALID_TICKET',
        error: 'Missing required approval ticket envelope or cryptographic signature.'
      };
    }

    // 1. Replay attack prevention: check nonce
    if (this.consumedNonces.has(ticket.nonce)) {
      return {
        success: false,
        status: 'DENIED_NONCE_REPLAY',
        error: 'Approval ticket nonce has already been consumed (replay attack detected).'
      };
    }

    // 2. Expiration check
    if (Date.now() > ticket.expiresAtMs) {
      return {
        success: false,
        status: 'DENIED_TICKET_EXPIRED',
        error: `Approval ticket expired ${Date.now() - ticket.expiresAtMs}ms ago.`
      };
    }

    // 3. Payload integrity check
    const incomingDigest = crypto.createHash('sha256').update(JSON.stringify(incomingPayload)).digest('hex');
    if (ticket.payloadDigest && ticket.payloadDigest !== incomingDigest) {
      return {
        success: false,
        status: 'DENIED_PAYLOAD_TAMPERED',
        error: 'Payload hash does not match original approval ticket parameters.'
      };
    }

    // 4. Cryptographic HMAC-SHA256 signature verification
    const expectedMessage = `${ticket.actorId}:${ticket.action}:${ticket.nonce}:${ticket.expiresAtMs}:${ticket.payloadDigest}`;
    const expectedSignature = crypto.createHmac('sha256', this.vaultSecret).update(expectedMessage).digest('hex');

    if (ticket.signature !== expectedSignature) {
      return {
        success: false,
        status: 'DENIED_SIGNATURE_FORGERY',
        error: 'Cryptographic signature verification failed (unauthorized ticket origin).'
      };
    }

    // Ticket is valid: consume nonce
    this.consumedNonces.add(ticket.nonce);

    return {
      success: true,
      status: 'APPROVED_MUTATION_AUTHORIZED',
      ticketId: ticket.ticketId,
      actorId: ticket.actorId,
      action: ticket.action,
      consumedAt: new Date().toISOString()
    };
  }
}

module.exports = new SovereignApprovalGate();
