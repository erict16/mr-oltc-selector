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

  it("I-phase uses published sector digit 501", () => {
    expect(commercialTypeExists("3xVM-I-501/123B-10193W")).toBe(true);
    expect(commercialTypeExists("3xVM-I-500/123B-10193W")).toBe(false);
  });

  it("accepts flyer VR codes and OILTAP V specials", () => {
    expect(commercialTypeExists("VRM-III-700Y/72.5B-10193W")).toBe(true);
    expect(commercialTypeExists("VRH-III-650Y/72.5B-10193W")).toBe(true);
    expect(commercialTypeExists("3xVRX-I-652/72.5B-10193W")).toBe(true);
    expect(commercialTypeExists("V-III-250Y/76-10193W")).toBe(true);
    expect(commercialTypeExists("V-III-400D/40-10193W")).toBe(true);
  });

  it("rejects unpublished VR / OILTAP V strings", () => {
    expect(commercialTypeExists("VRM-III-700D/72.5B-10193W")).toBe(false);
    expect(commercialTypeExists("VRX-III-650Y/72.5B-10193W")).toBe(false);
    expect(commercialTypeExists("VRX-I-651/72.5B-10193W")).toBe(false);
    expect(commercialTypeExists("VRS-III-400Y/72.5B-10193W")).toBe(false);
    expect(commercialTypeExists("V-III-500Y/76-10193W")).toBe(false);
    expect(commercialTypeExists("VR-III-400Y/72.5B-10193W")).toBe(false);
  });
});
