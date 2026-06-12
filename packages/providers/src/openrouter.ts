import { OpenAICompatibleProvider, OpenAICompatibleConfig } from "./openai-compatible.js";

export function createOpenRouterProvider(apiKey: string): OpenAICompatibleProvider {
  return new OpenAICompatibleProvider({
    id: "openrouter",
    type: "openai-compatible",
    baseUrl: "https://openrouter.ai/api/v1",
    apiKey,
  });
}
