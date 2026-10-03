/**
 * Vercel Serverless Function — GET /api/health
 * Returns real JSON status so deployed site never serves frontend HTML on /api/health
 */
export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  return res.status(200).json({
    status: 'ok',
    service: 'BRAHMA Sovereign Matrix API',
    version: '1.0.0',
    uptime: process.uptime ? process.uptime() : 0,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'production'
  });
}
