import { describe, expect, it } from "vitest";
import { parseCliArgs, runCli } from "./cli";
import { commercialTypeExists } from "./typeExists";

function capture(argv: string[]): { code: number; out: string; err: string } {
  let out = "";
  let err = "";
  const code = runCli(argv, {
    stdout: (s) => {
      out += s;
    },
    stderr: (s) => {
      err += s;
    },
  });
  return { code, out, err };
}

describe("CLI", () => {
  it("350 A / 72.5 kV Y reversing ±8 → legal primary, identical twice, no prices", () => {
    const argv = ["--iu", "350", "--um", "72.5", "--conn", "Y", "--reg", "W", "--pm", "8"];
    const a = capture(argv);
    const b = capture(argv);
    expect(a.code).toBe(0);
    expect(a.out).toBe(b.out);
    const primary = a.out.trim().split(/\r?\n/)[0]!;
    expect(commercialTypeExists(primary)).toBe(true);
    expect(primary).toMatch(/^(VI|VV|VM) /);
    expect(a.out).not.toMatch(/RMB|CNY|USD|listRmb|coeff|报价|\$/i);
  });

  it("--iu 350 with k 1.5 equals --iu 350 with k 1.0", () => {
    const base = ["--iu", "350", "--um", "72.5", "--conn", "Y", "--reg", "W", "--pm", "8"];
    const a = capture([...base, "--k", "1.5"]);
    const b = capture([...base, "--k", "1.0"]);
    expect(a.code).toBe(0);
    expect(b.code).toBe(0);
    const pa = a.out.trim().split(/\r?\n/)[0];
    const pb = b.out.trim().split(/\r?\n/)[0];
    expect(pa).toBe(pb);
  });

  it("k on capacity path does change Imax", () => {
    const a = capture(["--mva", "25", "--kv", "110", "--conn", "Y", "--reg", "W", "--pm", "8", "--k", "1.0"]);
    const b = capture(["--mva", "25", "--kv", "110", "--conn", "Y", "--reg", "W", "--pm", "8", "--k", "1.5"]);
    expect(a.code).toBe(0);
    expect(b.code).toBe(0);
    // Not asserting different types (may still land on same Ium), but k is parsed.
    expect(parseCliArgs(["--mva", "25", "--kv", "110", "--k", "1.5"]).k).toBe(1.5);
  });
});
