import { existsSync, readdirSync, readFileSync } from "fs";
import { dirname, join } from "path";
import type { SkillDefinition, SkillManifest } from "./types.js";

const SKILLS_DIR = join(process.env.CLEW_HOME || process.env.HOME || process.env.USERPROFILE || ".", ".clew", "skills");

export function getSkillsDir(): string {
  return process.env.CLEW_SKILLS_DIR || SKILLS_DIR;
}

export function listSkills(): SkillDefinition[] {
  const dir = getSkillsDir();
  if (!existsSync(dir)) return [];
  const entries = readdirSync(dir, { withFileTypes: true });
  const skills: SkillDefinition[] = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const skillDir = join(dir, entry.name);
    const manifestPath = join(skillDir, "skill.json");
    if (!existsSync(manifestPath)) continue;
    try {
      const raw = readFileSync(manifestPath, "utf-8");
      const manifest = JSON.parse(raw) as SkillDefinition;
      skills.push({ ...manifest, name: manifest.name || entry.name });
    } catch {
      // Skip invalid skill manifests
    }
  }
  return skills;
}

export function loadSkill(name: string): SkillManifest | null {
  const skills = listSkills();
  const skill = skills.find((s) => s.name === name);
  if (!skill) return null;
  return {
    ...skill,
    path: join(getSkillsDir(), name),
  };
}

export function validateSkill(definition: SkillDefinition): boolean {
  return !!definition.name && !!definition.description;
}
