// Stage a skillhub.cn-compatible copy: no png, no scripts/.
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const SUMMARY =
  "贴变压器铭牌或给参数（容量、电压、电流、调压方式、分接范围），用 mr-oltc 命令选出公开样本册里真实存在的有载分接开关型号，并说明选型理由。不含报价。";

const out = mkdtempSync(path.join(os.tmpdir(), "skillhub-cn-"));
const dir = path.join(out, "mr-oltc-selector");
cpSync(root, dir, {
  recursive: true,
  filter: (src) => {
    const rel = path.relative(root, src).replaceAll("\\", "/");
    if (!rel) return true;
    const top = rel.split("/")[0];
    if ([".git", "assets", "scripts", "node_modules"].includes(top)) {
      return false;
    }
    const base = path.basename(src);
    if ([".gitignore", ".gitattributes", "LICENSE"].includes(base)) return false;
    return true;
  },
});
rmSync(path.join(dir, "assets"), { recursive: true, force: true });
rmSync(path.join(dir, "scripts"), { recursive: true, force: true });

const skillPath = path.join(dir, "SKILL.md");
const text = readFileSync(skillPath, "utf8");
const version = text.match(/^version: (.+)$/m)?.[1]?.trim() ?? "1.0.0";
if (!/^slug: /m.test(text)) {
  const extra = [
    "slug: mr-oltc-selector",
    "displayName: MR有载开关选型助手",
    `summary: ${SUMMARY}`,
    "license: MIT",
  ].join("\n");
  const updated = text.replace(
    /^name: mr-oltc-selector$/m,
    `name: mr-oltc-selector\n${extra}`,
  );
  if (updated === text) throw new Error("name line not found in SKILL.md frontmatter");
  writeFileSync(skillPath, updated);
}

console.log(`staged: ${dir}`);
console.log(`version: ${version}`);
