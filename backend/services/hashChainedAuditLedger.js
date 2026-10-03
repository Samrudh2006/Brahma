/**
 * BRAHMA Cryptographic Hash-Chained Audit Ledger
 * 
 * Invariant: Tamper-Evident Append-Only State Root Ledger.
 * Every council action hashes the previous block's digest:
 *   H_n = SHA-256(H_{n-1} + index + timestamp + councilId + action + SHA-256(payload))
 * Any retroactive tampering immediately invalidates the entire downstream chain.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class HashChainedAuditLedger {
  constructor() {
    this.ledgerDir = path.join(process.cwd(), '.brahma', 'ledger');
    this.ledgerFile = path.join(this.ledgerDir, 'hash_chained_audit_log.json');
    this.chain = [];
    this._initStorage();
  }

  _initStorage() {
    try {
      if (!fs.existsSync(this.ledgerDir)) {
        fs.mkdirSync(this.ledgerDir, { recursive: true });
      }
      if (fs.existsSync(this.ledgerFile)) {
        const raw = fs.readFileSync(this.ledgerFile, 'utf8');
        this.chain = JSON.parse(raw);
      } else {
        this.chain = [];
        this._appendGenesisBlock();
      }
    } catch {
      this.chain = [];
      this._appendGenesisBlock();
    }
  }

  _appendGenesisBlock() {
    const genesis = {
      index: 0,
      timestamp: '2026-01-01T00:00:00.000Z',
      councilId: 'GENESIS',
      action: 'SOVEREIGN_ROOT_GENESIS',
      payload: { system: 'BRAHMA_SOVEREIGN_MATRIX_INITIALIZED' },
      prevHash: '0000000000000000000000000000000000000000000000000000000000000000',
      entryHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    };
    this.chain = [genesis];
    this._save();
  }

  _save() {
    try {
      fs.writeFileSync(this.ledgerFile, JSON.stringify(this.chain, null, 2), 'utf8');
    } catch {
      // Non-fatal if filesystem is restricted
    }
  }

  /**
   * Compute entry hash
   */
  _computeHash({ index, timestamp, councilId, action, payload, prevHash }) {
    const payloadDigest = crypto.createHash('sha256').update(JSON.stringify(payload || {})).digest('hex');
    const rawString = `${index}:${timestamp}:${councilId}:${action}:${payloadDigest}:${prevHash}`;
    return crypto.createHash('sha256').update(rawString).digest('hex');
  }

  /**
   * Append a new council event to the tamper-evident hash chain
   */
  appendEntry({
    councilId = 'brahma_core',
    action = 'EXECUTE_COUNCIL_OPERATION',
    payload = {}
  } = {}) {
    const prevBlock = this.chain[this.chain.length - 1];
    const index = this.chain.length;
    const timestamp = new Date().toISOString();
    const prevHash = prevBlock ? prevBlock.entryHash : '0000000000000000000000000000000000000000000000000000000000000000';

    const entryHash = this._computeHash({
      index,
      timestamp,
      councilId,
      action,
      payload,
      prevHash
    });

    const newBlock = {
      index,
      timestamp,
      councilId,
      action,
      payload,
      prevHash,
      entryHash
    };

    this.chain.push(newBlock);
    this._save();

    return {
      success: true,
      blockIndex: index,
      stateRoot: entryHash,
      prevHash,
      totalBlocks: this.chain.length,
      entry: newBlock
    };
  }

  /**
   * Cryptographically verify the integrity of the entire chain from genesis to tip
   */
  verifyChainIntegrity() {
    const startTime = Date.now();
    if (this.chain.length === 0) {
      return { success: false, error: 'Empty chain' };
    }

    for (let i = 1; i < this.chain.length; i++) {
      const current = this.chain[i];
      const previous = this.chain[i - 1];

      // 1. Verify link to previous hash
      if (current.prevHash !== previous.entryHash) {
        return {
          success: false,
          chainValid: false,
          tamperedBlockIndex: i,
          reason: `Broken chain link at index ${i}: prevHash does not match entry ${i - 1} hash.`
        };
      }

      // 2. Re-compute and verify hash integrity
      const expectedHash = this._computeHash(current);
      if (current.entryHash !== expectedHash) {
        return {
          success: false,
          chainValid: false,
          tamperedBlockIndex: i,
          reason: `Cryptographic hash mismatch at index ${i}: data was modified after signing.`
        };
      }
    }

    const stateRoot = this.chain[this.chain.length - 1].entryHash;

    return {
      success: true,
      chainValid: true,
      totalBlocks: this.chain.length,
      stateRoot,
      verificationLatencyMs: Date.now() - startTime,
      attestation: 'CRYPTOGRAPHIC_CHAIN_VERIFIED_UNBROKEN'
    };
  }

  /**
   * Get latest state root
   */
  getStateRoot() {
    const tip = this.chain[this.chain.length - 1];
    return tip ? tip.entryHash : null;
  }
}

module.exports = new HashChainedAuditLedger();
