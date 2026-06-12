import { randomUUID } from "crypto";
import type { Tool, ToolResult } from "@clew/core";

export class ToolRegistry {
  private tools = new Map<string, Tool>();

  register(tool: Tool): void {
    this.tools.set(tool.name, tool);
  }

  unregister(name: string): boolean {
    return this.tools.delete(name);
  }

  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  list(): Tool[] {
    return Array.from(this.tools.values());
  }

  async execute(name: string, args: Record<string, unknown>): Promise<ToolResult> {
    const tool = this.tools.get(name);
    if (!tool) {
      return { ok: false, error: `Tool not found: ${name}` };
    }
    try {
      const result = await tool.execute(args);
      return { ok: true, data: result, durationMs: 0 };
    } catch (error) {
      return { ok: false, error: (error as Error).message };
    }
  }
}
