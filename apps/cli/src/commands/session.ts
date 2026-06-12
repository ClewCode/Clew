import { Command } from "commander";
import { listSessions, createSession, readSession, appendSessionEvent } from "@clew/core/session";

export function createSessionCommand(): Command {
  const cmd = new Command("session");
  cmd.description("Manage sessions");

  cmd.command("list")
    .description("List recent sessions")
    .action(() => {
      const sessions = listSessions();
      console.log(sessions.map((s: { id: string; createdAt: string; title?: string }) => `${s.id}\t${s.createdAt}\t${s.title || "(untitled)"}`).join("\n"));
    });

  cmd.command("new")
    .argument("[title]", "Session title")
    .action((title: string | undefined) => {
      const session = createSession(process.cwd(), title);
      console.log(`Created session ${session.id}`);
    });

  cmd.command("show")
    .argument("<id>", "Session ID")
    .action((id: string) => {
      const session = readSession(id);
      if (!session) {
        console.log("Session not found.");
        return;
      }
      console.log(JSON.stringify(session, null, 2));
    });

  cmd.command("event")
    .argument("<session-id>", "Session ID")
    .argument("<type>", "Event type")
    .argument("<content>", "Event content")
    .action((sessionId: string, type: string, content: string) => {
      const event = appendSessionEvent(sessionId, type, content);
      console.log(`Added event ${event.id}`);
    });

  return cmd;
}
