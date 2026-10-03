const http = require('http');

const payload = {
  messages: [{ sender: 'user', text: 'hello' }],
  identity: {
    id: 'ganesha',
    name: 'GANESHA',
    title: 'Remover of Obstacles & Strategic Genius',
    domain: 'Wisdom • Problem Solving • Architecture',
    philosophy: 'Clears technical bottlenecks and untangles complex bugs.',
    underlyingModel: 'OpenAI o1 / o3-mini',
    swarmCount: 20
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
    console.log('--- LIVE CHAT RESPONSE ---');
    console.log(chunks);
  });
});

req.write(JSON.stringify(payload));
req.end();
