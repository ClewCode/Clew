import { Command } from "commander";
import { setKey, getKey, deleteKey, listProviders } from "@clew/gateway";

export function createKeyCommand(): Command {
  const cmd = new Command("key");
  cmd.description("Manage API keys for providers");

  cmd.command("add")
    .argument("<provider>")
    .argument("<api-key>")
    .description("Store API key for a provider")
    .action((provider: string, apiKey: string) => {
      setKey(provider, apiKey);
      console.log(`Stored key for ${provider}`);
    });

  cmd.command("set")
    .argument("<provider>")
    .argument("<api-key>")
    .description("Store API key for a provider")
    .action((provider: string, apiKey: string) => {
      setKey(provider, apiKey);
      console.log(`Stored key for ${provider}`);
    });

  cmd.command("get")
    .argument("<provider>")
    .description("Show stored API key for a provider (masked)")
    .action((provider: string) => {
      const key = getKey(provider);
      if (!key) {
        console.log(`No key stored for ${provider}`);
        return;
      }
      const masked = key.slice(0, 4) + "****" + key.slice(-4);
      console.log(`${provider}: ${masked}`);
    });

  cmd.command("list")
    .description("List providers with stored keys")
    .action(() => {
      const providers = listProviders();
      console.log(providers.length > 0 ? providers.join("\n") : "(none)");
    });

  cmd.command("delete")
    .argument("<provider>")
    .description("Remove stored API key for a provider")
    .action((provider: string) => {
      deleteKey(provider);
      console.log(`Removed key for ${provider}`);
    });

  return cmd;
}
