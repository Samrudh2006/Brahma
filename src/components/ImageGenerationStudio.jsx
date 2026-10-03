import React, { useState } from 'react';
import {
  Image, Sparkles, Download, Copy, ExternalLink, RefreshCw,
  Sliders, Maximize, Play, Check, Eye, Wand2, Layers, Zap
} from 'lucide-react';
import { API_BASE } from '../api/client';

const STYLES = [
  { id: 'cosmic-gold', name: 'Cosmic Gold Sovereign', icon: Sparkles, preview: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300' },
  { id: 'photorealistic', name: '8K Photorealistic SOTA', icon: Eye, preview: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon Matrix', icon: Zap, preview: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300' },
  { id: '3d-render', name: '3D Octane Radiance Field', icon: Layers, preview: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=300' }
];

const CURATED_GALLERY = [
  {
    id: 'art_1',
    title: 'Cosmic Sovereign Temple of Brahma',
    prompt: 'Cosmic sacred golden geometry mandala floating in quantum space, hyper-detailed 8k octane render glowing aura',
    style: 'cosmic-gold',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'art_2',
    title: 'Divine Saraswati Intelligence Matrix',
    prompt: 'Saraswati deity of wisdom and neural computing, cosmic veena strings made of fiber optic light',
    style: 'cosmic-gold',
    url: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'art_3',
    title: 'Deep Quantum Silicon Transistor Array',
    prompt: 'Nanometer semiconductor chip with glowing gold interconnects, Blackwell B200 architecture photorealistic',
    style: '3d-render',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'art_4',
    title: 'Cyberpunk Neural Core & Swarm Fleet',
    prompt: 'Autonomous multi-agent drone fleet hovering over futuristic Tokyo skyline at night neon cyberpunk',
    style: 'cyberpunk',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'
  }
];

export default function ImageGenerationStudio({ onClose, onSendToChat }) {
  const [prompt, setPrompt] = useState('Cosmic Golden Mandala Sovereign Temple with Sacred Geometry and Glowing Aura');
  const [selectedStyle, setSelectedStyle] = useState('cosmic-gold');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [guidance, setGuidance] = useState(7.5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(CURATED_GALLERY[0]);
  const [copied, setCopied] = useState(false);
  const [gallery, setGallery] = useState(CURATED_GALLERY);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch(`${API_BASE}/images/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style: selectedStyle, aspectRatio, guidance })
      });
      const data = await res.json();
      if (data.success) {
        const newArt = {
          id: 'art_' + Date.now(),
          title: prompt.slice(0, 32),
          prompt,
          style: selectedStyle,
          url: data.imageUrl,
          resolution: data.resolution,
          latency: data.latencyMs + 'ms'
        };
        setGeneratedImage(newArt);
        setGallery(prev => [newArt, ...prev]);
      }
    } catch (err) {
      console.error('Image generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(generatedImage.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = generatedImage.url;
    a.download = `brahma_art_${Date.now()}.jpg`;
    a.target = '_blank';
    a.click();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      background: 'rgba(2, 4, 10, 0.96)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      flexDirection: 'column',
      color: '#f8fafc'
    }}>
      {/* Top Navbar */}
      <div style={{
        padding: '12px 24px',
        borderBottom: '1px solid rgba(234, 179, 8, 0.25)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(10, 15, 26, 0.9)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image size={18} color="#fbbf24" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 8 }}>
              Divine AI Image & Visual Asset Generation Studio
              <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 10, background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)', fontWeight: 700 }}>
                FLUX.1 / SD 3.5 TURBO
              </span>
            </h2>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>High-Fidelity Text-to-Image Synthesis with Cosmic Sacred Aesthetics</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleCopyUrl}
            className="secondary-btn"
            style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {copied ? <Check size={13} color="#4ade80" /> : <Copy size={13} />} {copied ? 'Copied URL' : 'Copy URL'}
          </button>
          <button
            onClick={handleDownload}
            className="primary-btn"
            style={{ padding: '6px 14px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Download size={13} /> Download 8K Image
          </button>
          {onClose && (
            <button
              onClick={onClose}
              style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: '#fff', padding: '6px 12px', borderRadius: 8, cursor: 'pointer' }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '360px 1fr', overflow: 'hidden' }}>
        {/* Left Controls Pane */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)', padding: 20, background: 'rgba(8, 12, 22, 0.85)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Prompt Box */}
          <div>
            <label style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
              Prompt Description
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              rows={4}
              placeholder="Describe what you want to generate in rich artistic detail..."
              style={{ width: '100%', background: '#04060d', border: '1px solid rgba(234, 179, 8, 0.25)', borderRadius: 10, padding: 12, color: '#f8fafc', fontSize: '0.85rem' }}
            />
          </div>

          {/* Style Selector */}
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 8 }}>
              Artistic Style Presets
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {STYLES.map(st => {
                const Icon = st.icon;
                const isSelected = selectedStyle === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => setSelectedStyle(st.id)}
                    style={{
                      padding: 10,
                      borderRadius: 8,
                      border: `1px solid ${isSelected ? '#fbbf24' : 'rgba(255,255,255,0.08)'}`,
                      background: isSelected ? 'rgba(234,179,8,0.15)' : 'rgba(15,23,42,0.6)',
                      color: isSelected ? '#fbbf24' : '#cbd5e1',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      textAlign: 'left'
                    }}
                  >
                    <Icon size={14} /> {st.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>
              Aspect Ratio
            </label>
            <div style={{ display: 'flex', gap: 6 }}>
              {['1:1', '16:9', '9:16', '4:3'].map(ar => (
                <button
                  key={ar}
                  onClick={() => setAspectRatio(ar)}
                  className={`filter-chip ${aspectRatio === ar ? 'active' : ''}`}
                  style={{ flex: 1, justifyContent: 'center', fontSize: '0.75rem', padding: '6px' }}
                >
                  {ar}
                </button>
              ))}
            </div>
          </div>

          {/* Guidance Scale */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginBottom: 4 }}>
              <span>Guidance Scale (CFG):</span>
              <strong style={{ color: '#fbbf24' }}>{guidance}</strong>
            </div>
            <input
              type="range"
              min="1"
              max="20"
              step="0.5"
              value={guidance}
              onChange={e => setGuidance(Number(e.target.value))}
              style={{ width: '100%' }}
            />
          </div>

          {/* Generate Action Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="primary-btn"
            style={{ width: '100%', padding: '12px', fontSize: '0.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 10 }}
          >
            <Wand2 size={16} />
            {isGenerating ? 'Synthesizing Neural Art...' : 'Generate Image ⚡'}
          </button>
        </div>

        {/* Right Preview Canvas & History Gallery */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 24, gap: 20 }}>
          {/* Main Display Canvas */}
          <div style={{
            flex: 1,
            background: '#040711',
            border: '1px solid rgba(234, 179, 8, 0.3)',
            borderRadius: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)'
          }}>
            {isGenerating ? (
              <div style={{ textAlign: 'center', color: '#fbbf24' }}>
                <RefreshCw size={36} style={{ animation: 'spin 1.5s linear infinite', marginBottom: 12 }} />
                <div style={{ fontSize: '1rem', fontWeight: 600 }}>Synthesizing 8K Photorealistic Latents...</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 4 }}>FLUX.1-Dev Diffusion Steps (28/28)</div>
              </div>
            ) : generatedImage ? (
              <img
                src={generatedImage.url}
                alt={generatedImage.prompt}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                  borderRadius: 8
                }}
              />
            ) : (
              <div style={{ color: '#94a3b8' }}>Type a prompt and click Generate</div>
            )}

            {generatedImage && !isGenerating && (
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(180deg, transparent 0%, rgba(5,8,18,0.95) 100%)',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700 }}>{generatedImage.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#cbd5e1', maxWidth: 600 }}>{generatedImage.prompt}</div>
                </div>
                <span style={{ fontSize: '0.7rem', color: '#4ade80', background: 'rgba(34,197,94,0.15)', padding: '2px 8px', borderRadius: 8 }}>
                  {generatedImage.resolution || '1024x1024'}
                </span>
              </div>
            )}
          </div>

          {/* Curated Gallery Reel */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Recent Generation Gallery ({gallery.length})
            </div>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
              {gallery.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setGeneratedImage(item)}
                  style={{
                    width: 110,
                    height: 80,
                    borderRadius: 8,
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: `1.5px solid ${generatedImage?.url === item.url ? '#fbbf24' : 'rgba(255,255,255,0.1)'}`,
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
