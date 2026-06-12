import { ChatMessage, ChatRequest, ChatResponse, LlmProvider } from "./types.js";
import { OpenAICompatibleProvider } from "./openai-compatible.js";

export function createGoogleProvider(apiKey: string): OpenAICompatibleProvider {
  return new OpenAICompatibleProvider({
    id: "google",
    type: "openai-compatible",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    apiKey,
  });
}
