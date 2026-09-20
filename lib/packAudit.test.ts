import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { APP_VERSION } from "./appVersion";
import { commercialTypeExists } from "./typeExists";

const root = process.cwd();
const bin = path.join(root, "pack", "bin", "oltc.js");

describe("selection-only pack", () => {
  it("bundles without prices and prints a stable legal primary twice", () => {
    const pack = spawnSync(process.execPath, [path.join(root, "scripts", "pack-cli.mjs")], {
      cwd: root,
      encoding: "utf8",
    });
    expect(pack.status, pack.stderr + pack.stdout).toBe(0);
    expect(existsSync(bin)).toBe(true);
    const packedPkg = JSON.parse(
      readFileSync(path.join(root, "pack", "package.json"), "utf8"),
    );
    expect(packedPkg.name).toBe("mr-oltc-selector");
    expect(packedPkg.version).toBe(APP_VERSION);
    expect(packedPkg.bin).toEqual({ "mr-oltc": "bin/oltc.js" });
    const js = readFileSync(bin, "utf8");
    expect(js.includes("listRmb")).toBe(false);
    expect(js.includes("basePrices.data.json")).toBe(false);

    const argv = ["--iu", "350", "--um", "72.5", "--conn", "Y", "--reg", "W", "--pm", "8"];
    const once = spawnSync(process.execPath, [bin, ...argv], {
      cwd: path.join(root, "pack"),
      encoding: "utf8",
    });
    const twice = spawnSync(process.execPath, [bin, ...argv], {
      cwd: path.join(root, "pack"),
      encoding: "utf8",
    });
    expect(once.status, once.stderr).toBe(0);
    expect(once.stdout).toBe(twice.stdout);
    const primary = once.stdout.trim().split(/\r?\n/)[0]!;
    expect(commercialTypeExists(primary)).toBe(true);
    expect(once.stdout).not.toMatch(/RMB|CNY|USD|listRmb|coeff/i);
  });
});
