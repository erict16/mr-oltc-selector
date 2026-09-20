import { iiiTypeAllowsConnection, SERIES } from "./catalog";
import { parseTypeString } from "./parseType";
import type { PhaseCode, SeriesDef } from "./types";

const COMPOUND_NO_GRADE = new Set(["vi", "vv", "oiltap_v"]);
const STAR_ONLY_III = new Set(["vm", "vrs", "vrl", "oiltap_g"]);

export const III_D_FAMILIES = ["vi", "vv", "oiltap_v"] as const;

export function commercialTypeExists(
  model: string,
  series?: SeriesDef,
): boolean {
  const parsed = parseTypeString(model);
  if (!parsed) return false;
  const s =
    series ?? SERIES.find((row) => row.code === parsed.family);
  if (!s) return false;
  if (s.code !== parsed.family) return false;

  const phase = parsed.phases as PhaseCode;
  const allowedI = s.currents[phase];
  if (!allowedI?.includes(parsed.currentA)) return false;
  if (
    parsed.umKv &&
    !s.umKv.some((u) => Math.abs(u - parsed.umKv) < 0.05)
  ) {
    return false;
  }

  if (COMPOUND_NO_GRADE.has(s.id) && parsed.selectorSize) return false;
  if (s.usesSelectorSize && parsed.umKv && parsed.selectorSize) {
    // letter must be a published size; empty size is incomplete, not illegal here
  }

  if (phase === "III") {
    const conn = (parsed.connection || "Y") as "Y" | "D" | "any";
    if (!iiiTypeAllowsConnection(s, "III", conn === "D" ? "D" : "Y")) {
      return false;
    }
  }
  if (phase === "I" && parsed.connection) return false;
  if (phase === "II") {
    if (STAR_ONLY_III.has(s.id) && parsed.connection === "D") return false;
  }
  return true;
}

export function phaseConnectionLegal(
  s: SeriesDef,
  phases: PhaseCode,
  conn: "Y" | "D" | "any",
): boolean {
  if (phases === "III") return iiiTypeAllowsConnection(s, "III", conn);
  if (phases === "II" && STAR_ONLY_III.has(s.id) && conn === "D") return false;
  return true;
}

export function connectionLetterOnPhase(
  s: SeriesDef,
  phases: PhaseCode,
  conn: "Y" | "D" | "any",
): "Y" | "D" | "any" {
  if (phases === "I") return "any";
  if (phases === "II" && STAR_ONLY_III.has(s.id)) return conn === "D" ? "any" : conn;
  return conn;
}

export function resolveOctcListModel(_model: string): string | null {
  return null;
}
