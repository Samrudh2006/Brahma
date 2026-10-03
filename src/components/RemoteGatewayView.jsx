import React, { useState, useEffect } from 'react';
import {
  Smartphone, Monitor, Radio, Send, Terminal, Mail,
  Shield, CheckCircle2, AlertTriangle, RefreshCw, Globe,
  Activity, Play, Lock, Key, Copy, Check, QrCode, Zap,
  Server, HardDrive, Cpu, Clock, CheckCheck
} from 'lucide-react';
import { API_BASE } from '../api/client';

export default function RemoteGatewayView() {
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

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
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

  return (
    <div style={{ padding: '24px 32px', maxWidth: 1300, margin: '0 auto', color: '#e2e8f0' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f8fafc' }}>
              📱 Mobile-to-Laptop Daemon & Remote Automations
            </span>
            <span style={{ background: '#10b981', color: '#000', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: 10 }}>
              LIVE DAEMON
            </span>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: 4 }}>
            Control your laptop remotely from your mobile phone anywhere · Live Web Search · Automated Email Alerts
          </p>
        </div>

        <button
          onClick={fetchTelemetry}
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

      {/* Grid: 3 Main Columns */}
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
                background: 'linear-gradient(135deg, #fbbf24, #d97706)',
                color: '#000',
                border: 'none',
                borderRadius: 8,
                padding: '9px',
                fontWeight: 800,
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6
              }}
            >
              {executing ? <RefreshCw className="spin" size={14} /> : <Play size={14} />}
              Execute on Laptop
            </button>
            {commandOutput && (
              <pre style={{ marginTop: 10, background: '#02040a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 8, padding: 10, fontSize: '0.72rem', color: '#a7f3d0', maxHeight: 120, overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
                {commandOutput}
              </pre>
            )}
          </div>

          {/* Web Search Card */}
          <div style={{ background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 20 }}>
            <h3 style={{ fontSize: '0.95rem', color: '#a855f7', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <Globe size={16} /> Real-Time Web Search Crawler
            </h3>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleWebSearch()}
                style={{
                  flex: 1,
                  background: '#040711',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  color: '#fff',
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
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
    </div>
  );
}
