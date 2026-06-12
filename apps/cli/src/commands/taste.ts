import { Command } from "commander";
import { TasteStore, loadTasteProfile, saveTasteProfile } from "@clew/taste";

const store = new TasteStore();

export function createTasteCommand(): Command {
  const cmd = new Command("taste");
  cmd.description("Manage taste profile (coding & communication preferences)");

  cmd.command("show")
    .description("Show current taste rules")
    .action(() => {
      const profile = loadTasteProfile();
      const rules = profile.rules;
      if (rules.length === 0) {
        console.log("(no rules)");
        return;
      }
      for (const r of rules) {
        console.log(`  [${r.kind}] ${r.text}`);
      }
    });

  cmd.command("add")
    .argument("<rule-text>")
    .option("-k, --kind <kind>", "Rule kind", "style")
    .action((ruleText: string, options: { kind: string }) => {
      const profile = loadTasteProfile();
      store.load(profile);
      store.addRule({
        id: crypto.randomUUID(),
        kind: options.kind as "style" | "architecture" | "naming" | "security" | "performance" | "testing",
        text: ruleText,
        confidence: 0.5,
        tags: [],
      });
      const saved = saveTasteProfile(store.getProfile()!);
      if (saved) console.log("Taste rule added.");
      else console.log("Failed to save taste rule.");
    });

  cmd.command("dislike")
    .argument("<pattern>")
    .description("Register a dislike/preference")
    .action((pattern: string) => {
      const profile = loadTasteProfile();
      profile.dislikes.push(pattern);
      saveTasteProfile(profile);
      console.log(`Dislike registered: "${pattern}"`);
    });

  cmd.command("inspect")
    .description("Show full taste profile")
    .action(() => {
      const profile = loadTasteProfile();
      console.log(JSON.stringify(profile, null, 2));
    });

  return cmd;
}
