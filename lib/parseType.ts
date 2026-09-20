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
    .replace(/\s+/g, "")
    .trim();
}

/**
 * Compact commercial type, no spaces:
 *   VV-III-250Y/76-10193W
 *   VM-III-500Y/123B-10193W
 *   3xVM-I-501/123B-10193W
 *   VI-III-400Y/76-10193W
 */
export function parseTypeString(raw: string): TypeParts | null {
  const t = normalizeType(raw);
  const re = new RegExp(
    `^(?:(\\d+)x)?(${FAMILIES})-(III|II|I)-(\\d+)([YD])?/(\\d+(?:\\.\\d+)?)([A-E]+)?-(\\d+[WG0]?)$`,
    "i",
  );
  const m = t.match(re);
  if (!m) return null;
  return {
    unitCount: m[1] ? Number(m[1]) : 1,
    family: m[2].toUpperCase(),
    phases: m[3].toUpperCase(),
    currentA: Number(m[4]),
    connection: (m[5] ?? "").toUpperCase(),
    umKv: Number(m[6]),
    selectorSize: (m[7] ?? "").toUpperCase(),
    tapCode: m[8],
  };
}
