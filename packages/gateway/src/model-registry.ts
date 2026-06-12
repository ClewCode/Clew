export interface ModelInfo {
  id: string;
  providerId: string;
  displayName: string;
  capabilities: string[];
}

export const DEFAULT_MODELS: ModelInfo[] = [
  { id: "gpt-4o", providerId: "openai", displayName: "GPT-4o", capabilities: ["chat", "tools", "vision"] },
  { id: "gpt-4o-mini", providerId: "openai", displayName: "GPT-4o Mini", capabilities: ["chat", "tools"] },
  { id: "gpt-4-turbo", providerId: "openai", displayName: "GPT-4 Turbo", capabilities: ["chat", "tools", "vision"] },
  { id: "o1", providerId: "openai", displayName: "OpenAI o1", capabilities: ["chat"] },
  { id: "o1-mini", providerId: "openai", displayName: "OpenAI o1-mini", capabilities: ["chat"] },
  { id: "claude-sonnet-4-20250514", providerId: "anthropic", displayName: "Claude Sonnet 4", capabilities: ["chat", "tools", "vision"] },
  { id: "claude-3-5-haiku-20241022", providerId: "anthropic", displayName: "Claude 3.5 Haiku", capabilities: ["chat", "tools"] },
  { id: "claude-3-opus-20240229", providerId: "anthropic", displayName: "Claude 3 Opus", capabilities: ["chat", "tools", "vision"] },
  { id: "deepseek-chat", providerId: "deepseek", displayName: "DeepSeek Chat", capabilities: ["chat", "tools"] },
  { id: "deepseek-reasoner", providerId: "deepseek", displayName: "DeepSeek Reasoner", capabilities: ["chat"] },
  { id: "gemini-2.0-flash", providerId: "google", displayName: "Gemini 2.0 Flash", capabilities: ["chat", "tools", "vision"] },
  { id: "gemini-1.5-pro", providerId: "google", displayName: "Gemini 1.5 Pro", capabilities: ["chat", "tools", "vision"] },
  { id: "llama3.1:70b", providerId: "ollama", displayName: "Llama 3.1 70B", capabilities: ["chat", "tools"] },
  { id: "llama3.1:8b", providerId: "ollama", displayName: "Llama 3.1 8B", capabilities: ["chat", "tools"] },
];

export function getModelsForProvider(providerId: string): ModelInfo[] {
  return DEFAULT_MODELS.filter((m) => m.providerId === providerId);
}

export function resolveModel(modelId: string): ModelInfo | undefined {
  return DEFAULT_MODELS.find((m) => m.id === modelId);
}
