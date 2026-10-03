/**
 * BRAHMA OpenWhisper Neural Speech-to-Text Engine
 * High-Speed, Zero-Cost Alternative to WhisperFlow / Proprietary STT
 * 
 * Supports:
 * - Groq Whisper-Large-v3-Turbo (Ultra-Low Latency ~120ms)
 * - OpenAI Whisper API
 * - HuggingFace Inference Whisper-Large-v3
 * - Local Whisper / FastWhisper / Ollama Endpoints
 * - Indic & Multi-language Automatic Accents (Telugu, Hindi, Tamil, Kannada, Sanskrit, English)
 */
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

class WhisperService {
  constructor() {
    this.groqApiKey = process.env.GROQ_API_KEY || '';
    this.openAiKey = process.env.OPENAI_API_KEY || '';
    this.hfToken = process.env.HF_API_TOKEN || '';
    this.localWhisperUrl = process.env.LOCAL_WHISPER_URL || 'http://localhost:8000/v1/audio/transcriptions';
  }

  /**
   * Transcribe audio buffer or file
   * @param {Buffer|Blob|string} audioData - Buffer or base64 audio data
   * @param {Object} options - { language, prompt, temperature, model, userApiKey }
   */
  async transcribe(audioBuffer, options = {}) {
    const {
      language = 'te', // Default to Telugu or 'auto'
      prompt = 'తెలుగు మరియు ఆంగ్ల సంభాషణ (Telugu and English conversation)',
      temperature = 0.0,
      userApiKey = null,
      mimeType = 'audio/webm'
    } = options;

    const startTime = Date.now();
    const effectiveGroqKey = (userApiKey && userApiKey.startsWith('gsk_')) ? userApiKey : this.groqApiKey;
    const effectiveOpenAiKey = (userApiKey && userApiKey.startsWith('sk-') && !userApiKey.startsWith('sk-or-')) ? userApiKey : this.openAiKey;

    // ── Tier 1: Groq Whisper-Large-v3-Turbo (Instant ~120ms) ────────────────
    if (effectiveGroqKey) {
      try {
        const result = await this.transcribeWithGroq(audioBuffer, {
          language,
          prompt,
          temperature,
          apiKey: effectiveGroqKey,
          mimeType
        });
        return {
          success: true,
          provider: 'Groq Whisper-Large-v3-Turbo',
          text: result.text,
          language: result.language || language,
          duration: result.duration,
          latencyMs: Date.now() - startTime
        };
      } catch (err) {
        console.warn('[OpenWhisper] Groq tier error, cascading:', err.message);
      }
    }

    // ── Tier 2: OpenAI Whisper API ───────────────────────────────────────────
    if (effectiveOpenAiKey) {
      try {
        const result = await this.transcribeWithOpenAI(audioBuffer, {
          language,
          prompt,
          temperature,
          apiKey: effectiveOpenAiKey,
          mimeType
        });
        return {
          success: true,
          provider: 'OpenAI Whisper-1',
          text: result.text,
          latencyMs: Date.now() - startTime
        };
      } catch (err) {
        console.warn('[OpenWhisper] OpenAI tier error, cascading:', err.message);
      }
    }

    // ── Tier 3: HuggingFace Inference API (Free Open-Source Whisper-v3) ───────
    if (this.hfToken) {
      try {
        const result = await this.transcribeWithHuggingFace(audioBuffer, { mimeType });
        return {
          success: true,
          provider: 'HuggingFace Whisper-Large-v3',
          text: result.text,
          latencyMs: Date.now() - startTime
        };
      } catch (err) {
        console.warn('[OpenWhisper] HuggingFace tier error, cascading:', err.message);
      }
    }

    // ── Tier 4: Local Whisper Engine (Ollama / FastWhisper) ───────────────────
    try {
      const result = await this.transcribeWithLocal(audioBuffer, { language, mimeType });
      return {
        success: true,
        provider: 'Local OpenWhisper Server',
        text: result.text,
        latencyMs: Date.now() - startTime
      };
    } catch (_) {
      // Local server offline
    }

    return {
      success: false,
      error: 'No active Whisper provider found. Provide a free Groq API key (gsk_...) or HF token in backend/.env for server-side Whisper transcription.',
      fallbackToWebSpeech: true
    };
  }

  /**
   * Groq Whisper-Large-v3 API
   */
  async transcribeWithGroq(audioBuffer, { language, prompt, temperature, apiKey, mimeType }) {
    const ext = mimeType.includes('wav') ? 'wav' : (mimeType.includes('mp4') ? 'm4a' : 'webm');
    const form = new FormData();
    form.append('file', audioBuffer, { filename: `audio.${ext}`, contentType: mimeType });
    form.append('model', 'whisper-large-v3-turbo');
    if (language && language !== 'auto') {
      form.append('language', language.split('-')[0]); // 'te-IN' -> 'te'
    }
    if (prompt) form.append('prompt', prompt);
    form.append('temperature', temperature.toString());
    form.append('response_format', 'json');

    const res = await axios.post('https://api.groq.com/openai/v1/audio/transcriptions', form, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...form.getHeaders()
      },
      timeout: 15000
    });

    return res.data;
  }

  /**
   * OpenAI Whisper API
   */
  async transcribeWithOpenAI(audioBuffer, { language, prompt, temperature, apiKey, mimeType }) {
    const ext = mimeType.includes('wav') ? 'wav' : 'webm';
    const form = new FormData();
    form.append('file', audioBuffer, { filename: `audio.${ext}`, contentType: mimeType });
    form.append('model', 'whisper-1');
    if (language && language !== 'auto') {
      form.append('language', language.split('-')[0]);
    }
    if (prompt) form.append('prompt', prompt);

    const res = await axios.post('https://api.openai.com/v1/audio/transcriptions', form, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        ...form.getHeaders()
      },
      timeout: 15000
    });

    return res.data;
  }

  /**
   * Hugging Face Inference Whisper-Large-v3
   */
  async transcribeWithHuggingFace(audioBuffer, { mimeType }) {
    const res = await axios.post(
      'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
      audioBuffer,
      {
        headers: {
          Authorization: `Bearer ${this.hfToken}`,
          'Content-Type': mimeType
        },
        timeout: 20000
      }
    );

    return res.data;
  }

  /**
   * Local Whisper Server
   */
  async transcribeWithLocal(audioBuffer, { language, mimeType }) {
    const ext = mimeType.includes('wav') ? 'wav' : 'webm';
    const form = new FormData();
    form.append('file', audioBuffer, { filename: `audio.${ext}`, contentType: mimeType });
    if (language && language !== 'auto') {
      form.append('language', language.split('-')[0]);
    }

    const res = await axios.post(this.localWhisperUrl, form, {
      headers: form.getHeaders(),
      timeout: 10000
    });

    return res.data;
  }
}

module.exports = new WhisperService();
