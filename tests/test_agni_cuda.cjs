const http = require('http');

const payload = {
  messages: [{ sender: 'user', text: 'How do I optimize CUDA kernel memory coalescing?' }],
  identity: {
    id: 'agni',
    name: 'AGNI',
    title: 'The Fire of Raw Compute & GPU Acceleration',
    domain: 'CUDA • GPU Kernels • Low-Level Performance • Compilers',
    philosophy: 'Ignites low-level CUDA kernels and parallel compute pipelines.',
    underlyingModel: 'StarCoder 2 / Codestral',
    swarmCount: 24
  },
  model: 'deepseek-r1'
};

const req = http.request('http://localhost:4000/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' }
}, (res) => {
  let chunks = '';
  res.on('data', c => {
    chunks += c.toString();
  });
  res.on('end', () => {
    console.log('--- AGNI CUDA RESPONSE ---');
    console.log(chunks);
  });
});

req.write(JSON.stringify(payload));
req.end();
