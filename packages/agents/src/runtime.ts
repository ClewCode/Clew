import { randomUUID } from "crypto";
import type { AgentContext, AgentResult, ToolCall } from "./types.js";
import { ToolPermissionManager } from "@clew/tools";

export interface AgentRuntime {
  run(context: AgentContext, messages: { role: string; content: string }[]): Promise<AgentResult>;
  executeToolCall(toolCall: ToolCall, permissions: ToolPermissionManager): Promise<unknown>;
}

export class DefaultAgentRuntime implements AgentRuntime {
  async run(context: AgentContext, messages: { role: string; content: string }[]): Promise<AgentResult> {
    // Stub: returns a placeholder result
    return {
      text: `[Agent stub] Mode: ${context.mode}\nThis is a placeholder. Wire up the provider gateway in a later pass.`,
      mode: context.mode,
      toolCalls: [],
    };
  }

  async executeToolCall(toolCall: ToolCall, permissions: ToolPermissionManager): Promise<unknown> {
    // Stub: returns a placeholder result
    return { ok: false, error: "Tool execution not yet implemented" };
  }
}
