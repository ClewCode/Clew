import { Command } from "commander";
import { createInitCommand } from "./init.js";
import { createDoctorCommand } from "./doctor.js";
import { createConfigCommand } from "./config.js";
import { createKeyCommand } from "./key.js";
import { createModelCommand } from "./model.js";
import { createChatCommand } from "./chat.js";
import { createMemoryCommand } from "./memory.js";
import { createTasteCommand } from "./taste.js";
import { createSessionCommand } from "./session.js";

export function buildRootCommand(): Command {
  const program = new Command();
  program.name("clew").description("Clew \u2014 your personal thread through code").version("0.1.0");

  program.addCommand(createInitCommand());
  program.addCommand(createDoctorCommand());
  program.addCommand(createConfigCommand());
  program.addCommand(createKeyCommand());
  program.addCommand(createModelCommand());
  program.addCommand(createChatCommand());
  program.addCommand(createMemoryCommand());
  program.addCommand(createTasteCommand());
  program.addCommand(createSessionCommand());

  // Stubs for planned commands
  const stubs: [string, string][] = [
    ["run", "Run a one-shot task using the default model [planned]"],
    ["plan", "Generate an implementation plan without editing files [planned]"],
    ["code", "Write code based on a plan or prompt [planned]"],
    ["review", "Review a git diff or set of changes [planned]"],
    ["fix", "Analyze and fix an error or test failure [planned]"],
    ["test", "Run tests and debug failures [planned]"],
    ["loop", "Bounded repo check \u2014 summarize state, suggest next tasks [planned]"],
    ["mcp", "Manage MCP servers and expose Clew tools over MCP [planned]"],
    ["skill", "List, add, and run local skills [planned]"],
    ["bridge", "WebSocket bridge for remote approval and dashboard [planned]"],
  ];
  for (const [name, desc] of stubs) {
    const stub = new Command(name);
    stub.description(desc);
    stub.action(() => {
      console.log(`"clew ${name}" is not yet implemented.`);
      console.log("See: https://github.com/ClewCode/Clew");
    });
    program.addCommand(stub);
  }

  return program;
}
