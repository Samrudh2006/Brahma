import React, { useState, useEffect } from 'react';
import {
  Cloud, Server, Cpu, HardDrive, Play, RefreshCw, CheckCircle2,
  AlertTriangle, Copy, Check, Terminal, ExternalLink, Zap,
  Layers, Clock, Shield, Sparkles, Download, ArrowRight, Laptop
} from 'lucide-react';
import { API_BASE } from '../api/client';

export default function CloudComputerView() {
  const [cloudTelemetry, setCloudTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dispatching, setDispatching] = useState(false);
  const [customCommand, setCustomCommand] = useState('node -e "console.log(\'Brahma Cloud Computer Active:\', new Date().toISOString())"');
  const [taskName, setTaskName] = useState('Autonomous Background Job');
  const [selectedTaskType, setSelectedTaskType] = useState('INVARIANT_TESTS');
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeGuideTab, setActiveGuideTab] = useState('hf'); // 'hf', 'github', 'termux'

  useEffect(() => {
    fetchCloudStatus();
    fetchTasks();
    const interval = setInterval(() => {
      fetchCloudStatus();
      fetchTasks();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const fetchCloudStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/cloud/status`);
      if (res.ok) {
        const data = await res.json();
        setCloudTelemetry(data);
      }
    } catch (e) {
      console.warn('Failed to fetch cloud telemetry:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API_BASE}/cloud/tasks`);
      if (res.ok) {
        const data = await res.json();
        setTasks(data.tasks || []);
        if (data.tasks?.length > 0 && !selectedTask) {
          setSelectedTask(data.tasks[0]);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch tasks:', e);
    }
  };

  const handleDispatchTask = async () => {
    setDispatching(true);
    try {
      const res = await fetch(`${API_BASE}/cloud/tasks/dispatch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: taskName,
          type: selectedTaskType,
          command: selectedTaskType === 'CUSTOM_SHELL' ? customCommand : undefined
        })
      });
      const data = await res.json();
      if (data.success && data.task) {
        setSelectedTask(data.task);
        fetchTasks();
      }
    } catch (err) {
      console.error('Task dispatch failed:', err);
    } finally {
      setDispatching(false);
    }
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const platform = cloudTelemetry?.platform || { platform: 'Detecting...', tier: 'Standard', isCloud: false };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, color: '#e2e8f0' }}>
      {/* Top Banner: Status & 24/7 Promise */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.35)',
        borderRadius: 16,
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            background: platform.isCloud ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
            border: `1px solid ${platform.isCloud ? '#10b981' : '#3b82f6'}`,
            borderRadius: 14,
            padding: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Cloud size={28} color={platform.isCloud ? '#10b981' : '#60a5fa'} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 900, color: '#f8fafc' }}>
                Antariksha Sovereign 24/7 Cloud Computer
              </h2>
              <span style={{
                background: platform.isCloud ? 'rgba(16, 185, 129, 0.25)' : 'rgba(245, 158, 11, 0.25)',
                color: platform.isCloud ? '#34d399' : '#fbbf24',
                border: `1px solid ${platform.isCloud ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.5)'}`,
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: 20
              }}>
                {platform.isCloud ? '🟢 CLOUD RUNNER ACTIVE (24/7 ONLINE)' : '🟡 LOCAL BASTION (CLOSED WHEN OFF)'}
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
              Current Node: <strong style={{ color: '#e2e8f0' }}>{platform.platform}</strong> · {platform.tier} · Uptime: <strong style={{ color: '#38bdf8' }}>{Math.floor((cloudTelemetry?.uptimeSeconds || 0) / 60)} mins</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => { fetchCloudStatus(); fetchTasks(); }}
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fbbf24',
            padding: '8px 16px',
            borderRadius: 8,
            cursor: 'pointer',
            fontSize: '0.82rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}
        >
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Sync Telemetry
        </button>
      </div>

      {/* 3 Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {/* CPU & Arch */}
        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Cpu size={14} color="#38bdf8" /> Virtual CPU Cores
            </span>
            <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700 }}>{cloudTelemetry?.architecture || 'x64'}</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f8fafc' }}>
            {cloudTelemetry?.cpu?.cores || 2} Cores
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4 }}>
            {cloudTelemetry?.cpu?.model || 'Cloud vCPU Core'}
          </div>
        </div>

        {/* Cloud RAM */}
        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <HardDrive size={14} color="#a855f7" /> Memory Allocation
            </span>
            <span style={{ fontSize: '0.72rem', color: '#a855f7', fontWeight: 700 }}>{cloudTelemetry?.memory?.usagePercent || 0}% Used</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f8fafc' }}>
            {cloudTelemetry?.memory?.usedMb || 0} MB <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ {cloudTelemetry?.memory?.totalMb || 0} MB</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4 }}>
            Process Heap: {cloudTelemetry?.processMemory?.heapUsedMb || 0} MB RSS
          </div>
        </div>

        {/* Detached Background Tasks */}
        <div style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Zap size={14} color="#10b981" /> Detached Cloud Tasks
            </span>
            <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>Autonomous</span>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 900, color: '#f8fafc' }}>
            {tasks.length} Executed
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: 4 }}>
            Active Background Queue: {cloudTelemetry?.activeTasksCount || 0} Running
          </div>
        </div>
      </div>

      {/* 2-Column: Left (Dispatch Cloud Jobs), Right (Task Output Terminal) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: 20 }}>
        {/* Left: Dispatch Cloud Tasks */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14,
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Play size={18} color="#fbbf24" />
            <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800, color: '#f8fafc' }}>
              Dispatch Autonomous Cloud Task
            </h3>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', margin: 0 }}>
            Run full test suites, builds, or scripts asynchronously in the cloud. It continues executing even after you close your laptop.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                Task Name
              </label>
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                style={{
                  width: '100%',
                  background: '#040711',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  color: '#fff',
                  fontSize: '0.82rem'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                Task Preset
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { id: 'INVARIANT_TESTS', label: '🧪 184 Invariant Tests', desc: 'Runs full test suite' },
                  { id: 'PROJECT_BUILD', label: '🏗️ Vite Build Check', desc: 'Builds production dist' },
                  { id: 'RESEARCH_DIGEST', label: '📡 Research Digest', desc: 'Collects arxiv & papers' },
                  { id: 'CUSTOM_SHELL', label: '💻 Custom Command', desc: 'Execute custom command' }
                ].map((preset) => {
                  const isSel = selectedTaskType === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedTaskType(preset.id)}
                      style={{
                        background: isSel ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255,255,255,0.03)',
                        border: `1px solid ${isSel ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 8,
                        padding: '10px 12px',
                        textAlign: 'left',
                        cursor: 'pointer',
                        color: isSel ? '#93c5fd' : '#cbd5e1'
                      }}
                    >
                      <div style={{ fontSize: '0.8rem', fontWeight: 800 }}>{preset.label}</div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>{preset.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {selectedTaskType === 'CUSTOM_SHELL' && (
              <div>
                <label style={{ fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700, display: 'block', marginBottom: 4 }}>
                  Shell Command
                </label>
                <input
                  type="text"
                  value={customCommand}
                  onChange={(e) => setCustomCommand(e.target.value)}
                  style={{
                    width: '100%',
                    background: '#040711',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 8,
                    padding: '8px 12px',
                    color: '#34d399',
                    fontFamily: 'monospace',
                    fontSize: '0.82rem'
                  }}
                />
              </div>
            )}

            <button
              onClick={handleDispatchTask}
              disabled={dispatching}
              style={{
                background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '12px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
              }}
            >
              {dispatching ? <RefreshCw className="spin" size={16} /> : <Play size={16} />}
              Launch Detached Cloud Execution
            </button>
          </div>
        </div>

        {/* Right: Task Logs Terminal & History */}
        <div style={{
          background: '#030712',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14,
          padding: 16,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Terminal size={16} color="#34d399" />
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc' }}>
                Cloud Execution Terminal: {selectedTask?.name || 'No Task Selected'}
              </span>
            </div>
            {selectedTask && (
              <span style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: 6,
                background: selectedTask.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.2)' : selectedTask.status === 'RUNNING' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                color: selectedTask.status === 'COMPLETED' ? '#34d399' : selectedTask.status === 'RUNNING' ? '#60a5fa' : '#f87171'
              }}>
                {selectedTask.status} {selectedTask.exitCode !== null ? `(Exit: ${selectedTask.exitCode})` : ''}
              </span>
            )}
          </div>

          <div style={{
            flex: 1,
            minHeight: 240,
            maxHeight: 280,
            overflowY: 'auto',
            background: '#010409',
            padding: 12,
            borderRadius: 8,
            fontFamily: 'Consolas, monospace',
            fontSize: '0.74rem',
            color: '#cbd5e1',
            lineHeight: 1.5
          }}>
            {selectedTask?.outputLogs?.length > 0 ? (
              selectedTask.outputLogs.map((log, idx) => (
                <div key={idx} style={{ color: log.type === 'STDERR' ? '#f87171' : '#34d399', whiteSpace: 'pre-wrap' }}>
                  {log.text}
                </div>
              ))
            ) : (
              <div style={{ color: '#64748b', textAlign: 'center', marginTop: 80 }}>
                No active stdout/stderr logs. Dispatch a task on the left or select a previous job below.
              </div>
            )}
          </div>

          {/* Quick Tasks Pill Row */}
          {tasks.length > 0 && (
            <div style={{ marginTop: 12, display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {tasks.slice(0, 6).map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  style={{
                    background: selectedTask?.id === t.id ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${selectedTask?.id === t.id ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 6,
                    padding: '4px 8px',
                    fontSize: '0.7rem',
                    color: selectedTask?.id === t.id ? '#93c5fd' : '#94a3b8',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t.name} ({t.status})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 100% Free 24/7 Cloud Setup Guides (Hugging Face, GitHub Actions, Termux) */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 14,
        padding: 22
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={18} color="#fbbf24" /> 1-Click Free 24/7 Cloud Deployment Guides
            </h3>
            <p style={{ margin: '4px 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>
              Host Brahma permanently for ₹0 so it runs 24/7 without needing your laptop powered on.
            </p>
          </div>

          {/* Guide Selector Tabs */}
          <div style={{ display: 'flex', gap: 6, background: 'rgba(0,0,0,0.3)', padding: 4, borderRadius: 8 }}>
            {[
              { id: 'hf', label: '🤗 Hugging Face Spaces (16GB RAM Free)' },
              { id: 'github', label: '🐙 GitHub Actions 24/7 Worker' },
              { id: 'termux', label: '📱 Spare Android Phone (Zero Watt)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveGuideTab(tab.id)}
                style={{
                  background: activeGuideTab === tab.id ? '#3b82f6' : 'transparent',
                  color: activeGuideTab === tab.id ? '#fff' : '#94a3b8',
                  border: 'none',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Guide Content */}
        {activeGuideTab === 'hf' && (
          <div style={{ background: '#040711', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#fbbf24' }}>
                Option 1: Deploy to Hugging Face Spaces (2 vCPU / 16 GB RAM / 50 GB Storage / Always-On)
              </div>
              <a
                href="https://huggingface.co/new-space"
                target="_blank"
                rel="noreferrer"
                style={{
                  background: 'rgba(251, 191, 36, 0.15)',
                  color: '#fbbf24',
                  border: '1px solid rgba(251, 191, 36, 0.3)',
                  borderRadius: 6,
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                Open Hugging Face New Space <ExternalLink size={12} />
              </a>
            </div>
            <ol style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
              <li>Create a new Space on Hugging Face (e.g. <code style={{ color: '#38bdf8' }}>brahma-cloud-computer</code>).</li>
              <li>Select <strong>Docker</strong> as the Space SDK and pick the <strong>Free 2 vCPU · 16 GB RAM</strong> hardware tier.</li>
              <li>Push this repository to the Hugging Face Space git URL:
                <pre style={{ background: '#02040a', padding: 8, borderRadius: 6, color: '#34d399', margin: '6px 0', fontSize: '0.72rem' }}>
git remote add space https://huggingface.co/spaces/YOUR_USERNAME/brahma-cloud-computer
git push space master:main
                </pre>
              </li>
              <li>Brahma will build and run on port 7860 with a permanent free HTTPS URL accessible from your phone 24/7!</li>
            </ol>
          </div>
        )}

        {activeGuideTab === 'github' && (
          <div style={{ background: '#040711', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#34d399', marginBottom: 10 }}>
              Option 2: GitHub Actions 24/7 Autonomous Cron Runner (Configured & Ready in Repo)
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>
              We have added <code style={{ color: '#38bdf8' }}>.github/workflows/brahma-cloud-runner.yml</code>. It runs in the cloud every 6 hours automatically or upon manual 1-click trigger from your GitHub repo.
            </p>
            <div style={{ marginTop: 10, display: 'flex', gap: 10 }}>
              <button
                onClick={() => copyToClipboard('.github/workflows/brahma-cloud-runner.yml', 'wf')}
                style={{
                  background: 'rgba(52, 211, 153, 0.15)',
                  border: '1px solid rgba(52, 211, 153, 0.3)',
                  color: '#34d399',
                  borderRadius: 6,
                  padding: '6px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                {copiedKey === 'wf' ? <Check size={14} /> : <Copy size={14} />}
                Copy Workflow Path
              </button>
            </div>
          </div>
        )}

        {activeGuideTab === 'termux' && (
          <div style={{ background: '#040711', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 16 }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#a855f7', marginBottom: 10 }}>
              Option 3: Run 24/7 on an Old Spare Android Phone (Zero-Watt Dedicated Cloud Node)
            </div>
            <p style={{ fontSize: '0.78rem', color: '#cbd5e1', lineHeight: 1.7, margin: '0 0 10px' }}>
              Install Termux from F-Droid on any spare Android phone, keep it plugged in on Wi-Fi, and run this one-line command:
            </p>
            <pre style={{ background: '#02040a', padding: 10, borderRadius: 6, color: '#34d399', margin: 0, fontSize: '0.72rem', overflowX: 'auto' }}>
pkg update -y && pkg install -y nodejs git && git clone https://github.com/Samrudh2006/Brahma.git && cd Brahma && npm ci --legacy-peer-deps && npm run build && node backend/server.js
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
