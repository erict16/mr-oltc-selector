import {
  allowedUms,
  iiiTypeAllowsConnection,
  publishedCurrentTokens,
  SERIES,
} from "./catalog";
import { parseTypeString } from "./parseType";
import type { PhaseCode, SelectorSize, SeriesDef } from "./types";

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
  const tokens = publishedCurrentTokens(s, phase);
  if (!tokens.includes(parsed.currentA)) return false;
  const connForUm: "Y" | "D" | "any" =
    parsed.connection === "D" ? "D" : parsed.connection === "Y" ? "Y" : "any";
  if (parsed.umKv) {
    const ums = allowedUms(s, phase, connForUm === "any" ? "Y" : connForUm);
    if (!ums.some((u) => Math.abs(u - parsed.umKv) < 0.05)) return false;
  }

  if (COMPOUND_NO_GRADE.has(s.id) && parsed.selectorSize) return false;
  if (s.usesSelectorSize && parsed.selectorSize) {
    const allowed: SelectorSize[] = s.selectorSizes?.length
      ? s.selectorSizes
      : ["B", "C", "D", "DE"];
    if (!allowed.some((x) => x === parsed.selectorSize)) return false;
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
