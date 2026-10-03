/**
 * BRAHMA — 289+ Specialized Multi-Agent Swarm Registry
 * Mapped to 20+ Frontier AI Model Engines & Providers
 */

export const DIVINE_COUNCILS = [
  { id: 'council_core', name: 'Brahma Supreme Architecture Council', deity: 'Brahma', count: 24, icon: '👑', color: '#d4af37' },
  { id: 'council_logic', name: 'Saraswati Formal Logic & Epistemology Council', deity: 'Saraswati', count: 22, icon: '🪕', color: '#9b59b6' },
  { id: 'council_removal', name: 'Ganesha Obstacle Invariance & Triage Council', deity: 'Ganesha', count: 20, icon: '🐘', color: '#e67e22' },
  { id: 'council_systems', name: 'Vishwakarma Hardware & Silicon Compilers Council', deity: 'Vishwakarma', count: 26, icon: '⚙️', color: '#3498db' },
  { id: 'council_exec', name: 'Hanuman High-Throughput Execution Council', deity: 'Hanuman', count: 24, icon: '⚡', color: '#e74c3c' },
  { id: 'council_refactor', name: 'Shiva Legacy Refactoring & Transformation Council', deity: 'Shiva', count: 22, icon: '🔱', color: '#1abc9c' },
  { id: 'council_defense', name: 'Durga Cyber Warfare & Red-Team Defense Council', deity: 'Durga', count: 25, icon: '🛡️', color: '#c0392b' },
  { id: 'council_fintech', name: 'Lakshmi Microstructure & Financial State Machines Council', deity: 'Lakshmi', count: 23, icon: '💰', color: '#f1c40f' },
  { id: 'council_vision', name: 'Krishna Autonomous Strategy & Game Theory Council', deity: 'Krishna', count: 21, icon: '🦚', color: '#2980b9' },
  { id: 'council_compute', name: 'Agni Low-Level Kernels & GPU Ignition Council', deity: 'Agni', count: 24, icon: '🔥', color: '#d35400' },
  { id: 'council_network', name: 'Varuna Distributed Topology & Mesh Council', deity: 'Varuna', count: 20, icon: '🌊', color: '#16a085' },
  { id: 'council_clarity', name: 'Surya Programmatic SEO & Knowledge Graph Council', deity: 'Surya', count: 22, icon: '☀️', color: '#f39c12' },
  { id: 'council_security', name: 'Kali Adversarial Jailbreak & Tech Debt Destruction Council', deity: 'Kali', count: 24, icon: '🗡️', color: '#8e44ad' },
];

const MODEL_ASSIGNMENTS = [
  { modelId: 'deepseek-r1', modelName: 'DeepSeek R1', provider: 'DeepSeek', logo: '🐋', badgeBg: 'rgba(59, 130, 246, 0.15)', badgeBorder: '#3b82f6' },
  { modelId: 'claude-3-7-sonnet', modelName: 'Claude 3.7 Sonnet', provider: 'Anthropic', logo: '🟣', badgeBg: 'rgba(168, 85, 247, 0.15)', badgeBorder: '#a855f7' },
  { modelId: 'gemini-2-0-flash', modelName: 'Gemini 2.0 Flash', provider: 'Google DeepMind', logo: '🔷', badgeBg: 'rgba(14, 165, 233, 0.15)', badgeBorder: '#0ea5e9' },
  { modelId: 'qwen-2-5-coder-32b', modelName: 'Qwen 2.5 Coder', provider: 'Alibaba Qwen', logo: '🔶', badgeBg: 'rgba(249, 115, 22, 0.15)', badgeBorder: '#f97316' },
  { modelId: 'llama-3-3-70b', modelName: 'Llama 3.3 70B', provider: 'Meta AI', logo: '🦙', badgeBg: 'rgba(34, 197, 94, 0.15)', badgeBorder: '#22c55e' },
  { modelId: 'o1-preview', modelName: 'OpenAI o1', provider: 'OpenAI', logo: '🟩', badgeBg: 'rgba(16, 185, 129, 0.15)', badgeBorder: '#10b981' },
  { modelId: 'o3-mini', modelName: 'OpenAI o3-mini', provider: 'OpenAI', logo: '⚡', badgeBg: 'rgba(234, 179, 8, 0.15)', badgeBorder: '#eab308' },
  { modelId: 'bitnet-b1-58', modelName: 'BitNet 1.58-Bit', provider: 'Microsoft Research', logo: '💠', badgeBg: 'rgba(99, 102, 241, 0.15)', badgeBorder: '#6366f1' },
  { modelId: 'mistral-large-2', modelName: 'Mistral Large 2', provider: 'Mistral AI', logo: '🔴', badgeBg: 'rgba(239, 68, 68, 0.15)', badgeBorder: '#ef4444' },
  { modelId: 'phi-4', modelName: 'Phi-4 Synthetic', provider: 'Microsoft', logo: '🧬', badgeBg: 'rgba(20, 184, 166, 0.15)', badgeBorder: '#14b8a6' },
];

// Generate 289+ Specialized Agents with assigned frontier models and logos
export const ALL_289_AGENTS = DIVINE_COUNCILS.flatMap((council, cIdx) => {
  const agentRoles = [
    'Lead Architect', 'Kernel Synthesizer', 'Formal Prover', 'Memory Boundary Auditor',
    'AST Mutator', 'Byzantine State Hedger', 'Sub-Cubic Matrix Tensorizer', 'BitBLAS 1.58-Bit Optimizer',
    'Riemannian Velocity Integrator', 'Adversarial Jailbreak Tester', 'Zero-Knowledge Circuit Prover',
    'Continuous Latent Trajectory Engine', 'Thermodynamic Boltzmann Sampler', 'Sim2Real Humanoid Controller',
    'Idempotency Lock Verifier', 'Microstructure Tick-Level Forecaster', 'De Novo Enzyme Folder',
    'Waddington Manifold Reverser', 'Cache-Coherent Memory Scaler', 'eBPF Kernel Profiler',
    'Smart Contract Reentrancy Verifier', 'High-Frequency Order Hedger', 'Hardware-Aware Scan Dispatcher',
    'Neural Code Decompiler', 'Multi-Hop Citation Miner', 'Autonomous API Orchestrator'
  ];

  return Array.from({ length: council.count }).map((_, aIdx) => {
    const role = agentRoles[(cIdx * 7 + aIdx) % agentRoles.length];
    const model = MODEL_ASSIGNMENTS[(cIdx * 3 + aIdx) % MODEL_ASSIGNMENTS.length];
    const id = `agent_${council.id}_${aIdx + 1}`;
    return {
      id,
      name: `${council.deity} ${role} #${aIdx + 1}`,
      councilId: council.id,
      councilName: council.name,
      deity: council.deity,
      color: council.color,
      icon: council.icon,
      status: aIdx % 5 === 0 ? 'active' : (aIdx % 3 === 0 ? 'synthesizing' : 'standby'),
      tier: 'Level 5 Autonomous',
      specialty: `${council.deity} Domain: ${role}`,
      totalTasksExecuted: 'N/A',
      verificationRate: 'N/A',
      // Frontier Model & Logo
      underlyingModel: model.modelName,
      modelId: model.modelId,
      provider: model.provider,
      providerLogo: model.logo,
      badgeBg: model.badgeBg,
      badgeBorder: model.badgeBorder,
    };
  });
});
