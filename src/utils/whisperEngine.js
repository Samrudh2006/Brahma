/**
 * BRAHMA OpenWhisper Neural Client Engine
 * High-Precision Speech-to-Text with Automatic Language Fallbacks
 * 
 * Flow:
 * 1. Record raw audio buffer using MediaRecorder (16kHz / Opus / WebM / WAV)
 * 2. Send audio blob to /api/whisper/transcribe (Groq Whisper-Large-v3-Turbo / OpenAI / HuggingFace)
 * 3. Graceful fallback to in-browser WebSpeech Continuous VAD if offline
 */

export async function transcribeAudioBlob(audioBlob, { language = 'te', prompt = '', userApiKey = null } = {}) {
  const formData = new FormData();
  formData.append('audio', audioBlob, 'voice_recording.webm');
  formData.append('language', language);
  if (prompt) formData.append('prompt', prompt);
  if (userApiKey) formData.append('userApiKey', userApiKey);

  try {
    const res = await fetch('/api/whisper/transcribe', {
      method: 'POST',
      body: formData
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      throw new Error(err.error || 'Transcription failed');
    }

    const data = await res.json();
    return data;
  } catch (err) {
    console.warn('[OpenWhisper Client Warning]:', err.message);
    return {
      success: false,
      error: err.message,
      fallbackToWebSpeech: true
    };
  }
}

export async function checkWhisperStatus() {
  try {
    const res = await fetch('/api/whisper/status');
    if (res.ok) {
      return await res.json();
    }
  } catch (_) {}
  return {
    engine: 'OpenWhisper Fallback',
    availableTiers: [{ name: 'WebSpeech VAD Native', active: true }]
  };
}
