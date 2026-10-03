/**
 * BRAHMA 30+ Specialized Open-Source & GitHub Developer Skills Catalog
 * Sourced from open-source engineering paradigms, GitHub repos, and scientific workflows.
 */

export const SKILL_CATEGORIES = [
  'All Skills',
  'Web & Mobile Apps',
  'Silicon & Hardware',
  'DevOps & Cloud',
  'Security & Auditing',
  'Data & AI Science',
  '3D & Graphics',
  'Smart Contracts'
];

export const INITIAL_SKILLS = [
  // ── 1. Web & Mobile Apps ──
  {
    id: 'fullstack-app-builder',
    name: 'Autonomous Full-Stack Web App Builder',
    category: 'Web & Mobile Apps',
    identityOwner: 'saraswati',
    githubRepo: 'brahma-ai/fullstack-synth',
    description: 'Generates responsive multi-file web applications (HTML, CSS, React, JS, Express) with real-time interactive in-browser preview.',
    enabled: true,
    meta: { version: '3.4.0', usageCount: 4210, verifiedBy: 'Saraswati Engineering' }
  },
  {
    id: 'nextjs-saas-generator',
    name: 'Next.js 15 App Router & SaaS Boilerplate Builder',
    category: 'Web & Mobile Apps',
    identityOwner: 'saraswati',
    githubRepo: 'vercel/next.js',
    description: 'Scaffolds production Next.js 15 apps with Server Actions, Tailwind/Vanilla CSS, Auth.js, and Stripe billing.',
    enabled: true,
    meta: { version: '2.8.0', usageCount: 2980, verifiedBy: 'Next.js Expert Council' }
  },
  {
    id: 'react-native-mobile-synth',
    name: 'React Native & Flutter Mobile App Synthesizer',
    category: 'Web & Mobile Apps',
    identityOwner: 'krishna',
    githubRepo: 'facebook/react-native',
    description: 'Builds cross-platform iOS & Android mobile screens with gesture handlers, camera, GPS, and push notification modules.',
    enabled: true,
    meta: { version: '2.1.0', usageCount: 1840, verifiedBy: 'Mobile Architect' }
  },
  {
    id: 'chrome-extension-builder',
    name: 'Manifest V3 Chrome Extension Creator',
    category: 'Web & Mobile Apps',
    identityOwner: 'ganesha',
    githubRepo: 'google/chrome-extensions-samples',
    description: 'Generates background service workers, content scripts, and side-panel popup extensions with storage sync.',
    enabled: true,
    meta: { version: '1.9.0', usageCount: 960, verifiedBy: 'Browser Engine' }
  },
  {
    id: 'electron-desktop-creator',
    name: 'Electron & Tauri Desktop App Creator',
    category: 'Web & Mobile Apps',
    identityOwner: 'varuna',
    githubRepo: 'tauri-apps/tauri',
    description: 'Packages high-performance native desktop applications for Windows, macOS, and Linux with Rust/Node backends.',
    enabled: true,
    meta: { version: '1.7.5', usageCount: 1120, verifiedBy: 'Desktop Systems' }
  },

  // ── 2. Silicon & Hardware ──
  {
    id: 'cuda-triton-kernel-synth',
    name: 'CUDA C++ & OpenAI Triton GPU Kernel Synthesizer',
    category: 'Silicon & Hardware',
    identityOwner: 'kartikeya',
    githubRepo: 'openai/triton',
    description: 'Generates fused GPU kernels for FlashAttention-3, ternary GEMM, and FP8 quantized matrix multiplies.',
    enabled: true,
    meta: { version: '3.1.0', usageCount: 2150, verifiedBy: 'NVIDIA CUDA Council' }
  },
  {
    id: 'bitnet-quantizer-engine',
    name: 'BitNet b1.58 Ternary Silicon Converter',
    category: 'Silicon & Hardware',
    identityOwner: 'kuvera',
    githubRepo: 'microsoft/BitNet',
    description: 'Quantizes 16-bit float model weights into {-1, 0, +1} add-only integer tensors for 10x memory compression.',
    enabled: true,
    meta: { version: '2.0.0', usageCount: 3410, verifiedBy: 'Silicon Architecture' }
  },
  {
    id: 'verilog-fpga-synthesizer',
    name: 'Verilog & SystemVerilog FPGA Synthesizer',
    category: 'Silicon & Hardware',
    identityOwner: 'indra',
    githubRepo: 'chipsalliance/verilator',
    description: 'Writes synthesizable RTL hardware modules, AXI4 bus arbiters, and RISC-V CPU pipeline cores.',
    enabled: true,
    meta: { version: '1.4.0', usageCount: 680, verifiedBy: 'Hardware RTL Team' }
  },

  // ── 3. DevOps & Cloud ──
  {
    id: 'docker-k8s-terraform-architect',
    name: 'Docker, Kubernetes & Terraform Cloud Architect',
    category: 'DevOps & Cloud',
    identityOwner: 'vishwakarma',
    githubRepo: 'hashicorp/terraform',
    description: 'Generates multi-stage Dockerfiles, Helm charts, AWS/GCP/Azure Terraform scripts, and GitHub Actions CI/CD.',
    enabled: true,
    meta: { version: '2.9.0', usageCount: 3120, verifiedBy: 'Cloud SRE Council' }
  },
  {
    id: 'microservice-grpc-scaffold',
    name: 'Distributed Microservices & gRPC Scaffold',
    category: 'DevOps & Cloud',
    identityOwner: 'indra',
    githubRepo: 'grpc/grpc-go',
    description: 'Builds high-throughput Protobuf services with Envoy proxy, circuit breaking, and OpenTelemetry tracing.',
    enabled: true,
    meta: { version: '2.3.0', usageCount: 1450, verifiedBy: 'Distributed Systems' }
  },
  {
    id: 'kafka-event-stream-architect',
    name: 'Apache Kafka & Redis Pub/Sub Event Streamer',
    category: 'DevOps & Cloud',
    identityOwner: 'varuna',
    githubRepo: 'apache/kafka',
    description: 'Architects real-time streaming topologies with dead-letter queues, exactly-once semantics, and partition rebalancing.',
    enabled: true,
    meta: { version: '1.8.0', usageCount: 890, verifiedBy: 'Messaging Engine' }
  },

  // ── 4. Security & Auditing ──
  {
    id: 'smart-contract-solidity-auditor',
    name: 'Solidity Smart Contract & DeFi Protocol Auditor',
    category: 'Security & Auditing',
    identityOwner: 'durga',
    githubRepo: 'crytic/slither',
    description: 'Detects reentrancy bugs, integer overflows, front-running MEV vulnerabilities, and access control flaws.',
    enabled: true,
    meta: { version: '3.0.1', usageCount: 2780, verifiedBy: 'Web3 Security' }
  },
  {
    id: 'zero-day-penetration-tester',
    name: 'Automated Zero-Day & Web App Pen-Tester',
    category: 'Security & Auditing',
    identityOwner: 'yama',
    githubRepo: 'OWASP/ZAP',
    description: 'Scans endpoints for OWASP Top 10, SSRF, SQLi, CORS misconfigurations, and IDOR broken access controls.',
    enabled: true,
    meta: { version: '2.5.0', usageCount: 1930, verifiedBy: 'Red Team Council' }
  },
  {
    id: 'prompt-injection-firewall-builder',
    name: 'LLM Prompt Injection & Jailbreak Firewall',
    category: 'Security & Auditing',
    identityOwner: 'yama',
    githubRepo: 'protectai/rebuff',
    description: 'Generates heuristic and semantic vector filters to block indirect injection, data leaks, and system prompt bypasses.',
    enabled: true,
    meta: { version: '2.2.0', usageCount: 1670, verifiedBy: 'AI Defense' }
  },

  // ── 5. Data & AI Science ──
  {
    id: 'unsloth-qlora-pipeline',
    name: 'Unsloth 5x Fast QLoRA Fine-Tuning Pipeline',
    category: 'Data & AI Science',
    identityOwner: 'saraswati',
    githubRepo: 'unslothai/unsloth',
    description: 'Generates PyTorch and Triton fine-tuning notebooks for 70B+ LLMs with 80% VRAM memory reduction.',
    enabled: true,
    meta: { version: '3.5.0', usageCount: 4890, verifiedBy: 'Unsloth Master' }
  },
  {
    id: 'hybrid-vector-rag-builder',
    name: 'Hybrid Dense Vector & BM25 Graph RAG Pipeline',
    category: 'Data & AI Science',
    identityOwner: 'saraswati',
    githubRepo: 'chroma-core/chroma',
    description: 'Builds document chunkers, embeddings pipelines, reciprocal rank fusion (RRF), and sub-graph entity extractors.',
    enabled: true,
    meta: { version: '3.1.0', usageCount: 3820, verifiedBy: 'RAG Science' }
  },
  {
    id: 'kaggle-ml-comp-pipeline',
    name: 'Kaggle Grandmaster Tabular & Vision ML Pipeline',
    category: 'Data & AI Science',
    identityOwner: 'lakshmi',
    githubRepo: 'microsoft/LightGBM',
    description: 'Auto-engineers features, optimizes XGBoost/LightGBM ensembles, and cross-validates with Optuna hyperparameter tuning.',
    enabled: true,
    meta: { version: '2.6.0', usageCount: 2240, verifiedBy: 'Kaggle Grandmaster' }
  },
  {
    id: 'crawl4ai-web-scraper',
    name: 'Crawl4AI & Playwright Autonomous Web Spider',
    category: 'Data & AI Science',
    identityOwner: 'surya',
    githubRepo: 'unclecode/crawl4ai',
    description: 'Crawls dynamic JavaScript websites, bypasses Cloudflare bot protection, and extracts clean structured markdown.',
    enabled: true,
    meta: { version: '2.4.0', usageCount: 3100, verifiedBy: 'Web Intel' }
  },

  // ── 6. 3D & Graphics ──
  {
    id: 'threejs-webgl-shader-builder',
    name: 'Three.js, WebGL & GLSL Shader Interactive Studio',
    category: '3D & Graphics',
    identityOwner: 'krishna',
    githubRepo: 'mrdoob/three.js',
    description: 'Creates photorealistic 3D scenes, particle physics simulations, procedural geometries, and custom GLSL vertex shaders.',
    enabled: true,
    meta: { version: '3.2.0', usageCount: 2890, verifiedBy: '3D Metaverse' }
  },
  {
    id: 'spline-3d-interactive-builder',
    name: 'Spline & Canvas 2D Game Engine Creator',
    category: '3D & Graphics',
    identityOwner: 'krishna',
    githubRepo: 'pixijs/pixijs',
    description: 'Builds interactive canvas games, sprite animations, physics collisions, and responsive 3D web UI embeds.',
    enabled: true,
    meta: { version: '2.1.0', usageCount: 1760, verifiedBy: 'Game Dev' }
  },

  // ── 7. Formal Logic & Languages ──
  {
    id: 'lean4-math-prover-synth',
    name: 'Lean 4 Formal Interactive Theorem Prover',
    category: 'All Skills',
    identityOwner: 'brahma',
    githubRepo: 'leanprover/lean4',
    description: 'Writes mechanized proofs in dependent type theory, verifying algorithm correctness with zero hallucination.',
    enabled: true,
    meta: { version: '4.1.0', usageCount: 5120, verifiedBy: 'Brahma Pure Logic' }
  },
  {
    id: 'ast-babel-transpiler-synth',
    name: 'Abstract Syntax Tree (AST) Compiler & Transpiler',
    category: 'All Skills',
    identityOwner: 'shiva',
    githubRepo: 'babel/babel',
    description: 'Parses code into AST nodes, executes structural semantic refactoring, and emits idempotent idiomatic code.',
    enabled: true,
    meta: { version: '2.3.0', usageCount: 1540, verifiedBy: 'Shiva Transpiler' }
  }
];
