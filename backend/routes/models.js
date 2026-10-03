const router = require('express').Router();
const axios = require('axios');

const OLLAMA_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

// 20+ Frontier AI Models Directory
const FRONTIER_MODELS_CATALOG = [
  // Tier 1: Reasoning & Mathematics (DeepSeek, OpenAI, Anthropic, Google)
  { id: 'deepseek-r1', name: 'DeepSeek R1 (Open Reasoning)', provider: 'DeepSeek', context: '128k', speed: '98 T/s', tier: 'Reasoning Frontier' },
  { id: 'claude-3-7-sonnet', name: 'Claude 3.7 Sonnet (Hybrid Thinking)', provider: 'Anthropic', context: '200k', speed: '110 T/s', tier: 'Frontier Flagship' },
  { id: 'gemini-2-0-flash', name: 'Gemini 2.0 Flash (Real-Time Multimodal)', provider: 'Google DeepMind', context: '1000k', speed: '240 T/s', tier: 'Ultra Speed' },
  { id: 'gemini-2-0-pro', name: 'Gemini 2.0 Pro Experimental', provider: 'Google DeepMind', context: '2000k', speed: '120 T/s', tier: 'Long Context' },
  { id: 'o1-preview', name: 'OpenAI o1 (Inference Search)', provider: 'OpenAI', context: '128k', speed: '65 T/s', tier: 'Reasoning' },
  { id: 'o3-mini', name: 'OpenAI o3-mini (High-Speed Logic)', provider: 'OpenAI', context: '128k', speed: '180 T/s', tier: 'High Speed' },
  { id: 'gpt-4o', name: 'OpenAI GPT-4o (Omni Multimodal)', provider: 'OpenAI', context: '128k', speed: '140 T/s', tier: 'Flagship' },
  { id: 'gpt-4o-mini', name: 'OpenAI GPT-4o-mini', provider: 'OpenAI', context: '128k', speed: '220 T/s', tier: 'Fast Utility' },
  
  // Tier 2: Open Source Titans (Meta, Qwen, Mistral, Microsoft)
  { id: 'llama-3-3-70b', name: 'Llama 3.3 70B Instruct', provider: 'Meta AI', context: '128k', speed: '160 T/s', tier: 'Open SOTA' },
  { id: 'llama-3-1-405b', name: 'Llama 3.1 405B Sovereign', provider: 'Meta AI', context: '128k', speed: '45 T/s', tier: 'Frontier Open' },
  { id: 'llama-3-2-vision', name: 'Llama 3.2 11B Vision', provider: 'Meta AI', context: '128k', speed: '190 T/s', tier: 'Edge Vision' },
  { id: 'qwen-2-5-coder-32b', name: 'Qwen 2.5 Coder 32B (SOTA Coding)', provider: 'Alibaba Qwen', context: '128k', speed: '175 T/s', tier: 'Code Master' },
  { id: 'qwen-2-5-72b', name: 'Qwen 2.5 72B Instruct', provider: 'Alibaba Qwen', context: '128k', speed: '130 T/s', tier: 'General Knowledge' },
  { id: 'mistral-large-2', name: 'Mistral Large 2 (123B)', provider: 'Mistral AI', context: '128k', speed: '110 T/s', tier: 'Multilingual' },
  { id: 'codestral-latest', name: 'Codestral 22B (FIM / Compilers)', provider: 'Mistral AI', context: '256k', speed: '210 T/s', tier: 'Compiler & AST' },
  { id: 'phi-4', name: 'Microsoft Phi-4 (14B Synthetic)', provider: 'Microsoft Research', context: '16k', speed: '230 T/s', tier: 'Math & Logic' },
  { id: 'bitnet-b1-58', name: 'BitNet b1.58 Ternary (Add-Only)', provider: 'Microsoft Research', context: '32k', speed: '520 T/s', tier: '1-Bit Silicon' },
  { id: 'gemma-2-27b', name: 'Google Gemma 2 27B', provider: 'Google DeepMind', context: '8k', speed: '160 T/s', tier: 'Efficient SOTA' },
  { id: 'starcoder-2-15b', name: 'StarCoder 2 15B (Systems Code)', provider: 'BigCode', context: '16k', speed: '180 T/s', tier: 'Low-Level C++' },
  { id: 'deepseek-v3', name: 'DeepSeek V3 (671B MoE)', provider: 'DeepSeek', context: '128k', speed: '125 T/s', tier: 'Mega MoE' },
];

// GET /api/models — returns all available local and cloud models
router.get('/', async (req, res) => {
  let localModels = [];
  try {
    const r = await axios.get(`${OLLAMA_URL}/api/tags`, { timeout: 3000 });
    localModels = (r.data.models || []).map(m => ({
      id: m.name,
      name: m.name,
      source: 'local',
      size: m.size,
      provider: 'Ollama Local'
    }));
  } catch (_) {}

  res.json({
    totalCount: FRONTIER_MODELS_CATALOG.length + localModels.length,
    local: localModels,
    catalog: FRONTIER_MODELS_CATALOG,
  });
});

module.exports = router;
