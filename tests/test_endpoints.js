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
  console.log('--- Testing /api/execute ---');
  const execRes = await post('http://localhost:4000/api/execute', {
    code: 'const a = 100; const b = 250; console.log("Calculated sum:", a + b); a + b;'
  });
  console.log('Code Execution Output:', execRes);

  console.log('--- Testing /api/billing/checkout ---');
  const billRes = await post('http://localhost:4000/api/billing/checkout', { planId: 'plan_pro' });
  console.log('Billing Checkout Session:', billRes);
}

run();
