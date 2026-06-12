import { existsSync } from "fs";
import { dirname, join } from "path";
import { mkdirSync } from "fs";
import { readJsonFile, writeJsonFile } from "@clew/core/fs";
import type { TasteProfile } from "@clew/core";

export function getTasteProfilePath(): string {
  return process.env.CLEW_TASTE_FILE || join(process.env.CLEW_HOME || process.env.HOME || process.env.USERPROFILE || ".", ".clew", "taste.json");
}

export function loadTasteProfile(): TasteProfile {
  const path = getTasteProfilePath();
  if (!existsSync(path)) {
    return { rules: [] };
  }
  try {
    return readJsonFile<TasteProfile>(path);
  } catch {
    return { rules: [] };
  }
}

export function saveTasteProfile(profile: TasteProfile): void {
  const path = getTasteProfilePath();
  mkdirSync(dirname(path), { recursive: true });
  writeJsonFile(path, profile);
}
