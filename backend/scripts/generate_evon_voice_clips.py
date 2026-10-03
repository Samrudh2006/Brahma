import asyncio
import os
import sys
import edge_tts

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

OUTPUT_DIRS = [
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "voice_outputs")),
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "public", "voice_outputs")),
]

for d in OUTPUT_DIRS:
    os.makedirs(d, exist_ok=True)

# 100% FEMALE Indic Neural Voices — Tuned for highest conversational fidelity (Gnani-grade Telephony & Assistant)
FEMALE_CLIPS = [
    {
        "filename": "evon_telugu_shruti_female.mp3",
        "voice": "te-IN-ShrutiNeural",
        "language": "Telugu (తెలుగు)",
        "role": "Saraswati AI Assistant (Female)",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "నమస్కారం! నేను జ్ఞాని ఈవాన్ v3.3 ని. బ్రహ్మ వ్యవస్థలో తెలుగు భాషలో మీకు అత్యంత వేగంగా, స్పష్టంగా మరియు సహజంగా సమాధానాలు ఇవ్వడానికి నేను సిద్ధంగా ఉన్నాను. చెప్పండి, నేను మీకు ఎలా సహాయపడగలను?"
    },
    {
        "filename": "evon_telugu_casual_shruti.mp3",
        "voice": "te-IN-ShrutiNeural",
        "language": "Telugu Conversational (తెలుగు - క్యాజువల్ స్టైల్)",
        "role": "Gnani Indic Voice Concierge (Female)",
        "rate": "+2%",
        "pitch": "+1Hz",
        "text": "హలో మవా! బ్రహ్మ సిస్టమ్ లో ఇండిక్ లాంగ్వేజ్ మోడల్ అద్భుతంగా పనిచేస్తోంది. ఎలాంటి సందేహమైనా సరే, చాలా తేలికగా, మన తెలుగు భాషలోనే క్షణాల్లో పరిష్కరిస్తాను!"
    },
    {
        "filename": "evon_hindi_swara_female.mp3",
        "voice": "hi-IN-SwaraNeural",
        "language": "Hindi (हिंदी)",
        "role": "Swara Sovereign Agent (Female)",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "नमस्ते! मैं ज्ञानी इवोन v3.3 हूँ। भारत की अपनी संप्रभु AI प्रणाली में आपका हार्दिक स्वागत है। हिंदी भाषा में आपकी हर समस्या का त्वरित और सटीक समाधान मेरे पास उपलब्ध है।"
    },
    {
        "filename": "evon_tamil_pallavi_female.mp3",
        "voice": "ta-IN-PallaviNeural",
        "language": "Tamil (தமிழ்)",
        "role": "Pallavi Voice Agent (Female)",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "வணக்கம்! நான் ஞானி ஈவான் v3.3. பிரம்மா செயற்கை நுண்ணறிவு மேட்ரிக்ஸில் தமிழ் மொழியில் உங்களுக்கு மிகச் சிறந்த, விரைவான மற்றும் தெளிவான பதில்களை வழங்க நான் எப்போதும் தயார்."
    },
    {
        "filename": "evon_kannada_sapna_female.mp3",
        "voice": "kn-IN-SapnaNeural",
        "language": "Kannada (ಕನ್ನಡ)",
        "role": "Sapna Voice Agent (Female)",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "ನಮಸ್ಕಾರ! ನಾನು ಜ್ಞಾನಿ ಈವೋನ್ v3.3. ಬ್ರಹ್ಮ ತಂತ್ರಜ್ಞಾನ ವ್ಯವಸ್ಥೆಯಲ್ಲಿ ಕನ್ನಡ ಭಾಷೆಯ ಎಲ್ಲಾ ಪ್ರಶ್ನೆಗಳಿಗೆ ಅತ್ಯಂತ ವೇಗವಾಗಿ ಮತ್ತು ನಿಖರವಾಗಿ ಉತ್ತರಿಸಲು ನಾನು ಸಂತೋಷಪಡುತ್ತೇನೆ."
    },
    {
        "filename": "evon_marathi_aarohi_female.mp3",
        "voice": "mr-IN-AarohiNeural",
        "language": "Marathi (मराठी)",
        "role": "Aarohi Voice Agent (Female)",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "नमस्कार! मी ज्ञानी इव्हॉन v3.3 आहे. ब्रह्मा सार्वभौम AI प्लॅटफॉर्मवर मराठी भाषेत आपल्याला सर्वोत्तम आणि अचूक मार्गदर्शन करण्यास मी तत्पर आहे."
    },
    {
        "filename": "evon_bengali_tanishaa_female.mp3",
        "voice": "bn-IN-TanishaaNeural",
        "language": "Bengali (বাংলা)",
        "role": "Tanishaa Voice Agent (Female)",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "নমস্কার! আমি জ্ঞানী ইভন v3.3। ব্রহ্মা এআই সিস্টেমে বাংলা ভাষায় আপনার সমস্ত প্রশ্নের দ্রুত ও নির্ভরযোগ্য উত্তর দিতে আমি প্রস্তুত।"
    },
    {
        "filename": "evon_english_neerja_female.mp3",
        "voice": "en-IN-NeerjaExpressiveNeural",
        "language": "Indian English (Expressive)",
        "role": "Neerja Expressive Telephony (Female)",
        "rate": "+0%",
        "pitch": "+0Hz",
        "text": "Hello! Welcome to the BRAHMA Sovereign Frontier AI Matrix, powered by the Gnani Evon 30-billion Mixture-of-Experts engine. How may I assist your enterprise today?"
    }
]

async def generate_female_clips():
    print(f"Synthesizing {len(FEMALE_CLIPS)} High-Fidelity FEMALE Indic Voice Clips...")
    
    for clip in FEMALE_CLIPS:
        print(f"-> Generating Female Voice: {clip['language']} ({clip['voice']}) -> {clip['filename']}")
        communicate = edge_tts.Communicate(
            clip["text"], 
            clip["voice"], 
            rate=clip.get("rate", "+0%"), 
            pitch=clip.get("pitch", "+0Hz")
        )
        
        # Save to backend
        backend_path = os.path.join(OUTPUT_DIRS[0], clip["filename"])
        await communicate.save(backend_path)
        
        # Copy to public folder
        public_path = os.path.join(OUTPUT_DIRS[1], clip["filename"])
        with open(backend_path, "rb") as src, open(public_path, "wb") as dst:
            dst.write(src.read())

    print("\nCreating Sleek All-Female Interactive Audio Showcase...")
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BRAHMA & Gnani Evon — Best Indic Female Neural Voices</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: radial-gradient(circle at 50% 0%, #1e1b4b 0%, #090d16 60%, #030712 100%);
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      padding: 40px 20px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .container {
      width: 100%;
      max-width: 860px;
    }
    header {
      text-align: center;
      margin-bottom: 36px;
      padding-bottom: 24px;
      border-bottom: 1px solid rgba(251, 191, 36, 0.2);
    }
    .badge-bar {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-bottom: 14px;
      flex-wrap: wrap;
    }
    .badge {
      background: rgba(244, 63, 94, 0.15);
      color: #fb7185;
      border: 1px solid rgba(244, 63, 94, 0.4);
      padding: 5px 12px;
      border-radius: 9999px;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      display: inline-flex;
      align-items: center;
      gap: 5px;
    }
    .badge-gold {
      background: rgba(251, 191, 36, 0.15);
      color: #fbbf24;
      border-color: rgba(251, 191, 36, 0.4);
    }
    h1 {
      font-size: 2.2rem;
      font-weight: 800;
      background: linear-gradient(135deg, #fef08a 0%, #f59e0b 50%, #f43f5e 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 8px;
    }
    .subtitle {
      color: #94a3b8;
      font-size: 1rem;
      max-width: 600px;
      margin: 0 auto;
      line-height: 1.5;
    }
    .grid {
      display: grid;
      gap: 20px;
    }
    .card {
      background: rgba(15, 23, 42, 0.85);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 22px 24px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      transition: all 0.25s ease;
      position: relative;
      overflow: hidden;
    }
    .card::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 4px;
      background: linear-gradient(180deg, #f43f5e, #fbbf24);
    }
    .card:hover {
      border-color: rgba(251, 191, 36, 0.4);
      transform: translateY(-2px);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.7);
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .lang-name {
      font-size: 1.2rem;
      font-weight: 800;
      color: #38bdf8;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .voice-id {
      background: rgba(255, 255, 255, 0.06);
      color: #cbd5e1;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-family: monospace;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .speaker-meta {
      font-size: 0.85rem;
      color: #fb7185;
      font-weight: 600;
      margin-bottom: 10px;
    }
    .quote-box {
      background: rgba(3, 7, 18, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.05);
      padding: 14px 16px;
      border-radius: 10px;
      margin-bottom: 16px;
      color: #f8fafc;
      font-size: 0.95rem;
      line-height: 1.6;
    }
    audio {
      width: 100%;
      height: 44px;
      border-radius: 24px;
      outline: none;
    }
    footer {
      margin-top: 40px;
      text-align: center;
      color: #64748b;
      font-size: 0.82rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="badge-bar">
        <span class="badge">🌸 100% All-Female Voices</span>
        <span class="badge badge-gold">⚡ Gnani-Grade Neural Prosody</span>
        <span class="badge">🇮🇳 Sovereign Indic AI</span>
      </div>
      <h1>BRAHMA & Gnani Evon Voice Matrix</h1>
      <p class="subtitle">Experience crystal-clear, natural conversational female neural voices synthesized for Indian languages matching Gnani Evon v3.3 responses.</p>
    </header>

    <div class="grid">
"""
    for c in FEMALE_CLIPS:
        html_content += f"""
      <div class="card">
        <div class="card-header">
          <div class="lang-name">
            <span>🔊</span>
            <span>{c['language']}</span>
          </div>
          <span class="voice-id">{c['voice']}</span>
        </div>
        <div class="speaker-meta">👩 {c['role']}</div>
        <div class="quote-box">&ldquo;{c['text']}&rdquo;</div>
        <audio controls preload="metadata" src="./{c['filename']}"></audio>
      </div>
"""
    html_content += """
    </div>

    <footer>
      BRAHMA Sovereign Frontier AI Matrix &bull; Generated with High-Definition Indic Neural Vocoders &bull; Ready for Offline & Telephony Integration
    </footer>
  </div>
</body>
</html>
"""
    html_path = os.path.join(OUTPUT_DIRS[1], "listen_clips.html")
    with open(html_path, "w", encoding="utf-8") as f:
        f.write(html_content)
    
    print(f"\n[OK] Interactive Player successfully saved at: {html_path}")
    print("[SUCCESS] All female Indic voice clips synthesized and saved!")

if __name__ == "__main__":
    asyncio.run(generate_female_clips())
