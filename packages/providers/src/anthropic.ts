import { ChatMessage, ChatRequest, ChatResponse, LlmProvider } from "./types.js";

export class AnthropicProvider implements LlmProvider {
  id: string;
  type: string;
  private apiKey: string;

  constructor(id: string, apiKey: string) {
    this.id = id;
    this.type = "anthropic";
    this.apiKey = apiKey;
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const url = "https://api.anthropic.com/v1/messages";
    const systemMessage = request.messages.filter((m) => m.role === "system").map((m) => m.content).join("\n");
    const userMessages = request.messages.filter((m) => m.role !== "system");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model: request.model,
        max_tokens: request.maxTokens ?? 4096,
        system: systemMessage || undefined,
        messages: userMessages.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content,
        })),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Anthropic error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
      model?: string;
      usage?: { input_tokens?: number; output_tokens?: number };
    };

    const content = data.content?.map((c) => c.text || "").join("") ?? "";

    return {
      content,
      model: data.model ?? request.model,
      provider: this.id,
      usage: {
        inputTokens: data.usage?.input_tokens,
        outputTokens: data.usage?.output_tokens,
      },
    };
  }

  async listModels(): Promise<string[]> {
    // Anthropic doesn't expose a public model list API.
    // Return empty and rely on manual entries.
    return [];
  }
}
