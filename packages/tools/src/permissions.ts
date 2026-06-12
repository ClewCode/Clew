export type ToolPermissionLevel = "read" | "write" | "execute" | "network" | "git";

export interface ToolPermission {
  tool: string;
  level: ToolPermissionLevel;
  reason?: string;
}

export interface PermissionGate {
  required: ToolPermissionLevel;
  granted: boolean;
}

export class ToolPermissionManager {
  private grants: Map<string, ToolPermissionLevel> = new Map();

  constructor(private defaultLevel: ToolPermissionLevel = "read") {}

  request(tool: string, level: ToolPermissionLevel): PermissionGate {
    const granted = this.grants.get(tool) === level || this.grants.get(tool) === "execute";
    return { required: level, granted };
  }

  grant(tool: string, level: ToolPermissionLevel): void {
    this.grants.set(tool, level);
  }

  revoke(tool: string): void {
    this.grants.delete(tool);
  }

  canRead(tool: string): boolean {
    return this.request(tool, "read").granted;
  }

  canWrite(tool: string): boolean {
    return this.request(tool, "write").granted;
  }

  canExecute(tool: string): boolean {
    return this.request(tool, "execute").granted;
  }
}
