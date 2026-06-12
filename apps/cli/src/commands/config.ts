import { Command } from "commander";
import { loadConfig, saveConfig, type ClewConfig } from "@clew/core/config";

export function createConfigCommand(): Command {
  const cmd = new Command("config");
  cmd.description("Read and write clew configuration");

  cmd.command("get")
    .description("Get current configuration")
    .action(() => {
      const config = loadConfig();
      console.log(JSON.stringify(config, null, 2));
    });

  cmd.command("set")
    .description("Set a configuration value")
    .argument("<key>")
    .argument("<value>")
    .action((key: string, value: string) => {
      const config = loadConfig();
      const updated = { ...config, [key]: JSON.parse(value) } as Partial<ClewConfig>;
      saveConfig({ ...config, ...updated } as ClewConfig);
      console.log(`Set ${key}`);
    });

  return cmd;
}
