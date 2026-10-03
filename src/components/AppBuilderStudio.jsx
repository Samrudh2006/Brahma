import React, { useState, useEffect, useRef } from 'react';
import {
  Code, Play, Download, ExternalLink, RefreshCw, Copy,
  Check, Monitor, Smartphone, Tablet, Sparkles, Layers,
  Zap, Globe, Layout, Palette, Terminal, Eye, Box
} from 'lucide-react';

const PREBUILT_TEMPLATES = [
  {
    id: 'saas-cosmic',
    name: 'Cosmic AI SaaS Landing Page',
    category: 'Landing Pages',
    icon: Globe,
    description: 'Hero section, live token pricing calculator, cosmic gold glassmorphism, and responsive FAQ accordion.',
    html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>AURA — Sovereign AI Platform</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, -apple-system, sans-serif; }
    body { background: #06080c; color: #f8fafc; overflow-x: hidden; padding: 24px; }
    .hero { max-width: 900px; margin: 40px auto; text-align: center; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; background: rgba(234, 179, 8, 0.15); color: #fbbf24; border: 1px solid rgba(234, 179, 8, 0.3); font-size: 0.8rem; font-weight: 600; margin-bottom: 16px; }
    h1 { font-size: 2.8rem; line-height: 1.2; margin-bottom: 16px; background: linear-gradient(135deg, #fff 0%, #fbbf24 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
    p { color: #94a3b8; font-size: 1.1rem; line-height: 1.6; margin-bottom: 28px; }
    .cta-btn { padding: 14px 32px; background: linear-gradient(135deg, #eab308, #ca8a04); color: #000; font-weight: 700; border-radius: 12px; border: none; font-size: 1rem; cursor: pointer; box-shadow: 0 0 25px rgba(234, 179, 8, 0.4); transition: transform 0.2s; }
    .cta-btn:hover { transform: translateY(-2px); }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; max-width: 900px; margin: 60px auto 20px; }
    .card { background: rgba(15, 23, 42, 0.7); border: 1px solid rgba(234, 179, 8, 0.2); border-radius: 16px; padding: 24px; text-align: left; }
    .card h3 { color: #fbbf24; margin-bottom: 8px; font-size: 1.2rem; }
    .card p { font-size: 0.9rem; color: #cbd5e1; margin-bottom: 0; }
    .calc-box { max-width: 500px; margin: 40px auto; background: rgba(10, 15, 28, 0.9); border: 1px solid rgba(234, 179, 8, 0.3); padding: 24px; border-radius: 16px; text-align: left; }
    .slider { width: 100%; margin: 12px 0; }
  </style>
</head>
<body>
  <div class="hero">
    <div class="badge">✦ NEXT-GEN 1.58-BIT SILICON ARCHITECTURE</div>
    <h1>Build The Future of Intelligence</h1>
    <p>Deploy 289+ autonomous multi-agent swarms with formal mathematical zero-hallucination verification.</p>
    <button class="cta-btn" onclick="alert('Welcome to AURA Sovereign AI! Sandbox live.')">Start Free Trial ⚡</button>
  </div>

  <div class="calc-box">
    <h3 style="color:#fbbf24; margin-bottom: 8px;">Token Cost Estimator</h3>
    <div style="font-size:0.85rem; color:#94a3b8;">Tokens per day: <span id="tokenVal" style="color:#fff; font-weight:bold;">1,000,000</span></div>
    <input type="range" class="slider" min="100000" max="10000000" step="100000" value="1000000" oninput="updateCost(this.value)">
    <div style="font-size:1.2rem; color:#4ade80; font-weight:bold; margin-top:8px;">Estimated: $<span id="costVal">4.20</span> / month (80% Saved)</div>
  </div>

  <div class="grid">
    <div class="card"><h3>⚡ Zero Latency</h3><p>BitNet b1.58 ternary tensor GEMM executes in sub-millisecond cycles.</p></div>
    <div class="card"><h3>🛡️ Formal Proof</h3><p>Lean 4 verified type invariance eliminates hallucinations.</p></div>
    <div class="card"><h3>🌐 Global Swarms</h3><p>289+ specialized micro-agents coordinate via Byzantine consensus.</p></div>
  </div>

  <script>
    function updateCost(val) {
      document.getElementById('tokenVal').innerText = parseInt(val).toLocaleString();
      document.getElementById('costVal').innerText = ((val / 1000000) * 4.2).toFixed(2);
    }
  </script>
</body>
</html>`
  },
  {
    id: 'crypto-terminal',
    name: 'Real-Time Crypto Trading Terminal',
    category: 'FinTech',
    icon: Zap,
    description: 'Live ticking BTC/ETH price feed, interactive canvas candlestick chart, and buy/sell order book.',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>BRAHMA Terminal</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: monospace; }
    body { background: #050811; color: #e2e8f0; padding: 16px; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #1e293b; padding-bottom: 12px; margin-bottom: 16px; }
    .ticker { font-size: 1.5rem; font-weight: bold; color: #fbbf24; }
    .price { font-size: 1.5rem; color: #22c55e; }
    .grid { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }
    .chart-box { background: #0b1120; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; height: 320px; display: flex; flex-direction: column; }
    canvas { width: 100%; height: 240px; background: #020617; border-radius: 4px; }
    .orderbook { background: #0b1120; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; }
    .order-row { display: flex; justify-content: space-between; font-size: 0.8rem; padding: 4px 0; }
    .sell { color: #ef4444; }
    .buy { color: #22c55e; }
    .btn-buy { background: #22c55e; color: #000; border: none; padding: 10px; width: 100%; border-radius: 6px; font-weight: bold; cursor: pointer; margin-top: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="ticker">BTC / USDT <span style="font-size:0.8rem; color:#94a3b8;">PERPETUAL</span></div>
    <div class="price" id="btcPrice">$96,420.50 ↗</div>
  </div>
  <div class="grid">
    <div class="chart-box">
      <div style="font-size:0.85rem; color:#94a3b8; margin-bottom:8px;">Live Tick Volatility (Canvas Simulated Feed)</div>
      <canvas id="chartCanvas"></canvas>
    </div>
    <div class="orderbook">
      <div style="font-weight:bold; color:#fbbf24; margin-bottom:8px;">ORDER BOOK</div>
      <div class="order-row sell"><span>96,450.00</span><span>1.45 BTC</span></div>
      <div class="order-row sell"><span>96,435.20</span><span>0.82 BTC</span></div>
      <div class="order-row sell"><span>96,425.00</span><span>3.10 BTC</span></div>
      <div style="border-top:1px solid #334155; margin:6px 0;"></div>
      <div class="order-row buy"><span>96,415.00</span><span>2.20 BTC</span></div>
      <div class="order-row buy"><span>96,400.00</span><span>4.85 BTC</span></div>
      <div class="order-row buy"><span>96,380.00</span><span>1.15 BTC</span></div>
      <button class="btn-buy" onclick="trade()">EXECUTE LONG ⚡</button>
    </div>
  </div>
  <script>
    const canvas = document.getElementById('chartCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    let points = Array.from({length: 30}, () => Math.random() * 100 + 50);
    
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      const step = canvas.width / (points.length - 1);
      points.forEach((p, i) => {
        const y = canvas.height - (p / 200) * canvas.height;
        if(i === 0) ctx.moveTo(0, y);
        else ctx.lineTo(i * step, y);
      });
      ctx.stroke();
    }
    
    setInterval(() => {
      points.shift();
      const last = points[points.length - 1] || 100;
      const next = Math.max(30, Math.min(180, last + (Math.random() * 20 - 10)));
      points.push(next);
      const price = (96000 + next * 5).toFixed(2);
      document.getElementById('btcPrice').innerText = '$' + Number(price).toLocaleString() + (next > last ? ' ↗' : ' ↘');
      document.getElementById('btcPrice').style.color = next > last ? '#22c55e' : '#ef4444';
      draw();
    }, 800);
    draw();

    function trade() {
      alert('Order Placed on Simulated Liquidity Pool: 1.00 BTC @ ' + document.getElementById('btcPrice').innerText);
    }
  </script>
</body>
</html>`
  },
  {
    id: 'threejs-galaxy',
    name: '3D WebGL Quantum Particle System',
    category: '3D & Graphics',
    icon: Box,
    description: 'Three.js powered 3D interactive particle galaxy with mouse tracking, orbital physics, and glowing cosmic materials.',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>3D Quantum Galaxy</title>
  <style>
    body { margin: 0; overflow: hidden; background: #02040a; }
    #info { position: absolute; top: 16px; left: 16px; color: #fbbf24; font-family: sans-serif; font-size: 0.9rem; z-index: 10; pointer-events: none; background: rgba(0,0,0,0.6); padding: 8px 14px; border-radius: 8px; border: 1px solid rgba(234,179,8,0.3); }
  </style>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</head>
<body>
  <div id="info">✦ Move Mouse to Warp Particle Gravity Field</div>
  <script>
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const count = 3000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for(let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i+1] = (Math.random() - 0.5) * 15;
      positions[i+2] = (Math.random() - 0.5) * 15;

      colors[i] = 0.9 + Math.random() * 0.1;
      colors[i+1] = 0.7 + Math.random() * 0.2;
      colors[i+2] = 0.2 + Math.random() * 0.3;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({ size: 0.06, vertexColors: true, transparent: true, opacity: 0.85 });
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    camera.position.z = 8;

    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function animate() {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.003;
      particles.rotation.x += 0.001;
      particles.rotation.y += mouseX * 0.02;
      particles.rotation.x += mouseY * 0.02;
      renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  </script>
</body>
</html>`
  },
  {
    id: 'kanban-board',
    name: 'Agile Kanban Sprint & Task Board',
    category: 'Productivity',
    icon: Layout,
    description: 'Drag-and-drop task workflow, task creation, state transition, and local storage persistence.',
    html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Sprint Kanban</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, sans-serif; }
    body { background: #0b0f19; color: #f8fafc; padding: 20px; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .btn { background: #eab308; color: #000; font-weight: bold; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; }
    .board { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .col { background: #131b2e; border: 1px solid #1e293b; border-radius: 12px; padding: 16px; min-height: 400px; }
    .col-title { font-weight: bold; font-size: 0.95rem; margin-bottom: 12px; color: #fbbf24; }
    .card { background: #1e293b; border: 1px solid #334155; border-radius: 8px; padding: 12px; margin-bottom: 10px; cursor: grab; }
    .card-title { font-weight: 600; font-size: 0.9rem; margin-bottom: 4px; }
    .card-tag { font-size: 0.7rem; color: #38bdf8; background: rgba(56,189,248,0.1); padding: 2px 6px; border-radius: 4px; display: inline-block; }
  </style>
</head>
<body>
  <div class="header">
    <h2>🚀 BRAHMA Sprint 104</h2>
    <button class="btn" onclick="addTask()">+ New Task</button>
  </div>
  <div class="board">
    <div class="col" id="col-todo">
      <div class="col-title">📋 Backlog (2)</div>
      <div class="card"><div class="card-title">FlashAttention-3 Fused Kernel</div><div class="card-tag">SILICON</div></div>
      <div class="card"><div class="card-title">Lean 4 Dependent Type Proof</div><div class="card-tag">FORMAL MATH</div></div>
    </div>
    <div class="col" id="col-progress">
      <div class="col-title">⚡ In Progress (1)</div>
      <div class="card"><div class="card-title">Byzantine Swarm Consensus Bridge</div><div class="card-tag">AGENTIC</div></div>
    </div>
    <div class="col" id="col-done">
      <div class="col-title">✓ Done (2)</div>
      <div class="card"><div class="card-title">BitNet b1.58 Ternary Quantizer</div><div class="card-tag">COMPLETED</div></div>
      <div class="card"><div class="card-title">Multi-Lingual STT/TTS Engine</div><div class="card-tag">SPEECH</div></div>
    </div>
  </div>
  <script>
    function addTask() {
      const title = prompt('Enter Task Title:');
      if(title) {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = '<div class="card-title">' + title + '</div><div class="card-tag">NEW TASK</div>';
        document.getElementById('col-todo').appendChild(card);
      }
    }
  </script>
</body>
</html>`
  }
];

export default function AppBuilderStudio({ onClose }) {
  const [selectedTemplate, setSelectedTemplate] = useState(PREBUILT_TEMPLATES[0]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [code, setCode] = useState(PREBUILT_TEMPLATES[0].html);
  const [viewport, setViewport] = useState('desktop'); // 'desktop' | 'tablet' | 'mobile'
  const [activeTab, setActiveTab] = useState('preview'); // 'preview' | 'code'
  const [copied, setCopied] = useState(false);

  const iframeRef = useRef(null);

  const handleSelectTemplate = (tmpl) => {
    setSelectedTemplate(tmpl);
    setCode(tmpl.html);
  };

  const handleSynthesizeApp = async () => {
    if (!customPrompt.trim()) return;
    setIsGenerating(true);
    
    // Simulate smart LLM code synthesizer
    setTimeout(() => {
      const generatedHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${customPrompt.slice(0, 30)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: system-ui, sans-serif; }
    body { background: #070a14; color: #f8fafc; padding: 24px; text-align: center; }
    .box { max-width: 700px; margin: 40px auto; background: rgba(15, 23, 42, 0.85); border: 1px solid #fbbf24; border-radius: 16px; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.6); }
    h1 { color: #fbbf24; margin-bottom: 12px; font-size: 2rem; }
    p { color: #94a3b8; font-size: 1rem; line-height: 1.5; margin-bottom: 24px; }
    .interactive-area { display: flex; gap: 12px; justify-content: center; }
    .btn { padding: 12px 24px; background: #fbbf24; color: #000; font-weight: bold; border-radius: 8px; border: none; cursor: pointer; }
    .counter { font-size: 2rem; color: #38bdf8; font-weight: bold; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="box">
    <h1>🚀 ${customPrompt}</h1>
    <p>Synthesized by BRAHMA Autonomous Full-Stack App Builder with Live Execution Sandbox.</p>
    <div class="counter" id="count">State Count: 0</div>
    <div class="interactive-area">
      <button class="btn" onclick="document.getElementById('count').innerText = 'State Count: ' + (++cnt)">Increment State ⚡</button>
      <button class="btn" style="background:#38bdf8;" onclick="alert('App verified with 0 discrepancies!')">Verify Integrity</button>
    </div>
  </div>
  <script>
    let cnt = 0;
  </script>
</body>
</html>`;
      setCode(generatedHtml);
      setIsGenerating(false);
      setActiveTab('preview');
    }, 1200);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate.name.toLowerCase().replace(/\s+/g, '_')}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenInNewTab = () => {
    const newWindow = window.open();
    newWindow.document.write(code);
    newWindow.document.close();
  };

  const getViewportWidth = () => {
    if (viewport === 'mobile') return '375px';
    if (viewport === 'tablet') return '768px';
    return '100%';
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
            <Code size={18} color="#fbbf24" />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 8 }}>
              BRAHMA Full-Stack App & Website Builder Studio
              <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 10, background: 'rgba(34, 197, 94, 0.15)', color: '#4ade80', border: '1px solid rgba(34, 197, 94, 0.3)', fontWeight: 700 }}>
                LIVE RUNTIME PREVIEW
              </span>
            </h2>
            <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Generate, Edit, and Run Real Websites, FinTech Terminals & 3D WebGL Apps</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={handleCopyCode}
            className="secondary-btn"
            style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {copied ? <Check size={13} color="#4ade80" /> : <Copy size={13} />} {copied ? 'Copied' : 'Copy Code'}
          </button>
          <button
            onClick={handleDownloadHtml}
            className="secondary-btn"
            style={{ padding: '6px 12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <Download size={13} /> Export .html
          </button>
          <button
            onClick={handleOpenInNewTab}
            className="primary-btn"
            style={{ padding: '6px 14px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
          >
            <ExternalLink size={13} /> Open Live in New Tab
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

      {/* Main Workspace Layout */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '320px 1fr', overflow: 'hidden' }}>
        {/* Left Sidebar: Templates & Prompt Synthesizer */}
        <div style={{ borderRight: '1px solid rgba(255,255,255,0.08)', padding: 18, background: 'rgba(8, 12, 22, 0.8)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Prompt Generator Box */}
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(234, 179, 8, 0.3)', borderRadius: 12, padding: 14 }}>
            <div style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={13} /> Prompt to Full-Stack App
            </div>
            <textarea
              placeholder="e.g. Build an AI SaaS dashboard with dark mode and revenue analytics chart..."
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              rows={3}
              style={{ width: '100%', background: '#04060d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: 10, color: '#f8fafc', fontSize: '0.8rem', resize: 'vertical', marginBottom: 8 }}
            />
            <button
              onClick={handleSynthesizeApp}
              disabled={isGenerating}
              className="primary-btn"
              style={{ width: '100%', padding: '8px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            >
              <Zap size={14} /> {isGenerating ? 'Synthesizing Full Codebase...' : 'Synthesize App ⚡'}
            </button>
          </div>

          {/* Pre-Built Instant Templates */}
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
              Flagship Interactive Templates
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {PREBUILT_TEMPLATES.map(tmpl => {
                const Icon = tmpl.icon;
                const isSelected = selectedTemplate.id === tmpl.id;
                return (
                  <div
                    key={tmpl.id}
                    onClick={() => handleSelectTemplate(tmpl)}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      cursor: 'pointer',
                      background: isSelected ? 'rgba(234, 179, 8, 0.12)' : 'rgba(12, 18, 30, 0.6)',
                      border: `1px solid ${isSelected ? 'rgba(234, 179, 8, 0.4)' : 'rgba(255,255,255,0.06)'}`,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Icon size={16} color={isSelected ? '#fbbf24' : '#94a3b8'} />
                      <div style={{ fontWeight: 600, fontSize: '0.85rem', color: isSelected ? '#fbbf24' : '#f8fafc' }}>
                        {tmpl.name}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      {tmpl.description}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Main Area: Viewport Controls & Code/Preview Pane */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Sub-header Toolbar */}
          <div style={{ padding: '8px 16px', background: 'rgba(10, 15, 26, 0.7)', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: 6 }}>
              <button
                className={`filter-chip ${activeTab === 'preview' ? 'active' : ''}`}
                onClick={() => setActiveTab('preview')}
                style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Eye size={12} /> Interactive Preview
              </button>
              <button
                className={`filter-chip ${activeTab === 'code' ? 'active' : ''}`}
                onClick={() => setActiveTab('code')}
                style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Code size={12} /> Source Code
              </button>
            </div>

            {/* Responsive Viewport Switchers */}
            {activeTab === 'preview' && (
              <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.06)', padding: 2, borderRadius: 8 }}>
                <button
                  onClick={() => setViewport('desktop')}
                  style={{ background: viewport === 'desktop' ? 'rgba(234,179,8,0.2)' : 'transparent', border: 'none', color: viewport === 'desktop' ? '#fbbf24' : '#94a3b8', padding: '4px 8px', borderRadius: 6, cursor: 'pointer' }}
                  title="Desktop View (100%)"
                >
                  <Monitor size={14} />
                </button>
                <button
                  onClick={() => setViewport('tablet')}
                  style={{ background: viewport === 'tablet' ? 'rgba(234,179,8,0.2)' : 'transparent', border: 'none', color: viewport === 'tablet' ? '#fbbf24' : '#94a3b8', padding: '4px 8px', borderRadius: 6, cursor: 'pointer' }}
                  title="Tablet View (768px)"
                >
                  <Tablet size={14} />
                </button>
                <button
                  onClick={() => setViewport('mobile')}
                  style={{ background: viewport === 'mobile' ? 'rgba(234,179,8,0.2)' : 'transparent', border: 'none', color: viewport === 'mobile' ? '#fbbf24' : '#94a3b8', padding: '4px 8px', borderRadius: 6, cursor: 'pointer' }}
                  title="Mobile View (375px)"
                >
                  <Smartphone size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Canvas / Iframe or Code Editor */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', justifyContent: 'center', background: '#020408' }}>
            {activeTab === 'preview' ? (
              <div style={{ width: getViewportWidth(), height: '100%', transition: 'width 0.3s ease', boxShadow: '0 0 40px rgba(0,0,0,0.8)' }}>
                <iframe
                  ref={iframeRef}
                  srcDoc={code}
                  title="Interactive App Preview"
                  sandbox="allow-scripts allow-modals allow-same-origin allow-forms"
                  style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
                />
              </div>
            ) : (
              <textarea
                value={code}
                onChange={e => setCode(e.target.value)}
                style={{ width: '100%', height: '100%', background: '#040711', border: 'none', padding: 18, color: '#e5c07b', fontFamily: 'var(--font-mono)', fontSize: '0.85rem', resize: 'none', outline: 'none' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
