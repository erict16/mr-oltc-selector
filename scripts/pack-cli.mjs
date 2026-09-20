#!/usr/bin/env node
/**
 * Bundle selection-only CLI into pack/ for npm publish.
 * Must not include list RMB, coefficients, or quote fixtures.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildSync } from "esbuild";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const packDir = path.join(root, "pack");
const binDir = path.join(packDir, "bin");

const FORBIDDEN = [
  "listRmb",
  "basePrices.data.json",
  "coefficients.ts",
  "anthonyQs",
  "FOB Shanghai",
  "vietnam\": 1.1",
];

mkdirSync(binDir, { recursive: true });

const outFile = path.join(binDir, "oltc.js");
buildSync({
  entryPoints: [path.join(root, "scripts", "oltc.ts")],
  bundle: true,
  platform: "node",
  format: "esm",
  target: "node20",
  outfile: outFile,
});

let bundled = readFileSync(outFile, "utf8");
if (!bundled.startsWith("#!")) {
  bundled = "#!/usr/bin/env node\n" + bundled;
  writeFileSync(outFile, bundled);
}
for (const needle of FORBIDDEN) {
  if (bundled.includes(needle)) {
    throw new Error(`pack leak: bundled CLI contains ${needle}`);
  }
}

const VERSION = "1.0.0";

const pkg = {
  name: "mr-oltc-selector",
  version: VERSION,
  description:
    "OLTC type selection CLI from public VACUTAP / OILTAP brochure axes. No prices.",
  bin: { "mr-oltc": "bin/oltc.js" },
  type: "module",
  files: ["bin", "README.md"],
  engines: { node: ">=20" },
  license: "MIT",
  repository: {
    type: "git",
    url: "git+https://github.com/erict16/mr-oltc-selector.git",
  },
  keywords: ["OLTC", "tap-changer", "VACUTAP", "OILTAP"],
};

writeFileSync(
  path.join(packDir, "package.json"),
  JSON.stringify(pkg, null, 2) + "\n",
);

const readme = readFileSync(path.join(root, "README.md"), "utf8");
writeFileSync(path.join(packDir, "README.md"), readme);

console.log("packed", packDir);
