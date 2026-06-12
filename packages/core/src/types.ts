
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
  version: number;
  rules: TasteRule[];
  likes: string[];
  dislikes: string[];
  codingStyle: Record<string, unknown>;
  docStyle: {
    direct: boolean;
    avoidAiSlop: boolean;
  };
  signals: TasteSignal[];
}

export interface TasteRule {
  id: string;
  kind: string;
  text: string;
  confidence: number;
  tags: string[];
}

export type TasteSignalType =
  | "accept"
  | "reject"
  | "edit"
  | "undo"
  | "correction"
  | "preferred"
  | "disliked"
  | "wrong";

export interface TasteSignal {
  id: string;
  type: TasteSignalType;
  content: string;
  context?: string;
  createdAt: string;
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

