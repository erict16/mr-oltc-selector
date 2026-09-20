import { describe, expect, it } from "vitest";
import { SERIES } from "./catalog";
import { FIXTURES, selectOltc } from "./engine";
import { parseTypeString } from "./parseType";
import { commercialTypeExists } from "./typeExists";
import type { SelectInput } from "./types";

function duty(partial: Partial<SelectInput>): SelectInput {
  return {
    mounting: "in_tank",
    medium: "oil_vacuum",
    preferVacuum: true,
    phases: "III",
    connection: "Y",
    throughCurrentA: 350,
    umKv: 76,
    stepVoltageV: 1500,
    regulation: "reversing",
    plusMinusSteps: 8,
    midPositions: 3,
    mdu: "none",
    ...partial,
  };
}

describe("published-doc fixtures", () => {
  it("VV III 250 Y at Um 76 exists and is selected for 250 A", () => {
    const out = selectOltc(FIXTURES.vv250Y76.input);
    expect(out.ok).toBe(true);
    const primary = out.results[0]!.model;
    expect(primary).toContain(FIXTURES.vv250Y76.expectContains);
    const parsed = parseTypeString(primary);
    expect(parsed).not.toBeNull();
    expect(parsed!.family).toBe("VV");
    expect(parsed!.phases).toBe("III");
    expect(parsed!.currentA).toBe(250);
    expect(parsed!.connection).toBe("Y");
    expect(parsed!.umKv).toBe(76);
    expect(parsed!.selectorSize).toBe("");
    expect(commercialTypeExists(primary)).toBe(true);
  });

  it("VM III 500 Y at Um 123 with selector B", () => {
    const out = selectOltc(FIXTURES.vm500Y123B.input);
    expect(out.ok).toBe(true);
    const primary = out.results[0]!.model;
    expect(primary).toContain(FIXTURES.vm500Y123B.expectContains);
    const parsed = parseTypeString(primary);
    expect(parsed).not.toBeNull();
    expect(parsed!.family).toBe("VM");
    expect(parsed!.currentA).toBe(500);
    expect(parsed!.umKv).toBe(123);
    expect(parsed!.selectorSize).toBe("B");
    expect(commercialTypeExists(primary)).toBe(true);
  });
});

describe("hard locks", () => {
  it("--iu path never multiplies k (engine sees the given Imax)", () => {
    const a = selectOltc(duty({ throughCurrentA: 350 }));
    const b = selectOltc(duty({ throughCurrentA: 350 }));
    expect(a.results[0]!.model).toBe(b.results[0]!.model);
    expect(a.results[0]!.currentA).toBeGreaterThanOrEqual(350);
  });

  it("oil request never returns a vacuum family", () => {
    const out = selectOltc(
      duty({
        preferVacuum: false,
        medium: "oil",
        throughCurrentA: 350,
        umKv: 76,
      }),
    );
    expect(out.ok).toBe(true);
    for (const r of out.results) {
      const s = SERIES.find((row) => row.id === r.seriesId)!;
      expect(s.vacuum).toBe(false);
      expect(s.medium).toBe("oil");
    }
  });

  it("vacuum request never returns an oil family", () => {
    const out = selectOltc(duty({ preferVacuum: true, medium: "oil_vacuum" }));
    expect(out.ok).toBe(true);
    for (const r of out.results) {
      const s = SERIES.find((row) => row.id === r.seriesId)!;
      expect(s.vacuum).toBe(true);
    }
  });

  it("dry mount reports out of catalogue", () => {
    const out = selectOltc(duty({ mounting: "dry_type", medium: "dry" }));
    expect(out.ok).toBe(false);
  });

  it("on-tank vacuum reports out of catalogue", () => {
    const out = selectOltc(duty({ mounting: "on_tank" }));
    expect(out.ok).toBe(false);
  });

  it("VM III-D is not a type; delta uses 3x I", () => {
    const out = selectOltc(
      duty({
        connection: "D",
        throughCurrentA: 500,
        umKv: 123,
        stepVoltageV: 2000,
      }),
    );
    expect(out.ok).toBe(true);
    const primary = out.results[0]!.model;
    expect(primary).not.toMatch(/VM III \d+ D/);
    expect(commercialTypeExists(primary)).toBe(true);
  });

  it("compound types have no selector size letter", () => {
    const out = selectOltc(duty({ throughCurrentA: 250, umKv: 76 }));
    expect(out.ok).toBe(true);
    const parsed = parseTypeString(out.results[0]!.model)!;
    expect(["VI", "VV"]).toContain(parsed.family);
    expect(parsed.selectorSize).toBe("");
  });
});
