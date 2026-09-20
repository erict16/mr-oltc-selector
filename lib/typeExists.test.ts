import { describe, expect, it } from "vitest";
import { commercialTypeExists } from "./typeExists";

describe("commercialTypeExists", () => {
  it("accepts published VV III 250 Y-76", () => {
    expect(commercialTypeExists("VV III 250 Y-76-10 19 3W")).toBe(true);
  });

  it("accepts published VM III 500 Y-123/B", () => {
    expect(commercialTypeExists("VM III 500 Y-123/B-10 19 3W")).toBe(true);
  });

  it("rejects invented Ium and III-D on VM", () => {
    expect(commercialTypeExists("VV III 251 Y-76-10 19 3W")).toBe(false);
    expect(commercialTypeExists("VM III 500 D-123/B-10 19 3W")).toBe(false);
  });

  it("rejects selector letter on compound VV", () => {
    expect(commercialTypeExists("VV III 250 Y-76/B-10 19 3W")).toBe(false);
  });
});
