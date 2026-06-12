import type { TasteProfile, TasteRule } from "@clew/core";

export class TasteStore {
  private profile: TasteProfile | null = null;

  load(profile: TasteProfile): void {
    this.profile = profile;
  }

  getProfile(): TasteProfile | null {
    return this.profile;
  }

  addRule(rule: TasteRule): void {
    if (!this.profile) throw new Error("Taste profile not loaded");
    this.profile.rules.push(rule);
  }

  removeRule(ruleId: string): void {
    if (!this.profile) return;
    this.profile.rules = this.profile.rules.filter((r) => r.id !== ruleId);
  }

  getRules(kind?: string): TasteRule[] {
    if (!this.profile) return [];
    if (!kind) return this.profile.rules;
    return this.profile.rules.filter((r) => r.kind === kind);
  }

  clear(): void {
    this.profile = null;
  }
}
