/**
 * BRAHMA Sovereign Change Request & Reviewable Diffs Service
 * 
 * Invariants:
 * - Reviewable Agent Writes: Agents never overwrite canonical state directly; they submit structured Change Requests
 * - Field-Level Diffs: Every request contains before vs after field-level diffs with authorship & rationale
 * - Formal State Machine: PENDING_REVIEW -> APPROVED -> COMMITTED (or REJECTED)
 * - Cryptographic Auditing: SHA-256 commit hash generated upon approval
 */

const crypto = require('crypto');

class ChangeRequestService {
  constructor() {
    this.changeRequests = new Map();
    this.committedHistory = [];
  }

  /**
   * Submit a new Change Request with structured field-level diffs
   */
  createChangeRequest({
    targetEntity,
    entityId,
    proposedBy = 'Brahma-Autonomous-Agent',
    rationale = '',
    diffs = [],
    metadata = {}
  }) {
    if (!targetEntity || !entityId) {
      throw new Error('targetEntity and entityId are required');
    }
    if (!Array.isArray(diffs) || diffs.length === 0) {
      throw new Error('diffs array with at least one field change is required');
    }

    const crId = `cr_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const timestamp = new Date().toISOString();

    // Standardize diff objects: { field, oldValue, newValue, operation: 'ADD'|'MODIFY'|'DELETE' }
    const normalizedDiffs = diffs.map(d => ({
      field: d.field,
      oldValue: d.oldValue !== undefined ? d.oldValue : null,
      newValue: d.newValue !== undefined ? d.newValue : null,
      operation: d.operation || (d.oldValue === undefined || d.oldValue === null ? 'ADD' : d.newValue === null ? 'DELETE' : 'MODIFY')
    }));

    const changePayload = JSON.stringify({ targetEntity, entityId, proposedBy, rationale, diffs: normalizedDiffs });
    const proposalHash = crypto.createHash('sha256').update(changePayload).digest('hex');

    const changeRequest = {
      id: crId,
      status: 'PENDING_REVIEW', // PENDING_REVIEW -> APPROVED -> COMMITTED | REJECTED
      targetEntity,
      entityId,
      proposedBy,
      rationale,
      diffs: normalizedDiffs,
      fieldCount: normalizedDiffs.length,
      proposalHashSha256: proposalHash,
      createdAt: timestamp,
      reviewedAt: null,
      reviewedBy: null,
      reviewComments: null,
      commitHash: null,
      metadata
    };

    this.changeRequests.set(crId, changeRequest);

    return {
      success: true,
      changeRequest
    };
  }

  /**
   * Approve a Change Request and commit its diffs
   */
  approveChangeRequest(crId, { reviewedBy = 'Master-Council-Admin', comments = '' } = {}) {
    const cr = this.changeRequests.get(crId);
    if (!cr) {
      return { success: false, error: 'CHANGE_REQUEST_NOT_FOUND' };
    }
    if (cr.status !== 'PENDING_REVIEW') {
      return { success: false, error: `CANNOT_APPROVE_STATUS_${cr.status}` };
    }

    const commitTimestamp = new Date().toISOString();
    const commitPayload = JSON.stringify({ ...cr, reviewedBy, comments, commitTimestamp });
    const commitHash = crypto.createHash('sha256').update(commitPayload).digest('hex');

    cr.status = 'COMMITTED';
    cr.reviewedBy = reviewedBy;
    cr.reviewedAt = commitTimestamp;
    cr.reviewComments = comments;
    cr.commitHash = commitHash;

    this.committedHistory.unshift({ ...cr });

    return {
      success: true,
      changeRequest: cr,
      commitHash
    };
  }

  /**
   * Reject a Change Request
   */
  rejectChangeRequest(crId, { reviewedBy = 'Master-Council-Admin', reason = 'Rejected during audit' } = {}) {
    const cr = this.changeRequests.get(crId);
    if (!cr) {
      return { success: false, error: 'CHANGE_REQUEST_NOT_FOUND' };
    }
    if (cr.status !== 'PENDING_REVIEW') {
      return { success: false, error: `CANNOT_REJECT_STATUS_${cr.status}` };
    }

    cr.status = 'REJECTED';
    cr.reviewedBy = reviewedBy;
    cr.reviewedAt = new Date().toISOString();
    cr.reviewComments = reason;

    return {
      success: true,
      changeRequest: cr
    };
  }

  /**
   * Get single Change Request by ID
   */
  getChangeRequest(crId) {
    return this.changeRequests.get(crId) || null;
  }

  /**
   * List all Change Requests with optional status filtering
   */
  listChangeRequests({ status = null, limit = 50 } = {}) {
    let all = Array.from(this.changeRequests.values());
    if (status) {
      all = all.filter(c => c.status === status.toUpperCase());
    }
    return all.slice(0, limit);
  }
}

module.exports = new ChangeRequestService();
