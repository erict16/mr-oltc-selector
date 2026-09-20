import type {
  Connection,
  PhaseCode,
  SeriesDef,
  SelectorSize,
} from "./types";

/**
 * Catalogue axes from public Reinhausen OLTC TDs / overview.
 * Sources: docs/catalog/axes.json and docs/brochure-extracts.
 * Do not invent Ium / Um / III-D rows.
 */

export const EARTH_INSULATION: Record<number, { pf: number; bil: number }> = {
  40: { pf: 70, bil: 200 },
  72.5: { pf: 140, bil: 350 },
  76: { pf: 140, bil: 350 },
  123: { pf: 230, bil: 550 },
  145: { pf: 275, bil: 650 },
  170: { pf: 325, bil: 750 },
  245: { pf: 460, bil: 1050 },
  300: { pf: 460, bil: 1050 },
  362: { pf: 510, bil: 1175 },
  420: { pf: 570, bil: 1425 },
};

/** Menu Ums. 76 is the 72.5 kV IEC class on compact families; VM/G still print 72.5 from the TD. */
export const UM_OPTIONS_KV = [
  40, 76, 123, 145, 170, 245, 300, 362, 420,
] as const;

export type CatalogueMenuItem = {
  value: number;
  labelZh: string;
  labelEn: string;
};

function catalogueMenu(
  steps: readonly number[],
  unit: string,
): CatalogueMenuItem[] {
  return steps.map((v) => {
    const label = `${v} ${unit}`;
    return { value: v, labelZh: label, labelEn: label };
  });
}

export const UM_MENU: CatalogueMenuItem[] = catalogueMenu(UM_OPTIONS_KV, "kV");

export const CURRENT_OPTIONS_A = [
  200, 250, 350, 400, 500, 600, 650, 700, 800, 1000, 1200, 1300, 1500, 1600,
  2000, 2600, 3000, 3200,
] as const;

export const CURRENT_MENU: CatalogueMenuItem[] = catalogueMenu(
  CURRENT_OPTIONS_A,
  "A",
);

export const STEP_VOLTAGE_OPTIONS_V = [
  500, 800, 1000, 1200, 1400, 1500, 1650, 1800, 2000, 2200, 2500, 3000, 3300,
  4000, 4500, 5000, 6000,
] as const;

export const STEP_VOLTAGE_MENU: CatalogueMenuItem[] = catalogueMenu(
  STEP_VOLTAGE_OPTIONS_V,
  "V",
);

export const ACROSS_BIL_OPTIONS_KV = [
  75, 95, 105, 120, 150, 170, 200, 250, 285, 320, 350, 450, 520, 550, 650, 750,
] as const;

export const ACROSS_PF_OPTIONS_KV = [
  20, 30, 38, 45, 50, 65, 70, 80, 85, 95, 100, 110, 125, 140, 150,
] as const;

export const ACROSS_BIL_MENU: CatalogueMenuItem[] = catalogueMenu(
  ACROSS_BIL_OPTIONS_KV,
  "kV",
);

export const ACROSS_PF_MENU: CatalogueMenuItem[] = catalogueMenu(
  ACROSS_PF_OPTIONS_KV,
  "kV",
);

export { PM_STEP_OPTIONS } from "./tapCode";

export const LINEAR_POSITION_OPTIONS = [
  7, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
] as const;

export const POSITION_OPTIONS = [
  9, 10, 12, 14, 16, 17, 18, 19, 21, 23, 27, 31, 33, 35,
] as const;

/** Published VM example uses size B at Um 123. */
export const SELECTOR_SIZES_BY_UM: Record<number, SelectorSize[]> = {
  40: ["B", "C"],
  72.5: ["B", "C", "D", "DE"],
  76: ["B", "C", "D", "DE"],
  123: ["B", "C", "D", "DE"],
  145: ["B", "C", "D", "DE"],
  170: ["C", "D", "DE"],
  245: ["D", "DE"],
  300: ["DE", "E"],
  362: ["DE", "E"],
  420: ["E"],
};

export const SIZE_ORDER: SelectorSize[] = ["B", "C", "D", "DE", "E"];

export const INTERNAL_INSULATION: Record<
  SelectorSize,
  { a_li: number; a_pf: number; b_li: number; b_pf: number }
> = {
  "": { a_li: 0, a_pf: 0, b_li: 0, b_pf: 0 },
  A: { a_li: 0, a_pf: 0, b_li: 0, b_pf: 0 },
  B: { a_li: 265, a_pf: 50, b_li: 265, b_pf: 50 },
  C: { a_li: 365, a_pf: 82, b_li: 350, b_pf: 82 },
  D: { a_li: 460, a_pf: 105, b_li: 460, b_pf: 146 },
  DE: { a_li: 550, a_pf: 120, b_li: 550, b_pf: 160 },
  E: { a_li: 650, a_pf: 150, b_li: 650, b_pf: 180 },
};

export function iiiTypeAllowsConnection(
  s: Pick<SeriesDef, "connections" | "iiiConnections">,
  phases: PhaseCode,
  conn: Connection,
): boolean {
  if (phases !== "III") return true;
  const allowed = s.iiiConnections ?? s.connections;
  if (conn === "any") return true;
  return allowed.includes(conn) || allowed.includes("any");
}

/** Compact vacuum before combined vacuum before VR; oil families only on oil. */
export const FAMILY_MIN_RANK: Record<string, number> = {
  vi: 10,
  vv: 20,
  oiltap_v: 15,
  vm: 40,
  vrs: 60,
  vrl: 64,
  oiltap_g: 70,
};

export const SERIES: SeriesDef[] = [
  {
    id: "vi",
    code: "VI",
    nameEn: "VACUTAP VI compact in-tank vacuum OLTC",
    nameZh: "VI 箱内真空有载（紧凑）",
    mounting: ["in_tank"],
    medium: "oil_vacuum",
    structure: "compound",
    vacuum: true,
    currents: { III: [400] },
    umKv: [40, 76, 123],
    umKvY: [40, 76, 123],
    umKvD: [40, 76, 123],
    usesSelectorSize: false,
    maxStepVoltageV: 1500,
    stepCapacityByCurrent: { 400: 600 },
    connections: ["Y", "D"],
    iiiConnections: ["Y", "D"],
    maxPositionsLinear: 14,
    maxPositionsWithChangeOver: 27,
    defaultMdu: "",
    notesEn: "VI III 400 Y and D. No selector size letter. Source: OI 7993270.",
    notesZh: "VI III 400 Y/D。无选择器等级字母。",
    rank: 10,
  },
  {
    id: "vv",
    code: "VV",
    nameEn: "VACUTAP VV compact in-tank vacuum OLTC",
    nameZh: "VV 箱内真空有载（紧凑）",
    mounting: ["in_tank"],
    medium: "oil_vacuum",
    structure: "compound",
    vacuum: true,
    currents: { I: [400], III: [250, 400, 600] },
    currentTokens: { I: [401], III: [250, 400, 600] },
    umKv: [40, 76, 123, 145],
    umKvY: [40, 76, 123],
    umKvD: [40, 76, 145],
    umKvByPhase: { I: [76, 145], III: [40, 76, 123, 145] },
    usesSelectorSize: false,
    maxStepVoltageV: 2000,
    stepCapacityByCurrent: { 250: 700, 400: 700, 600: 700 },
    connections: ["Y", "D"],
    iiiConnections: ["Y", "D"],
    maxPositionsLinear: 12,
    maxPositionsWithChangeOver: 23,
    defaultMdu: "",
    notesEn:
      "VV III 250/400/600 Y and D. VV I 401. No selector size. TD 203 / 1800203.",
    notesZh: "VV III 250/400/600 Y/D。无选择器等级字母。",
    rank: 20,
  },
  {
    id: "vm",
    code: "VM",
    nameEn: "VACUTAP VM combined in-tank vacuum OLTC",
    nameZh: "VM 箱内真空有载（组合式）",
    mounting: ["in_tank"],
    medium: "oil_vacuum",
    structure: "combined",
    vacuum: true,
    currents: {
      I: [350, 500, 650, 800, 1000, 1200, 1500],
      II: [350, 500, 650],
      III: [350, 500, 650],
    },
    currentTokens: {
      I: [351, 501, 651, 802, 1002, 1203, 1503],
      II: [352, 502, 652],
      III: [350, 500, 650],
    },
    umKv: [72.5, 123, 170, 245, 300],
    umKvByPhase: {
      I: [72.5, 123, 170, 245, 300],
      II: [72.5, 123, 170, 245],
      III: [72.5, 123, 170, 245],
    },
    usesSelectorSize: true,
    selectorSizes: ["B", "C", "D", "DE"],
    maxStepVoltageV: 3300,
    stepCapacityByCurrent: {
      350: 1155,
      500: 1625,
      650: 1625,
      800: 2600,
      1000: 2600,
      1200: 3500,
      1500: 3500,
    },
    connections: ["Y", "D"],
    iiiConnections: ["Y"],
    maxPositionsLinear: 18,
    maxPositionsWithChangeOver: 35,
    defaultMdu: "",
    notesEn:
      "III is Y-only (VM III 350Y/500Y/650Y). D uses 3x VM I. Selector B/C/D/DE. TD 2332907.",
    notesZh: "三相只有星点型号。线端用 3× I。选择器 B/C/D/DE。",
    rank: 40,
  },
  {
    id: "vrs",
    code: "VRS",
    nameEn: "VACUTAP VRS combined in-tank vacuum OLTC",
    nameZh: "VRS 箱内真空有载",
    mounting: ["in_tank"],
    medium: "oil_vacuum",
    structure: "combined",
    vacuum: true,
    currents: {
      I: [700, 1000, 1300, 2600],
      II: [700, 1000, 1300],
      III: [700, 1000, 1300],
    },
    currentTokens: {
      I: [701, 1001, 1301, 2622],
      II: [702, 1002, 1302],
      III: [700, 1000, 1300],
    },
    umKv: [72.5, 123, 170, 245],
    usesSelectorSize: true,
    selectorSizes: ["B", "C", "D", "DE"],
    maxStepVoltageV: 4500,
    stepCapacityByCurrent: {
      700: 1500,
      1000: 2100,
      1300: 2100,
      2600: 4200,
    },
    connections: ["Y", "D"],
    iiiConnections: ["Y"],
    maxPositionsLinear: 18,
    maxPositionsWithChangeOver: 35,
    defaultMdu: "",
    notesEn: "Current-gen VR compact row. III is Y-only. Flyer IN5062036.",
    notesZh: "现行 VR 紧凑档。三相只有星点。",
    rank: 60,
  },
  {
    id: "vrl",
    code: "VRL",
    nameEn: "VACUTAP VRL high-current in-tank vacuum OLTC",
    nameZh: "VRL 大电流箱内真空有载",
    mounting: ["in_tank"],
    medium: "oil_vacuum",
    structure: "combined",
    vacuum: true,
    currents: {
      I: [1300, 1600, 1800, 2000, 2400, 2600, 3000, 3200],
      II: [1300],
      III: [1300, 1600],
    },
    currentTokens: {
      I: [1301, 1601, 1801, 2001, 2401, 2601, 3001, 3201],
      II: [1302],
      III: [1300, 1600],
    },
    umKv: [72.5, 123, 170, 245, 300, 362, 420],
    usesSelectorSize: true,
    selectorSizes: ["B", "C", "D", "DE", "E"],
    maxStepVoltageV: 6000,
    stepCapacityByCurrent: {
      1300: 3000,
      1600: 6000,
      1800: 10000,
      2000: 10000,
      2400: 10000,
      2600: 10000,
      3000: 10000,
      3200: 10000,
    },
    connections: ["Y", "D"],
    iiiConnections: ["Y"],
    maxPositionsLinear: 18,
    maxPositionsWithChangeOver: 35,
    defaultMdu: "",
    notesEn: "Use only when VRS cannot cover. III 1300Y / 1600Y. IN5062036.",
    notesZh: "仅当 VRS 不够时用。三相 1300Y / 1600Y。",
    rank: 64,
  },
  {
    id: "oiltap_v",
    code: "V",
    nameEn: "OILTAP V compact in-tank oil OLTC",
    nameZh: "OILTAP V 箱内油有载（紧凑）",
    mounting: ["in_tank"],
    medium: "oil",
    structure: "compound",
    vacuum: false,
    currents: { I: [350], III: [200, 350] },
    umKv: [40, 76, 123],
    umKvY: [40, 76, 123],
    umKvD: [40, 76, 123],
    umKvByPhase: { I: [40, 76], III: [40, 76, 123] },
    usesSelectorSize: false,
    maxStepVoltageV: 1500,
    stepCapacityByCurrent: { 200: 300, 350: 525 },
    connections: ["Y", "D"],
    iiiConnections: ["Y", "D"],
    maxPositionsLinear: 14,
    maxPositionsWithChangeOver: 27,
    defaultMdu: "",
    notesEn:
      "Oil only. TD 82: V III 200 Y/D, V III 350 Y/D, V I 350. I Um max 76.",
    notesZh: "仅油灭弧。TD 82：V III 200/350 Y/D，V I 350。",
    rank: 15,
  },
  {
    id: "oiltap_g",
    code: "G",
    nameEn: "OILTAP G combined in-tank oil OLTC",
    nameZh: "OILTAP G 箱内油有载",
    mounting: ["in_tank"],
    medium: "oil",
    structure: "combined",
    vacuum: false,
    currents: { I: [1600, 3000], III: [1600, 2000] },
    currentTokens: { I: [1602, 3002], III: [1602, 2002] },
    umKv: [72.5, 123, 170, 245, 300],
    usesSelectorSize: true,
    selectorSizes: ["D", "E"],
    maxStepVoltageV: 5000,
    stepCapacityByCurrent: { 1600: 5000, 2000: 5000, 3000: 6500 },
    connections: ["Y", "D"],
    iiiConnections: ["Y"],
    maxPositionsLinear: 16,
    maxPositionsWithChangeOver: 31,
    defaultMdu: "",
    notesEn: "Oil only. TD 48: G III 1602 Y / 2002 Y. Selector D/E.",
    notesZh: "仅油灭弧。三相只有星点。选择器 D/E。",
    rank: 70,
  },
];

/** 76 (VV/VI drawings) and 72.5 (VM/G TD) are one IEC class. */
export function familyDutyUm(wanted: number, familyUms: number[]): number {
  const has725 = familyUms.some((u) => Math.abs(u - 72.5) < 0.05);
  const has76 = familyUms.some((u) => Math.abs(u - 76) < 0.05);
  if (Math.abs(wanted - 76) < 0.2 && has725 && !has76) return 72.5;
  if (Math.abs(wanted - 72.5) < 0.2 && has76 && !has725) return 76;
  return wanted;
}

/** Ums that exist for this phase and Y/D on the published type. */
export function allowedUms(
  s: SeriesDef,
  phases: PhaseCode,
  conn: Connection,
): number[] {
  let ums = s.umKvByPhase?.[phases] ?? s.umKv;
  if (conn === "D" && s.umKvD?.length) {
    ums = ums.filter((u) => s.umKvD!.some((d) => Math.abs(d - u) < 0.05));
  } else if (conn === "Y" && s.umKvY?.length) {
    ums = ums.filter((u) => s.umKvY!.some((y) => Math.abs(y - u) < 0.05));
  }
  return ums;
}

export function typeCurrentToken(
  s: SeriesDef,
  phases: PhaseCode,
  ium: number,
): number {
  const iums = s.currents[phases];
  const tokens = s.currentTokens?.[phases];
  if (!iums?.length || !tokens?.length) return ium;
  const i = iums.findIndex((c) => c === ium);
  return i >= 0 ? tokens[i] : ium;
}

export function publishedCurrentTokens(
  s: SeriesDef,
  phases: PhaseCode,
): number[] {
  return s.currentTokens?.[phases] ?? s.currents[phases] ?? [];
}

export function nearestUm(wanted: number, allowed: number[]): number | null {
  if (!allowed.length) return null;
  const sorted = [...allowed].sort((a, b) => a - b);
  const ge = sorted.find((u) => u >= wanted - 0.01);
  return ge ?? sorted[sorted.length - 1];
}

export function coveringUms(wanted: number, allowed: number[]): number[] {
  if (!allowed.length) return [];
  const sorted = [...allowed].sort((a, b) => a - b);
  const ge = sorted.filter((u) => u >= wanted - 0.01);
  if (!ge.length) return [];
  return ge.length > 1 ? [ge[0], ge[1]] : [ge[0]];
}

export function nearestCurrent(
  wanted: number,
  allowed: number[] | undefined,
): number | null {
  if (!allowed?.length) return null;
  const sorted = [...allowed].sort((a, b) => a - b);
  const ge = sorted.find((c) => c >= wanted - 0.01);
  if (ge != null) return ge;
  const max = sorted[sorted.length - 1];
  if (wanted <= max * 1.01 + 0.5) return max;
  return null;
}

export function phaseToken(p: PhaseCode): string {
  return p;
}

/** Published VM III 500 Y-123/B uses B at 123 kV. */
export function defaultSelectorSizeForUm(um: number): SelectorSize {
  if (um <= 123 + 0.1) return "B";
  if (um <= 170 + 0.1) return "C";
  if (um <= 245 + 0.1) return "D";
  if (um <= 300 + 0.1) return "DE";
  return "E";
}

function firstAllowedAtOrAbove(
  min: SelectorSize,
  allowed: SelectorSize[],
): SelectorSize {
  const minIdx = SIZE_ORDER.indexOf(min);
  for (let i = Math.max(0, minIdx); i < SIZE_ORDER.length; i++) {
    if (allowed.includes(SIZE_ORDER[i])) return SIZE_ORDER[i];
  }
  return allowed[allowed.length - 1] ?? "B";
}

export function pickSelectorSize(
  um: number,
  requested: SelectorSize | "auto" | undefined,
  bilKv?: number,
  pfKv?: number,
  acrossTapBilKv?: number,
  acrossTapPfKv?: number,
  familySizes?: SelectorSize[],
): SelectorSize {
  const umAllowed = SELECTOR_SIZES_BY_UM[um] ?? ["B", "C", "D", "DE"];
  const allowed =
    familySizes?.length
      ? umAllowed.filter((x) => familySizes.includes(x))
      : umAllowed;
  const pool = allowed.length ? allowed : familySizes?.length ? familySizes : umAllowed;
  if (requested && requested !== "auto") {
    if (pool.includes(requested)) return requested;
    return firstAllowedAtOrAbove(requested, pool);
  }

  let floor = defaultSelectorSizeForUm(um);
  floor = firstAllowedAtOrAbove(floor, pool);

  const earth = EARTH_INSULATION[um];
  if (earth && bilKv && bilKv > earth.bil + 1) {
    const i = SIZE_ORDER.indexOf(floor);
    floor = firstAllowedAtOrAbove(
      SIZE_ORDER[Math.min(SIZE_ORDER.length - 1, i + 1)] ?? "DE",
      pool,
    );
  }
  if (earth && pfKv && pfKv > earth.pf + 1) {
    const i = SIZE_ORDER.indexOf(floor);
    floor = firstAllowedAtOrAbove(
      SIZE_ORDER[Math.min(SIZE_ORDER.length - 1, i + 1)] ?? "DE",
      pool,
    );
  }

  const needALi = acrossTapBilKv ?? 0;
  const needAPf = acrossTapPfKv ?? 0;
  const floorIdx = SIZE_ORDER.indexOf(floor);

  for (let i = floorIdx; i < SIZE_ORDER.length; i++) {
    const cand = SIZE_ORDER[i];
    if (!pool.includes(cand)) continue;
    const ins = INTERNAL_INSULATION[cand];
    if (needALi <= 0 && needAPf <= 0) return cand;
    if (ins.a_li + 0.5 >= needALi && ins.a_pf + 0.5 >= needAPf) return cand;
  }

  for (const cand of SIZE_ORDER) {
    if (!pool.includes(cand)) continue;
    const ins = INTERNAL_INSULATION[cand];
    if (ins.a_li + 0.5 >= needALi && ins.a_pf + 0.5 >= needAPf) return cand;
  }
  return pool[pool.length - 1];
}
