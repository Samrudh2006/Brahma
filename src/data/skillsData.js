/**
 * BRAHMA 30+ Specialized Open-Source & GitHub Developer Skills Catalog
 * Sourced from open-source engineering paradigms, GitHub repos, and scientific workflows.
 */

export const SKILL_CATEGORIES = [
  'All Skills',
  'Enterprise Integrations & OSINT (Nango, Flowsint, Agentic Inbox)',
  'Voice Cloning & Video Generation (VoxCPM & MoneyPrinterTurbo)',
  'Claude Code & Agent Skills (Addy Osmani)',
  'Quant & Algorithmic Trading (TradingAgents)',
  'Vercel AI & Agent Skills',
  'YC Founder & Growth Playbook',
  'Web & Mobile Apps',
  'Silicon & Hardware',
  'DevOps & Cloud',
  'Security & Auditing',
  'Data & AI Science',
  '3D & Graphics',
  'Smart Contracts'
];

export const INITIAL_SKILLS = [
  // ── 0.000 Enterprise Integrations & OSINT (Nango, Flowsint, Agentic Inbox) ──
  {
    id: 'nango-250-api-sync',
    name: 'NangoHQ 250+ Unified API & OAuth Synchronization Engine',
    category: 'Enterprise Integrations & OSINT (Nango, Flowsint, Agentic Inbox)',
    identityOwner: 'brahma',
    githubRepo: 'NangoHQ/nango',
    description: 'Unified integration gateway managing 250+ OAuth connectors, automated token refreshes, webhooks, and bidirectional syncing with GitHub, Notion, Slack, and Linear.',
    enabled: true,
    meta: { version: '0.62.0', usageCount: 11450, verifiedBy: 'Nango Core Lab' }
  },
  {
    id: 'flowsint-graph-osint',
    name: 'Flowsint Node-Based Cyber Threat & OSINT Knowledge Graph',
    category: 'Enterprise Integrations & OSINT (Nango, Flowsint, Agentic Inbox)',
    identityOwner: 'varuna',
    githubRepo: 'reconurge/flowsint',
    description: 'Synthesizes visual entity-relationship graphs for domain infrastructure, DNS routing, SSL certificates, IP reputations, and threat intelligence vectors.',
    enabled: true,
    meta: { version: '1.2.0', usageCount: 7890, verifiedBy: 'Varuna Recon Squad' }
  },
  {
    id: 'agentic-inbox-email-triage',
    name: 'Cloudflare Agentic Inbox Autonomous Email Classifier & Auto-Reply',
    category: 'Enterprise Integrations & OSINT (Nango, Flowsint, Agentic Inbox)',
    identityOwner: 'narada',
    githubRepo: 'cloudflare/agentic-inbox',
    description: 'Autonomous inbound email triage: priority categorization, security anomaly detection, one-sentence executive briefs, and 1-click contextual AI response drafts.',
    enabled: true,
    meta: { version: '1.0.0', usageCount: 8620, verifiedBy: 'Executive Dispatch' }
  },

  // ── 0.00 Voice Cloning & Video Generation (VoxCPM, HyperFrames, MoneyPrinterTurbo) ──
  {
    id: 'voxcpm-deity-voice-cloning',
    name: 'OpenBMB VoxCPM Neural Voice Cloning & 13 Deity Prosody Engine',
    category: 'Voice Cloning & Video Generation (VoxCPM & MoneyPrinterTurbo)',
    identityOwner: 'saraswati',
    githubRepo: 'OpenBMB/VoxCPM',
    description: 'Implements zero-shot voice cloning and conversational speech synthesis with native Telugu, Sanskrit, and English phonetic pitch alignment.',
    enabled: true,
    meta: { version: '1.5.0', usageCount: 6810, verifiedBy: 'VoxCPM Audio Lab' }
  },
  {
    id: 'moneyprinter-turbo-shorts-creator',
    name: 'MoneyPrinterTurbo AI 1-Click Short Video & Reels Pipeline',
    category: 'Voice Cloning & Video Generation (VoxCPM & MoneyPrinterTurbo)',
    identityOwner: 'krishna',
    githubRepo: 'harry0703/MoneyPrinterTurbo',
    description: 'End-to-end autonomous video creation: Scriptwriting -> VoxCPM Voiceover -> Karaoke Subtitles -> Video Scene Assembly for YouTube Shorts/TikTok.',
    enabled: true,
    meta: { version: '2.0.0', usageCount: 9240, verifiedBy: 'Viral Media Lab' }
  },
  {
    id: 'hyperframes-code-video-renderer',
    name: 'HeyGen HyperFrames Code-Driven Remotion Frame Renderer',
    category: 'Voice Cloning & Video Generation (VoxCPM & MoneyPrinterTurbo)',
    identityOwner: 'krishna',
    githubRepo: 'heygen-com/hyperframes',
    description: 'Programmatically renders WebGL/Canvas video frames, dynamic motion graphics, and presentation explainers at 60 FPS using pure code.',
    enabled: true,
    meta: { version: '1.1.0', usageCount: 4780, verifiedBy: 'Remotion Engine' }
  },

  // ── 0.0 Claude Code & Agent Skills (Addy Osmani) ──
  {
    id: 'addy-web-vitals-profiler',
    name: 'Addy Osmani Core Web Vitals & INP Performance Profiler',
    category: 'Claude Code & Agent Skills (Addy Osmani)',
    identityOwner: 'shiva',
    githubRepo: 'addyosmani/agent-skills',
    description: 'Profiles Interaction to Next Paint (INP), Largest Contentful Paint (LCP), and Cumulative Layout Shift with Chrome DevTools trace AST metrics.',
    enabled: true,
    meta: { version: '1.2.0', usageCount: 4210, verifiedBy: 'Chrome Engineering' }
  },
  {
    id: 'addy-memory-leak-hunter',
    name: 'Addy Osmani V8 Heap & Detached DOM Memory Leak Hunter',
    category: 'Claude Code & Agent Skills (Addy Osmani)',
    identityOwner: 'shiva',
    githubRepo: 'addyosmani/agent-skills',
    description: 'Automates heap snapshot differential analysis, identifies detached DOM subtrees, closure retainers, and garbage collection thrashing.',
    enabled: true,
    meta: { version: '1.1.0', usageCount: 3890, verifiedBy: 'V8 Performance' }
  },
  {
    id: 'addy-pr-code-reviewer',
    name: 'Addy Osmani High-Rigor Architecture & PR Reviewer',
    category: 'Claude Code & Agent Skills (Addy Osmani)',
    identityOwner: 'brahma',
    githubRepo: 'addyosmani/agent-skills',
    description: 'Executes automated enterprise-grade PR reviews inspecting idempotence, boundary invariants, API backwards compatibility, and DRY purity.',
    enabled: true,
    meta: { version: '2.0.0', usageCount: 7120, verifiedBy: 'Staff Eng Review' }
  },
  {
    id: 'addy-bundle-treeshaker',
    name: 'Addy Osmani Rollup/Vite Bundle Tree-Shaking Optimizer',
    category: 'Claude Code & Agent Skills (Addy Osmani)',
    identityOwner: 'saraswati',
    githubRepo: 'addyosmani/agent-skills',
    description: 'Deconstructs JavaScript bundle ASTs, isolates circular re-exports, enforces dynamic import code-splitting, and trims dead weight.',
    enabled: true,
    meta: { version: '1.4.0', usageCount: 3450, verifiedBy: 'Vite Ecosystem' }
  },

  // ── 0.0.1 Quantitative & Algorithmic Trading (TradingAgents & Fincept) ──
  {
    id: 'tradingagents-hedge-fund-debate',
    name: 'TradingAgents Multi-Agent Quantitative Swarm Consensus',
    category: 'Quant & Algorithmic Trading (TradingAgents)',
    identityOwner: 'kuvera',
    githubRepo: 'TauricResearch/TradingAgents',
    description: 'Simulates a 4-agent hedge fund debate (Fundamental vs Technical vs Risk Gatekeeper vs Portfolio Manager) to derive high-conviction alpha signals.',
    enabled: true,
    meta: { version: '1.0.0', usageCount: 8430, verifiedBy: 'Kuvera Sovereign Quant' }
  },
  {
    id: 'fincept-terminal-telemetry',
    name: 'Fincept Terminal Wall Street Feeds & SEC Edgar Dissector',
    category: 'Quant & Algorithmic Trading (TradingAgents)',
    identityOwner: 'kuvera',
    githubRepo: 'Fincept-Corporation/FinceptTerminal',
    description: 'Pulls real-time equity & crypto telemetry, calculates 14-day RSI, MACD histograms, Golden Crosses, and extracts 10-K financial disclosures.',
    enabled: true,
    meta: { version: '2.1.0', usageCount: 6540, verifiedBy: 'Wall Street Terminal' }
  },
  {
    id: 'kuvera-var-risk-shield',
    name: 'Kuvera Capital Value-at-Risk (95% VaR) & Drawdown Shield',
    category: 'Quant & Algorithmic Trading (TradingAgents)',
    identityOwner: 'kuvera',
    githubRepo: 'TauricResearch/TradingAgents',
    description: 'Enforces mathematical portfolio risk constraints, bounded drawdown limits, stop-loss ratios, and automated dynamic position sizing.',
    enabled: true,
    meta: { version: '1.2.0', usageCount: 5210, verifiedBy: 'Kuvera Capital' }
  },

  // ── 0. Vercel AI & Agent Skills (Vercel Labs & AI SDK) ──
  {
    id: 'vercel-skills-standard',
    name: 'Vercel Labs Agent Skills & Action Schema Standard',
    category: 'Vercel AI & Agent Skills',
    identityOwner: 'saraswati',
    githubRepo: 'vercel-labs/skills',
    description: 'Implements portable AI agent skill definitions with deterministic tool schemas, parameter validation, and workflow orchestration.',
    enabled: true,
    meta: { version: '2.4.0', usageCount: 6820, verifiedBy: 'Vercel AI Standard' }
  },
  {
    id: 'vercel-ai-sdk-core',
    name: 'Vercel AI SDK 4.0 Streaming & Multi-Modal Tool Engine',
    category: 'Vercel AI & Agent Skills',
    identityOwner: 'saraswati',
    githubRepo: 'vercel/ai',
    description: 'Enables streamText, generateObject, real-time multi-step tool calls, and unified provider abstraction across OpenAI, Anthropic, and Groq.',
    enabled: true,
    meta: { version: '4.1.2', usageCount: 8940, verifiedBy: 'AI SDK Council' }
  },
  {
    id: 'vercel-v0-generative-ui',
    name: 'Vercel v0 Streamable Generative UI Synthesizer',
    category: 'Vercel AI & Agent Skills',
    identityOwner: 'krishna',
    githubRepo: 'vercel-labs/v0',
    description: 'Renders dynamic interactive React UI components on-the-fly directly inside the conversation stream with Tailwind & Framer Motion.',
    enabled: true,
    meta: { version: '3.0.0', usageCount: 5410, verifiedBy: 'Generative UI Team' }
  },

  // ── 0.1 Y Combinator Founder & Growth Playbook (YC CEO / Leadership) ──
  {
    id: 'yc-pmf-growth-engine',
    name: 'YC Product-Market Fit & 7% Weekly Growth Engine',
    category: 'YC Founder & Growth Playbook',
    identityOwner: 'brahma',
    githubRepo: 'ycombinator/founder-playbook',
    description: 'Garry Tan & Sam Altman YC framework: User interview distillation, retention curve cohort analysis, and viral k-factor growth loops.',
    enabled: true,
    meta: { version: '5.0.0', usageCount: 9230, verifiedBy: 'Y Combinator Partner Logic' }
  },
  {
    id: 'yc-saas-legal-trap-defense',
    name: 'SaaS Legal Pitfall & Compliance Shield ($100k+ Fine Defense)',
    category: 'YC Founder & Growth Playbook',
    identityOwner: 'durga',
    githubRepo: 'ycombinator/legal-compliance',
    description: 'Guards against COPPA ($53k/user), Munich Google Fonts IP leak (€100), California session replay wiretapping ($5k/session), CAN-SPAM email footers, ROSCA auto-renewals, and $6 DMCA Designated Agent.',
    enabled: true,
    meta: { version: '4.2.0', usageCount: 7120, verifiedBy: 'YC Startup Legal Defense' }
  },
  {
    id: 'yc-founder-sales-unit-economics',
    name: 'YC Founder-Led Sales & LTV/CAC Unit Economics Matrix',
    category: 'YC Founder & Growth Playbook',
    identityOwner: 'kuvera',
    githubRepo: 'ycombinator/b2b-sales-playbook',
    description: 'Calculates payback periods, net revenue retention (NRR), founder outbound discovery scripts, and enterprise pilot-to-contract closure.',
    enabled: true,
    meta: { version: '3.8.0', usageCount: 4670, verifiedBy: 'YC Growth Economics' }
  },
  {
    id: 'system-prompt-memory-architect',
    name: 'Cognitive System Prompt & 46-Tool Memory Architecture',
    category: 'YC Founder & Growth Playbook',
    identityOwner: 'shiva',
    githubRepo: 'anthropics/anthropic-cookbook',
    description: 'Designs tamper-proof hierarchical system prompts, persistent memory indexing, tool-boundary gating, and anti-jailbreak instruction manuals.',
    enabled: true,
    meta: { version: '4.8.0', usageCount: 8190, verifiedBy: 'Frontier AI Prompt Architects' }
  },

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
