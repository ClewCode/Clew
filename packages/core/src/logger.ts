export type LogLevel = "debug" | "info" | "warn" | "error";

const LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

let currentLevel: LogLevel = "info";

export function setLogLevel(level: LogLevel) {
  currentLevel = level;
}

export function log(level: LogLevel, message: string, meta?: unknown) {
  if (LEVELS[level] < LEVELS[currentLevel]) return;
  const prefix = `[clew:${level}]`;
  const metaStr = meta !== undefined ? ` ${JSON.stringify(meta)}` : "";
  console.error(`${prefix} ${message}${metaStr}`);
}

export const logger = {
  debug: (message: string, meta?: unknown) => log("debug", message, meta),
  info: (message: string, meta?: unknown) => log("info", message, meta),
  warn: (message: string, meta?: unknown) => log("warn", message, meta),
  error: (message: string, meta?: unknown) => log("error", message, meta),
};
