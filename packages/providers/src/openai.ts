import { OpenAICompatibleProvider, OpenAICompatibleConfig } from "./openai-compatible.js";

export function createOpenAIProvider(apiKey: string): OpenAICompatibleProvider {
  return new OpenAICompatibleProvider({
    id: "openai",
    type: "openai-compatible",
    baseUrl: "https://api.openai.com/v1",
    apiKey,
  });
}
