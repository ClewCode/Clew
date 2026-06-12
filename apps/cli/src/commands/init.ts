import { Command } from "commander";
import { ensureClewHome } from "@clew/core/fs";
import { saveConfig, DEFAULT_CONFIG } from "@clew/core/config";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";

const DEFAULT_PROVIDERS_JSON = JSON.stringify(
  {
    providers: {
      openai: { type: "openai", baseUrl: "https://api.openai.com/v1", models: [] },
      anthropic: { type: "anthropic", baseUrl: "https://api.anthropic.com", models: [] },
      openrouter: { type: "openai-compatible", baseUrl: "https://openrouter.ai/api/v1", models: [] },
      deepseek: { type: "openai-compatible", baseUrl: "https://api.deepseek.com/v1", models: [] },
      google: { type: "google", baseUrl: null, models: [] },
      ollama: { type: "ollama", baseUrl: "http://localhost:11434", models: [] },
    },
  },
  null,
  2
);

const DEFAULT_TASTE_JSON = JSON.stringify(
  {
    version: 1,
    rules: [],
    likes: [],
    dislikes: [],
    codingStyle: {},
    docStyle: { direct: true, avoidAiSlop: true },
    signals: [],
  },
  null,
  2
);

export function createInitCommand(): Command {
  const cmd = new Command("init");
  cmd.description("Initialize clew configuration and directories");
  cmd.action(() => {
    const home = ensureClewHome();
    const dirs = ["sessions", "logs", "skills", "plugins", "cache"];

    // Create config
    const configPath = join(home, "config.json");
    if (!existsSync(configPath)) {
      saveConfig(DEFAULT_CONFIG);
      console.log(`Created config at ${configPath}`);
    } else {
      console.log(`Config exists at ${configPath}`);
    }

    // Create providers.json
    const providersPath = join(home, "providers.json");
    if (!existsSync(providersPath)) {
      writeFileSync(providersPath, DEFAULT_PROVIDERS_JSON);
      console.log(`Created providers at ${providersPath}`);
    }

    // Create taste.json
    const tastePath = join(home, "taste.json");
    if (!existsSync(tastePath)) {
      writeFileSync(tastePath, DEFAULT_TASTE_JSON);
      console.log(`Created taste profile at ${tastePath}`);
    }

    // Create subdirectories
    for (const dir of dirs) {
      const p = join(home, dir);
      if (!existsSync(p)) {
        mkdirSync(p, { recursive: true });
        console.log(`Created ${p}`);
      }
    }

    console.log("\nClew initialized at " + home);
  });
  return cmd;
}
