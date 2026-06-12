import Database from "better-sqlite3";
import { dirname, join } from "path";
import { existsSync, mkdirSync } from "fs";

export function getDatabasePath(): string {
  return join(process.env.CLEW_HOME || process.env.HOME || process.env.USERPROFILE || ".", ".clew", "memory.db");
}

export function openDatabase(): Database.Database {
  const path = getDatabasePath();
  const dir = dirname(path);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const db = new Database(path);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  return db;
}

export function initializeSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS memories (
      id TEXT PRIMARY KEY,
      sessionId TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      importance REAL NOT NULL DEFAULT 0.5,
      confidence REAL NOT NULL DEFAULT 0.8,
      keywords TEXT NOT NULL DEFAULT '[]',
      embedding BLOB,
      accessCount INTEGER NOT NULL DEFAULT 0,
      lastAccessedAt TEXT,
      createdAt TEXT NOT NULL,
      expiresAt TEXT,
      tags TEXT NOT NULL DEFAULT '[]'
    );

    CREATE TABLE IF NOT EXISTS memory_relations (
      id TEXT PRIMARY KEY,
      sourceId TEXT NOT NULL,
      targetId TEXT NOT NULL,
      relationType TEXT NOT NULL,
      weight REAL NOT NULL DEFAULT 1.0,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (sourceId) REFERENCES memories(id) ON DELETE CASCADE,
      FOREIGN KEY (targetId) REFERENCES memories(id) ON DELETE CASCADE
    );

    CREATE VIRTUAL TABLE IF NOT EXISTS memories_fts USING fts5(
      content,
      keywords,
      tags,
      content='memories',
      content_rowid='rowid'
    );

    CREATE TRIGGER IF NOT EXISTS memories_ai AFTER INSERT ON memories BEGIN
      INSERT INTO memories_fts(rowid, content, keywords, tags)
      VALUES (new.rowid, new.content, new.keywords, new.tags);
    END;

    CREATE TRIGGER IF NOT EXISTS memories_ad AFTER DELETE ON memories BEGIN
      INSERT INTO memories_fts(memories_fts, rowid, content, keywords, tags)
      VALUES ('delete', old.rowid, old.content, old.keywords, old.tags);
    END;

    CREATE TRIGGER IF NOT EXISTS memories_au AFTER UPDATE ON memories BEGIN
      INSERT INTO memories_fts(memories_fts, rowid, content, keywords, tags)
      VALUES ('delete', old.rowid, old.content, old.keywords, old.tags);
      INSERT INTO memories_fts(rowid, content, keywords, tags)
      VALUES (new.rowid, new.content, new.keywords, new.tags);
    END;

    CREATE INDEX IF NOT EXISTS idx_memories_session ON memories(sessionId);
    CREATE INDEX IF NOT EXISTS idx_memories_type ON memories(type);
    CREATE INDEX IF NOT EXISTS idx_memories_created ON memories(createdAt);
    CREATE INDEX IF NOT EXISTS idx_relations_source ON memory_relations(sourceId);
    CREATE INDEX IF NOT EXISTS idx_relations_target ON memory_relations(targetId);
  `);
}
