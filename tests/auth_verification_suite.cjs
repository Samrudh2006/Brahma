const path = require('path');
module.paths.push(path.resolve(__dirname, '../backend/node_modules'));
module.paths.push(path.resolve(__dirname, '../node_modules'));

const assert = require('assert');
const crypto = require('crypto');
const db = require('../backend/db/database');
const express = require('express');
const request = require('http');

// Load auth router directly
const authRouter = require('../backend/routes/auth');
const app = express();
app.use(express.json());
app.use('/auth', authRouter);

let server;
const PORT = 4099;

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = request.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(raw) }));
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

function get(path, token) {
  return new Promise((resolve, reject) => {
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
    const req = request.request({
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method: 'GET',
      headers
    }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(raw) }));
    });
    req.on('error', reject);
    req.end();
  });
}

async function runAuthTests() {
  console.log('================================================================');
  console.log('🔱 BRAHMA COMPREHENSIVE AUTH & SECURITY VERIFICATION SUITE');
  console.log('================================================================\n');

  await new Promise(r => { server = app.listen(PORT, '127.0.0.1', r); });

  const testEmail = `pioneer_${Date.now()}@brahma.ai`;
  const testPassword = 'securePassword123!';
  const testName = 'Pioneer Explorer';

  try {
    // -------------------------------------------------------------
    // TEST 1: Regular User Registration
    // -------------------------------------------------------------
    console.log('[TEST 1] Testing Regular User Registration...');
    const regRes = await post('/auth/register', {
      email: testEmail,
      password: testPassword,
      name: testName
    });

    assert.strictEqual(regRes.status, 201, `Expected status 201, got ${regRes.status}`);
    assert.strictEqual(regRes.body.success, true, 'Registration success must be true');
    assert.ok(regRes.body.token, 'A valid session token must be returned');
    assert.strictEqual(regRes.body.user.email, testEmail);
    assert.strictEqual(regRes.body.user.name, testName);
    assert.strictEqual(regRes.body.user.isAdmin, undefined, 'Regular user must not have isAdmin flag');
    assert.strictEqual(regRes.body.user.password, undefined, 'Plain password must NEVER leak in API response');
    console.log('  -> PASS: User registered successfully. Token issued: ' + regRes.body.token.slice(0, 15) + '...\n');

    // -------------------------------------------------------------
    // TEST 2: Password Storage & Cryptographic Hashing in SQLite
    // -------------------------------------------------------------
    console.log('[TEST 2] Verifying Cryptographic Salt & Scrypt Hash in SQLite Database...');
    const dbUser = db.prepare('SELECT email, password_hash, salt FROM users WHERE email = ?').get(testEmail);
    assert.ok(dbUser, 'User must exist in SQLite database');
    assert.notStrictEqual(dbUser.password_hash, testPassword, 'Plain password must NOT be stored in DB');
    assert.ok(dbUser.salt && dbUser.salt.length === 32, '16-byte hex salt (32 chars) must be generated');
    assert.ok(dbUser.password_hash && dbUser.password_hash.length === 128, 'Scrypt 64-byte hash (128 hex chars) must be stored');
    console.log('  -> PASS: Database verified. Password securely hashed with unique salt.\n');

    // -------------------------------------------------------------
    // TEST 3: Duplicate Registration Rejection
    // -------------------------------------------------------------
    console.log('[TEST 3] Testing Duplicate Registration Prevention...');
    const dupRes = await post('/auth/register', { email: testEmail, password: testPassword });
    assert.strictEqual(dupRes.status, 409, 'Duplicate email must return HTTP 409 Conflict');
    console.log('  -> PASS: Duplicate registration properly blocked.\n');

    // -------------------------------------------------------------
    // TEST 4: Regular User Login with Correct Password
    // -------------------------------------------------------------
    console.log('[TEST 4] Testing Regular User Login with Correct Password...');
    const loginRes = await post('/auth/login', {
      email: testEmail,
      password: testPassword
    });
    assert.strictEqual(loginRes.status, 200, `Expected 200, got ${loginRes.status}`);
    assert.strictEqual(loginRes.body.success, true);
    assert.ok(loginRes.body.token);
    assert.strictEqual(loginRes.body.user.email, testEmail);
    assert.strictEqual(loginRes.body.user.role, 'user');
    assert.strictEqual(loginRes.body.user.isAdmin, false);
    assert.strictEqual(loginRes.body.user.hasDotsOfficeAccess, false);
    console.log('  -> PASS: Correct credentials accepted. Session token created.\n');

    // -------------------------------------------------------------
    // TEST 5: Login with Incorrect Password Rejection
    // -------------------------------------------------------------
    console.log('[TEST 5] Testing Login with Wrong Password...');
    const wrongPassRes = await post('/auth/login', {
      email: testEmail,
      password: 'wrong_password_xyz'
    });
    assert.strictEqual(wrongPassRes.status, 401, 'Wrong password must return 401 Unauthorized');
    assert.strictEqual(wrongPassRes.body.error, 'Invalid email or password.');
    console.log('  -> PASS: Wrong password rejected with 401.\n');

    // -------------------------------------------------------------
    // TEST 6: Session Verification via /auth/me
    // -------------------------------------------------------------
    console.log('[TEST 6] Testing Session Verification (/auth/me)...');
    const meRes = await get('/auth/me', loginRes.body.token);
    assert.strictEqual(meRes.status, 200);
    assert.strictEqual(meRes.body.success, true);
    assert.strictEqual(meRes.body.user.email, testEmail);
    console.log('  -> PASS: Session token valid and user verified.\n');

    // -------------------------------------------------------------
    // TEST 7: Supreme Architect Login (Your Credentials)
    // -------------------------------------------------------------
    console.log('[TEST 7] Testing Supreme Architect Login (samrudhdwivvedula12@gmail.com / samrudh@hacker)...');
    const supremeRes = await post('/auth/login', {
      email: 'samrudhdwivvedula12@gmail.com',
      password: 'samrudh@hacker'
    });
    assert.strictEqual(supremeRes.status, 200);
    assert.strictEqual(supremeRes.body.success, true);
    assert.strictEqual(supremeRes.body.user.email, 'samrudhdwivvedula12@gmail.com');
    assert.strictEqual(supremeRes.body.user.role, 'supreme_architect');
    assert.strictEqual(supremeRes.body.user.isAdmin, true, 'Supreme Architect must have isAdmin=true');
    assert.strictEqual(supremeRes.body.user.hasDotsOfficeAccess, true, 'Supreme Architect must have hasDotsOfficeAccess=true');
    assert.strictEqual(supremeRes.body.user.tier, 'Supreme Sovereign Architect');
    assert.ok(supremeRes.body.user.powers.allAdminAccess, 'allAdminAccess power must be true');
    assert.ok(supremeRes.body.user.powers.godMode, 'godMode power must be true');
    console.log('  -> PASS: Supreme Architect authenticated with Full A-to-Z God-Mode powers & Virtual Office unlocked!\n');

    // -------------------------------------------------------------
    // TEST 8: Supreme Architect Session Verification via /auth/me
    // -------------------------------------------------------------
    console.log('[TEST 8] Testing Supreme Architect Session Verification (/auth/me)...');
    const supremeMe = await get('/auth/me', supremeRes.body.token);
    assert.strictEqual(supremeMe.status, 200);
    assert.strictEqual(supremeMe.body.user.isAdmin, true);
    assert.strictEqual(supremeMe.body.user.hasDotsOfficeAccess, true);
    assert.strictEqual(supremeMe.body.user.role, 'supreme_architect');
    console.log('  -> PASS: Supreme Architect session retains all admin powers across reloads.\n');

    console.log('================================================================');
    console.log('✅ ALL 8/8 AUTHENTICATION & SECURITY INVARIANTS PASSED (100%)');
    console.log('================================================================');

  } finally {
    server.close();
  }
}

runAuthTests().catch(err => {
  console.error('\n❌ AUTH TEST FAILED:', err);
  process.exit(1);
});
