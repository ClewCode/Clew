import { existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { writeJsonFile } from "@clew/core/fs";

export const KeyStoreSchema = {};

export function getKeyStorePath(): string {
  return join(process.env.CLEW_HOME || process.env.HOME || process.env.USERPROFILE || ".", ".clew", "keys.json");
}

export function loadKeys(): Record<string, string> {
  const path = getKeyStorePath();
  if (!existsSync(path)) return {};
  try {
    return JSON.parse(require("fs").readFileSync(path, "utf-8")) as Record<string, string>;
  } catch {
    return {};
  }
}

export function saveKeys(keys: Record<string, string>): void {
  const path = getKeyStorePath();
  ensureDir(dirname(path));
  writeJsonFile(path, keys);
}

export function getKey(providerId: string): string | null {
  return loadKeys()[providerId] ?? null;
}

export function setKey(providerId: string, apiKey: string): void {
  const keys = loadKeys();
  keys[providerId] = apiKey;
  saveKeys(keys);
}

export function deleteKey(providerId: string): void {
  const keys = loadKeys();
  delete keys[providerId];
  saveKeys(keys);
}

export function listProviders(): string[] {
  return Object.keys(loadKeys());
}

function ensureDir(dir: string): void {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}
