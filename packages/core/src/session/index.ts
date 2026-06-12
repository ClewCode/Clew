import { randomUUID } from "crypto";
import { writeJsonFile, ensureClewHome } from "../fs.js";
import { readJsonFile } from "../fs.js";
import { dirname, join } from "path";
import { existsSync, readdirSync } from "fs";
import type { ClewSessionEvent } from "../events.js";
import type { ClewSession } from "../types.js";

export function getSessionsDir(): string {
  return `${ensureClewHome()}/sessions`;
}

export function getSessionPath(id: string): string {
  return `${getSessionsDir()}/${id}.json`;
}

export function getSessionEventsPath(id: string): string {
  return `${getSessionsDir()}/${id}-events.json`;
}

export function createSession(cwd: string, title?: string): ClewSession {
  const session: ClewSession = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    cwd,
    title,
  };
  writeJsonFile(getSessionPath(session.id), session);
  return session;
}

export function readSession(id: string): ClewSession | null {
  try {
    return readJsonFile<ClewSession>(getSessionPath(id));
  } catch {
    return null;
  }
}

export function appendSessionEvent(sessionId: string, type: string, payload: unknown): ClewSessionEvent {
  const event: ClewSessionEvent = {
    id: randomUUID(),
    sessionId,
    type,
    createdAt: new Date().toISOString(),
    payload,
  };
  const path = getSessionEventsPath(sessionId);
  const dir = join(path, "..");
  try {
    const events: ClewSessionEvent[] = readJsonFile<ClewSessionEvent[]>(path);
    events.push(event);
    writeJsonFile(path, events);
  } catch {
    writeJsonFile(path, [event]);
  }
  return event;
}

export function listSessions(): ClewSession[] {
  const dir = getSessionsDir();
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter((f: string) => f.endsWith(".json") && !f.endsWith("-events.json"));
  const sessions: ClewSession[] = [];
  for (const file of files) {
    try {
      const session = readJsonFile<ClewSession>(`${dir}/${file}`);
      sessions.push(session);
    } catch {
      // skip corrupted sessions
    }
  }
  return sessions.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}
