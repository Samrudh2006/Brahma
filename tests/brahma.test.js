import { describe, it, expect } from 'vitest';
import { FRONTIER_MODELS_CATALOG } from '../src/data/modelsCatalog.js';
import { DIVINE_COUNCILS, ALL_289_AGENTS } from '../src/data/agentsData.js';

describe('BRAHMA AGI Architecture Verification Suite', () => {
  it('Verifies 20+ Frontier AI Models are configured in the catalog', () => {
    expect(FRONTIER_MODELS_CATALOG.length).toBeGreaterThanOrEqual(20);
    const modelIds = FRONTIER_MODELS_CATALOG.map(m => m.id);
    expect(modelIds).toContain('deepseek-r1');
    expect(modelIds).toContain('claude-3-7-sonnet');
    expect(modelIds).toContain('gemini-2-0-flash');
    expect(modelIds).toContain('llama-3-3-70b');
    expect(modelIds).toContain('qwen-2-5-coder-32b');
    expect(modelIds).toContain('bitnet-b1-58');
  });

  it('Verifies 13 Divine Intelligence Councils are defined', () => {
    expect(DIVINE_COUNCILS.length).toBe(13);
    const deities = DIVINE_COUNCILS.map(c => c.deity);
    expect(deities).toContain('Brahma');
    expect(deities).toContain('Saraswati');
    expect(deities).toContain('Ganesha');
    expect(deities).toContain('Vishwakarma');
    expect(deities).toContain('Hanuman');
    expect(deities).toContain('Shiva');
    expect(deities).toContain('Durga');
    expect(deities).toContain('Lakshmi');
    expect(deities).toContain('Krishna');
    expect(deities).toContain('Agni');
    expect(deities).toContain('Varuna');
    expect(deities).toContain('Surya');
    expect(deities).toContain('Kali');
  });

  it('Verifies 289+ Specialized Multi-Agent Swarm instances are instantiated', () => {
    expect(ALL_289_AGENTS.length).toBeGreaterThanOrEqual(289);
    ALL_289_AGENTS.forEach(agent => {
      expect(agent.id).toBeDefined();
      expect(agent.name).toBeDefined();
      expect(agent.councilId).toBeDefined();
      expect(agent.specialty).toBeDefined();
      expect(agent.verificationRate).toBeDefined();
    });
  });
});
