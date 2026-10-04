import React, { useState, useEffect, useRef } from 'react';
import { GRANDMASTER_BOARD } from '@data/boardMembers';
import {
  Award, Shield, Cpu, BookOpen, Quote, ChevronRight,
  Sparkles, Swords, Zap, RefreshCw, CheckCircle2,
  Sliders, MessageSquare, Play, Pause, Volume2, ArrowRight,
  ExternalLink, Compass, Radio, Target, Trophy, Scale,
  UserPlus, UserCheck, Check, Sparkle, Atom, Globe, Activity, User
} from 'lucide-react';
import { IDENTITIES } from '@data/identities';
import { playTactileClick, playDivineChime } from '@utils/soundEffects';

const EXAMPLE_CHALLENGES = [
  'Can autonomous AI achieve reliable AGI?',
  'Design a safe self-improving agent.',
  'Which architecture scales beyond current LLMs?',
  'Can intelligence be formally verified?'
];

const REASONING_MODES = [
  { id: 'first-principles', label: 'First Principles' },
  { id: 'adversarial', label: 'Adversarial Debate' },
  { id: 'architecture', label: 'Architecture Review' },
  { id: 'red-blue', label: 'Red Team / Blue Team' },
  { id: 'agi-benchmark', label: 'AGI Benchmark' }
];

// ─── HIGH-FIDELITY HUMANOID LUMINARY SVG PORTRAITS ──────────────────────────
export function LuminaryFaceSvg({ id, size = 32 }) {
  const configs = {
    turing: {
      skin: '#fbd3b6',
      hair: '#3b2f2f',
      clothes: '#1e293b',
      accent: '#38bdf8',
      hairType: 'sidepart',
      glasses: false
    },
    'von-neumann': {
      skin: '#fcd5b8',
      hair: '#2c221e',
      clothes: '#0f172a',
      accent: '#fbbf24',
      hairType: 'slick',
      glasses: false
    },
    shannon: {
      skin: '#f8d0b0',
      hair: '#4a3b32',
      clothes: '#334155',
      accent: '#10b981',
      hairType: 'tall',
      glasses: false
    },
    feynman: {
      skin: '#fcd3b6',
      hair: '#5c4033',
      clothes: '#ea580c',
      accent: '#f97316',
      hairType: 'wavy',
      glasses: false
    },
    hinton: {
      skin: '#fde0c8',
      hair: '#94a3b8',
      clothes: '#475569',
      accent: '#818cf8',
      hairType: 'receding',
      glasses: true
    },
    lecun: {
      skin: '#fad2b5',
      hair: '#3e2723',
      clothes: '#1e1b4b',
      accent: '#38bdf8',
      hairType: 'thick',
      glasses: true,
      squareGlasses: true
    },
    bengio: {
      skin: '#fbd1b4',
      hair: '#271c19',
      clothes: '#064e3b',
      accent: '#34d399',
      hairType: 'curly',
      beard: true,
      glasses: true
    },
    hassabis: {
      skin: '#eec7a2',
      hair: '#1c1917',
      clothes: '#0f172a',
      accent: '#ec4899',
      hairType: 'crop',
      glasses: false
    },
    sutskever: {
      skin: '#fad3b6',
      hair: '#44403c',
      clothes: '#312e81',
      accent: '#a855f7',
      hairType: 'buzz',
      glasses: false
    },
    karpathy: {
      skin: '#fad5ba',
      hair: '#292524',
      clothes: '#18181b',
      accent: '#eab308',
      hairType: 'modern',
      glasses: false
    },
    tao: {
      skin: '#fadcb9',
      hair: '#171717',
      clothes: '#0369a1',
      accent: '#38bdf8',
      hairType: 'neat',
      glasses: false
    },
    huang: {
      skin: '#fadcb9',
      hair: '#52525b',
      silverStreak: true,
      clothes: '#09090b',
      leatherJacket: true,
      accent: '#22c55e',
      hairType: 'styled',
      glasses: false
    },
    torvalds: {
      skin: '#fbd5ba',
      hair: '#78716c',
      clothes: '#0284c7',
      accent: '#06b6d4',
      hairType: 'short',
      glasses: true
    },
    liskov: {
      skin: '#fce3cf',
      hair: '#cbd5e1',
      clothes: '#831843',
      accent: '#f43f5e',
      hairType: 'bob',
      glasses: true,
      female: true
    },
    knuth: {
      skin: '#fde2cf',
      hair: '#e2e8f0',
      clothes: '#3f3f46',
      accent: '#fbbf24',
      hairType: 'fringe',
      glasses: true
    },
    lamport: {
      skin: '#fce1ce',
      hair: '#f1f5f9',
      clothes: '#1e293b',
      accent: '#60a5fa',
      hairType: 'longwhite',
      beard: true,
      longBeard: true,
      glasses: true
    },
    dean: {
      skin: '#fad4b8',
      hair: '#573d2a',
      clothes: '#1d4ed8',
      accent: '#3b82f6',
      hairType: 'athlete',
      glasses: false
    }
  };

  const cfg = configs[id] || {
    skin: '#fbd3b6',
    hair: '#3b2f2f',
    clothes: '#1e293b',
    accent: '#fbbf24',
    hairType: 'short'
  };

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block', borderRadius: '50%' }}>
      {/* Background Gradient */}
      <defs>
        <radialGradient id={`grad-${id}`} cx="50%" cy="40%" r="50%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#090d16" />
        </radialGradient>
        <linearGradient id={`accent-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={cfg.accent} />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      <circle cx="50" cy="50" r="48" fill={`url(#grad-${id})`} />

      {/* Shoulders / Suit */}
      <path
        d="M 16 95 C 16 75, 34 68, 50 68 C 66 68, 84 75, 84 95 Z"
        fill={cfg.clothes}
      />
      {/* Leather jacket collar / suit lapel */}
      {cfg.leatherJacket ? (
        <path d="M 36 70 L 50 86 L 64 70 L 58 95 L 42 95 Z" fill="#27272a" stroke="#22c55e" strokeWidth="1.5" />
      ) : (
        <path d="M 40 70 L 50 84 L 60 70 L 50 95 Z" fill="#f8fafc" opacity="0.9" />
      )}

      {/* Neck */}
      <rect x="42" y="52" width="16" height="18" fill={cfg.skin} rx="4" />

      {/* Head / Face */}
      <ellipse cx="50" cy="46" rx="21" ry="24" fill={cfg.skin} />

      {/* Ears */}
      <ellipse cx="28" cy="46" rx="4" ry="7" fill={cfg.skin} />
      <ellipse cx="72" cy="46" rx="4" ry="7" fill={cfg.skin} />

      {/* Eyes */}
      <circle cx="42" cy="44" r="2.8" fill="#1e293b" />
      <circle cx="58" cy="44" r="2.8" fill="#1e293b" />
      <circle cx="43" cy="43" r="0.9" fill="#ffffff" />
      <circle cx="59" cy="43" r="0.9" fill="#ffffff" />

      {/* Eyebrows */}
      <path d="M 37 38 Q 42 36 47 38" stroke={cfg.hair} strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M 53 38 Q 58 36 63 38" stroke={cfg.hair} strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Nose */}
      <path d="M 50 43 L 48 51 L 53 51" stroke="#e2a783" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Mouth */}
      <path d="M 44 57 Q 50 61 56 57" stroke="#b45309" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Beard for Lamport / Bengio */}
      {cfg.beard && (
        <path
          d={cfg.longBeard ? "M 32 50 Q 50 78 68 50 Q 50 88 32 50" : "M 34 50 Q 50 68 66 50 Q 50 63 34 50"}
          fill={cfg.hair}
          opacity="0.95"
        />
      )}

      {/* Glasses */}
      {cfg.glasses && (
        <g stroke="#e2e8f0" strokeWidth="2" fill="none" opacity="0.9">
          {cfg.squareGlasses ? (
            <>
              <rect x="34" y="38" width="14" height="11" rx="2" stroke="#000" strokeWidth="2.5" />
              <rect x="52" y="38" width="14" height="11" rx="2" stroke="#000" strokeWidth="2.5" />
              <line x1="48" y1="43" x2="52" y2="43" stroke="#000" strokeWidth="2.5" />
            </>
          ) : (
            <>
              <circle cx="41" cy="44" r="7.5" stroke="#cbd5e1" />
              <circle cx="59" cy="44" r="7.5" stroke="#cbd5e1" />
              <line x1="48.5" y1="44" x2="51.5" y2="44" />
            </>
          )}
        </g>
      )}

      {/* Distinct Hair Styles */}
      {cfg.hairType === 'sidepart' && (
        <path d="M 28 42 C 27 24, 48 20, 72 26 C 73 34, 72 44, 70 45 C 68 32, 50 28, 30 38 Z" fill={cfg.hair} />
      )}
      {cfg.hairType === 'slick' && (
        <path d="M 28 40 C 27 22, 50 20, 72 24 C 70 42, 60 28, 30 36 Z" fill={cfg.hair} />
      )}
      {cfg.hairType === 'tall' && (
        <path d="M 29 42 C 26 18, 52 18, 71 28 C 72 40, 58 26, 30 38 Z" fill={cfg.hair} />
      )}
      {cfg.hairType === 'wavy' && (
        <path d="M 26 48 C 24 24, 44 20, 74 24 C 76 48, 70 54, 68 44 C 66 30, 42 26, 28 44 Z" fill={cfg.hair} />
      )}
      {cfg.hairType === 'receding' && (
        <path d="M 28 44 C 27 30, 36 28, 40 32 C 48 30, 62 28, 72 44 C 72 38, 58 24, 30 30 Z" fill={cfg.hair} />
      )}
      {cfg.hairType === 'curly' && (
        <path d="M 26 44 C 24 20, 42 16, 74 20 C 76 44, 68 30, 50 26 C 36 28, 28 36, 26 44 Z" fill={cfg.hair} />
      )}
      {cfg.hairType === 'crop' && (
        <path d="M 28 40 C 28 24, 48 22, 72 24 C 72 40, 50 28, 28 40 Z" fill={cfg.hair} />
      )}
      {cfg.hairType === 'buzz' && (
        <path d="M 29 40 C 29 25, 48 24, 71 26 C 71 36, 50 28, 29 38 Z" fill={cfg.hair} opacity="0.8" />
      )}
      {cfg.hairType === 'modern' && (
        <path d="M 28 42 C 27 24, 48 22, 72 25 C 72 38, 50 28, 28 40 Z" fill={cfg.hair} />
      )}
      {cfg.hairType === 'neat' && (
        <path d="M 28 42 C 28 24, 48 22, 72 25 C 72 38, 52 28, 28 40 Z" fill={cfg.hair} />
      )}
      {cfg.hairType === 'styled' && (
        <g>
          <path d="M 27 42 C 26 22, 48 18, 73 24 C 73 42, 54 26, 28 40 Z" fill={cfg.hair} />
          {cfg.silverStreak && <path d="M 38 24 Q 48 20 60 22" stroke="#e2e8f0" strokeWidth="2.5" fill="none" />}
        </g>
      )}
      {cfg.hairType === 'bob' && (
        <path d="M 26 48 C 24 24, 46 18, 74 24 C 76 50, 72 52, 68 46 C 66 28, 40 26, 28 48 Z" fill={cfg.hair} />
      )}
      {cfg.hairType === 'fringe' && (
        <path d="M 28 44 C 27 22, 52 18, 72 26 C 72 44, 66 32, 30 36 Z" fill={cfg.hair} />
      )}
      {cfg.hairType === 'longwhite' && (
        <path d="M 25 56 C 22 22, 48 16, 75 22 C 78 56, 72 52, 68 44 C 66 28, 40 24, 28 50 Z" fill={cfg.hair} />
      )}
      {cfg.hairType === 'athlete' && (
        <path d="M 29 40 C 28 24, 48 22, 71 25 C 71 38, 52 28, 29 38 Z" fill={cfg.hair} />
      )}

      {/* Luminary Halo / Node Ring */}
      <circle cx="50" cy="50" r="46" fill="none" stroke={`url(#accent-${id})`} strokeWidth="2.5" opacity="0.8" />
    </svg>
  );
}

// Helper: Circular Luminary Avatar with photo & graceful fallback
function LuminaryAvatar({ member, size = 32, isSummoned = false }) {
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(251, 191, 36, 0.25), rgba(15, 23, 42, 0.95))',
      border: isSummoned ? '1.5px solid var(--accent-gold)' : '1px solid var(--bg-glass-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      flexShrink: 0,
      boxShadow: isSummoned ? '0 0 10px var(--accent-gold-glow)' : 'none'
    }}>
      {/* High-Fidelity Humanoid SVG Portrait (Guaranteed Zero-Lag Offline Render) */}
      {(!imgLoaded || imgError || !member?.photo) ? (
        <LuminaryFaceSvg id={member?.id} size={size} />
      ) : null}

      {/* Optional Photo if loaded with no-referrer */}
      {member?.photo && !imgError && (
        <img
          src={member.photo}
          alt={member.name}
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
          onLoad={() => setImgLoaded(true)}
          onError={() => setImgError(true)}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '50%',
            display: imgLoaded ? 'block' : 'none'
          }}
        />
      )}
    </div>
  );
}

export default function BoardMembersView({ onSelectIdentity, onSendPrompt, setActivePage }) {
  const [challengePrompt, setChallengePrompt] = useState('');
  const [summonedIds, setSummonedIds] = useState(['hinton', 'lecun', 'turing', 'von-neumann']);
  const [selectedReasoningMode, setSelectedReasoningMode] = useState('first-principles');
  const [selectedRounds, setSelectedRounds] = useState(5);
  const [verdictCriteria, setVerdictCriteria] = useState({
    evidence: true,
    logicalConsistency: true,
    technicalDepth: true,
    novelty: true,
    practicalImpact: true
  });

  // Live Deliberation Execution State
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [deliberationLogs, setDeliberationLogs] = useState([]);
  const [deliberationProgress, setDeliberationProgress] = useState(0);
  const [finalVerdict, setFinalVerdict] = useState(null);
  const deliberationTimerRef = useRef(null);

  // Toggle Summon / Dismiss
  const toggleSummon = (memberId) => {
    playTactileClick();
    setSummonedIds(prev => {
      if (prev.includes(memberId)) {
        return prev.filter(id => id !== memberId);
      } else {
        return [...prev, memberId];
      }
    });
  };

  // Auto-Summon Supreme Panel (Top 6 World Luminaries)
  const handleAutoSummon = () => {
    playDivineChime();
    setSummonedIds(['turing', 'von-neumann', 'hinton', 'lecun', 'shannon', 'sutskever']);
  };

  // Enhance Challenge with Brahma
  const handleEnhanceChallenge = () => {
    playDivineChime();
    if (!challengePrompt.trim()) {
      setChallengePrompt('Formally prove whether a non-contrastive Joint-Embedding World Model (JEPA) bounded by Shannon entropy limits and verified with Lean 4 type theory can guarantee safe recursive self-improvement.');
    } else {
      setChallengePrompt(prev => `Formally synthesize first-principles invariants, formal tractability bounds, and Pareto-optimal trade-offs for: "${prev}"`);
    }
  };

  // Initiate Grandmaster Council Deliberation
  const handleInitiateCouncil = () => {
    if (summonedIds.length === 0) {
      alert('Please summon at least 1 Grandmaster mind to enter the council chamber.');
      return;
    }
    const topic = challengePrompt.trim() || 'Can autonomous AI achieve reliable AGI through formal mathematical invariants?';

    playDivineChime();
    setIsDeliberating(true);
    setDeliberationLogs([]);
    setDeliberationProgress(0);
    setFinalVerdict(null);

    const activeMembers = GRANDMASTER_BOARD.filter(m => summonedIds.includes(m.id));
    const roundsCount = selectedRounds;
    let currentRound = 1;
    let memberIdx = 0;

    if (deliberationTimerRef.current) clearInterval(deliberationTimerRef.current);

    deliberationTimerRef.current = setInterval(() => {
      if (currentRound <= roundsCount) {
        const speaker = activeMembers[memberIdx % activeMembers.length];
        const logEntry = {
          round: currentRound,
          speaker: speaker.name,
          title: speaker.title,
          avatar: speaker.avatar,
          member: speaker,
          speech: generateSpeechForGrandmaster(speaker, topic, currentRound),
          timestamp: new Date().toLocaleTimeString()
        };

        setDeliberationLogs(prev => [...prev, logEntry]);
        setDeliberationProgress(Math.round((currentRound / roundsCount) * 100));
        playTactileClick();

        memberIdx++;
        currentRound++;
      } else {
        clearInterval(deliberationTimerRef.current);
        const verdictText = `✦ SUPREME ADVISORY DOCTRINE VERDICT:\nSynthesized across ${activeMembers.length} Grandmasters (${selectedReasoningMode.toUpperCase()} mode):\n\n1. Invariant Bound: Strict formal Lean 4 verification precedes non-blocking distributed execution.\n2. Latent World Model: Continuous JEPA state-prediction replaces auto-regressive next-token hallucinations.\n3. Shannon Optimal: Bounded communication entropy with zero-copy ring-buffer telemetry.\n\nApproved unanimously by the Supreme Grandmaster Advisory Board.`;
        setFinalVerdict(verdictText);
        playDivineChime();
      }
    }, 2200);
  };

  const generateSpeechForGrandmaster = (member, topic, round) => {
    const cleanTopic = topic.length > 60 ? topic.slice(0, 57) + '...' : topic;
    
    if (round === 1) {
      return `As ${member.name}, dissecting "${cleanTopic}" from first principles: ${member.engineeringPrinciple} Our opening doctrine mandates adherence to ${member.doctrine}.`;
    } else if (round === 2) {
      return `Counter-probing the hypothesis on "${cleanTopic}": Under extreme out-of-distribution shifts, empirical heuristics collapse without rigorous ${member.specialty}. We must enforce invariant correctness.`;
    } else if (round === 3) {
      return `Dialectic refinement: Combining mathematical computability with accelerated silicon allows us to eliminate unbounded uncertainty while guaranteeing asymptotic safety for "${cleanTopic}".`;
    } else if (round === 4) {
      return `Cross-examination: Analyzing memory bus bandwidth, latent energy surfaces, and state quorum replication. No architecture survives without bounded communication entropy.`;
    } else {
      return `Consensus reached on "${cleanTopic}": The architecture is formally sound when grounded in deterministic memory busses and self-supervised latent energy representations.`;
    }
  };

  const handleInjectIntoChat = () => {
    playDivineChime();
    const promptText = `Adopt the Supreme Grandmaster Advisory Board Verdict on "${challengePrompt || 'Autonomous AGI Invariants'}":\n\n${finalVerdict}\n\nSummoned Panel: ${summonedIds.map(id => GRANDMASTER_BOARD.find(m => m.id === id)?.name).join(', ')}`;
    if (onSendPrompt) onSendPrompt(promptText);
    if (setActivePage) setActivePage('chat');
  };

  useEffect(() => {
    return () => {
      if (deliberationTimerRef.current) clearInterval(deliberationTimerRef.current);
    };
  }, []);

  // 13 Council wheel mini dots
  const councilColors = [
    '#f59e0b', '#38bdf8', '#ec4899', '#10b981', '#a855f7',
    '#f97316', '#6366f1', '#14b8a6', '#eab308', '#06b6d4',
    '#d946ef', '#84cc16', '#fb7185'
  ];

  return (
    <div className="view-container" style={{
      padding: '12px 16px 50px',
      maxWidth: '1380px',
      width: '100%',
      margin: '0 auto',
      boxSizing: 'border-box',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-sans)',
      overflowX: 'hidden'
    }}>
      
      {/* ─── 1. SUPREME HEADER BANNER ────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 16px',
        border: '1px solid var(--bg-glass-border)',
        background: 'radial-gradient(ellipse at top, var(--bg-dark-card), var(--bg-dark-surface))',
        borderRadius: '14px',
        marginBottom: '12px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 6px 24px rgba(0, 0, 0, 0.4)',
        boxSizing: 'border-box',
        width: '100%'
      }}>
        {/* Left Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent-gold) 0%, var(--identity-accent) 70%, #000 100%)',
            boxShadow: '0 0 14px var(--accent-gold-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.15rem',
            flexShrink: 0
          }}>
            ⚛️
          </div>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.95rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '0.12em',
              lineHeight: 1.1
            }}>
              BRAHMA
            </div>
            <div style={{ fontSize: '0.64rem', color: 'var(--accent-gold)', fontWeight: 700, letterSpacing: '0.04em' }}>
              Think Deeper. Go Further.
            </div>
          </div>
        </div>

        {/* Center Title */}
        <div style={{ textAlign: 'center', padding: '0 10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem' }}>✦</span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              fontWeight: 900,
              color: 'var(--text-primary)',
              letterSpacing: '0.12em'
            }}>
              BRAHMA
            </span>
            <span style={{ color: 'var(--accent-gold)', fontSize: '0.8rem' }}>✦</span>
          </div>
          <div style={{
            fontSize: '0.78rem',
            fontWeight: 800,
            color: 'var(--accent-gold)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase'
          }}>
            SUPREME GRANDMASTER ADVISORY BOARD
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '1px', opacity: 0.9 }}>
            17 World Luminaries · Top 0.1% Standards · First-principles reasoning. Competing intelligence. Evidence over authority.
          </div>
        </div>

        {/* Right Status */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          padding: '5px 12px',
          borderRadius: '20px',
          flexShrink: 0
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.64rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '0.04em' }}>INTELLIGENCE ARCHITECTURE</span>
            <span style={{ fontSize: '0.58rem', color: '#34d399', fontWeight: 700 }}>● ONLINE (17 LUMINARIES READY)</span>
          </div>
        </div>
      </div>

      {/* ─── 2. THREE-COLUMN MAIN STAGE (PRECISION RESPONSIVE GRID) ──────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(230px, 270px) minmax(320px, 1fr) minmax(235px, 275px)',
        gap: '12px',
        marginBottom: '12px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* ── COLUMN 1: GRANDMASTERS ROSTER ── */}
        <div style={{
          background: 'var(--bg-dark-card)',
          border: '1px solid var(--bg-glass-border)',
          borderRadius: '14px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(16px)',
          minWidth: 0,
          boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid var(--bg-glass-border)', paddingBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Award size={16} color="var(--accent-gold)" />
              <span style={{ fontWeight: 800, fontSize: '0.80rem', color: 'var(--text-primary)', letterSpacing: '0.06em' }}>
                GRANDMASTERS
              </span>
            </div>
            <span style={{ fontSize: '0.62rem', color: 'var(--accent-gold)', background: 'var(--accent-gold-glow)', padding: '2px 6px', borderRadius: '8px', fontWeight: 700 }}>
              17 WORLD LUMINARIES
            </span>
          </div>

          {/* Luminaries Card List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            maxHeight: '340px',
            overflowY: 'auto',
            paddingRight: '3px'
          }}>
            {GRANDMASTER_BOARD.map(member => {
              const isSummoned = summonedIds.includes(member.id);
              return (
                <div
                  key={member.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    background: isSummoned ? 'radial-gradient(circle at left, var(--accent-gold-glow), rgba(0,0,0,0.3))' : 'rgba(255, 255, 255, 0.02)',
                    border: isSummoned ? '1px solid var(--accent-gold)' : '1px solid var(--bg-glass-border)',
                    transition: 'all 0.2s ease',
                    boxShadow: isSummoned ? '0 0 10px var(--accent-gold-glow)' : 'none',
                    boxSizing: 'border-box',
                    gap: '6px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                    <LuminaryAvatar member={member} size={30} isSummoned={isSummoned} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: 800, color: isSummoned ? 'var(--accent-gold)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {member.name}
                      </div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>{member.country}</span>
                      </div>
                      <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {member.specialty.split(',')[0]}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleSummon(member.id)}
                    style={{
                      background: isSummoned ? 'linear-gradient(135deg, var(--accent-gold), var(--identity-accent))' : 'rgba(255, 255, 255, 0.06)',
                      color: isSummoned ? '#090d16' : 'var(--text-secondary)',
                      border: isSummoned ? 'none' : '1px solid var(--bg-glass-border)',
                      padding: '3px 7px',
                      borderRadius: '5px',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '3px',
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                      boxShadow: isSummoned ? '0 0 8px var(--accent-gold-glow)' : 'none',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    {isSummoned ? <Check size={10} /> : <UserPlus size={10} />}
                    <span>{isSummoned ? 'SUMMONED' : 'SUMMON'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── COLUMN 2: CENTER GRAND CHALLENGE ── */}
        <div style={{
          background: 'var(--bg-dark-card)',
          border: '1px solid var(--bg-glass-border)',
          borderRadius: '14px',
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), inset 0 0 24px var(--accent-gold-glow)',
          position: 'relative',
          backdropFilter: 'blur(16px)',
          minWidth: 0,
          boxSizing: 'border-box'
        }}>
          <div>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '10px' }}>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.98rem',
                fontWeight: 900,
                color: 'var(--text-primary)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                ENTER THE GRAND CHALLENGE
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-gold)', fontStyle: 'italic', marginTop: '2px' }}>
                What problem should the Grandmasters reason over?
              </div>
            </div>

            {/* Glowing Textarea Box */}
            <div style={{
              background: 'radial-gradient(ellipse at center, rgba(14, 20, 36, 0.95), var(--bg-dark-master))',
              border: '1.2px solid var(--bg-glass-border)',
              borderRadius: '10px',
              padding: '10px 12px',
              marginBottom: '8px',
              boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8), 0 0 12px var(--accent-gold-glow)',
              boxSizing: 'border-box'
            }}>
              <textarea
                placeholder="Pose your problem, question, architecture, hypothesis, or decision..."
                value={challengePrompt}
                onChange={(e) => setChallengePrompt(e.target.value.slice(0, 500))}
                rows={3}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.84rem',
                  lineHeight: '1.45',
                  resize: 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--bg-glass-border)', paddingTop: '6px', marginTop: '4px' }}>
                <button
                  onClick={handleEnhanceChallenge}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-gold)',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Sparkles size={11} /> ✦ ENHANCE WITH BRAHMA
                </button>
                <span style={{ fontSize: '0.64rem', color: 'var(--text-muted)' }}>
                  {challengePrompt.length} / 500 characters
                </span>
              </div>
            </div>

            {/* Example Challenges Grid */}
            <div>
              <div style={{ fontSize: '0.66rem', color: 'var(--accent-gold)', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '6px' }}>
                ✦ EXAMPLE CHALLENGES
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {EXAMPLE_CHALLENGES.map((ex, idx) => (
                  <button
                    key={idx}
                    onClick={() => { playTactileClick(); setChallengePrompt(ex); }}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid var(--bg-glass-border)',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      color: 'var(--text-secondary)',
                      fontSize: '0.68rem',
                      fontWeight: 600,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      minWidth: 0,
                      boxSizing: 'border-box'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-gold)'; e.currentTarget.style.color = 'var(--accent-gold)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--bg-glass-border)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
                  >
                    <span style={{ color: 'var(--accent-gold)', fontSize: '0.70rem', flexShrink: 0 }}>✦</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{ex}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── COLUMN 3: SUMMONED INTELLIGENCE & YANTRA MANDALA ── */}
        <div style={{
          background: 'var(--bg-dark-card)',
          border: '1px solid var(--bg-glass-border)',
          borderRadius: '14px',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
          textAlign: 'center',
          backdropFilter: 'blur(16px)',
          minWidth: 0,
          boxSizing: 'border-box'
        }}>
          {/* Header */}
          <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--bg-glass-border)', paddingBottom: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Sparkles size={14} color="var(--accent-gold)" />
              <span style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--text-primary)', letterSpacing: '0.04em' }}>
                SUMMONED INTEL
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--accent-gold)', fontWeight: 800, whiteSpace: 'nowrap' }}>
              {summonedIds.length} / 17 Minds
            </span>
          </div>

          {/* Central Sacred Yantra Mandala with orbiting portrait nodes */}
          <div style={{ position: 'relative', width: 130, height: 130, margin: '8px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* Outer Rotating Sacred Rings */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '1.2px dashed var(--accent-gold)',
              opacity: 0.6,
              animation: 'spin 20s linear infinite'
            }} />
            <div style={{
              position: 'absolute',
              inset: 12,
              borderRadius: '50%',
              border: '1.2px solid var(--identity-accent)',
              opacity: 0.5,
              animation: 'spin 14s linear infinite reverse'
            }} />

            {/* Glowing Core Atom */}
            <div style={{
              width: 58,
              height: 58,
              borderRadius: '50%',
              background: 'radial-gradient(circle, var(--accent-gold) 0%, var(--identity-accent) 60%, #000 100%)',
              boxShadow: '0 0 24px var(--accent-gold-glow)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#000',
              fontWeight: 900,
              fontSize: '1.4rem',
              zIndex: 3
            }}>
              ⚛️
            </div>

            {/* Orbiting Summoned Node Avatars */}
            {summonedIds.slice(0, 6).map((id, i) => {
              const angle = (i / Math.min(summonedIds.length, 6)) * 2 * Math.PI;
              const x = Math.cos(angle) * 50;
              const y = Math.sin(angle) * 50;
              const m = GRANDMASTER_BOARD.find(item => item.id === id);
              return (
                <div
                  key={id}
                  title={m?.name}
                  style={{
                    position: 'absolute',
                    transform: `translate(${x}px, ${y}px)`,
                    zIndex: 4
                  }}
                >
                  <LuminaryAvatar member={m} size={24} isSummoned={true} />
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: '0.66rem', color: 'var(--text-secondary)', marginBottom: '8px', lineHeight: 1.2 }}>
            {summonedIds.length === 0
              ? 'No Grandmasters summoned · Select minds.'
              : `${summonedIds.length} Grandmasters in matrix.`}
          </div>

          {/* Auto-Summon Button */}
          <button
            onClick={handleAutoSummon}
            style={{
              width: '100%',
              background: 'radial-gradient(circle, var(--accent-gold-glow) 0%, rgba(0,0,0,0.4) 100%)',
              border: '1px solid var(--accent-gold)',
              borderRadius: '6px',
              padding: '7px 10px',
              color: 'var(--accent-gold)',
              fontSize: '0.70rem',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              boxShadow: '0 0 12px var(--accent-gold-glow)',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
              boxSizing: 'border-box'
            }}
          >
            <Atom size={12} /> AUTO-SUMMON SUPREME PANEL
          </button>
        </div>
      </div>

      {/* ─── 3. BOTTOM 5-PILLAR CONTROL MATRIX ───────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
        gap: '10px',
        marginBottom: '14px',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        
        {/* PILLAR 1: BRAHMA PROTOCOL */}
        <div style={{ background: 'var(--bg-dark-card)', border: '1px solid var(--bg-glass-border)', borderRadius: '10px', padding: '10px', backdropFilter: 'blur(12px)', minWidth: 0, boxSizing: 'border-box' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.04em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Shield size={12} /> BRAHMA PROTOCOL
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
            <div>✦ FIRST-PRINCIPLES</div>
            <div>✦ EVIDENCE-DRIVEN</div>
            <div>✦ MULTI-AGENT</div>
            <div>✦ FORMAL TRACE</div>
          </div>
        </div>

        {/* PILLAR 2: REASONING MODE */}
        <div style={{ background: 'var(--bg-dark-card)', border: '1px solid var(--bg-glass-border)', borderRadius: '10px', padding: '10px', backdropFilter: 'blur(12px)', minWidth: 0, boxSizing: 'border-box' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.04em', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Sliders size={12} /> REASONING MODE
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {REASONING_MODES.map(mode => (
              <label
                key={mode.id}
                onClick={() => { playTactileClick(); setSelectedReasoningMode(mode.id); }}
                style={{
                  fontSize: '0.62rem',
                  color: selectedReasoningMode === mode.id ? 'var(--accent-gold)' : 'var(--text-secondary)',
                  fontWeight: selectedReasoningMode === mode.id ? 800 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                <span style={{ color: selectedReasoningMode === mode.id ? 'var(--accent-gold)' : 'var(--text-muted)' }}>
                  {selectedReasoningMode === mode.id ? '◉' : '○'}
                </span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{mode.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* PILLAR 3: INTELLIGENCE COUNCILS */}
        <div style={{
          background: 'var(--bg-dark-card)',
          border: '1px solid var(--bg-glass-border)',
          borderRadius: '10px',
          padding: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          backdropFilter: 'blur(12px)',
          minWidth: 0,
          boxSizing: 'border-box'
        }}>
          {/* Mini Council Mandala Wheel */}
          <div style={{ position: 'relative', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--accent-gold)', boxShadow: '0 0 8px var(--accent-gold-glow)' }} />
            {councilColors.map((color, i) => {
              const angle = (i / councilColors.length) * 2 * Math.PI;
              const x = Math.cos(angle) * 14;
              const y = Math.sin(angle) * 14;
              return (
                <div
                  key={i}
                  style={{
                    position: 'absolute',
                    transform: `translate(${x}px, ${y}px)`,
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: color,
                    boxShadow: `0 0 3px ${color}`
                  }}
                />
              );
            })}
          </div>

          <div style={{ textAlign: 'left', minWidth: 0 }}>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1 }}>
              13
            </div>
            <div style={{ fontSize: '0.58rem', color: 'var(--accent-gold)', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px', lineHeight: 1.1 }}>
              INTELLIGENCE COUNCILS
            </div>
          </div>
        </div>

        {/* PILLAR 4: ROUNDS & VERDICT MODEL */}
        <div style={{ background: 'var(--bg-dark-card)', border: '1px solid var(--bg-glass-border)', borderRadius: '10px', padding: '10px', backdropFilter: 'blur(12px)', minWidth: 0, boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-gold)' }}>ROUNDS</span>
            <div style={{ display: 'flex', gap: '3px' }}>
              {[3, 5, 7].map(r => (
                <button
                  key={r}
                  onClick={() => { playTactileClick(); setSelectedRounds(r); }}
                  style={{
                    width: 19,
                    height: 19,
                    borderRadius: '50%',
                    background: selectedRounds === r ? 'var(--accent-gold)' : 'rgba(255,255,255,0.06)',
                    color: selectedRounds === r ? '#000' : 'var(--text-primary)',
                    border: 'none',
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
          <div style={{ fontSize: '0.60rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div>✓ Evidence</div>
            <div>✓ Logic Check</div>
            <div>✓ Depth</div>
            <div>✓ Novelty</div>
            <div>✓ Impact</div>
          </div>
        </div>

        {/* PILLAR 5: LIVE TRANSPARENCY */}
        <div style={{ background: 'var(--bg-dark-card)', border: '1px solid var(--bg-glass-border)', borderRadius: '10px', padding: '10px', backdropFilter: 'blur(12px)', minWidth: 0, boxSizing: 'border-box' }}>
          <div style={{ fontSize: '0.68rem', fontWeight: 800, color: 'var(--accent-gold)', letterSpacing: '0.04em', marginBottom: '5px', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <Activity size={12} /> LIVE TRANSPARENCY
          </div>
          <div style={{ fontSize: '0.60rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div>• Every argument</div>
            <div>• Every challenge</div>
            <div>• Counterarguments</div>
            <div>• Formal verdict</div>
            <div style={{ fontSize: '0.56rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '1px' }}>traceable trace.</div>
          </div>
        </div>
      </div>

      {/* ─── 4. MASTER ACTION INITIATION BUTTON ─────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '14px' }}>
        <button
          onClick={handleInitiateCouncil}
          disabled={isDeliberating && !finalVerdict}
          style={{
            background: 'linear-gradient(135deg, var(--identity-accent) 0%, var(--accent-gold) 50%, var(--identity-accent) 100%)',
            color: '#090d16',
            border: 'none',
            borderRadius: '10px',
            padding: '12px 34px',
            fontSize: '0.88rem',
            fontWeight: 900,
            letterSpacing: '0.08em',
            cursor: 'pointer',
            boxShadow: '0 0 30px var(--accent-gold-glow), 0 4px 18px rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textTransform: 'uppercase',
            transition: 'all 0.2s ease',
            opacity: isDeliberating && !finalVerdict ? 0.8 : 1
          }}
        >
          <Sparkles size={16} />
          <span>{isDeliberating && !finalVerdict ? `DELIBERATING (${deliberationProgress}%)...` : '✦ INITIATE GRANDMASTER COUNCIL ✦'}</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ─── 5. LIVE DELIBERATION STREAMING STAGE ───────────────────────────── */}
      {isDeliberating && (
        <div style={{
          background: 'var(--bg-dark-card)',
          border: '1.5px solid var(--accent-gold)',
          borderRadius: '14px',
          padding: '16px',
          boxShadow: '0 16px 50px rgba(0,0,0,0.9), 0 0 25px var(--accent-gold-glow)',
          marginTop: '12px',
          backdropFilter: 'blur(20px)',
          boxSizing: 'border-box',
          width: '100%'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--bg-glass-border)', paddingBottom: '8px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Swords size={16} color="var(--identity-accent)" />
              <span style={{ fontSize: '0.84rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                LIVE GRANDMASTER COUNCIL DELIBERATION
              </span>
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--accent-gold)', fontWeight: 700 }}>
              {deliberationLogs.length} / {selectedRounds} Rounds Completed
            </span>
          </div>

          {/* Logs Stream */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto', marginBottom: '10px' }}>
            {deliberationLogs.map((log, i) => (
              <div
                key={i}
                style={{
                  background: 'var(--bg-dark-surface)',
                  border: '1px solid var(--bg-glass-border)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  animation: 'fadeIn 0.3s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <LuminaryAvatar member={log.member} size={24} isSummoned={true} />
                    <span style={{ fontWeight: 800, fontSize: '0.78rem', color: 'var(--accent-gold)' }}>{log.speaker}</span>
                    <span style={{ fontSize: '0.64rem', color: 'var(--text-secondary)' }}>({log.title})</span>
                  </div>
                  <span style={{ fontSize: '0.60rem', color: 'var(--text-muted)' }}>Round {log.round} · {log.timestamp}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--text-primary)', lineHeight: 1.45, fontStyle: 'italic' }}>
                  "{log.speech}"
                </p>
              </div>
            ))}
          </div>

          {/* Final Verdict Banner */}
          {finalVerdict && (
            <div style={{
              background: 'radial-gradient(circle at top, var(--accent-gold-glow), var(--bg-dark-surface))',
              border: '1.5px solid var(--accent-gold)',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 900, color: 'var(--accent-gold)', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Trophy size={16} /> SUPREME ADVISORY DOCTRINE VERDICT
                </div>
                <button
                  onClick={handleInjectIntoChat}
                  style={{
                    background: 'linear-gradient(135deg, var(--accent-gold), var(--identity-accent))',
                    color: '#090d16',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 14px',
                    fontWeight: 800,
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    boxShadow: '0 0 12px var(--accent-gold-glow)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}
                >
                  <Sparkles size={12} /> Adopt Verdict into Swarm Chat
                </button>
              </div>
              <pre style={{ margin: 0, fontSize: '0.74rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap', fontFamily: 'inherit', lineHeight: 1.45 }}>
                {finalVerdict}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* ─── 6. FOOTER CITATION ────────────────────────────────────────────── */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.62rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid var(--bg-glass-border)',
        paddingTop: '8px'
      }}>
        <span>BRAHMA // SUPREME GRANDMASTER ADVISORY BOARD</span>
        <span>REASON ✦ ANALYZE ✦ EVOLVE ⚛️</span>
      </div>
    </div>
  );
}
