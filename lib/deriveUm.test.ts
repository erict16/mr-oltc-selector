import { describe, expect, it } from "vitest";
import { familyDutyUm } from "./catalog";
import { selectOltc } from "./engine";
import {
  DEFAULT_WINDING_RATED_KV,
  oltcUmFromRatedKv,
  snapRatedKv,
  windingUmFromRatedKv,
} from "./deriveUm";

describe("snap nameplate Un", () => {
  it("keeps menu values", () => {
    expect(snapRatedKv(132)).toBe(132);
    expect(snapRatedKv(110)).toBe(110);
    expect(snapRatedKv(33)).toBe(33);
  });
});

describe("Um mapping", () => {
  it("defaults 110 kV star to 76", () => {
    expect(DEFAULT_WINDING_RATED_KV).toBe(110);
    expect(oltcUmFromRatedKv(110, "Y")).toBe(76);
    expect(oltcUmFromRatedKv(132, "Y")).toBe(76);
  });

  it("110 kV delta stays winding class 123", () => {
    expect(oltcUmFromRatedKv(110, "D")).toBe(123);
    expect(windingUmFromRatedKv(110)).toBe(123);
  });

  it("33 kV stays 40", () => {
    expect(oltcUmFromRatedKv(33, "Y")).toBe(40);
    expect(oltcUmFromRatedKv(33, "D")).toBe(40);
  });

  it("220 kV star stays 245", () => {
    expect(oltcUmFromRatedKv(220, "Y")).toBe(245);
  });
});

describe("76 vs 72.5 IEC class", () => {
  it("76 duty uses VM 72.5 from the TD", () => {
    expect(familyDutyUm(76, [72.5, 123, 170])).toBe(72.5);
    const out = selectOltc({
      mounting: "in_tank",
      medium: "oil_vacuum",
      preferVacuum: true,
      phases: "III",
      connection: "Y",
      throughCurrentA: 500,
      umKv: 76,
      stepVoltageV: 2000,
      regulation: "reversing",
      plusMinusSteps: 8,
      midPositions: 3,
      preferStructure: "combined",
      mdu: "none",
    });
    expect(out.ok).toBe(true);
    expect(out.results[0]!.model).toMatch(/VM-III-500Y\/72\.5B-/);
  });
});
