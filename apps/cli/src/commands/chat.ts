import { Command } from "commander";
import { DefaultAgentRuntime } from "@clew/agents";

export function createChatCommand(): Command {
  const cmd = new Command("chat");
  cmd.description("Start a chat session");

  cmd.argument("[message]", "Initial message");
  cmd.option("-m, --model <model>", "Model to use");
  cmd.option("-p, --provider <provider>", "Provider to use");
  cmd.option("--session <id>", "Existing session ID");

  cmd.action(async (message: string | undefined, options: { model?: string; provider?: string; session?: string }) => {
    const runtime = new DefaultAgentRuntime();
    const messages = message ? [{ role: "user", content: message }] : [];
    const result = await runtime.run(
      {
        mode: "chat",
        cwd: process.cwd(),
        sessionId: options.session || crypto.randomUUID(),
        providerId: options.provider || "openai",
        modelId: options.model || "gpt-4o",
      },
      messages
    );
    console.log(result.text);
  });

  return cmd;
}
