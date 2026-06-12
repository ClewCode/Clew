import { z } from "zod";
import { readJsonFile, writeJsonFile, ensureClewHome } from "../fs.js";
import { ClewError } from "../errors.js";

export const ClewConfigSchema = z.object({
  version: z.number().default(1),
  defaultProvider: z.string().nullable().default(null),
  defaultModel: z.string().nullable().default(null),
  workspaceMode: z.literal("personal").default("personal"),
  approvalMode: z.enum(["manual", "auto-safe", "auto"]).default("manual"),
  memory: z.object({
    enabled: z.boolean().default(true),
    recallLimit: z.number().default(12),
  }),
  taste: z.object({
    enabled: z.boolean().default(true),
  }),
  telemetry: z.object({
    enabled: z.boolean().default(false),
  }),
});

export type ClewConfig = z.infer<typeof ClewConfigSchema>;

export const DEFAULT_CONFIG: ClewConfig = {
  version: 1,
  defaultProvider: null,
  defaultModel: null,
  workspaceMode: "personal",
  approvalMode: "manual",
  memory: { enabled: true, recallLimit: 12 },
  taste: { enabled: true },
  telemetry: { enabled: false },
};

export function getConfigPath(): string {
  return `${ensureClewHome()}/config.json`;
}

export function loadConfig(): ClewConfig {
  const path = getConfigPath();
  try {
    const raw = readJsonFile<unknown>(path);
    return ClewConfigSchema.parse(raw);
  } catch {
    saveConfig(DEFAULT_CONFIG);
    return DEFAULT_CONFIG;
  }
}

export function saveConfig(config: ClewConfig): void {
  writeJsonFile(getConfigPath(), config);
}
