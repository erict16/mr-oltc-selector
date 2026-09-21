import { describe, expect, it } from "vitest";
import { runCli } from "./cli";
import { selectOltc } from "./engine";
import { commercialTypeExists } from "./typeExists";
import type { SelectInput } from "./types";

function capture(argv: string[]): { code: number; out: string } {
  let out = "";
  const code = runCli(argv, {
    stdout: (s) => {
      out += s;
    },
    stderr: () => {},
  });
  return { code, out };
}

function primaryLine(out: string): string {
  return out.trim().split(/\r?\n/)[0]!;
}

const base = {
  mounting: "in_tank" as const,
  medium: "oil_vacuum" as const,
  preferVacuum: true,
  phases: "III" as const,
  regulation: "reversing" as const,
  plusMinusSteps: 8,
  midPositions: 3 as const,
  mdu: "none" as const,
};

describe("TD type strings (not SERIES as oracle)", () => {
  it("rejects invented types that look catalogue-shaped", () => {
    expect(commercialTypeExists("VV-III-600D/123-10193W")).toBe(false);
    expect(commercialTypeExists("VM-III-500Y/300DE-10193W")).toBe(false);
    expect(commercialTypeExists("G-III-1600Y/72.5B-10193W")).toBe(false);
    expect(commercialTypeExists("3xVM-I-500/123B-10193W")).toBe(false);
    expect(commercialTypeExists("VRX-III-650Y/72.5B-10193W")).toBe(false);
    expect(commercialTypeExists("V-III-500Y/76-10193W")).toBe(false);
    expect(commercialTypeExists("VRM-III-700D/72.5B-10193W")).toBe(false);
  });

  it("accepts published tokens 501 / 1602 / D at 145", () => {
    expect(commercialTypeExists("3xVM-I-501/123B-10193W")).toBe(true);
    expect(commercialTypeExists("G-III-1602Y/72.5D-10193W")).toBe(true);
    expect(commercialTypeExists("VV-III-600D/145-10193W")).toBe(true);
    expect(commercialTypeExists("VRM-III-700Y/72.5B-10193W")).toBe(true);
    expect(commercialTypeExists("3xVRX-I-652/72.5B-10193W")).toBe(true);
    expect(commercialTypeExists("V-III-400Y/76-10193W")).toBe(true);
  });

  it("500 A / 123 kV D does not emit VV III-D at 123", () => {
    const out = selectOltc({
      ...base,
      connection: "D",
      throughCurrentA: 500,
      umKv: 123,
      stepVoltageV: 1500,
    });
    expect(out.ok).toBe(true);
    for (const r of out.results) {
      expect(r.model).not.toMatch(/VV-III-\d+D\/123/);
    }
  });

  it("500 A / 300 kV Y does not emit VM III at Um 300", () => {
    const out = selectOltc({
      ...base,
      connection: "Y",
      throughCurrentA: 500,
      umKv: 300,
      stepVoltageV: 2000,
    } as SelectInput);
    expect(out.ok).toBe(true);
    for (const r of out.results) {
      expect(r.model).not.toMatch(/VM-III-\d+Y\/300/);
    }
  });

  it("delta 500 A VM path uses 3xVM-I-501", () => {
    const out = selectOltc({
      ...base,
      connection: "D",
      throughCurrentA: 500,
      umKv: 123,
      stepVoltageV: 2000,
      preferStructure: "combined",
    });
    expect(out.ok).toBe(true);
    const models = out.results.map((r) => r.model);
    expect(models.some((m) => m.startsWith("3xVM-I-501/"))).toBe(true);
  });
});

describe("packed-path CLI (runCli)", () => {
  it("--iu 500 --um 123 --conn D never prints VV-III-…D/123", () => {
    const a = capture(["--iu", "500", "--um", "123", "--conn", "D", "--reg", "W", "--pm", "8"]);
    expect(a.code).toBe(0);
    expect(a.out).not.toMatch(/VV-III-\d+D\/123/);
    expect(commercialTypeExists(primaryLine(a.out))).toBe(true);
  });

  it("--iu 500 --um 300 --conn Y never prints VM-III-…/300", () => {
    const a = capture(["--iu", "500", "--um", "300", "--conn", "Y", "--reg", "W", "--pm", "8"]);
    expect(a.code).toBe(0);
    expect(a.out).not.toMatch(/VM-III-\d+Y\/300/);
    expect(commercialTypeExists(primaryLine(a.out))).toBe(true);
  });

  it("OILTAP G uses 1602 and selector D", () => {
    const a = capture([
      "--iu",
      "1600",
      "--um",
      "72.5",
      "--conn",
      "Y",
      "--reg",
      "W",
      "--pm",
      "8",
      "--oil",
    ]);
    expect(a.code).toBe(0);
    const primary = primaryLine(a.out);
    expect(primary).toMatch(/^G-III-1602Y\/72\.5D-/);
    expect(commercialTypeExists(primary)).toBe(true);
  });
});
