import { Command } from "commander";
import { DEFAULT_MODELS, getModelsForProvider } from "@clew/gateway";
import { loadConfig, saveConfig } from "@clew/core/config";

export function createModelCommand(): Command {
  const cmd = new Command("model");
  cmd.description("Manage model selection");

  cmd.command("list")
    .description("List available models")
    .option("-p, --provider <provider>", "Filter by provider")
    .action((options: { provider?: string }) => {
      const models = options.provider ? getModelsForProvider(options.provider) : DEFAULT_MODELS;
      if (models.length === 0) {
        console.log("(no models configured)");
        return;
      }
      for (const m of models) {
        const current = loadConfig().defaultModel;
        const mark = m.id === current ? " *" : "";
        console.log(`  ${m.id} (${m.providerId})${mark}`);
      }
    });

  cmd.command("add")
    .argument("<model-id>")
    .description("Register a model (format: provider/model-name)")
    .action((modelId: string) => {
      console.log(`Model "${modelId}" registered (persistent storage not yet implemented).`);
      console.log("This will be saved to providers.json in a future update.");
    });

  cmd.command("use")
    .argument("<model-id>")
    .description("Set default model (format: provider/model-name)")
    .action((modelId: string) => {
      const config = loadConfig();
      config.defaultModel = modelId;
      saveConfig(config);
      console.log(`Default model set to ${modelId}`);
    });

  return cmd;
}
