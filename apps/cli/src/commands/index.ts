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
  program.name("clew").description("Clew - Your personal thread through code").version("0.1.0");

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
  const stubCommands = ["run", "plan", "code", "review", "fix", "test", "loop", "mcp", "skill", "bridge"];
  for (const name of stubCommands) {
    const stub = new Command(name);
    stub.description(`[stub] ${name} - not yet implemented`);
    stub.action(() => console.log(`"${name}" is not implemented yet.`));
    program.addCommand(stub);
  }

  return program;
}
