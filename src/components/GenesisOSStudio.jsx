import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Shield, Play, RefreshCw, CheckCircle, Code, Cpu, Sparkles, X, Layers, AlertTriangle, FileCode } from 'lucide-react';

export default function GenesisOSStudio({ onClose }) {
  const [taskPrompt, setTaskPrompt] = useState('Build a self-healing zero-downtime distributed payment orchestrator with formal Lean 4 verification');
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const AGENT_SWARM = [
    { role: 'Genesis Architect', status: 'active', desc: 'Decomposes mission into formal state invariants' },
    { role: 'Kernel Synthesizer', status: 'idle', desc: 'Writes low-level C++/Rust addition-only kernels' },
    { role: 'Lean 4 Formal Prover', status: 'idle', desc: 'Generates mathematical safety & memory proofs' },
    { role: 'Sandbox Auditor', status: 'idle', desc: 'Executes simulated adversarial penetration tests' },
  ];

  const EXECUTION_STEPS = [
    { agent: 'Genesis Architect', action: 'State Machine Decomposition', details: 'Parsed Byzantine failure edges. 4 recovery paths generated.' },
    { agent: 'Kernel Synthesizer', action: 'Tool Self-Compilation', details: 'Synthesized custom async retry router (240 lines Rust).' },
    { agent: 'Lean 4 Formal Prover', action: 'Theorem Proving', details: 'Lean 4 Verified: Theorem `no_double_spend_invariant` checked in 14ms.' },
    { agent: 'Sandbox Auditor', action: 'Penetration Benchmark', details: 'Passed 10,000 synthetic network timeout faults with 0.00% fund loss.' },
  ];

  useEffect(() => {
    let timeout;
    if (isRunning && activeStep < EXECUTION_STEPS.length) {
      timeout = setTimeout(() => {
        setActiveStep((s) => s + 1);
      }, 1600);
    } else if (activeStep >= EXECUTION_STEPS.length) {
      setIsRunning(false);
    }
    return () => clearTimeout(timeout);
  }, [isRunning, activeStep]);

  const handleStart = () => {
    setActiveStep(0);
    setIsRunning(true);
  };

  return (
    <div className="discovery-modal-overlay" onClick={onClose}>
      <div className="discovery-modal-container genesis" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="discovery-modal-header">
          <div className="discovery-title-left">
            <div className="discovery-badge genesis">
              <Shield size={14} /> Self-Compiling Neuro-Symbolic Kernel
            </div>
            <h2>Brahma Genesis OS™</h2>
            <p>Autonomous Multi-Agent Task Orchestrator & Formal Verification Sandbox</p>
          </div>
          <button className="close-discovery-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Input Prompt Box */}
        <div className="genesis-input-card">
          <div className="genesis-input-label">
            <Sparkles size={14} className="text-gold" />
            <span>Autonomous Mission Objective</span>
          </div>
          <div className="genesis-input-row">
            <input
              type="text"
              className="genesis-prompt-field"
              value={taskPrompt}
              onChange={(e) => setTaskPrompt(e.target.value)}
              placeholder="Define mission-critical task for Genesis OS..."
            />
            <button
              className={`genesis-launch-btn ${isRunning ? 'running' : ''}`}
              onClick={handleStart}
              disabled={isRunning}
            >
              <Play size={16} /> {isRunning ? 'Executing Swarm...' : 'Execute Swarm'}
            </button>
          </div>
        </div>

        {/* Swarm & Terminal Grid */}
        <div className="genesis-workspace-grid">
          {/* Left Column: Multi-Agent Swarm Status */}
          <div className="swarm-agents-panel">
            <h3 className="swarm-title">
              <Cpu size={16} /> Autonomous Specialized Swarm
            </h3>
            <div className="agents-list">
              {AGENT_SWARM.map((agent, i) => {
                const isCurrent = isRunning && activeStep === i;
                const isDone = activeStep > i;
                return (
                  <div key={i} className={`agent-card ${isCurrent ? 'active' : ''} ${isDone ? 'done' : ''}`}>
                    <div className="agent-avatar-col">
                      <div className="agent-avatar">{agent.role[0]}</div>
                    </div>
                    <div className="agent-info-col">
                      <div className="agent-name-row">
                        <span className="agent-role-name">{agent.role}</span>
                        <span className={`agent-status-badge ${isDone ? 'done' : (isCurrent ? 'running' : 'idle')}`}>
                          {isDone ? 'Completed' : (isCurrent ? 'Synthesizing...' : 'Standby')}
                        </span>
                      </div>
                      <p className="agent-desc">{agent.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Live Terminal & Formal Proof Output */}
          <div className="genesis-terminal-panel">
            <div className="terminal-header">
              <Terminal size={14} />
              <span>Genesis Live Compiler & Proof Log</span>
            </div>

            <div className="terminal-body-scroll">
              <div className="term-line info">
                <span>[Genesis OS Core v1.4] Initialized sandboxed eBPF runtime.</span>
              </div>
              <div className="term-line prompt-echo">
                <span>&gt; Task: {taskPrompt}</span>
              </div>

              {EXECUTION_STEPS.slice(0, activeStep).map((step, idx) => (
                <div key={idx} className="term-step-block">
                  <div className="term-line success">
                    <span>✓ [{step.agent}] {step.action}</span>
                  </div>
                  <div className="term-line details">
                    <span>  ↳ {step.details}</span>
                  </div>
                </div>
              ))}

              {isRunning && (
                <div className="term-line working">
                  <span className="cursor-blink">⚡ Swarm Agent executing formal synthesis...</span>
                </div>
              )}

              {activeStep >= EXECUTION_STEPS.length && (
                <div className="term-final-card">
                  <CheckCircle size={18} className="text-green" />
                  <div>
                    <strong>Mission Accomplished: Zero-Defect Code Synthesized</strong>
                    <p>All formal invariants mathematically proven in Lean 4. Production binaries ready.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
