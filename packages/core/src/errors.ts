export class ClewError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ClewError";
  }
}

export class ConfigError extends ClewError {
  constructor(message: string) {
    super(message);
    this.name = "ConfigError";
  }
}

export class ProviderError extends ClewError {
  constructor(message: string) {
    super(message);
    this.name = "ProviderError";
  }
}

export class MemoryError extends ClewError {
  constructor(message: string) {
    super(message);
    this.name = "MemoryError";
  }
}

export class PermissionError extends ClewError {
  constructor(message: string) {
    super(message);
    this.name = "PermissionError";
  }
}

export class ToolError extends ClewError {
  constructor(message: string) {
    super(message);
    this.name = "ToolError";
  }
}
