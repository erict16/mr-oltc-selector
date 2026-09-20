import { describe, expect, it } from "vitest";
import { APP_VERSION } from "./appVersion";
import { RELEASES } from "./releaseNotes";

describe("release notes", () => {
  it("zh notes exist", () => {
    expect(RELEASES.zh.length).toBeGreaterThan(0);
    expect(APP_VERSION).toBe("1.0.3");
  });
});
