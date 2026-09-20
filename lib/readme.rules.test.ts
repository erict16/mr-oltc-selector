import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("README selection rules", () => {
  const md = readFileSync(path.join(process.cwd(), "README.md"), "utf8");

  it("states existence, ranking, and CLI pin", () => {
    expect(md).toContain("Minimum-adequate");
    expect(md).toContain("mr-oltc-selector@1.0.3");
    expect(md).toContain("--iu");
    expect(md).not.toMatch(/\bMR\b/);
  });
});
