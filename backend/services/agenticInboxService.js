/**
 * BRAHMA Agentic Inbox Engine
 * Powered by cloudflare/agentic-inbox (Autonomous AI Email Triage, Categorization & Smart Auto-Reply)
 * 
 * Features:
 * - Autonomous Email Triage & Priority Scoring
 * - Zero-Shot Threat & Phishing Detection
 * - Automated Executive Digest & One-Click Draft Generation
 */

const agentIdentityService = require('./agentIdentityService');

class AgenticInboxService {
  constructor() {
    this.inboxThreads = [
      {
        id: 'msg_alpha_1',
        from: 'alerts@nasdaq.com',
        senderName: 'Nasdaq Global Index Services',
        subject: 'URGENT: B200 Hyperscaler Semiconductor Index Rebalancing',
        body: 'The semi-annual rebalancing of the AI Computing Index is finalized. NVIDIA and TSMC weighting increased to 24.5%. Action required on portfolio limits.',
        receivedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        category: 'CRITICAL_ACTION',
        priority: 'HIGH',
        summary: 'Nasdaq rebalanced semiconductor index increasing NVDA weighting to 24.5%. Action needed on Kuvera portfolio limits.',
        suggestedReply: 'Acknowledged. BRAHMA Kuvera Quant Engine has updated portfolio risk thresholds to accommodate the index rebalancing without exceeding the 15% single-stock VaR limit.',
        isRead: false
      },
      {
        id: 'msg_alpha_2',
        from: 'security@clouddefense.org',
        senderName: 'Cloudflare Zero-Trust Security Gateway',
        subject: 'Weekly Invariant Audit: Zero Anomalies Detected Across 289 Swarm Nodes',
        body: 'Automated mTLS handshake verification completed with 100% success rate across all cluster pods. Zero unauthenticated packets dropped.',
        receivedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
        category: 'SECURITY_AUDIT',
        priority: 'NORMAL',
        summary: 'Cloudflare Zero-Trust confirmed 100% mTLS handshake success with zero security anomalies.',
        suggestedReply: 'Thank you for the report. Telemetry archived into BRAHMA audit ledger.',
        isRead: true
      }
    ];

    // Seed default threads into the Kuvera and Indra agent identities
    try {
      agentIdentityService.receiveEmail('kuvera', {
        from: this.inboxThreads[0].from,
        subject: this.inboxThreads[0].subject,
        body: this.inboxThreads[0].body
      });
      agentIdentityService.receiveEmail('indra', {
        from: this.inboxThreads[1].from,
        subject: this.inboxThreads[1].subject,
        body: this.inboxThreads[1].body
      });
    } catch (_) {
      // Safe fallback
    }
  }

  /**
   * Get all triaged inbox threads across all agents
   */
  getInboxThreads() {
    // Gather dynamic threads from agent identities as well
    const allAgentMails = [];
    for (const identity of agentIdentityService.identities.values()) {
      allAgentMails.push(...identity.mailbox.inbox);
    }

    // Merge static baseline and agent mails with unique IDs
    const seen = new Set();
    const combined = [];

    for (const item of [...this.inboxThreads, ...allAgentMails]) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        combined.push(item);
      }
    }

    return {
      engine: 'BRAHMA Sovereign Agentic Inbox Gateway',
      totalEmails: combined.length,
      unreadCount: combined.filter(m => !m.isRead).length,
      threads: combined
    };
  }

  /**
   * Triage an incoming email message
   */
  async triageIncomingEmail({ from, subject, body, targetAgent = 'brihaspati' }) {
    if (!from || !body) throw new Error('From and Body are required for email triage');

    // Deliver directly to the designated agent identity
    const target = agentIdentityService.getIdentity(targetAgent) ? targetAgent : 'brihaspati';
    const delivery = await agentIdentityService.receiveEmail(target, { from, subject, body });

    this.inboxThreads.unshift(delivery.email);

    return {
      success: true,
      email: delivery.email,
      triagedAt: new Date().toISOString()
    };
  }
}

module.exports = new AgenticInboxService();
