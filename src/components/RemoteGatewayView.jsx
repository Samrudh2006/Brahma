import React, { useState, useEffect } from 'react';
import {
  Smartphone, Monitor, Radio, Send, Terminal, Mail,
  Shield, CheckCircle2, AlertTriangle, RefreshCw, Globe,
  Activity, Play, Lock, Key, Copy, Check, QrCode, Zap,
  Server, HardDrive, Cpu, Clock, CheckCheck, Compass, Eye,
  Calendar, Layers, Download, CheckSquare, ExternalLink, Cloud
} from 'lucide-react';
import { API_BASE } from '../api/client';
import CloudComputerView from './CloudComputerView';

export default function RemoteGatewayView() {
  const [activeTab, setActiveTab] = useState('cloud'); // 'cloud', 'browser', 'mobile'
  const [telemetry, setTelemetry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [remoteCommand, setRemoteCommand] = useState('Get-Process | Select-Object -First 5 Name, CPU');
  const [commandOutput, setCommandOutput] = useState('');
  const [executing, setExecuting] = useState(false);
  
  // Web search state
  const [searchQuery, setSearchQuery] = useState('DeepSeek R1 mathematical reasoning paper');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);

  // Email state
  const [emailTo, setEmailTo] = useState('admin@brahma.ai');
  const [emailSubject, setEmailSubject] = useState('BRAHMA Automation Completed');
  const [emailBody, setEmailBody] = useState('All 289 Swarm Agents successfully verified and synced.');
  const [emailStatus, setEmailStatus] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  // QR Code & Token Pair State
  const [tokenCopied, setTokenCopied] = useState(false);
  const mobileGatewayToken = 'BRAHMA-SECURE-MOBILE-NODE-991A';
  const mobileAccessUrl = `${API_BASE}/remote/status?auth=` + mobileGatewayToken;

  // ─── YANTRA 2.0 Autonomous Browser Swarm State ─────────────────────────────
  const [browserStatus, setBrowserStatus] = useState(null);
  const [browserRecipes, setBrowserRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [customUrl, setCustomUrl] = useState('https://news.ycombinator.com');
  const [runningBrowser, setRunningBrowser] = useState(false);
  const [browserResult, setBrowserResult] = useState(null);
  const [browserLogs, setBrowserLogs] = useState([]);
  const [activeRoutines, setActiveRoutines] = useState([]);
  const [routineInterval, setRoutineInterval] = useState(30);
  const [schedulingRoutine, setSchedulingRoutine] = useState(false);

  useEffect(() => {
    fetchTelemetry();
    fetchBrowserMeta();
    const interval = setInterval(() => {
      fetchTelemetry();
      fetchBrowserRoutines();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchTelemetry = async () => {
    try {
      const res = await fetch(`${API_BASE}/remote/status`);
      if (res.ok) {
        const data = await res.json();
        setTelemetry(data);
      }
    } catch (e) {
      console.warn('Telemetry error:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrowserMeta = async () => {
    try {
      const [statusRes, recipesRes] = await Promise.all([
        fetch(`${API_BASE}/remote/browser/status`),
        fetch(`${API_BASE}/remote/browser/recipes`)
      ]);
      if (statusRes.ok) {
        const sData = await statusRes.json();
        setBrowserStatus(sData);
      }
      if (recipesRes.ok) {
        const rData = await recipesRes.json();
        setBrowserRecipes(rData);
        if (rData.length > 0 && !selectedRecipe) {
          setSelectedRecipe(rData[0]);
        }
      }
      fetchBrowserRoutines();
    } catch (e) {
      console.warn('Browser meta fetch error:', e);
    }
  };

  const fetchBrowserRoutines = async () => {
    try {
      const res = await fetch(`${API_BASE}/remote/browser/routines`);
      if (res.ok) {
        const data = await res.json();
        setActiveRoutines(data.routines || []);
      }
    } catch (e) {
      console.warn('Routines fetch error:', e);
    }
  };

  const handleExecuteRemote = async () => {
    if (!remoteCommand.trim()) return;
    setExecuting(true);
    setCommandOutput('⚡ Transmitting command through secure IPC gateway...');
    try {
      const res = await fetch(`${API_BASE}/remote/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: remoteCommand, autoNotify: true, emailRecipient: emailTo })
      });
      const data = await res.json();
      setCommandOutput(data.output || '✓ Executed successfully with exit code: 0');
    } catch (e) {
      setCommandOutput('Error executing command: ' + e.message);
    } finally {
      setExecuting(false);
    }
  };

  const handleWebSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`${API_BASE}/remote/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery })
      });
      const data = await res.json();
      setSearchResults(data.results || []);
    } catch (e) {
      console.warn('Search error:', e);
    } finally {
      setSearching(false);
    }
  };

  const handleSendMail = async () => {
    if (!emailTo.trim() || !emailBody.trim()) return;
    setSendingEmail(true);
    try {
      const res = await fetch(`${API_BASE}/remote/notify-mail`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to: emailTo, subject: emailSubject, message: emailBody })
      });
      const data = await res.json();
      setEmailStatus(`✓ Dispatched to ${emailTo} (ID: ${data.messageId})`);
    } catch (e) {
      setEmailStatus('Failed to send: ' + e.message);
    } finally {
      setSendingEmail(false);
    }
  };

  const copyMobileToken = () => {
    navigator.clipboard.writeText(mobileAccessUrl);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  // ─── Execute Headless Browser Recipe / Custom Workflow ───────────────────────
  const handleRunBrowserWorkflow = async (recipe = null) => {
    const targetRecipe = recipe || selectedRecipe;
    let steps = [];

    if (targetRecipe) {
      steps = targetRecipe.steps;
    } else {
      steps = [
        { action: 'goto', url: customUrl },
        { action: 'wait', ms: 1500 },
        { action: 'screenshot' }
      ];
    }

    setRunningBrowser(true);
    setBrowserLogs([`🚀 Spawning Yantra 2.0 Headless Chrome Container...`, `Target: ${targetRecipe ? targetRecipe.name : customUrl}`]);
    setBrowserResult(null);

    try {
      const res = await fetch(`${API_BASE}/remote/browser/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          steps,
          options: { headless: true, viewport: { width: 1280, height: 800 } }
        })
      });
      const data = await res.json();
      setBrowserResult(data);
      if (data.logs) {
        setBrowserLogs(data.logs);
      }
    } catch (err) {
      setBrowserLogs(prev => [...prev, `❌ Error: ${err.message}`]);
    } finally {
      setRunningBrowser(false);
    }
  };

  // ─── Schedule 24/7 Routine ───────────────────────────────────────────────────
  const handleScheduleRoutine = async () => {
    if (!selectedRecipe) return;
    setSchedulingRoutine(true);
    try {
      const res = await fetch(`${API_BASE}/remote/browser/schedule`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeId: selectedRecipe.id,
          name: `24/7 Watchdog: ${selectedRecipe.name}`,
          intervalMinutes: Number(routineInterval) || 30
        })
      });
      await res.json();
      fetchBrowserRoutines();
    } catch (err) {
      console.warn('Schedule error:', err);
    } finally {
      setSchedulingRoutine(false);
    }
  };

  const handleCancelRoutine = async (routineId) => {
    try {
      await fetch(`${API_BASE}/remote/browser/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ routineId })
      });
      fetchBrowserRoutines();
    } catch (e) {
      console.warn('Cancel routine error:', e);
    }
  };

  return (
    <div className="view-container" style={{ padding: '24px 32px 100px', maxWidth: 1400, margin: '0 auto', color: '#e2e8f0', overflowY: 'auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f8fafc' }}>
              ⌁ BRAHMA REMOTE COMMAND & 24/7 CLOUD MATRIX
            </span>
            <span style={{ background: '#10b981', color: '#000', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>
              24/7 ALWAYS-ON
            </span>
            <span style={{ background: '#3b82f6', color: '#fff', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>
              HEADLESS & DETACHED
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>
            24/7 Free Cloud Computer (Hugging Face / GitHub Actions) · Yantra Browser Swarm · Remote Mobile Gateway & Bastion Command
          </p>
        </div>

        <button
          onClick={() => { fetchTelemetry(); fetchBrowserMeta(); }}
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
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Telemetry
        </button>
      </div>

      {/* Main Tab Navigation */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, background: 'rgba(15, 23, 42, 0.6)', padding: 6, borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)' }}>
        {[
          { id: 'cloud', label: '☁️ 24/7 Cloud Computer (Antariksha Node)', desc: 'Runs when laptop is off' },
          { id: 'browser', label: '⌁ Yantra 2.0 Browser Swarm', desc: 'Headless browser automation' },
          { id: 'mobile', label: '📱 Mobile Node & Shell Gateway', desc: 'Remote shell & email alerts' }
        ].map(tab => {
          const isSel = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                background: isSel ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(30, 58, 138, 0.4))' : 'transparent',
                border: `1px solid ${isSel ? '#3b82f6' : 'transparent'}`,
                borderRadius: 8,
                padding: '10px 14px',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: isSel ? '#93c5fd' : '#cbd5e1' }}>
                {tab.label}
              </div>
              <div style={{ fontSize: '0.72rem', color: isSel ? '#bfdbfe' : '#64748b', marginTop: 2 }}>
                {tab.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: 24/7 CLOUD COMPUTER ─── */}
      {activeTab === 'cloud' && (
        <CloudComputerView />
      )}

      {/* ─── TAB 2: YANTRA 2.0 BROWSER SWARM SPOTLIGHT ─── */}
      {activeTab === 'browser' && (
        <div style={{ background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 15, 30, 0.95) 100%)', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: 16, padding: 22, marginBottom: 24, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: 8, borderRadius: 10 }}>
              <Compass size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#f8fafc', margin: 0 }}>
                Headless Browser Swarm & Computer-Use Engine
              </h2>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Engine: {browserStatus?.engine || 'Puppeteer-Core + Chrome CDP'} · Binary: {browserStatus?.chromeExecutable || 'Detecting...'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.78rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              {activeRoutines.length} Active 24/7 Watchdogs
            </span>
          </div>
        </div>

        {/* 2-Column: Left (Recipes & Controls), Right (Live Visual Viewport & Output) */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr', gap: 20 }}>
          {/* Left Column: Recipes & Routine Dispatch */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Layers size={15} color="#fbbf24" /> Select Pre-built Autonomous Browser Recipe:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {browserRecipes.map(recipe => {
                const isSelected = selectedRecipe?.id === recipe.id;
                return (
                  <div
                    key={recipe.id}
                    onClick={() => setSelectedRecipe(recipe)}
                    style={{
                      background: isSelected ? 'rgba(59, 130, 246, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                      border: isSelected ? '1px solid #3b82f6' : '1px solid rgba(255, 255, 255, 0.07)',
                      borderRadius: 10,
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.85rem', color: isSelected ? '#60a5fa' : '#f8fafc' }}>
                        {recipe.name}
                      </div>
                      <span style={{ fontSize: '0.68rem', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4, color: '#94a3b8' }}>
                        {recipe.category}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: 4 }}>
                      {recipe.description}
                    </div>
                    <div style={{ fontSize: '0.70rem', color: '#fbbf24', marginTop: 6, fontFamily: 'monospace' }}>
                      ⚡ {recipe.steps.length} Automated Actions ({recipe.steps.map(s => s.action).join(' → ')})
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Run Once / Schedule Controls */}
            <div style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => handleRunBrowserWorkflow()}
                  disabled={runningBrowser}
                  style={{
                    flex: 1.2,
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 14px',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    cursor: runningBrowser ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    boxShadow: '0 4px 12px rgba(37,99,235,0.3)'
                  }}
                >
                  {runningBrowser ? <RefreshCw className="spin" size={15} /> : <Play size={15} />}
                  {runningBrowser ? 'Executing Headless CDP...' : 'Dispatch Agent Swarm Now'}
                </button>

                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flex: 1 }}>
                  <input
                    type="number"
                    min="5"
                    max="1440"
                    value={routineInterval}
                    onChange={(e) => setRoutineInterval(e.target.value)}
                    style={{
                      width: 50,
                      background: '#040711',
                      border: '1px solid rgba(255,255,255,0.15)',
                      borderRadius: 6,
                      color: '#fbbf24',
                      padding: '8px 4px',
                      fontSize: '0.78rem',
                      textAlign: 'center',
                      fontWeight: 700
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>min</span>
                  <button
                    onClick={handleScheduleRoutine}
                    disabled={schedulingRoutine}
                    style={{
                      flex: 1,
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid #10b981',
                      color: '#34d399',
                      borderRadius: 6,
                      padding: '8px 10px',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    + 24/7 Schedule
                  </button>
                </div>
              </div>
            </div>

            {/* Active Routines List */}
            {activeRoutines.length > 0 && (
              <div style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: 10, padding: 12 }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={13} /> Active 24/7 Watchdog Jobs:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {activeRoutines.map(r => (
                    <div key={r.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#040711', padding: '6px 10px', borderRadius: 6, fontSize: '0.72rem' }}>
                      <div>
                        <span style={{ color: '#f8fafc', fontWeight: 600 }}>{r.name}</span>
                        <span style={{ color: '#94a3b8', marginLeft: 6 }}>({r.intervalMinutes}m cycle · runs: {r.runCount})</span>
                      </div>
                      <button
                        onClick={() => handleCancelRoutine(r.id)}
                        style={{ background: 'transparent', border: 'none', color: '#f87171', cursor: 'pointer', fontWeight: 700 }}
                      >
                        Stop
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Visual Viewport Preview & Execution Logs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Eye size={15} color="#38bdf8" /> Real-Time Viewport Preview (CDP Buffer)
              </div>
              {browserResult?.durationMs && (
                <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                  ✓ Completed in {(browserResult.durationMs / 1000).toFixed(2)}s
                </span>
              )}
            </div>

            {/* Viewport Frame */}
            <div style={{
              background: '#040711',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 10,
              minHeight: 230,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              position: 'relative'
            }}>
              {browserResult?.screenshot ? (
                <img
                  src={browserResult.screenshot}
                  alt="Live Browser Viewport"
                  style={{ width: '100%', height: 'auto', maxHeight: 270, objectFit: 'contain' }}
                />
              ) : (
                <div style={{ textAlign: 'center', color: '#64748b', padding: 24, fontSize: '0.78rem' }}>
                  {runningBrowser ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                      <RefreshCw className="spin" size={24} color="#60a5fa" />
                      <span>Stealth browser active... capturing live viewport buffer</span>
                    </div>
                  ) : (
                    <span>Click "Dispatch Agent Swarm Now" above to capture live viewport</span>
                  )}
                </div>
              )}
            </div>

            {/* Step-by-Step CDP Telemetry Log */}
            <div style={{ background: '#020617', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, padding: 12, maxHeight: 150, overflowY: 'auto', fontFamily: 'monospace', fontSize: '0.70rem' }}>
              <div style={{ color: '#fbbf24', fontWeight: 700, marginBottom: 4 }}>
                Telemetry Log:
              </div>
              {browserLogs.length > 0 ? (
                browserLogs.map((log, i) => (
                  <div key={i} style={{ color: log.includes('ERROR') ? '#f87171' : log.includes('Extracted') ? '#4ade80' : '#94a3b8' }}>
                    {log}
                  </div>
                ))
              ) : (
                <div style={{ color: '#475569' }}>Awaiting browser execution...</div>
              )}
            </div>

            {/* Extracted JSON Payload Preview */}
            {browserResult?.extractedData && Object.keys(browserResult.extractedData).length > 0 && (
              <div style={{ background: '#040d1a', border: '1px solid rgba(56, 189, 248, 0.2)', borderRadius: 8, padding: 10, fontSize: '0.70rem' }}>
                <div style={{ color: '#38bdf8', fontWeight: 700, marginBottom: 4 }}>
                  📊 Extracted Data Payload:
                </div>
                <div style={{ maxHeight: 90, overflowY: 'auto', color: '#a5f3fc', fontFamily: 'monospace' }}>
                  {JSON.stringify(browserResult.extractedData, null, 2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}

      {/* ─── TAB 3: MOBILE NODE & TELEMETRY IPC ─── */}
      {activeTab === 'mobile' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 20 }}>
        {/* Col 1: System Telemetry & Mobile QR Pairing */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Telemetry Card */}
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(251, 191, 36, 0.25)', borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontSize: '0.95rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <HardDrive size={16} /> Laptop Host Telemetry
            </h3>

            {telemetry ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                  <span style={{ color: '#94a3b8' }}>Hostname</span>
                  <span style={{ color: '#f8fafc', fontWeight: 700 }}>{telemetry.host}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                  <span style={{ color: '#94a3b8' }}>OS & Platform</span>
                  <span style={{ color: '#f8fafc', fontWeight: 600 }}>{telemetry.platform} ({telemetry.arch})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                  <span style={{ color: '#94a3b8' }}>CPU Engine</span>
                  <span style={{ color: '#f8fafc', fontWeight: 600 }}>{telemetry.cpuCores} Cores ({telemetry.cpuModel.split(' ')[0]})</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 6 }}>
                  <span style={{ color: '#94a3b8' }}>RAM Memory</span>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>{telemetry.ram.usedGb} GB / {telemetry.ram.totalGb} GB ({telemetry.ram.percentUsed}%)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#94a3b8' }}>Uptime</span>
                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>{telemetry.uptimeFormatted}</span>
                </div>
              </div>
            ) : (
              <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Fetching laptop health...</div>
            )}
          </div>

          {/* Mobile Gateway Pairing Card */}
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontSize: '0.95rem', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Smartphone size={16} /> Mobile Phone Webhook Link
            </h3>
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 14 }}>
              Open this endpoint on your mobile browser (or hook to iOS Shortcuts / Android Tasker) to trigger laptop automations from anywhere.
            </p>
            <div style={{ background: '#040711', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 12px', fontSize: '0.75rem', color: '#a5f3fc', wordBreak: 'break-all', marginBottom: 10 }}>
              {mobileAccessUrl}
            </div>
            <button
              onClick={copyMobileToken}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '9px',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              {tokenCopied ? <Check size={14} /> : <Copy size={14} />}
              {tokenCopied ? 'URL Copied to Clipboard!' : 'Copy Mobile Gateway Link'}
            </button>
          </div>
        </div>

        {/* Col 2: Remote Execution & Live Web Search */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Shell Command Card */}
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontSize: '0.95rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Terminal size={16} /> Remote Command Executor
            </h3>
            <textarea
              value={remoteCommand}
              onChange={(e) => setRemoteCommand(e.target.value)}
              rows={2}
              style={{
                width: '100%',
                background: '#040711',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                color: '#fff',
                padding: 10,
                fontSize: '0.78rem',
                fontFamily: 'monospace',
                outline: 'none',
                marginBottom: 10
              }}
            />
            <button
              onClick={handleExecuteRemote}
              disabled={executing}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                color: '#000',
                border: 'none',
                borderRadius: 8,
                padding: '9px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: executing ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                marginBottom: 10
              }}
            >
              {executing ? <RefreshCw className="spin" size={14} /> : <Play size={14} />}
              {executing ? 'Executing on Host...' : 'Execute Host Shell Script'}
            </button>

            {commandOutput && (
              <div style={{ background: '#020617', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, padding: 10, fontSize: '0.72rem', fontFamily: 'monospace', maxHeight: 110, overflowY: 'auto', whiteSpace: 'pre-wrap', color: '#cbd5e1' }}>
                {commandOutput}
              </div>
            )}
          </div>

          {/* Web Search Card */}
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontSize: '0.95rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Globe size={16} /> Fast Web Synthesizer
            </h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ flex: 1, background: '#040711', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#fff', padding: '7px 10px', fontSize: '0.78rem' }}
              />
              <button
                onClick={handleWebSearch}
                disabled={searching}
                style={{
                  background: 'linear-gradient(135deg, #a855f7, #7c3aed)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '8px 14px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                Search
              </button>
            </div>
            {searchResults.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 140, overflowY: 'auto' }}>
                {searchResults.map((res, i) => (
                  <div key={i} style={{ background: '#040711', padding: 8, borderRadius: 6, fontSize: '0.72rem' }}>
                    <div style={{ fontWeight: 700, color: '#fbbf24' }}>{res.title}</div>
                    <div style={{ color: '#94a3b8', marginTop: 2 }}>{res.snippet}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Col 3: Automated Mail Alerts */}
        <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '0.95rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Mail size={16} /> Automated Email Notification Dispatch
          </h3>
          <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: 14 }}>
            Get instant email reports when long-running AI builds, overnight scans, or critical alerts finish on your laptop.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Recipient Email</label>
              <input
                type="email"
                value={emailTo}
                onChange={(e) => setEmailTo(e.target.value)}
                style={{ width: '100%', background: '#040711', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', padding: '6px 10px', fontSize: '0.78rem', marginTop: 3 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Subject</label>
              <input
                type="text"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                style={{ width: '100%', background: '#040711', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', padding: '6px 10px', fontSize: '0.78rem', marginTop: 3 }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Report / Message Body</label>
              <textarea
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={4}
                style={{ width: '100%', background: '#040711', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, color: '#fff', padding: '8px 10px', fontSize: '0.78rem', marginTop: 3 }}
              />
            </div>
            <button
              onClick={handleSendMail}
              disabled={sendingEmail}
              style={{
                background: 'linear-gradient(135deg, #10b981, #059669)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: '10px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              {sendingEmail ? <RefreshCw className="spin" size={14} /> : <Send size={14} />}
              Send Test Email Alert
            </button>
            {emailStatus && (
              <div style={{ fontSize: '0.75rem', color: '#10b981', textAlign: 'center', marginTop: 4 }}>
                {emailStatus}
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
