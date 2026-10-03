/**
 * Vercel Serverless Function — /api/chat
 * Prevents 405 Method Not Allowed on deployed Vercel frontend.
 * Proxies to configured Express backend or provides direct inference.
 */
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed. Use POST.' });
  }

  const backendUrl = process.env.VITE_BACKEND_URL || process.env.BACKEND_URL || 'https://brahma-backend.onrender.com';

  try {
    const backendRes = await fetch(`${backendUrl.replace(/\/$/, '')}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(req.headers.authorization ? { Authorization: req.headers.authorization } : {})
      },
      body: JSON.stringify(req.body)
    });

    if (!backendRes.ok) {
      const errData = await backendRes.json().catch(() => ({ error: `Backend responded with HTTP ${backendRes.status}` }));
      return res.status(backendRes.status).json(errData);
    }

    // Forward streaming response or JSON
    const contentType = backendRes.headers.get('content-type') || '';
    res.setHeader('Content-Type', contentType);

    if (contentType.includes('text/event-stream')) {
      const reader = backendRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      return res.end();
    } else {
      const data = await backendRes.text();
      return res.send(data);
    }
  } catch (err) {
    return res.status(502).json({
      error: 'Backend gateway currently unreachable',
      details: err.message,
      hint: 'Ensure Express backend is running on Render or local port 4000'
    });
  }
}
