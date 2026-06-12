import { LlmProvider } from "./types.js";

const registry = new Map<string, LlmProvider>();

export function registerProvider(provider: LlmProvider): void {
  registry.set(provider.id, provider);
}

export function getProvider(id: string): LlmProvider | undefined {
  return registry.get(id);
}

export function getAllProviders(): LlmProvider[] {
  return Array.from(registry.values());
}

export function hasProvider(id: string): boolean {
  return registry.has(id);
}
