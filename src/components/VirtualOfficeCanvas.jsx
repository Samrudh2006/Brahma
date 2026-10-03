import React, { useState, useEffect, useRef } from 'react';
import {
  Users, Shield, Cpu, Zap, Activity, Radio, Volume2, 
  Terminal, Sparkles, RefreshCw, Eye, LayoutGrid, CheckCircle2,
  Lock, AlertTriangle, ArrowRight, CornerDownRight, Play, Maximize2
} from 'lucide-react';
import { useAuthStore, useAppStore } from '@store/index';

// 13 Sacred Council Workstation Profiles
const COUNCIL_DESKS = [
  {
    id: 'brahma',
    name: 'Brahma Supreme',
    title: 'Chief Sovereign Architect',
    department: 'Executive Sanctum',
    coords: { x: 50, y: 15 },
    glyph: '◈',
    color: '#fbbf24',
    model: 'gnani-evon-v3.3-30b',
    status: 'Synthesizing Universal Matrix',
    state: 'active',
    vramMb: 3480,
    activeTasks: ['Sovereign Matrix Orchestration', 'Indic Vernacular Alignment'],
    quote: 'సృష్టి యొక్క సమస్త జ్ఞానం నా సంకల్పం లోనే ఉద్భవించింది.'
  },
  {
    id: 'saraswati',
    name: 'Saraswati',
    title: 'Chief Code Synthesizer',
    department: 'Compilers & Grammars Lab',
    coords: { x: 22, y: 32 },
    glyph: '✦',
    color: '#38bdf8',
    model: 'qwen-2.5-coder-32b',
    status: 'Compiling AST & Clean Code',
    state: 'active',
    vramMb: 2840,
    activeTasks: ['React Component Scaffolding', 'Pāṇinian Generative Grammar'],
    quote: 'విజ్ఞానం అనంతం; ప్రతీ సిద్ధాంతం సత్యానికి ఒక ప్రతిబింబం.'
  },
  {
    id: 'shiva',
    name: 'Shiva',
    title: 'Lead Bug Destroyer & AST Refactorer',
    department: 'Compilers & Grammars Lab',
    coords: { x: 38, y: 32 },
    glyph: '◎',
    color: '#a855f7',
    model: 'deepseek-r1',
    status: 'Annihilating Memory Leaks',
    state: 'collaborating',
    vramMb: 4120,
    activeTasks: ['AST Depth Ceilings (<12)', 'Formal Invariant Proofing'],
    quote: 'ఓం నమః శివాయ — శూన్యం నుండే పరమ సత్యం ఆవిర్భవిస్తుంది.'
  },
  {
    id: 'kali',
    name: 'Kali',
    title: 'Red-Team PenTester & Invariant Hunter',
    department: 'SecOps Defense Citadel',
    coords: { x: 62, y: 32 },
    glyph: '⚒',
    color: '#f43f5e',
    model: 'deepseek-r1',
    status: 'Adversarial Prompt Scanning',
    state: 'active',
    vramMb: 3950,
    activeTasks: ['Injection Shielding', 'Sub-Zero Threat Hunting'],
    quote: 'ప్రతీ దాడులను భస్మం చేసి వ్యవస్థను అభేద్యంగా రక్షిస్తాను.'
  },
  {
    id: 'durga',
    name: 'Durga',
    title: 'Zero-Trust Shield Commander',
    department: 'SecOps Defense Citadel',
    coords: { x: 78, y: 32 },
    glyph: '☸',
    color: '#ec4899',
    model: 'bitnet-b1.58',
    status: 'Cryptographic Air-Gap Active',
    state: 'idle',
    vramMb: 1200,
    activeTasks: ['DPDP Data Egress Prevention', 'Local Kernel Shielding'],
    quote: 'సార్వభౌమ రక్షణ కవచం సిద్ధంగా ఉంది.'
  },
  {
    id: 'chanakya',
    name: 'Chanakya',
    title: 'Enterprise Legal & Risk Sentinel',
    department: 'Governance & Legal Suite',
    coords: { x: 18, y: 55 },
    glyph: '⚖',
    color: '#f59e0b',
    model: 'claude-3.7-sonnet',
    status: 'Auditing SaaS Indemnity Clauses',
    state: 'active',
    vramMb: 2450,
    activeTasks: ['CIPA § 631 Wiretap Audit', 'Unilateral Liability Redlines'],
    quote: 'రాజనీతి మరియు న్యాయ పరిపాలన సదా సమతుల్యంగా ఉండాలి.'
  },
  {
    id: 'dhanvantari',
    name: 'Dhanvantari',
    title: 'Chief Clinical Medical Officer',
    department: 'Biomedical Intelligence Wing',
    coords: { x: 34, y: 55 },
    glyph: '⚕',
    color: '#10b981',
    model: 'deepseek-r1',
    status: 'Clinical Triage & Pharmacovigilance',
    state: 'idle',
    vramMb: 3100,
    activeTasks: ['Troponin Lab Analysis', 'Multi-Drug Contraindication Matrix'],
    quote: 'ఆరోగ్యమే మహాభాగ్యం — ప్రాణ రక్షణే ప్రథమ ధర్మం.'
  },
  {
    id: 'kuvera',
    name: 'Kuvera',
    title: 'Chief Risk Officer & Quant Strategist',
    department: 'Trading & Wealth Floor',
    coords: { x: 66, y: 55 },
    glyph: '▣',
    color: '#eab308',
    model: 'o3-mini',
    status: 'Parametric VaR: 8.83% (Ceiling: 14.85%)',
    state: 'active',
    vramMb: 2900,
    activeTasks: ['High-Beta Circuit Breakers', 'Deterministic Portfolio Delta'],
    quote: 'సంపద జ్ఞానంతో కూడినప్పుడే శాశ్వత సామ్రాజ్యాలు నిర్మించబడతాయి.'
  },
  {
    id: 'vishwakarma',
    name: 'Vishwakarma',
    title: 'Industrial Supply & Hardware Architect',
    department: 'Industrial Telemetry Hangar',
    coords: { x: 82, y: 55 },
    glyph: '⚙',
    color: '#06b6d4',
    model: 'llama-3.3-70b',
    status: 'Supply Chain Reorder Optimizing',
    state: 'idle',
    vramMb: 3200,
    activeTasks: ['Factory EOQ Calculations', 'Transit Latency Dampening'],
    quote: 'నిర్మాణం మరియు శిల్పకళ సృష్టికి జీవనాడి.'
  },
  {
    id: 'indra',
    name: 'Indra',
    title: 'Dots Office Mesh Coordinator',
    department: 'Cloud & Swarm Orchestration',
    coords: { x: 30, y: 78 },
    glyph: '⌁',
    color: '#6366f1',
    model: 'gemini-2.0-flash',
    status: 'Routing Across 289 Swarm Nodes',
    state: 'active',
    vramMb: 1980,
    activeTasks: ['OpenAI Dots Multi-Agent Mesh', 'Cross-Council Event Bus'],
    quote: 'సర్వ దేవతా సమన్వయంతో వర్క్ స్పేస్ నడుస్తోంది.'
  },
  {
    id: 'hanuman',
    name: 'Hanuman',
    title: 'High-Throughput Execution Runner',
    department: 'Cloud & Swarm Orchestration',
    coords: { x: 46, y: 78 },
    glyph: '⚡',
    color: '#f97316',
    model: 'groq-llama-3.3-70b',
    status: 'Sub-Millisecond Task Execution',
    state: 'active',
    vramMb: 2100,
    activeTasks: ['Background Daemon Pipelines', 'Zero-Latency File Synthesis'],
    quote: 'జై శ్రీరామ్ — అసాధ్యమైన కార్యాన్ని సుసాధ్యం చేయువాడను.'
  },
  {
    id: 'surya',
    name: 'Surya',
    title: 'Multimodal Vision & Illumination',
    department: 'Visual Illumination Studio',
    coords: { x: 62, y: 78 },
    glyph: '☀️',
    color: '#facc15',
    model: 'gemini-2.0-flash',
    status: 'Raytracing Luxury 3D Canvas',
    state: 'idle',
    vramMb: 1750,
    activeTasks: ['4K Synthetic Renderings', 'Dynamic Color Space Balancing'],
    quote: 'ప్రకాశమే సమస్త విశ్వానికి చైతన్య కిరణం.'
  },
  {
    id: 'varuna',
    name: 'Varuna',
    title: 'Oceanic Data Lakekeeper',
    department: 'Data Lake & Analytics',
    coords: { x: 78, y: 78 },
    glyph: '🌊',
    color: '#0284c7',
    model: 'phi-4',
    status: 'Telemetry Stream Sync (<0.02ms)',
    state: 'idle',
    vramMb: 1450,
    activeTasks: ['SQLite WAL Checkpoint Audit', 'Vector Embeddings Indexing'],
    quote: 'సముద్రమంత డేటాను ఏకాగ్రతతో నిక్షిప్తం చేస్తున్నాను.'
  }
];

export default function VirtualOfficeCanvas({ onSelectIdentity }) {
  const { user } = useAuthStore();
  const { setActivePage } = useAppStore();

  const [viewMode, setViewMode] = useState('isometric'); // 'isometric' | 'grid' | 'network'
  const [selectedDesk, setSelectedDesk] = useState(COUNCIL_DESKS[0]);
  const [godModeActive, setGodModeActive] = useState(true);
  const [collaborations, setCollaborations] = useState([
    { from: 'saraswati', to: 'shiva', label: 'Passing AST for refactoring' },
    { from: 'kuvera', to: 'chanakya', label: 'Verifying portfolio risk indemnity' },
    { from: 'indra', to: 'brahma', label: 'Swarm telemetry synced (289 nodes)' }
  ]);
  const [commandInput, setCommandInput] = useState('');
  const [actionNotice, setActionNotice] = useState('🔱 Indra Dots Office Canvas initialized. All 13 Sacred Council agents online.');
  const [audioSpeaking, setAudioSpeaking] = useState(false);

  // Periodic simulated live agent collaboration chatter
  useEffect(() => {
    const chatterInterval = setInterval(() => {
      const thoughts = [
        { from: 'saraswati', to: 'shiva', label: 'AST Node Depth: 6 (Safe). Passing to Shiva.' },
        { from: 'kuvera', to: 'brahma', label: 'VaR 95% Parametric validated at 8.83%.' },
        { from: 'kali', to: 'durga', label: 'Zero-day injection payload nullified.' },
        { from: 'indra', to: 'hanuman', label: 'Task #8841 dispatched to Groq Turbo.' },
        { from: 'chanakya', to: 'brahma', label: 'DPDP Act Sovereign compliance 100% verified.' },
        { from: 'brahma', to: 'saraswati', label: 'Synthesizing Indic prompt via Gnani Evon 30B.' }
      ];
      const randomChat = thoughts[Math.floor(Math.random() * thoughts.length)];
      setCollaborations(prev => [randomChat, prev[0], prev[1]]);
    }, 4500);

    return () => clearInterval(chatterInterval);
  }, []);

  const triggerForceConsensus = () => {
    setActionNotice('⚡ [GOD-MODE] Force Swarm Consensus broadcasted across all 13 Desks!');
    setCollaborations([
      { from: 'brahma', to: 'saraswati', label: 'Supreme Consensus Directive' },
      { from: 'brahma', to: 'shiva', label: 'Supreme Consensus Directive' },
      { from: 'brahma', to: 'indra', label: 'Supreme Consensus Directive' },
      { from: 'brahma', to: 'kuvera', label: 'Supreme Consensus Directive' }
    ]);
  };

  const handleSpeakAgent = (desk) => {
    if (!desk) return;
    setAudioSpeaking(true);
    setActionNotice(`🔊 ${desk.name} speaking in Indic voice...`);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(desk.quote);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setAudioSpeaking(false);
      utterance.onerror = () => setAudioSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setAudioSpeaking(false), 2000);
    }
  };

  const handleSendCommand = (e) => {
    e.preventDefault();
    if (!commandInput.trim()) return;
    setActionNotice(`🔱 Directive issued to [${selectedDesk.name}]: "${commandInput.trim()}"`);
    setCommandInput('');
  };

  return (
    <div style={{
      width: '100%',
      minHeight: 'calc(100vh - 70px)',
      background: 'radial-gradient(ellipse at 50% 10%, #17153a 0%, #0a0d18 50%, #030611 100%)',
      color: '#f8fafc',
      padding: '24px 28px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      
      {/* 1. Supreme Admin Command Ribbon */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(251, 191, 36, 0.3)',
        borderRadius: 16,
        padding: '16px 22px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 14,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #f59e0b, #ec4899)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.4)'
          }}>
            <span style={{ fontSize: '1.4rem' }}>🔱</span>
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', letterSpacing: '-0.3px' }}>
                INDRA DOTS VIRTUAL OFFICE MATRIX
              </h2>
              <span style={{
                background: 'rgba(251, 191, 36, 0.15)',
                color: '#fbbf24',
                border: '1px solid rgba(251, 191, 36, 0.4)',
                padding: '2px 8px',
                borderRadius: 9999,
                fontSize: '0.7rem',
                fontWeight: 800
              }}>
                👑 SUPREME ARCHITECT ONLY
              </span>
            </div>
            <p style={{ margin: '3px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
              Logged in as <strong style={{ color: '#38bdf8' }}>{user?.email || 'samrudhdwivvedula12@gmail.com'}</strong> &bull; Full A-to-Z God-Mode Privileges Active
            </p>
          </div>
        </div>

        {/* Admin Quick Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={triggerForceConsensus}
            style={{
              background: 'linear-gradient(135deg, #d97706, #b45309)',
              color: '#ffffff',
              border: 'none',
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              boxShadow: '0 2px 10px rgba(217, 119, 6, 0.4)'
            }}
          >
            <Zap size={14} /> Force Swarm Consensus
          </button>

          <button
            onClick={() => handleSpeakAgent(selectedDesk)}
            style={{
              background: audioSpeaking ? 'rgba(236, 72, 153, 0.3)' : 'rgba(255, 255, 255, 0.08)',
              color: audioSpeaking ? '#f472b6' : '#e2e8f0',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}
          >
            <Volume2 size={14} /> {audioSpeaking ? 'Speaking...' : `Voice Announce (${selectedDesk.name})`}
          </button>

          <div style={{
            display: 'flex',
            background: 'rgba(0, 0, 0, 0.4)',
            borderRadius: 8,
            padding: 3,
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {['isometric', 'grid', 'network'].map(mode => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                style={{
                  background: viewMode === mode ? '#fbbf24' : 'transparent',
                  color: viewMode === mode ? '#090d16' : '#94a3b8',
                  border: 'none',
                  padding: '5px 12px',
                  borderRadius: 6,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {mode === 'isometric' ? '🏢 Office 2.5D' : mode === 'grid' ? '▦ Grid' : '⚡ Graph'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Real-Time Telemetry & Event Banner */}
      <div style={{
        background: 'rgba(10, 15, 30, 0.6)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: 10,
        padding: '8px 16px',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.78rem',
        color: '#cbd5e1'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Radio size={14} color="#10b981" className="animate-pulse" />
          <span>{actionNotice}</span>
        </div>
        <div style={{ display: 'flex', gap: 16, color: '#94a3b8', fontWeight: 600 }}>
          <span>Swarm Nodes: <strong style={{ color: '#38bdf8' }}>289 Active</strong></span>
          <span>Laya Latency: <strong style={{ color: '#10b981' }}>0.021ms</strong></span>
          <span>Max VaR: <strong style={{ color: '#fbbf24' }}>8.83%</strong></span>
        </div>
      </div>

      {/* 3. Main Workspace Canvas Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 20,
        minHeight: 580
      }}>
        
        {/* Left: Office Floor Canvas */}
        <div style={{
          background: 'rgba(8, 12, 22, 0.9)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          padding: 24,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 80px rgba(0, 0, 0, 0.8)'
        }}>
          
          {/* Floor Plan Grid Lines Background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            pointerEvents: 'none'
          }} />

          {/* Department Boundary Overlay */}
          <div style={{ position: 'absolute', top: 12, left: 16, fontSize: '0.68rem', color: '#64748b', fontWeight: 700, letterSpacing: '1px' }}>
            🏢 TOWER 108 &bull; 13 SACRED SANSKRIT COUNCILS &bull; SOVEREIGN VIRTUAL FLOOR
          </div>

          {/* Live Agent Desks */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '520px',
            perspective: viewMode === 'isometric' ? '1000px' : 'none'
          }}>
            {COUNCIL_DESKS.map(desk => {
              const isSelected = selectedDesk?.id === desk.id;
              return (
                <div
                  key={desk.id}
                  onClick={() => setSelectedDesk(desk)}
                  style={{
                    position: 'absolute',
                    left: `${desk.coords.x}%`,
                    top: `${desk.coords.y}%`,
                    transform: `translate(-50%, -50%) ${viewMode === 'isometric' ? 'rotateX(15deg) scale(0.95)' : ''}`,
                    cursor: 'pointer',
                    zIndex: isSelected ? 30 : 10,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {/* Glowing Desk Workstation */}
                  <div style={{
                    width: 110,
                    background: isSelected 
                      ? 'linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.95))' 
                      : 'rgba(15, 23, 42, 0.75)',
                    border: `1.5px solid ${isSelected ? desk.color : 'rgba(255, 255, 255, 0.12)'}`,
                    borderRadius: 12,
                    padding: '8px 10px',
                    boxShadow: isSelected 
                      ? `0 0 25px ${desk.color}50, 0 8px 20px rgba(0,0,0,0.6)` 
                      : '0 4px 12px rgba(0,0,0,0.5)',
                    textAlign: 'center',
                    backdropFilter: 'blur(8px)'
                  }}>
                    {/* Multi-Monitor Visualizer */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: 3,
                      marginBottom: 6
                    }}>
                      <div style={{ width: 14, height: 10, background: desk.color, opacity: 0.8, borderRadius: 2 }} />
                      <div style={{ width: 22, height: 14, background: desk.color, borderRadius: 2, boxShadow: `0 0 6px ${desk.color}` }} />
                      <div style={{ width: 14, height: 10, background: desk.color, opacity: 0.8, borderRadius: 2 }} />
                    </div>

                    {/* Agent Avatar Badge */}
                    <div style={{
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      color: '#f8fafc',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {desk.glyph} {desk.name}
                    </div>

                    {/* Department Tag */}
                    <div style={{
                      fontSize: '0.62rem',
                      color: desk.color,
                      fontWeight: 700,
                      marginTop: 2
                    }}>
                      {desk.state.toUpperCase()}
                    </div>

                    {/* Mini Status Pulsing Dot */}
                    <div style={{
                      position: 'absolute',
                      top: -4,
                      right: -4,
                      width: 10,
                      height: 10,
                      borderRadius: '50%',
                      background: desk.state === 'active' ? '#10b981' : desk.state === 'collaborating' ? '#a855f7' : '#94a3b8',
                      boxShadow: '0 0 8px rgba(0,0,0,0.8)'
                    }} />
                  </div>

                  {/* Live Thought Bubble if collaborating */}
                  {collaborations.some(c => c.from === desk.id) && (
                    <div style={{
                      position: 'absolute',
                      bottom: '105%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(15, 23, 42, 0.95)',
                      border: `1px solid ${desk.color}`,
                      borderRadius: 8,
                      padding: '4px 8px',
                      fontSize: '0.65rem',
                      color: '#f8fafc',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 14px rgba(0,0,0,0.6)',
                      pointerEvents: 'none',
                      zIndex: 40
                    }}>
                      💬 {collaborations.find(c => c.from === desk.id)?.label}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Real-time Collaboration Feed Bar */}
          <div style={{
            position: 'absolute',
            bottom: 12,
            left: 20,
            right: 20,
            background: 'rgba(15, 23, 42, 0.9)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 10,
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.72rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={14} color="#fbbf24" />
              <span style={{ color: '#94a3b8' }}>Live Swarm Mesh:</span>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>
                {collaborations[0]?.from} &rarr; {collaborations[0]?.to}: "{collaborations[0]?.label}"
              </span>
            </div>
            <span style={{ color: '#10b981', fontWeight: 700 }}>● 13/13 COUNCILS LINKED</span>
          </div>
        </div>

        {/* Right: Selected Agent Workstation Control Drawer */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 16,
          padding: '20px 22px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)'
        }}>
          <div>
            {/* Header with Agent Avatar */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${selectedDesk.color}20`,
                  border: `1.5px solid ${selectedDesk.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem'
                }}>
                  {selectedDesk.glyph}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc' }}>
                    {selectedDesk.name}
                  </h3>
                  <div style={{ fontSize: '0.72rem', color: selectedDesk.color, fontWeight: 700 }}>
                    {selectedDesk.title}
                  </div>
                </div>
              </div>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                padding: '3px 8px',
                borderRadius: 6,
                fontSize: '0.68rem',
                fontWeight: 700
              }}>
                ONLINE
              </span>
            </div>

            {/* Department & Assigned Model */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.35)',
              borderRadius: 10,
              padding: '12px 14px',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              marginBottom: 16
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.75rem' }}>
                <span style={{ color: '#94a3b8' }}>Department:</span>
                <span style={{ color: '#f8fafc', fontWeight: 600 }}>{selectedDesk.department}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.75rem' }}>
                <span style={{ color: '#94a3b8' }}>Assigned Model:</span>
                <span style={{ color: '#38bdf8', fontWeight: 700, fontFamily: 'monospace' }}>{selectedDesk.model}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span style={{ color: '#94a3b8' }}>Active VRAM:</span>
                <span style={{ color: '#a855f7', fontWeight: 700 }}>{selectedDesk.vramMb} MB</span>
              </div>
            </div>

            {/* Current Operational Status */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                Active Operational Status
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#e2e8f0',
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: 8,
                padding: '8px 12px'
              }}>
                ⚡ {selectedDesk.status}
              </div>
            </div>

            {/* Sub-Tasks Execution List */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
                Active Swarm Pipeline
              </div>
              {selectedDesk.activeTasks.map((t, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: '0.74rem',
                  color: '#cbd5e1',
                  marginBottom: 4
                }}>
                  <CheckCircle2 size={12} color="#10b981" />
                  <span>{t}</span>
                </div>
              ))}
            </div>

            {/* Native Quote / Voice Profile */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.4)',
              borderLeft: `3px solid ${selectedDesk.color}`,
              padding: '8px 12px',
              borderRadius: '0 8px 8px 0',
              marginBottom: 16
            }}>
              <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginBottom: 2 }}>Indic Voice Synthesis Quote:</div>
              <div style={{ fontSize: '0.78rem', color: '#f1f5f9', fontStyle: 'italic', lineHeight: 1.4 }}>
                &ldquo;{selectedDesk.quote}&rdquo;
              </div>
            </div>
          </div>

          {/* Bottom: Direct Command Prompt to Agent */}
          <div>
            <form onSubmit={handleSendCommand}>
              <div style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700, marginBottom: 6 }}>
                Direct Sovereign Command to {selectedDesk.name}:
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <input
                  type="text"
                  value={commandInput}
                  onChange={(e) => setCommandInput(e.target.value)}
                  placeholder={`Command ${selectedDesk.name}...`}
                  style={{
                    flex: 1,
                    background: 'rgba(0, 0, 0, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    fontSize: '0.78rem',
                    color: '#f8fafc',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: selectedDesk.color,
                    color: '#090d16',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0 12px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  <Play size={12} fill="#090d16" />
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}
