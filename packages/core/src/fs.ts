import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "fs";
import { join } from "path";
import { ClewError } from "./errors.js";

export function getClewHome(): string {
  const home = process.env.CLEW_HOME || join(process.env.HOME || process.env.USERPROFILE || ".", ".clew");
  return home;
}

export function ensureClewHome(): string {
  const home = getClewHome();
  if (!existsSync(home)) {
    mkdirSync(home, { recursive: true });
  }
  return home;
}

export function ensureDir(dirPath: string): void {
  if (!existsSync(dirPath)) {
    mkdirSync(dirPath, { recursive: true });
  }
}

export function readJsonFile<T>(path: string): T {
  try {
    const raw = readFileSync(path, "utf-8");
    return JSON.parse(raw) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      throw new ClewError(`File not found: ${path}`);
    }
    throw new ClewError(`Failed to read JSON: ${(err as Error).message}`);
  }
}

export function writeJsonFile<T>(path: string, data: T): void {
  const dir = require("path").dirname(path);
  ensureDir(dir);
  writeFileSync(path, JSON.stringify(data, null, 2), "utf-8");
}

export function fileExists(path: string): boolean {
  return existsSync(path);
}

export function getFileSize(path: string): number {
  try {
    return statSync(path).size;
  } catch {
    return 0;
  }
}
