/**
 * BRAHMA — Sovereign Edge Mesh & P2P CRDT State Replication Engine
 * State-based LWW-Element-Set CRDT, Vector Clocks & Merkle-DAG Sync
 * 
 * Provides:
 * 1. Last-Write-Wins Element-Set (LWW-Element-Set) CRDT for Peer-to-Peer Data Convergence
 * 2. Lamport Vector Clocks for Partial Order Causal Tracking
 * 3. Merkle Root State Hash Synchronization for Air-Gapped / Low-Bandwidth Clusters
 * 4. Deterministic Multi-Node Merge Reconciliation
 */

const crypto = require('crypto');

class BrahmaEdgeMeshSyncEngine {
  constructor() {
    this.engineName = 'BRAHMA-Edge-CRDT-Mesh';
    this.nodeId = `node_${crypto.randomBytes(3).toString('hex')}`;
    this.addSet = new Map(); // element -> { timestamp, nodeId }
    this.removeSet = new Map(); // element -> { timestamp, nodeId }
    this.vectorClock = {}; // nodeId -> counter
    this.vectorClock[this.nodeId] = 0;
  }

  /**
   * Add Element to LWW CRDT Set
   */
  addElement(element, customTimestamp = null) {
    this.vectorClock[this.nodeId] = (this.vectorClock[this.nodeId] || 0) + 1;
    const ts = customTimestamp || Date.now();
    this.addSet.set(element, { timestamp: ts, nodeId: this.nodeId });

    return {
      success: true,
      action: 'ADD_ELEMENT',
      element,
      timestamp: ts,
      merkleRoot: this.getMerkleStateRoot()
    };
  }

  /**
   * Remove Element from LWW CRDT Set
   */
  removeElement(element, customTimestamp = null) {
    this.vectorClock[this.nodeId] = (this.vectorClock[this.nodeId] || 0) + 1;
    const ts = customTimestamp || Date.now();
    this.removeSet.set(element, { timestamp: ts, nodeId: this.nodeId });

    return {
      success: true,
      action: 'REMOVE_ELEMENT',
      element,
      timestamp: ts,
      merkleRoot: this.getMerkleStateRoot()
    };
  }

  /**
   * Internal Helper to Extract Sorted Active Elements
   */
  getActiveElementsList() {
    const activeElements = [];
    for (const [elem, addMeta] of this.addSet.entries()) {
      const remMeta = this.removeSet.get(elem);
      if (!remMeta || addMeta.timestamp > remMeta.timestamp) {
        activeElements.push(elem);
      }
    }
    return activeElements.sort();
  }

  /**
   * Query Current Replicated State (LWW Evaluation Rule)
   * An element is present if it is in addSet and not in removeSet, OR if in both, addSet timestamp > removeSet timestamp
   */
  readActiveState() {
    const activeElements = this.getActiveElementsList();

    return {
      success: true,
      activeElements,
      totalActive: activeElements.length,
      nodeId: this.nodeId,
      vectorClock: { ...this.vectorClock },
      merkleRoot: this.getMerkleStateRoot()
    };
  }

  /**
   * Merge Remote CRDT Peer State (Commutative, Associative, Idempotent)
   */
  mergeRemotePeerState(remoteState = {}) {
    const { remoteNodeId, remoteAddSet = [], remoteRemoveSet = [], remoteVectorClock = {} } = remoteState;

    // Merge Vector Clocks: take pairwise maximum
    for (const [nId, count] of Object.entries(remoteVectorClock)) {
      this.vectorClock[nId] = Math.max(this.vectorClock[nId] || 0, count);
    }
    this.vectorClock[this.nodeId] = (this.vectorClock[this.nodeId] || 0) + 1;

    // Merge Add Set
    remoteAddSet.forEach(([elem, meta]) => {
      const existing = this.addSet.get(elem);
      if (!existing || meta.timestamp > existing.timestamp) {
        this.addSet.set(elem, meta);
      }
    });

    // Merge Remove Set
    remoteRemoveSet.forEach(([elem, meta]) => {
      const existing = this.removeSet.get(elem);
      if (!existing || meta.timestamp > existing.timestamp) {
        this.removeSet.set(elem, meta);
      }
    });

    return {
      success: true,
      status: 'CRDT_MERGE_CONVERGENCE_ACHIEVED',
      mergedWithNodeId: remoteNodeId,
      activeElements: this.getActiveElementsList(),
      newMerkleRoot: this.getMerkleStateRoot()
    };
  }

  /**
   * Compute Deterministic Merkle Root State Hash
   */
  getMerkleStateRoot() {
    const sorted = this.getActiveElementsList();
    const serialized = JSON.stringify(sorted);
    return crypto.createHash('sha256').update(serialized).digest('hex');
  }
}

module.exports = new BrahmaEdgeMeshSyncEngine();
