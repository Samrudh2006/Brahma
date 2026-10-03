/**
 * BRAHMA Sovereign In-Memory Hybrid Retrieval Engine
 * 
 * High-Speed Zero-Hop Retrieval Architecture (<2ms Hot Path):
 * - Combined BM25 Keyword Matching + Dense Cosine Vector Similarity in a Single Pass
 * - In-Memory Inverted Index with Term-Frequency & Document Length Normalization
 * - Zero Network Round-Trips (No Cloud Vector Database Dependency)
 * - Rich Metadata Filtering ($eq, $in, $contains)
 */

class HybridRetrievalEngine {
  constructor() {
    this.documents = new Map(); // id -> doc
    this.invertedIndex = new Map(); // term -> Set(docIds)
    this.docLengths = new Map(); // id -> token count
    this.avgDocLength = 0;
    this.k1 = 1.2; // BM25 term frequency saturation
    this.b = 0.75; // BM25 length normalization
    this.vectorDim = 64; // Compact local hash embedding dimensionality

    this.initializeBaselineKnowledge();
  }

  /**
   * Tokenize text into normalized alphanumeric stems
   */
  tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9_\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1);
  }

  /**
   * Generate lightweight deterministic dense semantic vector (Local SimHash/N-gram projection)
   */
  computeSemanticVector(text) {
    const tokens = this.tokenize(text);
    const vec = new Float32Array(this.vectorDim);
    if (tokens.length === 0) return vec;

    for (const token of tokens) {
      // Deterministic polynomial rolling hash
      let h = 0;
      for (let i = 0; i < token.length; i++) {
        h = (h * 31 + token.charCodeAt(i)) >>> 0;
      }
      const slot = h % this.vectorDim;
      vec[slot] += 1.0;
    }

    // L2 Normalize
    let norm = 0;
    for (let i = 0; i < this.vectorDim; i++) norm += vec[i] * vec[i];
    norm = Math.sqrt(norm);
    if (norm > 0) {
      for (let i = 0; i < this.vectorDim; i++) vec[i] /= norm;
    }
    return vec;
  }

  /**
   * Compute Cosine Similarity between two dense unit vectors
   */
  cosineSimilarity(vecA, vecB) {
    let dot = 0;
    for (let i = 0; i < this.vectorDim; i++) {
      dot += vecA[i] * vecB[i];
    }
    return Math.max(0, Math.min(1, dot));
  }

  /**
   * Index a document into memory
   */
  indexDocument({ id, text, metadata = {} }) {
    if (!id || !text) throw new Error('Document id and text are required');

    const docId = String(id);
    const tokens = this.tokenize(text);
    const vector = this.computeSemanticVector(text);

    // Update inverted index
    for (const token of tokens) {
      if (!this.invertedIndex.has(token)) {
        this.invertedIndex.set(token, new Set());
      }
      this.invertedIndex.get(token).add(docId);
    }

    this.documents.set(docId, {
      id: docId,
      text,
      metadata,
      vector,
      tokensCount: tokens.length,
      indexedAt: new Date().toISOString()
    });

    this.docLengths.set(docId, tokens.length);

    // Recalculate average document length
    let totalLen = 0;
    for (const len of this.docLengths.values()) totalLen += len;
    this.avgDocLength = this.documents.size > 0 ? totalLen / this.documents.size : 0;

    return { success: true, docId, tokenCount: tokens.length };
  }

  /**
   * Bulk index documents
   */
  indexBatch(docs = []) {
    let count = 0;
    for (const doc of docs) {
      this.indexDocument(doc);
      count++;
    }
    return { success: true, count, totalIndexed: this.documents.size };
  }

  /**
   * Evaluate metadata filter operators
   */
  matchesFilter(docMetadata, filter = {}) {
    if (!filter || Object.keys(filter).length === 0) return true;

    for (const [key, condition] of Object.entries(filter)) {
      const val = docMetadata[key];
      if (typeof condition === 'object' && condition !== null) {
        if ('$eq' in condition && val !== condition.$eq) return false;
        if ('$in' in condition && Array.isArray(condition.$in) && !condition.$in.includes(val)) return false;
        if ('$contains' in condition && (!Array.isArray(val) || !val.includes(condition.$contains))) return false;
      } else {
        if (val !== condition) return false;
      }
    }
    return true;
  }

  /**
   * Execute Hybrid In-Memory Search (BM25 + Dense Cosine Ranking)
   * @param {string} query - The search query
   * @param {Object} options - { topK = 5, alpha = 0.5, filter = {} }
   * alpha = 1.0 (pure keyword), 0.0 (pure semantic), 0.5 (balanced hybrid)
   */
  search(query, { topK = 5, alpha = 0.5, filter = {} } = {}) {
    const startTime = Date.now();
    const queryTokens = this.tokenize(query);
    const queryVector = this.computeSemanticVector(query);
    const totalDocs = this.documents.size;

    if (totalDocs === 0) {
      return { query, totalResults: 0, latencyMs: 0, results: [] };
    }

    const candidateScores = new Map(); // docId -> { bm25, semantic, hybrid }

    // ── Phase 1: BM25 Keyword Scoring ──────────────────────────────────────
    for (const token of queryTokens) {
      const postingList = this.invertedIndex.get(token);
      if (!postingList) continue;

      const df = postingList.size;
      // Standard Okapi BM25 IDF
      const idf = Math.log(1 + (totalDocs - df + 0.5) / (df + 0.5));

      for (const docId of postingList) {
        const doc = this.documents.get(docId);
        if (!doc || !this.matchesFilter(doc.metadata, filter)) continue;

        const docLen = this.docLengths.get(docId) || 1;
        // Count term frequency in doc
        const tf = this.tokenize(doc.text).filter(t => t === token).length;
        const bm25Score = idf * ((tf * (this.k1 + 1)) / (tf + this.k1 * (1 - this.b + this.b * (docLen / (this.avgDocLength || 1)))));

        const current = candidateScores.get(docId) || { bm25: 0, semantic: 0 };
        current.bm25 += bm25Score;
        candidateScores.set(docId, current);
      }
    }

    // ── Phase 2: Dense Semantic Cosine Scoring ─────────────────────────────
    // For all candidate docs (or all docs if queryTokens yielded few matches)
    const targetDocIds = candidateScores.size > 0 ? Array.from(candidateScores.keys()) : Array.from(this.documents.keys());

    let maxBm25 = 0.0001;
    for (const docId of targetDocIds) {
      const doc = this.documents.get(docId);
      if (!doc || !this.matchesFilter(doc.metadata, filter)) continue;

      const semanticScore = this.cosineSimilarity(queryVector, doc.vector);
      const scoreObj = candidateScores.get(docId) || { bm25: 0, semantic: 0 };
      scoreObj.semantic = semanticScore;
      if (scoreObj.bm25 > maxBm25) maxBm25 = scoreObj.bm25;
      candidateScores.set(docId, scoreObj);
    }

    // ── Phase 3: Normalized Hybrid Fusion with Evidence-Grade Weighting ───
    const EVIDENCE_WEIGHTS = {
      OFFICIAL: 1.0,      // Verified statutory code, official schema, audited ledger
      OBSERVED: 0.85,     // Empirically tested runtime telemetry & verified logs
      INFERRED: 0.60,     // Model synthesized reasoning & predictive estimates
      UNVERIFIED: 0.35    // Unvetted external web content or forum commentary
    };

    const results = [];
    for (const [docId, scores] of candidateScores.entries()) {
      const doc = this.documents.get(docId);
      if (!doc || !this.matchesFilter(doc.metadata, filter)) continue;

      const normalizedBm25 = Math.min(1.0, scores.bm25 / maxBm25);
      const baseHybridScore = alpha * normalizedBm25 + (1 - alpha) * scores.semantic;
      
      const grade = String(doc.metadata.evidenceGrade || 'OFFICIAL').toUpperCase();
      const trustMultiplier = EVIDENCE_WEIGHTS[grade] || 0.85;
      const finalScore = baseHybridScore * trustMultiplier;

      results.push({
        id: doc.id,
        text: doc.text,
        metadata: doc.metadata,
        evidenceGrade: grade,
        trustMultiplier,
        score: Number(finalScore.toFixed(4)),
        breakdown: {
          rawHybrid: Number(baseHybridScore.toFixed(4)),
          bm25: Number(normalizedBm25.toFixed(4)),
          semantic: Number(scores.semantic.toFixed(4)),
          trustMultiplier
        }
      });
    }

    // Sort by descending hybrid score
    results.sort((a, b) => b.score - a.score);
    const topResults = results.slice(0, topK);

    return {
      query,
      topK,
      totalMatched: results.length,
      latencyMs: Date.now() - startTime,
      results: topResults
    };
  }

  /**
   * Seed baseline sovereign knowledge into in-memory engine
   */
  initializeBaselineKnowledge() {
    this.indexBatch([
      {
        id: 'council_brihaspati',
        text: 'Brihaspati is the Sovereign Telephony and Voice Dialogue Concierge orchestrating low-latency voice, SMS, WebRTC, and 2FA OTP verification.',
        metadata: { domain: 'telephony', council: 'brihaspati' }
      },
      {
        id: 'council_garuda',
        text: 'Garuda is the Commerce and Travel Sentinel for flight search, hotel bookings, price alerts, and automated transactional negotiation.',
        metadata: { domain: 'commerce', council: 'garuda' }
      },
      {
        id: 'council_kuvera',
        text: 'Kuvera is the High-Frequency Quantitative Alpha and Portfolio Risk Council balancing risk limits and macroeconomic hedge analytics.',
        metadata: { domain: 'finance', council: 'kuvera' }
      },
      {
        id: 'council_indra',
        text: 'Indra is the Zero-Trust SecOps Shield hunting threats, auditing invariants, and orchestrating workspace mesh across Slack and Discord.',
        metadata: { domain: 'security', council: 'indra' }
      },
      {
        id: 'council_dhanvantari',
        text: 'Dhanvantari provides Clinical and Biomedical Decision Support, pharmacology telemetry, and medical diagnosis assistance.',
        metadata: { domain: 'biomedical', council: 'dhanvantari' }
      },
      {
        id: 'council_chanakya',
        text: 'Chanakya provides Enterprise Legal Governance, regulatory risk audits, and automated contract compliance.',
        metadata: { domain: 'legal', council: 'chanakya' }
      }
    ]);
  }
}

module.exports = new HybridRetrievalEngine();
