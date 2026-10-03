/**
 * BRAHMA — Phase 14: SQLite Database
 * Single-file database, no server setup required.
 */
let Database;
let isNativeSqlite = false;
try {
  const sqlite = require('node:sqlite');
  Database = sqlite.DatabaseSync;
  isNativeSqlite = true;
} catch {
  Database = require('better-sqlite3');
}

const path = require('path');
const fs = require('fs');

const rawDbPath = process.env.DATABASE_PATH || path.join(__dirname, 'brahma.db');
const DB_PATH = path.isAbsolute(rawDbPath) ? rawDbPath : path.resolve(__dirname, '..', rawDbPath);
const DB_DIR = path.dirname(DB_PATH);
if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });

const db = new Database(DB_PATH);

if (isNativeSqlite) {
  if (!db.pragma) {
    db.pragma = (sql) => db.exec(`PRAGMA ${sql};`);
  }
}

// Performance pragmas
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// ─── Schema Migrations ────────────────────────────────────────────────────────
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

// Seed initial notification if empty
const count = db.prepare('SELECT COUNT(*) as n FROM notifications').get();
if (count.n === 0) {
  db.prepare(`INSERT INTO notifications (type, title, body) VALUES (?, ?, ?)`).run(
    'welcome', '🔱 Welcome to BRAHMA', 'Your divine intelligence workspace is ready. All 13 deity identities are active.'
  );
}

console.log(`[DB] SQLite ready at ${DB_PATH}`);

module.exports = db;
