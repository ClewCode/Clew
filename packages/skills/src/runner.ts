import type { SkillDefinition, SkillRunOptions, SkillRunResult } from "./types.js";

export class SkillRunner {
  async run(skill: SkillDefinition, options: SkillRunOptions = {}): Promise<SkillRunResult> {
    // Stub: Skill execution not yet implemented
    // In a full implementation, this would:
    // 1. Resolve skill script or prompt
    // 2. Execute it (possibly in a sandbox)
    // 3. Capture output
    return {
      success: false,
      error: "Skill execution not yet implemented",
    };
  }
}
