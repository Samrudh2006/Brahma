/**
 * BRAHMA Multi-Provider Load Balancer & Circuit Breaker Engine
 * Distributes inference traffic across local & cloud providers with automatic circuit breaker failover.
 */

class LoadBalancer {
  constructor() {
    this.providers = [
      { id: 'ollama_local', name: 'Ollama Local Instance', type: 'local', weight: 10, status: 'CLOSED', errors: 0, lastErrorTime: 0 },
      { id: 'groq_cloud', name: 'Groq Llama-3 Ultra-Fast', type: 'cloud', weight: 8, status: 'CLOSED', errors: 0, lastErrorTime: 0 },
      { id: 'deepseek_r1', name: 'DeepSeek R1 Reasoner', type: 'cloud', weight: 7, status: 'CLOSED', errors: 0, lastErrorTime: 0 },
      { id: 'huggingface', name: 'HuggingFace Inference API', type: 'cloud', weight: 5, status: 'CLOSED', errors: 0, lastErrorTime: 0 },
      { id: 'fallback_mock', name: 'Brahma Sovereign Local Fallback', type: 'offline', weight: 1, status: 'CLOSED', errors: 0, lastErrorTime: 0 }
    ];

    this.rrIndex = 0;
    this.maxErrorsBeforeTrip = 3;
    this.cooldownPeriodMs = 30000; // 30s circuit breaker reset
  }

  /**
   * Select best available provider based on health status and Circuit Breaker state
   */
  selectProvider(preferredType = 'any') {
    const now = Date.now();

    // Check & reset tripped circuit breakers if cooldown expired
    this.providers.forEach(p => {
      if (p.status === 'OPEN' && (now - p.lastErrorTime) > this.cooldownPeriodMs) {
        console.log(`[CircuitBreaker] Resetting provider ${p.name} from OPEN to HALF-OPEN for trial.`);
        p.status = 'HALF-OPEN';
        p.errors = 0;
      }
    });

    // Filter healthy providers
    const healthy = this.providers.filter(p => p.status === 'CLOSED' || p.status === 'HALF-OPEN');
    if (healthy.length === 0) {
      return this.providers.find(p => p.id === 'fallback_mock');
    }

    // Round-Robin selection
    const selected = healthy[this.rrIndex % healthy.length];
    this.rrIndex++;
    return selected;
  }

  /**
   * Report successful execution on a provider
   */
  recordSuccess(providerId) {
    const p = this.providers.find(x => x.id === providerId);
    if (p) {
      p.errors = 0;
      p.status = 'CLOSED';
    }
  }

  /**
   * Report execution error on a provider & trip Circuit Breaker if threshold reached
   */
  recordFailure(providerId, errorMsg = '') {
    const p = this.providers.find(x => x.id === providerId);
    if (!p) return;

    p.errors++;
    p.lastErrorTime = Date.now();

    if (p.errors >= this.maxErrorsBeforeTrip) {
      p.status = 'OPEN';
      console.warn(`\n[CircuitBreaker TRIP] Provider "${p.name}" tripped to OPEN state after ${p.errors} errors! Error: ${errorMsg}`);
    }
  }

  /**
   * Get load balancer telemetry
   */
  getMetrics() {
    return {
      totalProviders: this.providers.length,
      healthyCount: this.providers.filter(p => p.status !== 'OPEN').length,
      providers: this.providers.map(p => ({
        id: p.id,
        name: p.name,
        status: p.status,
        errors: p.errors,
        weight: p.weight
      }))
    };
  }
}

module.exports = new LoadBalancer();
