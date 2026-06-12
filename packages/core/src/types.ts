
export interface ClewSession {
  id: string;
  createdAt: string;
  updatedAt: string;
  cwd: string;
  title?: string;
}

export type MemoryType = "note" | "decision" | "error" | "reference";

export interface Memory {
  id: string;
  sessionId: string;
  type: MemoryType;
  content: string;
  importance: number;
  confidence: number;
  keywords: string[];
  accessCount: number;
  createdAt: string;
  lastAccessedAt?: string;
  expiresAt?: string;
  tags: string[];
}

export interface MemoryQuery {
  sessionId?: string;
  type?: MemoryType;
  minImportance?: number;
  tags?: string[];
  queryText?: string;
  limit?: number;
}

export interface MemoryStats {
  total: number;
  avgImportance: number;
  byType: Record<string, number>;
}

export interface TasteProfile {
  rules: TasteRule[];
}

export interface TasteRule {
  id: string;
  kind: string;
  text: string;
  confidence: number;
  tags: string[];
}

export interface Tool {
  name: string;
  description: string;
  execute(args: Record<string, unknown>): Promise<unknown>;
}

export interface ToolResult {
  ok: boolean;
  data?: unknown;
  error?: string;
  durationMs?: number;
}

