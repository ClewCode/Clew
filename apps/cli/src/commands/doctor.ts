import { Command } from "commander";
import { existsSync } from "fs";
import { join } from "path";
import { getConfigPath } from "@clew/core/config";
import { getClewHome } from "@clew/core/fs";
import { listProviders } from "@clew/gateway";

export function createDoctorCommand(): Command {
  const cmd = new Command("doctor");
  cmd.description("Check clew environment and provider connectivity");
  cmd.action(() => {
    console.log("clew doctor\n");

    // Node version
    console.log(`Node: ${process.version}`);

    // Clew home
    const home = getClewHome();
    const homeExists = existsSync(home);
    console.log(`Clew home: ${home} ${homeExists ? "✓" : "✗ (run 'clew init')"}`);

    if (homeExists) {
      const dirs = ["sessions", "logs", "skills", "plugins", "cache"];
      for (const dir of dirs) {
        const p = join(home, dir);
        console.log(`  ${dir}/ ${existsSync(p) ? "✓" : "✗"}`);
      }

      const files = ["config.json", "providers.json", "taste.json"];
      for (const f of files) {
        const p = join(home, f);
        console.log(`  ${f} ${existsSync(p) ? "✓" : "✗"}`);
      }
    }

    // Providers
    const providers = listProviders();
    console.log(`\nProviders with keys: ${providers.length > 0 ? providers.join(", ") : "(none)"}`);

    if (providers.length === 0) {
      console.log("\nNo provider keys configured.");
      console.log("Run: clew key add <provider>");
    }

    console.log("\nDoctor check complete.");
  });
  return cmd;
}
