const router = require('express').Router();
const crypto = require('crypto');
const db = require('../db/database');

/**
 * Helper: Hash password using native Node.js scrypt
 */
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

/**
 * Helper: Safe timing comparison
 */
function verifyPassword(password, salt, storedHash) {
  const hash = hashPassword(password, salt);
  const hashBuffer = Buffer.from(hash, 'hex');
  const storedBuffer = Buffer.from(storedHash, 'hex');
  if (hashBuffer.length !== storedBuffer.length) return false;
  return crypto.timingSafeEqual(hashBuffer, storedBuffer);
}

/**
 * Helper: Create 30-day session token
 */
function createSession(userId) {
  const token = 'bsh_' + crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
  
  try {
    db.prepare(`
      INSERT INTO user_sessions (token, user_id, expires_at)
      VALUES (?, ?, ?)
    `).run(token, userId, expiresAt);
  } catch (err) {
    console.warn('[AUTH SESSION] Warning creating session in db:', err.message);
  }
  return token;
}

// ─── POST /auth/register ───────────────────────────────────────────────────────
router.post('/register', (req, res) => {
  const { email, password, name } = req.body || {};

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const displayName = (name && typeof name === 'string' && name.trim()) ? name.trim() : cleanEmail.split('@')[0];

  try {
    // Check if email already registered
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists. Please log in.' });
    }

    const userId = 'usr_' + crypto.randomBytes(12).toString('hex');
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);

    db.prepare(`
      INSERT INTO users (id, email, password_hash, salt, name, tier, avatar)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      userId,
      cleanEmail,
      passwordHash,
      salt,
      displayName,
      'Sovereign Pioneer',
      `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`
    );

    const token = createSession(userId);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: userId,
        email: cleanEmail,
        name: displayName,
        tier: 'Sovereign Pioneer',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
        isGuest: false
      },
      message: 'Account created successfully in Brahma Sovereign Space.'
    });
  } catch (err) {
    console.error('[AUTH REGISTER ERROR]', err);
    return res.status(500).json({ error: 'Registration failed due to a server error.' });
  }
});

// ─── POST /auth/login ──────────────────────────────────────────────────────────
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();

  try {
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(cleanEmail);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = verifyPassword(password, user.salt, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Update last_login
    try {
      db.prepare(`UPDATE users SET last_login = datetime('now') WHERE id = ?`).run(user.id);
    } catch (_) {}

    const token = createSession(user.id);

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier || 'Sovereign Pioneer',
        avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email)}`,
        isGuest: false
      },
      message: 'Welcome back to Brahma Supreme Workspace.'
    });
  } catch (err) {
    console.error('[AUTH LOGIN ERROR]', err);
    return res.status(500).json({ error: 'Login failed due to a server error.' });
  }
});

// ─── GET /auth/me ──────────────────────────────────────────────────────────────
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : req.headers['x-auth-token'];

  if (!token) {
    return res.status(401).json({ error: 'No authorization token provided.' });
  }

  // Handle guest token bypass
  if (token.startsWith('guest_tok_')) {
    return res.json({
      success: true,
      user: {
        id: 'usr_guest',
        email: 'guest@brahma.ai',
        name: 'Sovereign Guest',
        tier: 'Guest Explorer',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=brahma_guest',
        isGuest: true
      }
    });
  }

  try {
    const session = db.prepare(`
      SELECT user_id, expires_at FROM user_sessions WHERE token = ?
    `).get(token);

    if (!session) {
      return res.status(401).json({ error: 'Session expired or invalid.' });
    }

    if (new Date(session.expires_at) < new Date()) {
      try {
        db.prepare('DELETE FROM user_sessions WHERE token = ?').run(token);
      } catch (_) {}
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }

    const user = db.prepare(`
      SELECT id, email, name, tier, avatar, created_at FROM users WHERE id = ?
    `).get(session.user_id);

    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    return res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        tier: user.tier || 'Sovereign Pioneer',
        avatar: user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email)}`,
        isGuest: false
      }
    });
  } catch (err) {
    console.error('[AUTH ME ERROR]', err);
    return res.status(500).json({ error: 'Failed to verify session.' });
  }
});

// ─── POST /auth/logout ─────────────────────────────────────────────────────────
router.post('/logout', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : req.headers['x-auth-token'];

  if (token) {
    try {
      db.prepare('DELETE FROM user_sessions WHERE token = ?').run(token);
    } catch (_) {}
  }

  return res.json({ success: true, message: 'Logged out successfully.' });
});

// ─── POST /auth/guest ──────────────────────────────────────────────────────────
router.post('/guest', (req, res) => {
  const guestToken = 'guest_tok_' + crypto.randomBytes(16).toString('hex');
  const guestNum = Math.floor(1000 + Math.random() * 9000);

  return res.json({
    success: true,
    token: guestToken,
    user: {
      id: `usr_guest_${guestNum}`,
      email: `guest_${guestNum}@brahma.ai`,
      name: `Sovereign Guest #${guestNum}`,
      tier: 'Guest Explorer',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=guest_${guestNum}`,
      isGuest: true
    },
    message: 'Temporary sovereign guest session created.'
  });
});

// ─── GitHub OAuth (Preserved) ─────────────────────────────────────────────────
router.get('/github', (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.GITHUB_CLIENT_ID || 'YOUR_GITHUB_CLIENT_ID',
    redirect_uri: 'http://localhost:4000/auth/github/callback',
    scope: 'repo read:user',
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
});

router.get('/github/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.redirect('http://localhost:3001?auth=error');

  try {
    const axios = require('axios');
    const response = await axios.post(
      'https://github.com/login/oauth/access_token',
      { client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code },
      { headers: { Accept: 'application/json' } }
    );
    const token = response.data.access_token;
    res.redirect(`http://localhost:3001?auth=github&token=${token}`);
  } catch (err) {
    res.redirect('http://localhost:3001?auth=error');
  }
});

module.exports = router;
