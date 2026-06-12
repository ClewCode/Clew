export interface SkillDefinition {
  name: string;
  description: string;
  version?: string;
  prompt?: string;
  args?: Record<string, { description: string; required?: boolean }>;
}

export interface SkillManifest extends SkillDefinition {
  path: string;
}

export interface SkillRunOptions {
  args?: Record<string, string>;
}

export interface SkillRunResult {
  success: boolean;
  output?: string;
  error?: string;
}
