import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LANG_OPTIONS } from "./i18n";
import { agentGuide } from "./i18nAgents";

describe("agent guide copy", () => {
  it("covers every UI language with the stepper fields", () => {
    for (const { id } of LANG_OPTIONS) {
      const c = agentGuide(id);
      expect(c.title.length).toBeGreaterThan(4);
      expect(c.s1t.length).toBeGreaterThan(1);
      expect(c.s1b.length).toBeGreaterThan(4);
      expect(c.s2q.length).toBeGreaterThan(10);
      expect(c.s3note.length).toBeGreaterThan(4);
      expect(c.dl.length).toBeGreaterThan(2);
      expect(c.cli.length).toBeGreaterThan(2);
      expect(c.cliBody.length).toBeGreaterThan(10);
    }
  });

  it("has no em dash or en dash and no standalone MR", () => {
    for (const { id } of LANG_OPTIONS) {
      const blob = Object.values(agentGuide(id)).join("\n");
      expect(blob, id).not.toMatch(/[–—]/);
      expect(blob, id).not.toMatch(/\bMR\b/);
      expect(blob, id).not.toMatch(/华明/);
    }
  });
});

describe("preset hints are Reinhausen families", () => {
  it("i18n copy has no Huaming type codes", () => {
    const text = readFileSync(path.join(process.cwd(), "lib", "i18n.ts"), "utf8");
    expect(text).not.toMatch(/\bCM2\b/);
    expect(text).not.toMatch(/\bCV2\b/);
    expect(text).not.toMatch(/\bSHZV\b/);
    expect(text).not.toMatch(/252 kV/);
  });
});
