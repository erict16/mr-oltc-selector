import { describe, expect, it } from "vitest";
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
  it("defaults 110 kV star to 72.5", () => {
    expect(DEFAULT_WINDING_RATED_KV).toBe(110);
    expect(oltcUmFromRatedKv(110, "Y")).toBe(72.5);
    expect(oltcUmFromRatedKv(132, "Y")).toBe(72.5);
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
