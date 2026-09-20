import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function walk(dir: string, acc: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === "out" || name === "pack") continue;
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, acc);
    else if (/\.(tsx|ts|css|md|svg|html)$/.test(name)) acc.push(p);
  }
  return acc;
}

describe("visible copy has no standalone MR", () => {
  it("app/ and components/ have no \\bMR\\b", () => {
    const root = process.cwd();
    const hits: string[] = [];
    for (const file of [
      ...walk(path.join(root, "app")),
      ...walk(path.join(root, "components")),
      path.join(root, "README.md"),
    ]) {
      const text = readFileSync(file, "utf8");
      const lines = text.split(/\r?\n/);
      lines.forEach((line, i) => {
        if (/\bMR\b/.test(line) && !/mr-oltc-selector/.test(line)) {
          hits.push(`${path.relative(root, file)}:${i + 1}:${line.trim()}`);
        }
      });
    }
    expect(hits, hits.join("\n")).toEqual([]);
  });
});
