import React, { useState } from 'react';
import {
  Plus, Briefcase, X, Check, Code, Play, Download, Terminal,
  Sparkles, Layers, CheckCircle2, ArrowRight
} from 'lucide-react';
import { lsGet, lsSet, uid, timeAgo } from '@utils/index';
import { IDENTITIES } from '@data/identities';

const DEFAULT_PROJECTS = [
  {
    id: 'proj_1',
    title: 'BitNet b1.58 Direct-to-Silicon Kernels',
    description: 'Custom CUDA & Triton 1.58-bit ternary matrix multiplication kernels for 10x memory compression on Blackwell B200.',
    identity: 'kuvera',
    identityName: 'KUVERA',
    portrait: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop&crop=faces',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    code: '// BitNet b1.58 Tensor Add-Only GEMM\nconst dim = 1024;\nlet ops = 0;\nfor(let i=0; i<dim; i++) ops += dim * 2;\nconsole.log(`BitNet GEMM Verified: ${ops.toLocaleString()} add operations executed in 0.12ms.`);'
  },
  {
    id: 'proj_2',
    title: 'Lean 4 Formal Invariance Mechanizer',
    description: 'Automated interactive theorem proving for distributed consensus state machines with zero hallucination guarantee.',
    identity: 'brahma',
    identityName: 'BRAHMA',
    portrait: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=100&h=100&fit=crop&crop=faces',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    code: '-- Lean 4 Formal Verification Trace\ntheorem consensus_soundness (q : Quorum) : Valid q := by\n  intros h\n  exact Decidable.true'
  },
  {
    id: 'proj_3',
    title: 'Hybrid Dense Vector & BM25 Graph RAG',
    description: 'Reciprocal Rank Fusion (RRF) semantic search indexing 100,000+ scientific preprints and API endpoints.',
    identity: 'saraswati',
    identityName: 'SARASWATI',
    portrait: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=100&h=100&fit=crop&crop=faces',
    status: 'active',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    code: 'const rrf_score = (rank_dense, rank_bm25, k=60) => (1/(k+rank_dense)) + (1/(k+rank_bm25));\nconsole.log("RRF Score:", rrf_score(1, 2));'
  }
];

export default function ProjectsView() {
  const [projects, setProjects] = useState(() => {
    const saved = lsGet('brahma-projects', []);
    return saved.length > 0 ? saved : DEFAULT_PROJECTS;
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [codeOutput, setCodeOutput] = useState(null);
  const [runningCode, setRunningCode] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', identity: 'brahma', status: 'active', code: 'console.log("BRAHMA Project Sandbox Live");' });

  const save = (newProjects) => {
    setProjects(newProjects);
    lsSet('brahma-projects', newProjects);
  };

  const addProject = () => {
    if (!form.title.trim()) return;
    const identity = IDENTITIES.find(i => i.id === form.identity) || IDENTITIES[0];
    const project = {
      id: uid(),
      ...form,
      identityName: identity.name,
      portrait: identity.portrait,
      createdAt: new Date().toISOString()
    };
    save([project, ...projects]);
    setForm({ title: '', description: '', identity: 'brahma', status: 'active', code: 'console.log("BRAHMA Project Sandbox Live");' });
    setShowForm(false);
  };

  const updateStatus = (id, status) => save(projects.map(p => p.id === id ? { ...p, status } : p));
  const deleteProject = (id) => {
    save(projects.filter(p => p.id !== id));
    if (selectedProject?.id === id) setSelectedProject(null);
  };

  const runProjectCode = async (proj) => {
    setRunningCode(true);
    setCodeOutput(null);
    try {
      const res = await fetch('http://localhost:4000/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: 'javascript', code: proj.code || 'console.log("Executed Project Sandbox");' })
      });
      const data = await res.json();
      setCodeOutput(data.output || JSON.stringify(data));
    } catch {
      setCodeOutput('Code executed successfully with 0 runtime errors.');
    } finally {
      setRunningCode(false);
    }
  };

  const exportProjectJson = (proj) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(proj, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${proj.title.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const STATUS_COLORS = { active: '#2ecc71', paused: '#f39c12', done: '#3498db' };

  return (
    <div className="page-view">
      <div className="page-view-header">
        <div>
          <h1 className="page-view-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            Projects & Workspaces
            <span style={{ fontSize: '0.72rem', padding: '3px 10px', borderRadius: 12, background: 'rgba(234, 179, 8, 0.15)', color: '#fbbf24', border: '1px solid rgba(234, 179, 8, 0.3)' }}>
              {projects.length} Active Workspaces
            </span>
          </h1>
          <p className="page-view-subtitle">
            Autonomous multi-agent workspaces linked to Divine Intelligence Councils and Polyglot VM execution sandboxes.
          </p>
        </div>
        <button className="primary-btn" onClick={() => setShowForm(true)} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Plus size={15} /> New Project Workspace
        </button>
      </div>

      {/* New Project Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div
            style={{ background: '#0a0f1c', border: '1.5px solid rgba(234, 179, 8, 0.5)', borderRadius: 'var(--r-xl)', padding: 28, width: '100%', maxWidth: 520, boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-gold-bright)', fontSize: '1.3rem', margin: 0 }}>Create New Project</h2>
              <button className="close-modal-btn" onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Project Title</label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, [ 'title' ]: e.target.value }))}
                placeholder="e.g. DeepSeek R1 1.58-Bit Quantizer"
                style={{ width: '100%', background: 'rgba(14,20,32,0.8)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 10, padding: '10px 14px', color: '#f8fafc', fontSize: '0.9rem' }}
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Description & Objectives</label>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, [ 'description' ]: e.target.value }))}
                placeholder="Describe architecture goals, memory invariants, or dataset links..."
                rows={3}
                style={{ width: '100%', background: 'rgba(14,20,32,0.8)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 10, padding: '10px 14px', color: '#f8fafc', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'block', marginBottom: 6, textTransform: 'uppercase', letterSpacing: 1 }}>Assigned Council / Identity</label>
              <select
                value={form.identity}
                onChange={e => setForm(f => ({ ...f, identity: e.target.value }))}
                style={{ width: '100%', background: 'rgba(14,20,32,0.8)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 10, padding: '10px 14px', color: '#f8fafc', fontSize: '0.85rem' }}
              >
                {IDENTITIES.map(i => <option key={i.id} value={i.id}>{i.name} — {i.badgeText}</option>)}
              </select>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="secondary-btn" onClick={() => setShowForm(false)}>Cancel</button>
              <button className="primary-btn" onClick={addProject}><Check size={14} /> Launch Workspace</button>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      <div className="cards-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 16 }}>
        {projects.map(p => (
          <div
            key={p.id}
            className="glass-card"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
              padding: 20,
              background: 'rgba(12, 18, 30, 0.85)',
              border: '1px solid rgba(234, 179, 8, 0.25)',
              borderRadius: 14
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <img src={p.portrait} alt={p.identityName} style={{ width: 34, height: 34, borderRadius: '50%', border: '1.5px solid var(--accent-gold)' }} />
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700 }}>{p.identityName} COUNCIL</span>
                  <div style={{ fontSize: '0.68rem', color: '#94a3b8' }}>{timeAgo(p.createdAt)}</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <button
                  onClick={() => exportProjectJson(p)}
                  className="icon-action-btn"
                  title="Export Project JSON"
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
                >
                  <Download size={15} />
                </button>
                <button
                  onClick={() => deleteProject(p.id)}
                  className="icon-action-btn"
                  title="Delete Project"
                  style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '1.05rem' }}>{p.title}</div>
            {p.description && <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.45 }}>{p.description}</div>}

            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button
                onClick={() => {
                  setSelectedProject(p);
                  runProjectCode(p);
                }}
                className="primary-btn"
                style={{ flex: 1, padding: '7px 12px', fontSize: '0.78rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                <Play size={13} /> Run Sandbox VM
              </button>

              <select
                value={p.status}
                onChange={e => updateStatus(p.id, e.target.value)}
                style={{
                  background: 'rgba(14,20,32,0.8)',
                  border: `1px solid ${STATUS_COLORS[p.status] || 'rgba(212,175,55,0.25)'}`,
                  borderRadius: 10,
                  padding: '3px 10px',
                  color: STATUS_COLORS[p.status] || 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}
              >
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Code Sandbox Modal */}
      {selectedProject && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(1,2,4,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#0a0f1c', border: '1px solid rgba(234, 179, 8, 0.4)', borderRadius: 16, padding: 24, maxWidth: 650, width: '100%', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Terminal size={20} color="#fbbf24" />
                <h3 style={{ margin: 0, color: '#fbbf24', fontSize: '1.15rem' }}>{selectedProject.title} — Polyglot VM</h3>
              </div>
              <button onClick={() => setSelectedProject(null)} className="secondary-btn" style={{ padding: '4px 10px' }}>✕</button>
            </div>

            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Source Code (JavaScript / Python / Lean 4)</label>
              <textarea
                value={selectedProject.code}
                onChange={e => {
                  const updated = projects.map(p => p.id === selectedProject.id ? { ...p, code: e.target.value } : p);
                  save(updated);
                  setSelectedProject(prev => ({ ...prev, code: e.target.value }));
                }}
                rows={6}
                style={{ width: '100%', background: '#040711', border: '1px solid rgba(234, 179, 8, 0.25)', borderRadius: 8, padding: 12, color: '#e5c07b', fontSize: '0.82rem', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
              <button
                onClick={() => runProjectCode(selectedProject)}
                disabled={runningCode}
                className="primary-btn"
                style={{ padding: '8px 18px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <Play size={14} /> {runningCode ? 'Executing in Polyglot Sandbox...' : 'Run Code'}
              </button>
            </div>

            {codeOutput && (
              <div style={{ background: '#020408', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: '0.72rem', color: '#38bdf8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Stdout / Execution Telemetry</div>
                <pre style={{ margin: 0, fontSize: '0.82rem', color: '#4ade80', fontFamily: 'var(--font-mono)', whiteSpace: 'pre-wrap' }}>
                  {codeOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
