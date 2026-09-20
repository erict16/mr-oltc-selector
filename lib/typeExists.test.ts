import { describe, expect, it } from "vitest";
import { commercialTypeExists } from "./typeExists";

describe("commercialTypeExists", () => {
  it("accepts published VV-III-250Y/76", () => {
    expect(commercialTypeExists("VV-III-250Y/76-10193W")).toBe(true);
  });

  it("accepts published VM-III-500Y/123B", () => {
    expect(commercialTypeExists("VM-III-500Y/123B-10193W")).toBe(true);
  });

  it("rejects invented Ium and III-D on VM", () => {
    expect(commercialTypeExists("VV-III-251Y/76-10193W")).toBe(false);
    expect(commercialTypeExists("VM-III-500D/123B-10193W")).toBe(false);
  });

  it("rejects selector letter on compound VV", () => {
    expect(commercialTypeExists("VV-III-250Y/76B-10193W")).toBe(false);
  });
});
