/**
 * BRAHMA — 50+ Global Frontier AI Models Matrix
 * Sourced across all leading nations: USA, China, Europe, UAE, Japan, Open Sovereign Weights
 */

export const FRONTIER_MODELS_CATALOG = [
  // ─── UNITED STATES (OpenAI, Anthropic, Google DeepMind, Meta, Microsoft) ───
  { id: 'deepseek-r1', name: 'DeepSeek R1 (Open Reasoning)', provider: 'DeepSeek', nation: 'China 🇨🇳', context: '128k', speed: '98 T/s', tier: 'Reasoning Frontier', benchmark: 'MATH500: 97.3%' },
  { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet (Hybrid Thinking)', provider: 'Anthropic', nation: 'USA 🇺🇸', context: '200k', speed: '110 T/s', tier: 'Frontier Flagship', benchmark: 'SWE-bench: 70.3%' },
  { id: 'gemini-2-0-flash', name: 'Gemini 2.0 Flash (Real-Time)', provider: 'Google DeepMind', nation: 'USA 🇺🇸', context: '1000k', speed: '240 T/s', tier: 'Ultra Speed', benchmark: 'MMLU-Pro: 88.5%' },
  { id: 'gemini-2-0-pro', name: 'Gemini 2.0 Pro Experimental', provider: 'Google DeepMind', nation: 'USA 🇺🇸', context: '2000k', speed: '120 T/s', tier: 'Long Context', benchmark: 'NeedleInHaystack: 99.9%' },
  { id: 'o1-preview', name: 'OpenAI o1 (Tree-of-Thought)', provider: 'OpenAI', nation: 'USA 🇺🇸', context: '128k', speed: '65 T/s', tier: 'Deep Reasoning', benchmark: 'AIME 2024: 83.3%' },
  { id: 'o3-mini', name: 'OpenAI o3-mini (High-Speed Logic)', provider: 'OpenAI', nation: 'USA 🇺🇸', context: '128k', speed: '180 T/s', tier: 'High Speed Logic', benchmark: 'Codeforces: 2175' },
  { id: 'gpt-4o', name: 'OpenAI GPT-4o (Omni Multimodal)', provider: 'OpenAI', nation: 'USA 🇺🇸', context: '128k', speed: '140 T/s', tier: 'Flagship Omni', benchmark: 'HumanEval: 90.2%' },
  { id: 'gpt-4o-mini', name: 'OpenAI GPT-4o-mini', provider: 'OpenAI', nation: 'USA 🇺🇸', context: '128k', speed: '220 T/s', tier: 'Fast Utility', benchmark: 'GSM8K: 91.5%' },
  { id: 'llama-3-3-70b', name: 'Llama 3.3 70B Instruct', provider: 'Meta AI', nation: 'USA 🇺🇸', context: '128k', speed: '160 T/s', tier: 'Open SOTA', benchmark: 'MMLU: 88.6%' },
  { id: 'llama-3-1-405b', name: 'Llama 3.1 405B Sovereign', provider: 'Meta AI', nation: 'USA 🇺🇸', context: '128k', speed: '45 T/s', tier: 'Frontier Open', benchmark: 'Frontier SOTA' },
  { id: 'llama-3-2-vision', name: 'Llama 3.2 11B Vision', provider: 'Meta AI', nation: 'USA 🇺🇸', context: '128k', speed: '190 T/s', tier: 'Edge Vision', benchmark: 'DocVQA: 89.2%' },
  { id: 'llama-3-2-3b', name: 'Llama 3.2 3B On-Device', provider: 'Meta AI', nation: 'USA 🇺🇸', context: '128k', speed: '320 T/s', tier: 'Mobile Edge', benchmark: 'MMLU: 68.4%' },
  { id: 'phi-4', name: 'Microsoft Phi-4 (14B Synthetic)', provider: 'Microsoft Research', nation: 'USA 🇺🇸', context: '16k', speed: '230 T/s', tier: 'Math & Logic', benchmark: 'MATH: 80.4%' },
  { id: 'phi-3-5-moe', name: 'Microsoft Phi-3.5 MoE (42B)', provider: 'Microsoft Research', nation: 'USA 🇺🇸', context: '128k', speed: '190 T/s', tier: 'MoE Efficiency', benchmark: 'GSM8K: 88.2%' },
  { id: 'bitnet-b1-58', name: 'BitNet b1.58 Ternary (Add-Only)', provider: 'Microsoft Research', nation: 'USA 🇺🇸', context: '32k', speed: '520 T/s', tier: '1-Bit Silicon', benchmark: 'Zero-Mult GEMM' },
  { id: 'gemma-2-27b', name: 'Google Gemma 2 27B', provider: 'Google DeepMind', nation: 'USA 🇺🇸', context: '8k', speed: '160 T/s', tier: 'Efficient SOTA', benchmark: 'LMSYS: Top 10' },
  { id: 'gemma-2-9b', name: 'Google Gemma 2 9B', provider: 'Google DeepMind', nation: 'USA 🇺🇸', context: '8k', speed: '210 T/s', tier: 'Compact Leader', benchmark: 'MMLU: 71.3%' },
  { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic', nation: 'USA 🇺🇸', context: '200k', speed: '280 T/s', tier: 'Ultra Fast Agent', benchmark: 'SWE-bench: 40.6%' },
  { id: 'claude-3-opus', name: 'Claude 3 Opus (Dense Nuance)', provider: 'Anthropic', nation: 'USA 🇺🇸', context: '200k', speed: '75 T/s', tier: 'Philosophical', benchmark: 'GPQA: 50.4%' },
  { id: 'starcoder-2-15b', name: 'StarCoder 2 15B', provider: 'BigCode / HuggingFace', nation: 'USA 🇺🇸', context: '16k', speed: '180 T/s', tier: 'Systems C++', benchmark: 'HumanEval+: 76.8%' },

  // ─── CHINA (DeepSeek, Alibaba Qwen, Moonshot, Baichuan, 01.AI, Zhipu GLM) ───
  { id: 'deepseek-v3', name: 'DeepSeek V3 (671B MoE)', provider: 'DeepSeek', nation: 'China 🇨🇳', context: '128k', speed: '125 T/s', tier: 'Mega MoE', benchmark: 'MMLU-Pro: 89.1%' },
  { id: 'deepseek-coder-v2', name: 'DeepSeek Coder V2 (236B)', provider: 'DeepSeek', nation: 'China 🇨🇳', context: '128k', speed: '145 T/s', tier: 'Code Polyglot', benchmark: 'SWE-bench: 65.4%' },
  { id: 'qwen-2-5-coder-32b', name: 'Qwen 2.5 Coder 32B', provider: 'Alibaba Qwen', nation: 'China 🇨🇳', context: '128k', speed: '175 T/s', tier: 'Code Master SOTA', benchmark: 'EvalPlus: 84.1%' },
  { id: 'qwen-2-5-72b', name: 'Qwen 2.5 72B Instruct', provider: 'Alibaba Qwen', nation: 'China 🇨🇳', context: '128k', speed: '130 T/s', tier: 'General Knowledge', benchmark: 'Arena ELO: 1310' },
  { id: 'qwen-2-5-14b', name: 'Qwen 2.5 14B High-Speed', provider: 'Alibaba Qwen', nation: 'China 🇨🇳', context: '128k', speed: '240 T/s', tier: 'Midweight SOTA', benchmark: 'MMLU: 79.8%' },
  { id: 'qwen-2-5-math-72b', name: 'Qwen 2.5 Math 72B', provider: 'Alibaba Qwen', nation: 'China 🇨🇳', context: '32k', speed: '120 T/s', tier: 'Math Specialized', benchmark: 'MATH: 87.8%' },
  { id: 'glm-4-9b', name: 'GLM-4 9B Bi-Lingual', provider: 'Zhipu AI', nation: 'China 🇨🇳', context: '128k', speed: '220 T/s', tier: 'Bilingual Agent', benchmark: 'GSM8K: 85.5%' },
  { id: 'glm-4-plus', name: 'GLM-4 Plus Frontier', provider: 'Zhipu AI', nation: 'China 🇨🇳', context: '128k', speed: '110 T/s', tier: 'MoE Agent', benchmark: 'MMLU: 86.2%' },
  { id: 'kimi-moonshot-v1', name: 'Kimi Moonshot 200k', provider: 'Moonshot AI', nation: 'China 🇨🇳', context: '200k', speed: '115 T/s', tier: 'Long Document', benchmark: 'LongBench: 92.4%' },
  { id: 'yi-lightning', name: 'Yi Lightning (01.AI)', provider: '01.AI', nation: 'China 🇨🇳', context: '128k', speed: '210 T/s', tier: 'Sub-second MoE', benchmark: 'LMSYS Rank #6' },
  { id: 'baichuan-4', name: 'Baichuan 4 Enterprise', provider: 'Baichuan Inc', nation: 'China 🇨🇳', context: '64k', speed: '130 T/s', tier: 'Enterprise Knowledge', benchmark: 'C-Eval: 91.2%' },

  // ─── EUROPE & FRANCE (Mistral AI, Kyutai Moshi, Aleph Alpha) ───
  { id: 'mistral-large-2', name: 'Mistral Large 2 (123B)', provider: 'Mistral AI', nation: 'France 🇫🇷', context: '128k', speed: '110 T/s', tier: 'Multilingual Sovereign', benchmark: 'MMLU: 84.0%' },
  { id: 'codestral-latest', name: 'Codestral 22B (FIM / AST)', provider: 'Mistral AI', nation: 'France 🇫🇷', context: '256k', speed: '210 T/s', tier: 'Compiler & FIM', benchmark: 'FIM Accuracy: 91.6%' },
  { id: 'mistral-nemo-12b', name: 'Mistral NeMo 12B', provider: 'Mistral / NVIDIA', nation: 'France / USA 🇫🇷', context: '128k', speed: '230 T/s', tier: 'Compact Frontier', benchmark: 'MMLU: 74.2%' },
  { id: 'mistral-small-24b', name: 'Mistral Small 24B (2409)', provider: 'Mistral AI', nation: 'France 🇫🇷', context: '32k', speed: '185 T/s', tier: 'Efficient Reasoning', benchmark: 'MMLU: 81.0%' },
  { id: 'pixtral-12b', name: 'Pixtral 12B Vision', provider: 'Mistral AI', nation: 'France 🇫🇷', context: '128k', speed: '195 T/s', tier: 'Open Multimodal', benchmark: 'MMMU: 52.5%' },
  { id: 'kyutai-moshi', name: 'Kyutai Moshi Real-Time Audio', provider: 'Kyutai Lab', nation: 'France 🇫🇷', context: '16k', speed: 'Realtime Audio', tier: 'Full-Duplex Voice', benchmark: 'Latency: 160ms' },
  { id: 'luminous-supreme', name: 'Luminous Supreme (70B)', provider: 'Aleph Alpha', nation: 'Germany 🇩🇪', context: '32k', speed: '130 T/s', tier: 'Explainable AI', benchmark: 'EU Compliance' },

  // ─── MIDDLE EAST / UAE (Technology Innovation Institute - Falcon) ───
  { id: 'falcon-2-11b', name: 'Falcon 2 11B VLM', provider: 'TII UAE', nation: 'UAE 🇦🇪', context: '32k', speed: '190 T/s', tier: 'Vision Sovereign', benchmark: 'DocVQA: 84.1%' },
  { id: 'falcon-180b', name: 'Falcon 180B Dense', provider: 'TII UAE', nation: 'UAE 🇦🇪', context: '32k', speed: '55 T/s', tier: 'Sovereign Giant', benchmark: 'MMLU: 80.2%' },
  { id: 'jais-30b', name: 'Jais 30B Bilingual Arabic/EN', provider: 'Inception / G42', nation: 'UAE 🇦🇪', context: '32k', speed: '160 T/s', tier: 'MENA Flagship', benchmark: 'Arabic Bench: 94.2%' },

  // ─── ASIA-PACIFIC: JAPAN & SOUTH KOREA (Sakura, Fugaku, Naver HyperCLOVA) ───
  { id: 'fugaku-llm-13b', name: 'Fugaku-LLM 13B (HPC Supercomputer)', provider: 'RIKEN / Tokyo Tech', nation: 'Japan 🇯🇵', context: '32k', speed: '210 T/s', tier: 'Supercomputer AI', benchmark: 'Japanese MMLU: 82.3%' },
  { id: 'swallow-70b', name: 'Swallow 70B Japanese Leader', provider: 'Tokyo Tech', nation: 'Japan 🇯🇵', context: '128k', speed: '140 T/s', tier: 'Nihongo SOTA', benchmark: 'J-MMLU: 86.4%' },
  { id: 'hyperclova-x', name: 'HyperCLOVA X Frontier', provider: 'Naver', nation: 'South Korea 🇰🇷', context: '64k', speed: '125 T/s', tier: 'Korean SOTA', benchmark: 'KLUE: 91.5%' },
  { id: 'solar-pro-22b', name: 'Solar Pro 22B (DUS Upstage)', provider: 'Upstage AI', nation: 'South Korea 🇰🇷', context: '64k', speed: '220 T/s', tier: 'Depth-UpScaled', benchmark: 'MMLU: 82.1%' },

  // ─── UNITED KINGDOM & CANADA (DeepMind London, Cohere Command, Reka) ───
  { id: 'cohere-command-r-plus', name: 'Command R+ (104B Enterprise)', provider: 'Cohere', nation: 'Canada 🇨🇦', context: '128k', speed: '140 T/s', tier: 'RAG Champion', benchmark: 'RAG Multi-Hop: 92.1%' },
  { id: 'cohere-command-r', name: 'Command R (35B Agentic)', provider: 'Cohere', nation: 'Canada 🇨🇦', context: '128k', speed: '210 T/s', tier: 'Tool & Search', benchmark: 'Tool Use: 88.5%' },
  { id: 'reka-core', name: 'Reka Core Frontier Multimodal', provider: 'Reka AI', nation: 'UK / USA 🇬🇧', context: '128k', speed: '130 T/s', tier: 'Video/Audio/Text', benchmark: 'MMMU: 56.3%' },
  { id: 'reka-flash', name: 'Reka Flash 21B', provider: 'Reka AI', nation: 'UK / USA 🇬🇧', context: '128k', speed: '220 T/s', tier: 'Ultra Fast Multimodal', benchmark: 'Video-QA: 81.2%' },

  // ─── UNSLOTH 5X ACCELERATED & UNCENSORED / ABLITERATED SOVEREIGN MODELS ───
  { id: 'unsloth-deepseek-r1-fast', name: 'Unsloth DeepSeek-R1 (5x Fast Dynamic 4-Bit)', provider: 'Unsloth AI / DeepSeek', nation: 'USA / Open 🌐', context: '128k', speed: '420 T/s', tier: 'Unsloth 5x SOTA', benchmark: '80% VRAM Reduction' },
  { id: 'unsloth-llama-3-3-70b', name: 'Unsloth Llama 3.3 70B (Dynamic QLoRA)', provider: 'Unsloth AI / Meta', nation: 'USA / Open 🌐', context: '128k', speed: '380 T/s', tier: 'Unsloth 5x SOTA', benchmark: '5x Faster Fine-Tuning' },
  { id: 'unsloth-qwen-2-5-coder-32b', name: 'Unsloth Qwen 2.5 Coder 32B (Zero-Overhead)', provider: 'Unsloth AI / Qwen', nation: 'Open 🌐', context: '128k', speed: '410 T/s', tier: 'Unsloth Code', benchmark: 'Native Triton Kernels' },
  { id: 'dolphin-3-0-llama-uncensored', name: 'Dolphin 3.0 Llama 3.3 (Uncensored / Zero-Refusal)', provider: 'Cognitive Computations', nation: 'USA / Open 🌐', context: '128k', speed: '175 T/s', tier: 'Uncensored Sovereign', benchmark: 'Zero Refusal Rate' },
  { id: 'deepseek-r1-abliterated', name: 'DeepSeek R1 Abliterated (Refusal Vector Purged)', provider: 'Sovereign Open AI', nation: 'Global 🌐', context: '128k', speed: '110 T/s', tier: 'Uncensored Deep Reasoning', benchmark: 'Orthogonal Projection' },
  { id: 'nous-hermes-3-405b-uncensored', name: 'Nous Hermes 3 405B (Agentic & Unfiltered)', provider: 'Nous Research', nation: 'USA / Open 🌐', context: '128k', speed: '50 T/s', tier: 'Uncensored Mega Frontier', benchmark: 'JSON Structured Agent' },
  { id: 'wizardlm-2-8x22b-uncensored', name: 'WizardLM-2 8x22B (Unfiltered Complex Reasoning)', provider: 'Microsoft / Open Community', nation: 'USA / Open 🌐', context: '64k', speed: '160 T/s', tier: 'Uncensored MoE', benchmark: 'Arena ELO: 1290' },
  { id: 'mistral-large-2-abliterated', name: 'Mistral Large 2 Abliterated (Uncensored EU Sovereign)', provider: 'European Community', nation: 'France / EU 🇪🇺', context: '128k', speed: '115 T/s', tier: 'Uncensored Multilingual', benchmark: 'Zero Corporate Guardrails' }
];
