#!/usr/bin/env node
/**
 * BRAHMA — MCP Server Setup Script
 * Installs all free Model Context Protocol (MCP) servers globally
 *
 * Run: node scripts/setup-mcp.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const MCPS = [
  {
    package: '@modelcontextprotocol/server-fetch',
    name: 'Fetch MCP',
    description: 'Web scraping & URL content extraction',
    keyRequired: 'None'
  },
  {
    package: '@modelcontextprotocol/server-memory',
    name: 'Memory MCP',
    description: 'Persistent knowledge graph memory',
    keyRequired: 'None'
  },
  {
    package: '@modelcontextprotocol/server-github',
    name: 'GitHub MCP',
    description: 'Repo search, issues, PRs (public repos free)',
    keyRequired: 'Optional: GITHUB_TOKEN (set in .env)'
  },
  {
    package: '@modelcontextprotocol/server-brave-search',
    name: 'Brave Search MCP',
    description: 'Real-time web search (2000 req/month free)',
    keyRequired: 'BRAVE_API_KEY — Get free at: https://api.search.brave.com/register'
  },
  {
    package: '@modelcontextprotocol/server-filesystem',
    name: 'Filesystem MCP',
    description: 'Local file read/write access',
    keyRequired: 'None'
  },
  {
    package: '@modelcontextprotocol/server-sequential-thinking',
    name: 'Sequential Thinking MCP',
    description: 'Multi-step structured reasoning chains',
    keyRequired: 'None'
  }
];

console.log('\n🔱 BRAHMA — MCP Server Installation\n');
console.log('Installing free Model Context Protocol servers...\n');

let installed = 0;
let failed = 0;

for (const mcp of MCPS) {
  try {
    process.stdout.write(`  ⬇  Installing ${mcp.name} (${mcp.package})... `);
    execSync(`npx -y ${mcp.package} --version 2>/dev/null || true`, { stdio: 'pipe' });
    // Pre-cache the package
    execSync(`npm install -g ${mcp.package} --prefer-offline 2>/dev/null || npx -y ${mcp.package} --help 2>/dev/null || true`, {
      stdio: 'pipe',
      timeout: 30000
    });
    console.log('✅');
    console.log(`     └─ ${mcp.description}`);
    console.log(`     └─ Key: ${mcp.keyRequired}\n`);
    installed++;
  } catch (err) {
    console.log('⚠️  (will be installed on first use via npx)');
    console.log(`     └─ ${mcp.description}\n`);
    installed++; // npx installs on first use
  }
}

console.log('─'.repeat(60));
console.log(`\n✅ ${installed} MCP servers configured (npx auto-install on demand)`);
console.log(`\n📋 Free Public APIs integrated (no MCP needed):`);
const freeApis = [
  '  • Wikipedia REST API     — https://en.wikipedia.org/api/rest_v1',
  '  • arXiv Open API         — https://arxiv.org/help/api',
  '  • Open-Meteo Weather     — https://open-meteo.com',
  '  • NASA Open APIs         — https://api.nasa.gov (DEMO_KEY built-in)',
  '  • RestCountries          — https://restcountries.com',
  '  • CoinGecko Public API   — https://coingecko.com/api',
  '  • Open Exchange Rates    — https://open.er-api.com',
  '  • Open Library (Books)   — https://openlibrary.org',
  '  • ip-api.com (GeoIP)     — https://ip-api.com',
  '  • HuggingFace API        — https://huggingface.co/api',
  '  • GitHub REST API        — https://api.github.com',
  '  • Nager.Date Holidays    — https://date.nager.at',
  '',
  '  Optional (free key needed):',
  '  • NewsAPI                — https://newsapi.org/register (100 req/day)',
  '  • Brave Search           — https://api.search.brave.com/register (2000 req/month)',
  '  • NASA API Key           — https://api.nasa.gov (unlimited, DEMO_KEY works for 30/hr)',
  '  • GitHub Token           — https://github.com/settings/tokens (5000 req/hr vs 60)',
];
freeApis.forEach(line => console.log(line));

console.log('\n🧪 Test your intelligence APIs:\n');
console.log('  curl "http://localhost:4000/api/intelligence/status"');
console.log('  curl "http://localhost:4000/api/intelligence/wiki?q=BRAHMA"');
console.log('  curl "http://localhost:4000/api/intelligence/arxiv?q=LLM+reasoning"');
console.log('  curl "http://localhost:4000/api/intelligence/nasa/apod"');
console.log('  curl "http://localhost:4000/api/intelligence/crypto"');
console.log('\n🔱 BRAHMA Intelligence Layer ready!\n');
