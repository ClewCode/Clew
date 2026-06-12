import type { TasteRule } from "@clew/core";

export type AgentMode = "chat" | "plan" | "code" | "review" | "fix" | "test" | "release" | "maintain";

export interface AgentContext {
  mode: AgentMode;
  cwd: string;
  sessionId: string;
  providerId: string;
  modelId: string;
  taste?: TasteRule[];
}

export interface AgentResult {
  text: string;
  toolCalls?: ToolCall[];
  mode: AgentMode;
  tokensUsed?: { prompt: number; completion: number };
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
  error?: string;
}

export interface ToolPermission {
  tool: string;
  permission: "read" | "write" | "execute" | "network" | "git";
  reason?: string;
}
