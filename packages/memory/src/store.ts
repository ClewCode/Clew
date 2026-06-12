import { openDatabase, initializeSchema, getDatabasePath } from "./database.js";
import type { Memory, MemoryType, MemoryQuery, MemoryStats } from "@clew/core";

export class MemoryStore {
  private db: ReturnType<typeof openDatabase> | null = null;

  private getDb() {
    if (!this.db) {
      this.db = openDatabase();
      initializeSchema(this.db);
    }
    return this.db;
  }

  add(memory: Omit<Memory, "id" | "createdAt">): Memory {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const db = this.getDb();
    const stmt = db.prepare(
      `INSERT INTO memories (id, sessionId, type, content, importance, confidence, keywords, accessCount, createdAt, expiresAt, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    stmt.run(
      id,
      memory.sessionId,
      memory.type,
      memory.content,
      memory.importance,
      memory.confidence,
      JSON.stringify(memory.keywords),
      0,
      createdAt,
      memory.expiresAt ?? null,
      JSON.stringify(memory.tags)
    );
    return { id, createdAt, ...memory };
  }

  get(id: string): Memory | null {
    const db = this.getDb();
    const row = db.prepare("SELECT * FROM memories WHERE id = ?").get(id) as Record<string, unknown> | undefined;
    if (!row) return null;
    return this.mapRow(row);
  }

  update(id: string, changes: Partial<Memory>): Memory | null {
    const existing = this.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...changes, lastAccessedAt: new Date().toISOString() };
    const db = this.getDb();
    const stmt = db.prepare(
      `UPDATE memories SET content=?, importance=?, confidence=?, keywords=?, accessCount=?, lastAccessedAt=?, expiresAt=?, tags=? WHERE id=?`
    );
    stmt.run(
      updated.content,
      updated.importance,
      updated.confidence,
      JSON.stringify(updated.keywords),
      updated.accessCount,
      updated.lastAccessedAt,
      updated.expiresAt,
      JSON.stringify(updated.tags),
      id
    );
    return updated;
  }

  delete(id: string): boolean {
    const db = this.getDb();
    const result = db.prepare("DELETE FROM memories WHERE id = ?").run(id);
    return result.changes > 0;
  }

  search(query: MemoryQuery): Memory[] {
    const db = this.getDb();
    let sql = "SELECT * FROM memories WHERE 1=1";
    const params: unknown[] = [];

    if (query.sessionId) {
      sql += " AND sessionId = ?";
      params.push(query.sessionId);
    }
    if (query.type) {
      sql += " AND type = ?";
      params.push(query.type);
    }
    if (query.minImportance !== undefined) {
      sql += " AND importance >= ?";
      params.push(query.minImportance);
    }
    if (query.tags && query.tags.length > 0) {
      sql += " AND tags LIKE ?";
      params.push(`%"${query.tags[0]}"%`);
    }
    if (query.queryText) {
      sql += ` AND id IN (SELECT rowid FROM memories_fts WHERE memories_fts MATCH ?)`;
      params.push(query.queryText);
    }

    sql += " ORDER BY importance DESC, createdAt DESC";
    if (query.limit) {
      sql += " LIMIT ?";
      params.push(query.limit);
    }

    const rows = db.prepare(sql).all(...params) as Record<string, unknown>[];
    return rows.map(this.mapRow);
  }

  getStats(sessionId?: string): MemoryStats {
    const db = this.getDb();
    const where = sessionId ? "WHERE sessionId = ?" : "";
    const params: unknown[] = sessionId ? [sessionId] : [];
    const total = db.prepare(`SELECT COUNT(*) as count FROM memories ${where}`).get(...params) as { count: number };
    const avgImportance = db.prepare(`SELECT AVG(importance) as avg FROM memories ${where}`).get(...params) as { avg: number };
    const byType = db
      .prepare(`SELECT type, COUNT(*) as count FROM memories ${where} GROUP BY type`)
      .all(...params) as Record<string, unknown>[];
    return {
      total: total.count,
      avgImportance: avgImportance.avg || 0,
      byType: Object.fromEntries(byType.map((r) => [r.type as string, r.count as number])),
    };
  }

  clear(sessionId?: string): void {
    const db = this.getDb();
    if (sessionId) {
      db.prepare("DELETE FROM memories WHERE sessionId = ?").run(sessionId);
    } else {
      db.prepare("DELETE FROM memories").run();
    }
  }

  private mapRow(row: Record<string, unknown>): Memory {
    return {
      id: row.id as string,
      sessionId: row.sessionId as string,
      type: row.type as MemoryType,
      content: row.content as string,
      importance: row.importance as number,
      confidence: row.confidence as number,
      keywords: JSON.parse((row.keywords as string) || "[]") as string[],
      accessCount: row.accessCount as number,
      createdAt: row.createdAt as string,
      expiresAt: row.expiresAt as string | undefined,
      lastAccessedAt: row.lastAccessedAt as string | undefined,
      tags: JSON.parse((row.tags as string) || "[]") as string[],
    };
  }
}
