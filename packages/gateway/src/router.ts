import { LlmProvider } from "@clew/providers";
import { ModelInfo, resolveModel } from "./model-registry.js";
import { getKey, listProviders } from "./keystore.js";

export interface ProviderWithKey {
  provider: LlmProvider;
  hasKey: boolean;
}

export function getProviderForModel(modelId: string, providers: Map<string, LlmProvider>): LlmProvider | null {
  const info = resolveModel(modelId);
  if (!info) return null;
  return providers.get(info.providerId) ?? null;
}

export function ensureProviderReady(providerId: string, providers: Map<string, LlmProvider>): ProviderWithKey | null {
  const provider = providers.get(providerId);
  if (!provider) return null;
  const hasKey = getKey(providerId) !== null;
  if (!hasKey) return null;
  return { provider, hasKey: true };
}

export function listAvailableProviders(providers: Map<string, LlmProvider>): ProviderWithKey[] {
  const configured = listProviders();
  return Array.from(providers.values())
    .filter((p) => configured.includes(p.id))
    .map((p) => ({ provider: p, hasKey: true }));
}

export function getModelInfo(modelId: string): ModelInfo | undefined {
  return resolveModel(modelId);
}
