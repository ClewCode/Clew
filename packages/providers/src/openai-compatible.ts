import { ChatMessage, ChatRequest, ChatResponse, LlmProvider } from "./types.js";

export interface OpenAICompatibleConfig {
  id: string;
  baseUrl: string;
  apiKey?: string;
  type: "openai-compatible";
}

export class OpenAICompatibleProvider implements LlmProvider {
  id: string;
  type: string;
  private baseUrl: string;
  private apiKey: string | undefined;

  constructor(config: OpenAICompatibleConfig) {
    this.id = config.id;
    this.type = config.type;
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.apiKey = config.apiKey;
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const url = `${this.baseUrl}/chat/completions`;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: request.model,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.maxTokens,
        stream: false,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Provider ${this.id} error ${res.status}: ${text}`);
    }

    const data = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
      usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
      model?: string;
    };

    const content = data.choices?.[0]?.message?.content ?? "";
    return {
      content,
      model: data.model ?? request.model,
      provider: this.id,
      usage: {
        inputTokens: data.usage?.prompt_tokens,
        outputTokens: data.usage?.completion_tokens,
        totalTokens: data.usage?.total_tokens,
      },
    };
  }

  async listModels(): Promise<string[]> {
    const url = `${this.baseUrl}/models`;
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (this.apiKey) {
      headers["Authorization"] = `Bearer ${this.apiKey}`;
    }

    const res = await fetch(url, { headers });
    if (!res.ok) return [];
    const data = (await res.json()) as { data?: Array<{ id: string }> };
    return data.data?.map((m) => m.id) ?? [];
  }
}
