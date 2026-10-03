const http = require('http');

function post(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const req = http.request({
      hostname: u.hostname,
      port: u.port,
      path: u.pathname,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(JSON.stringify(body));
    req.end();
  });
}

async function run() {
  console.log('--- 1. Testing RAG Hybrid Vector Search ---');
  const ragRes = await post('http://localhost:4000/api/frontier/rag/search', { query: 'continuous latent planning' });
  console.log('RAG Top Result:', ragRes.results[0]?.title);

  console.log('--- 2. Testing CUDA 1.58-Bit Silicon Profiler ---');
  const cudaRes = await post('http://localhost:4000/api/frontier/cuda/profile', { matrixDim: 4096, precision: '1.58-bit' });
  console.log('CUDA Compression:', cudaRes.metrics.memoryCompressionRatio, '| Energy Gain:', cudaRes.metrics.energyEfficiencyGain);

  console.log('--- 3. Testing Swarm Multi-Council Debate ---');
  const swarmRes = await post('http://localhost:4000/api/frontier/swarm/debate', { query: 'Zero-Hallucination AGI State Invariant' });
  console.log('Swarm Verdict:', swarmRes.consensusVerdict, '| Rounds:', swarmRes.roundsCompleted);
}

run();
