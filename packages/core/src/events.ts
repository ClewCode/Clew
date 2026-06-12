export type ClewSessionEvent = {
  id: string;
  sessionId: string;
  type: string;
  createdAt: string;
  payload: unknown;
};

export type EventType =
  | "message"
  | "tool_call"
  | "tool_result"
  | "file_write"
  | "shell_command"
  | "git_action"
  | "error"
  | "system";

export class EventEmitter {
  private listeners: Map<string, Array<(payload: unknown) => void>> = new Map();

  on(type: string, fn: (payload: unknown) => void) {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(fn);
    return () => this.off(type, fn);
  }

  off(type: string, fn: (payload: unknown) => void) {
    const arr = this.listeners.get(type);
    if (arr) {
      const idx = arr.indexOf(fn);
      if (idx >= 0) arr.splice(idx, 1);
    }
  }

  emit(type: string, payload: unknown) {
    const arr = this.listeners.get(type);
    if (arr) {
      for (const fn of arr) {
        try {
          fn(payload);
        } catch (err) {
          console.error(`[event:${type}] listener error`, err);
        }
      }
    }
  }

  removeAll() {
    this.listeners.clear();
  }
}

export const globalEvents = new EventEmitter();
