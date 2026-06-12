import { OpenAICompatibleProvider, OpenAICompatibleConfig } from "./openai-compatible.js";

export function createDeepSeekProvider(apiKey: string): OpenAICompatibleProvider {
  return new OpenAICompatibleProvider({
    id: "deepseek",
    type: "openai-compatible",
    baseUrl: "https://api.deepseek.com/v1",
    apiKey,
  });
}
