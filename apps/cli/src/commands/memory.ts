import { Command } from "commander";
import { MemoryStore } from "@clew/memory";

const store = new MemoryStore();

export function createMemoryCommand(): Command {
  const cmd = new Command("memory");
  cmd.description("Manage memory store");

  cmd.command("add")
    .argument("<content>")
    .option("-t, --type <type>", "Memory type", "note")
    .option("-s, --session <id>", "Session ID", crypto.randomUUID())
    .action((content: string, options: { type: string; session: string }) => {
      const memory = store.add({
        sessionId: options.session,
        type: options.type as "note" | "decision" | "error" | "reference",
        content,
        importance: 0.5,
        confidence: 0.8,
        keywords: [],
        tags: [],
        accessCount: 0,
      });
      console.log(`Stored memory ${memory.id}`);
    });

  cmd.command("search")
    .argument("[query]")
    .option("-l, --limit <n>", "Limit results", "10")
    .action((query: string | undefined, options: { limit: string }) => {
      const results = store.search({ queryText: query, limit: parseInt(options.limit, 10) });
      console.log(results.map((m) => `[${m.type}] ${m.content}`).join("\n"));
    });

  cmd.command("clear")
    .description("Clear all memories")
    .action(() => {
      store.clear();
      console.log("Memories cleared.");
    });

  return cmd;
}
