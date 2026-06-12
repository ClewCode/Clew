import { ChatMessage, ChatRequest, ChatResponse, LlmProvider } from "./types.js";

export interface OllamaConfig {
  id: string;
  baseUrl: string;
  type: "ollama";
}

export class OllamaProvider implements LlmProvider {
  id: string;
  type: string;
  private baseUrl: string;

  constructor(config: OllamaConfig) {
    this.id = config.id;
    this.type = config.type;
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const url = `${this.baseUrl}/api/chat`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: request.model,
        messages: request.messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
        stream: false,
        options: { temperature: request.temperature ?? 0.7 },
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Ollama error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      message?: { content?: string };
      model?: string;
      prompt_eval_count?: number;
      eval_count?: number;
    };

    return {
      content: data.message?.content ?? "",
      model: data.model ?? request.model,
      provider: this.id,
      usage: {
        inputTokens: data.prompt_eval_count,
        outputTokens: data.eval_count,
      },
    };
  }

  async listModels(): Promise<string[]> {
    const url = `${this.baseUrl}/api/tags`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = (await res.json()) as { models?: Array<{ name: string }> };
    return data.models?.map((m) => m.name) ?? [];
  }
}
