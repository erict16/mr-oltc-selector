import { describe, expect, it } from "vitest";
import { publishedCurrentTokens, SERIES } from "./catalog";
import { selectOltc } from "./engine";
import { parseTypeString } from "./parseType";
import { commercialTypeExists } from "./typeExists";
import type { SelectInput } from "./types";

const VAC_IDS = new Set(SERIES.filter((s) => s.vacuum).map((s) => s.id));
const OIL_IDS = new Set(
  SERIES.filter((s) => s.medium === "oil" && !s.vacuum).map((s) => s.id),
);
const COMPOUND = new Set(
  SERIES.filter((s) => !s.usesSelectorSize).map((s) => s.code),
);
const STAR_ONLY = new Set(
  SERIES.filter((s) => (s.iiiConnections ?? []).join() === "Y").map(
    (s) => s.code,
  ),
);

function checkModel(model: string, ctx: string, bucket: string[]): void {
  if (!commercialTypeExists(model)) bucket.push(`${ctx} missing ${model}`);
  const parsed = parseTypeString(model);
  if (!parsed) {
    bucket.push(`${ctx} unparseable ${model}`);
    return;
  }
  const s = SERIES.find((row) => row.code === parsed.family);
  if (!s) bucket.push(`${ctx} unknown-family ${model}`);
  if (s && COMPOUND.has(s.code) && parsed.selectorSize) {
    bucket.push(`${ctx} grade ${model}`);
  }
  if (s && STAR_ONLY.has(s.code) && parsed.phases === "III" && parsed.connection === "D") {
    bucket.push(`${ctx} III-D ${model}`);
  }
  const tokens = s
    ? publishedCurrentTokens(s, parsed.phases as "I" | "II" | "III")
    : [];
  if (!tokens.includes(parsed.currentA)) {
    bucket.push(`${ctx} invented-Ium ${model}`);
  }
  if (/VV-III-\d+D\/123/.test(model)) {
    bucket.push(`${ctx} vv-d-123 ${model}`);
  }
  if (/VM-III-\d+Y\/300/.test(model)) {
    bucket.push(`${ctx} vm-iii-300 ${model}`);
  }
  if (/^G-III-\d+Y\/[\d.]+B/.test(model)) {
    bucket.push(`${ctx} g-selector-B ${model}`);
  }
}

describe("catalogue pressure", () => {
  it("grid never invents a type or leaks medium / mounting", () => {
    const illegal: string[] = [];
    const currents = [200, 250, 350, 400, 500, 600, 650, 800, 1000, 1300, 1600];
    const ums = [40, 72.5, 76, 123, 145, 170];
    const usts = [800, 1500, 2000, 3300, 4500, 6000];
    const conns = ["Y", "D"] as const;
    const pms = [8, 16] as const;

    for (const iu of currents) {
      for (const um of ums) {
        for (const ust of usts) {
          for (const conn of conns) {
            for (const pm of pms) {
              const base = {
                throughCurrentA: iu,
                umKv: um,
                stepVoltageV: ust,
                connection: conn,
                plusMinusSteps: pm,
                midPositions: 3 as const,
                phases: "III" as const,
                regulation: "reversing" as const,
                mdu: "none" as const,
              };
              const jobs: SelectInput[] = [
                {
                  ...base,
                  mounting: "in_tank",
                  medium: "oil_vacuum",
                  preferVacuum: true,
                },
                {
                  ...base,
                  mounting: "in_tank",
                  medium: "oil",
                  preferVacuum: false,
                },
                {
                  ...base,
                  mounting: "dry_type",
                  medium: "dry",
                  preferVacuum: true,
                },
                {
                  ...base,
                  mounting: "on_tank",
                  medium: "oil_vacuum",
                  preferVacuum: true,
                },
              ];
              for (const input of jobs) {
                const out = selectOltc(input);
                const ctx = `${iu}A ${um}kV ${ust}V ${conn} ±${pm} ${input.mounting}/${input.medium}`;
                if (!out.ok) continue;
                for (const r of out.results) {
                  checkModel(r.model, ctx, illegal);
                  const s = SERIES.find((row) => row.id === r.seriesId);
                  if (!s) {
                    illegal.push(`${ctx} no-series ${r.model}`);
                    continue;
                  }
                  if (input.preferVacuum && !VAC_IDS.has(s.id)) {
                    illegal.push(`${ctx} oil-for-vac ${r.model}`);
                  }
                  if (input.medium === "oil" && !OIL_IDS.has(s.id)) {
                    illegal.push(`${ctx} vac-for-oil ${r.model}`);
                  }
                  if (input.mounting === "dry_type") {
                    illegal.push(`${ctx} dry-emitted ${r.model}`);
                  }
                  if (input.mounting === "on_tank") {
                    illegal.push(`${ctx} on-tank-emitted ${r.model}`);
                  }
                }
              }
            }
          }
        }
      }
    }
    expect(illegal, illegal.slice(0, 20).join("\n")).toEqual([]);
  });
});
