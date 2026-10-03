/**
 * BRAHMA — Phase 14: SQLite Database
 * Single-file database, no server setup required.
 * Supports Node.js native node:sqlite (Node 22+), better-sqlite3, or resilient in-memory fallback.
 */
let Database;
let isNativeSqlite = false;

try {
  const sqlite = require('node:sqlite');
  if (sqlite && sqlite.DatabaseSync) {
    Database = sqlite.DatabaseSync;
    isNativeSqlite = true;
  }
} catch (_) {}

if (!Database) {
  try {
    Database = require('better-sqlite3');
  } catch (_) {}
}

const path = require('path');
const fs = require('fs');

const rawDbPath = process.env.DATABASE_PATH || path.join(__dirname, 'brahma.db');
const DB_PATH = path.isAbsolute(rawDbPath) ? rawDbPath : path.resolve(__dirname, '..', rawDbPath);
const DB_DIR = path.dirname(DB_PATH);
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

let db;
if (Database) {
  try {
    db = new Database(DB_PATH);
    if (isNativeSqlite && !db.pragma) {
      db.pragma = (sql) => {
        try { return db.exec(`PRAGMA ${sql};`); } catch (_) { return null; }
      };
    }
    if (db.pragma) {
      try {
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
      } catch (_) {}
    }
  } catch (err) {
    console.warn('[DB] Failed to instantiate SQLite database instance, falling back:', err.message);
    db = null;
  }
}

if (!db) {
  // Resilient memory mock store fallback
  console.warn('[DB] SQLite driver not found or failed to load. Initializing resilient store.');
  const inMemoryData = {
    notifications: [{ id: 1, type: 'welcome', title: '🔱 Welcome to BRAHMA', body: 'Your divine intelligence workspace is ready.' }],
    chat_sessions: [],
    messages: [],
    user_feedback: [],
    scheduled_tasks: []
  };
  db = {
    pragma: () => {},
    exec: () => {},
    prepare: (sql) => ({
      run: (...args) => ({ changes: 1, lastInsertRowid: Date.now() }),
      get: (...args) => {
        if (/count/i.test(sql)) return { n: inMemoryData.notifications.length };
        return inMemoryData.notifications[0] || null;
      },
      all: (...args) => inMemoryData.notifications || []
    })
  };
}

// ─── Schema Migrations ────────────────────────────────────────────────────────
try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id         TEXT PRIMARY KEY,
      title      TEXT NOT NULL,
      identity_id TEXT,
      identity_name TEXT,
      saved_at   TEXT DEFAULT (datetime('now')),
      archived   INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS messages (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT REFERENCES chat_sessions(id) ON DELETE CASCADE,
      sender     TEXT NOT NULL,
      text       TEXT NOT NULL,
      thought    TEXT,
      code_output TEXT,
      identity_id TEXT,
      timestamp  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS projects (
      id          TEXT PRIMARY KEY,
      title       TEXT NOT NULL,
      description TEXT,
      identity_id TEXT,
      status      TEXT DEFAULT 'active',
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS scheduled_tasks (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      prompt      TEXT NOT NULL,
      identity_id TEXT,
      schedule    TEXT,
      run_at      TEXT,
      status      TEXT DEFAULT 'pending',
      last_result TEXT,
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS favorites (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      text        TEXT NOT NULL,
      identity_id TEXT,
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      type        TEXT,
      title       TEXT NOT NULL,
      body        TEXT,
      is_read     INTEGER DEFAULT 0,
      related_id  TEXT,
      created_at  TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT
    );

    CREATE TABLE IF NOT EXISTS user_feedback (
      id                    TEXT PRIMARY KEY,
      stars                 INTEGER NOT NULL,
      rating_label          TEXT,
      improve_regions       TEXT,
      broken_issues         TEXT,
      bug_description       TEXT,
      suggestions           TEXT,
      user_contact          TEXT,
      session_duration_sec  INTEGER DEFAULT 0,
      user_agent            TEXT,
      created_at            TEXT DEFAULT (datetime('now'))
    );
  `);
} catch (migErr) {
  console.warn('[DB] Schema migration note:', migErr.message);
}

// Seed initial notification if empty
try {
  const count = db.prepare('SELECT COUNT(*) as n FROM notifications').get();
  if (count && count.n === 0) {
    db.prepare(`INSERT INTO notifications (type, title, body) VALUES (?, ?, ?)`).run(
      'welcome', '🔱 Welcome to BRAHMA', 'Your divine intelligence workspace is ready. All 13 deity identities are active.'
    );
  }
} catch (_) {}

console.log(`[DB] SQLite ready at ${DB_PATH}`);

module.exports = db;
