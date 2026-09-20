export type TypeParts = {
  unitCount: number;
  family: string;
  phases: string;
  currentA: number;
  connection: string;
  umKv: number;
  selectorSize: string;
  tapCode: string;
};

const FAMILIES = "VRS|VRL|VI|VV|VM|G|V";

/** Collapse a commercial type to a parseable line. */
export function normalizeType(raw: string): string {
  return raw
    .replace(/[×*]/g, "x")
    .replace(/[–—－]/g, "-")
    .replace(/,/g, ".")
    .replace(/（/g, "(")
    .replace(/）/g, ")")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Parse a commercial type.
 *   VV III 250 Y-76-10 19 3W
 *   VM III 500 Y-123/B-10 19 3W
 *   3x VM I 501-123/B-10 19 3W
 *   V III 350 Y-76-10 19 3W
 */
export function parseTypeString(raw: string): TypeParts | null {
  const t = normalizeType(raw);
  const re = new RegExp(
    `^(?:(\\d+)x\\s*)?(${FAMILIES})\\s+(III|II|I)\\s+(\\d+)\\s*([YD])?(?:-(\\d+(?:\\.\\d+)?)(?:\\/([A-E]+))?)?(?:-(\\d+)\\s+(\\d+)\\s+(\\d[WG0]?))?$`,
    "i",
  );
  const m = t.match(re);
  if (!m) return null;
  const family = m[2].toUpperCase();
  const tap =
    m[8] && m[9] && m[10] != null ? `${m[8]} ${m[9]} ${m[10]}` : "";
  return {
    unitCount: m[1] ? Number(m[1]) : 1,
    family,
    phases: m[3].toUpperCase(),
    currentA: Number(m[4]),
    connection: (m[5] ?? "").toUpperCase(),
    umKv: m[6] ? Number(m[6]) : 0,
    selectorSize: (m[7] ?? "").toUpperCase(),
    tapCode: tap,
  };
}
