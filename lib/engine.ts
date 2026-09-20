import {
  EARTH_INSULATION,
  FAMILY_MIN_RANK,
  INTERNAL_INSULATION,
  SERIES,
  allowedUms,
  coveringUms,
  nearestCurrent,
  nearestUm,
  phaseToken,
  pickSelectorSize,
  typeCurrentToken,
} from "./catalog";
import {
  commercialTypeExists,
  connectionLetterOnPhase,
  phaseConnectionLegal,
} from "./typeExists";
import { resolveTapFields } from "./tapCode";
import type {
  Connection,
  ModelResult,
  OctcSeriesChoice,
  OctcSeriesRoman,
  PhaseCode,
  SelectInput,
  SelectOutput,
  SelectorSize,
  SeriesDef,
} from "./types";

function normOctcContact(raw: string | undefined): string {
  const t = (raw ?? "").replace(/\s+/g, "").toLowerCase();
  const m = t.match(/^(\d+)x(\d+)$/);
  if (!m) return "";
  return `${Number(m[1])}x${Number(m[2])}`;
}

/**
 * DETC contact from service positions (or ±N �?2N+1).
 * 2025 list also has 8x7 / 9x8 / 10x9 / 16x15 �?map those when P needs them.
 * A known OS contact (`input.octcContact`) wins.
 */
export function octcContactCode(
  input: SelectInput,
  seriesId?: string,
): string {
  const hinted = normOctcContact(input.octcContact);
  if (hinted) return hinted;
  let pos = input.positions;
  if (input.plusMinusSteps != null && input.plusMinusSteps > 0) {
    pos = 2 * input.plusMinusSteps + 1;
  }
  if (seriesId === "wsg") {
    if (pos == null || pos <= 5) return "4x5";
    return "6x5";
  }
  if (pos == null || pos <= 6) return "6x5";
  if (pos <= 7) return "7x6";
  if (pos <= 8) return "8x7";
  if (pos <= 9) return "9x8";
  if (pos <= 10) return "10x9";
  if (pos <= 12) return "12x11";
  if (pos <= 16) return "16x15";
  return "18x17";
}

/** WSL size letter from 2025 list / OS. */
export function octcSizeLetter(
  um: number,
  contact: string,
  requested?: SelectorSize | "auto",
): SelectorSize {
  if (requested && requested !== "auto") {
    if (requested === "DE") return "E";
    return requested;
  }
  const c = contact.toLowerCase();
  if (c === "18x17" || c === "16x15") return "E";
  if (c === "12x11" || c === "10x9" || c === "12x12") return "D";
  if (
    um <= 72.5 + 0.1 &&
    ["6x5", "4x5", "5x4", "5x2", "4x3", "3x2", "7x6"].includes(c)
  ) {
    return "A";
  }
  return "B";
}

/**
 * Product series roman, not phase.
 * Explicit octcSeries wins. Else 5x2 �?VIII, 3x2 �?VI, 5x4 �?V;
 * else Y→IV / D→II.
 */
export function octcRoman(
  connection: Connection,
  contact?: string,
  series?: OctcSeriesChoice,
): OctcSeriesRoman {
  if (series && series !== "auto") return series;
  const c = (contact ?? "").toLowerCase();
  if (c === "5x2" || c === "12x2") return "VIII";
  if (c === "3x2" || c === "6x2") return "VI";
  if (c === "5x4" || c === "4x3") return "V";
  if (c === "12x12") return "VII";
  return connection === "D" ? "II" : "IV";
}

function isOctcSeries(s: SeriesDef): boolean {
  return s.dutyKind === "octc";
}

function maxStepVoltageForSeries(
  s: SeriesDef,
  _pitch: number,
): number {
  return s.maxStepVoltageV;
}

/**
 * Compound types have fixed internal insulation (no B/C/D letter).
 * CV2 Table 4-1: across-tap (a) ~200 kV LI �?reject if duty needs more.
 */
function compoundCoversAcrossTap(
  s: SeriesDef,
  input: SelectInput,
): boolean {
  if (s.structure !== "compound") return true;
  const needBil = input.acrossTapBilKv ?? 0;
  const needPf = input.acrossTapPfKv ?? 0;
  if (needBil <= 0 && needPf <= 0) return true;
  // Conservative compound internal a-distance (CV/CV2 family)
  const aLi = s.id === "cv2" ? 200 : 200;
  const aPf = s.id === "cv2" ? 50 : 50;
  return aLi + 0.5 >= needBil && aPf + 0.5 >= needPf;
}

function formatUmToken(
  um: number,
  size: string,
  usesSelectorSize: boolean,
): string {
  const umStr = Number.isInteger(um) ? String(um) : String(um);
  if (!usesSelectorSize || !size) return umStr;
  return `${umStr}${size}`;
}

function buildModelString(
  series: SeriesDef,
  phases: string,
  current: number,
  connection: Connection,
  umToken: string,
  tapCode: string,
  unitCount: number,
  _octcSeries?: OctcSeriesChoice,
): string {
  // Compact commercial string, same shape as Huaming:
  //   VVIII-250Y/76-10193W
  //   VMIII-500Y/123B-10193W
  const conn = connection === "any" ? "" : connection;
  const token = typeCurrentToken(series, phases as PhaseCode, current);
  const core = `${series.code}-${phases}-${token}${conn}/${umToken}-${tapCode}`;
  if (unitCount > 1) return `${unitCount}x${core}`;
  return core;
}

function seriesMatchesMounting(s: SeriesDef, input: SelectInput): boolean {
  if (input.mounting === "dry_type") return s.mounting.includes("dry_type");
  if (input.mounting === "reactor") return s.mounting.includes("reactor");
  if (
    input.mounting === "on_tank" ||
    input.mounting === "external_compartment"
  ) {
    return (
      s.mounting.includes("on_tank") ||
      s.mounting.includes("external_compartment")
    );
  }
  return s.mounting.includes("in_tank");
}

function seriesMatchesMedium(s: SeriesDef, input: SelectInput): boolean {
  if (input.mounting === "dry_type") return s.medium === "dry";
  // Vacuum / oil are hard locks. Do not fall back across the arc mode.
  if (input.preferVacuum || input.medium === "oil_vacuum") {
    return s.vacuum === true;
  }
  if (input.medium === "oil") return s.medium === "oil" && !s.vacuum;
  return true;
}

/**
 * Higher score = better primary pick.
 *
 * Commercial min-adequate (Base Price List 2025 + sales practice):
 *   1. Family: CV2 �?CM2 �?SHZV �?SDZV �?SHZVG
 *      (never SHZV-400 over CV2/CM2 on exact I; SDZV only when SHZV Ust/capacity is short).
 *   2. **Only emit a type that exists in the brochure.**
 *      CM2III-…D is not a type �?do not emit it. CV2III-…D and HWVIII-…D exist.
 *      3× I is used when that single-phase type exists and III does not cover
 *      (missing III connection, or I�?above III max).
 *      One legal III still beats 3× when both exist (Y price: SHZV-1000 vs 3×CM2I-800).
 *   3. Mild tighter catalogue current / Um.
 */
function adequacyScore(
  s: SeriesDef,
  input: SelectInput,
  current: number,
  um: number,
  unitCount: number,
): number {
  let score = 10000;

  // Dominant: family minimum path (lower FAMILY_MIN_RANK �?higher score)
  const fam = FAMILY_MIN_RANK[s.id] ?? s.rank;
  score -= fam * 100;

  // Vacuum / oil preference
  if (input.preferVacuum && s.vacuum) score += 40;
  if (input.preferVacuum && !s.vacuum) score -= 800;
  if (!input.preferVacuum && input.medium === "oil" && !s.vacuum) score += 40;
  if (!input.preferVacuum && input.medium === "oil" && s.vacuum) score -= 800;

  // Multi-unit is last resort commercially (see post-sort hard rule too).
  // Soft penalty only ranks among multi options when no single exists.
  if (unitCount > 1) {
    score -= 8000;
    score -= current * 0.05; // prefer cheaper multi pole rating when forced
  }

  // Mild fit preference �?must stay << one family step (100 pts)
  const overshootI = current - input.throughCurrentA;
  // Tight current beats a slightly-earlier compact family (250 A �?VV 250, not VI 400).
  score -= overshootI * 15;
  const overshootUm = um - input.umKv;
  score -= overshootUm * 3;

  // Mild step-capacity tightness
  const psin = s.stepCapacityByCurrent?.[current];
  if (psin && input.stepVoltageV > 0) {
    const need = (input.throughCurrentA * input.stepVoltageV) / 1000;
    if (need > 0 && psin >= need) {
      score -= (psin - need) * 0.01;
    }
  }

  return score;
}

type Attempt = {
  series: SeriesDef;
  phases: PhaseCode;
  current: number;
  um: number;
  unitCount: number;
  /** 3× because combined III cannot sit on delta / line-end */
  deltaForced?: boolean;
};

/** Catalogue I covers duty, with 1% commercial overcurrent (2026 OS: 603.75 on CV2-600). */
function ratingCoversDuty(wanted: number, rating: number): boolean {
  if (wanted <= rating + 0.01) return true;
  return wanted <= rating * 1.01 + 0.5;
}

function buildAttempts(s: SeriesDef, input: SelectInput): Attempt[] {
  const out: Attempt[] = [];
  const covering = coveringUms(
    input.umKv,
    allowedUms(s, input.phases, input.connection),
  ).filter((u) => u >= input.umKv - 0.1);
  if (!covering.length) return out;
  const um0 = covering[0];
  // 126 twin only on the min-adequate families (CV2/CM2/�?. SHZV extra Ums
  // crowd the ranked list and hide customer-locked oil CM rows (QS2607197).
  const ums =
    (FAMILY_MIN_RANK[s.id] ?? s.rank) < 40 ? covering : [um0];

  const list = s.currents[input.phases];
  const maxPhase = list?.length ? Math.max(...list) : null;
  const connIllegal = !phaseConnectionLegal(
    s,
    input.phases,
    input.connection,
  );

  // Primary phase as requested when a brochure type exists for this connection.
  if (
    !connIllegal &&
    maxPhase != null &&
    ratingCoversDuty(input.throughCurrentA, maxPhase)
  ) {
    const cur = nearestCurrent(input.throughCurrentA, list);
    if (cur != null) {
      for (const um of ums) {
        out.push({
          series: s,
          phases: input.phases,
          current: cur,
          um,
          unitCount: 1,
        });
      }
    }
  }

  // OCTC: never 3× singles.
  // 3× I-units: always emit a covering set so a customer-locked 3× stays
  // eligible. Ranking still puts any legal single III first.
  // Extra Um is only for single-unit alts (the 126 twin), not 3×.
  if (isOctcSeries(s)) return out;
  if (
    s.currents.I?.length &&
    (input.phases === "III" || connIllegal)
  ) {
    const curI = nearestCurrent(input.throughCurrentA, s.currents.I);
    const umI = coveringUms(
      input.umKv,
      allowedUms(s, "I", input.connection),
    ).filter((u) => u >= input.umKv - 0.1);
    const umForI = umI[0] ?? um0;
    if (curI != null && umForI != null) {
      out.push({
        series: s,
        phases: "I",
        current: curI,
        um: umForI,
        unitCount: 3,
        deltaForced: connIllegal,
      });
    }
  }

  return out;
}

/**
 * Other-options order: same family next I �?next list Um (126 after 72.5) �?
 * next family at the duty Um �?then SHZV / 3×. Stops SHZV filling the first
 * three alts when a 126 twin is on the 2025 list (2026 OS).
 */
function diversifyResults(ranked: ModelResult[]): ModelResult[] {
  if (ranked.length <= 1) return ranked;
  const primary = ranked[0];
  const used = new Set<string>([primary.model]);
  const rest: ModelResult[] = [];

  const take = (pred: (r: ModelResult) => boolean) => {
    const hit = ranked.find((r) => !used.has(r.model) && pred(r));
    if (hit) {
      rest.push(hit);
      used.add(hit.model);
    }
  };

  take(
    (r) =>
      r.seriesId === primary.seriesId &&
      r.unitCount === primary.unitCount &&
      Math.abs(r.umKv - primary.umKv) < 0.1 &&
      r.currentA !== primary.currentA,
  );
  take(
    (r) =>
      r.seriesId === primary.seriesId &&
      r.unitCount === primary.unitCount &&
      r.umKv > primary.umKv + 0.1,
  );
  take(
    (r) =>
      r.seriesId !== primary.seriesId &&
      r.unitCount === 1 &&
      r.umKv <= primary.umKv + 0.1,
  );

  for (const r of ranked) {
    if (used.has(r.model)) continue;
    rest.push(r);
    used.add(r.model);
  }
  return [primary, ...rest];
}

export function selectOltc(input: SelectInput): SelectOutput {
  const errorsEn: string[] = [];
  const errorsZh: string[] = [];

  if (!input.throughCurrentA || input.throughCurrentA <= 0) {
    errorsEn.push("Enter rated through-current (A).");
    errorsZh.push("请填写额定通过电流（A）。");
  }
  if (!input.umKv || input.umKv <= 0) {
    errorsEn.push("Enter highest voltage for equipment Um (kV).");
    errorsZh.push("请填写设备最高电压 Um（kV）。");
  }
  if (input.stepVoltageV < 0) {
    errorsEn.push("Step voltage cannot be negative.");
    errorsZh.push("级电压不能为负。");
  }

  if (errorsEn.length) {
    return { ok: false, results: [], errorsEn, errorsZh };
  }

  const tap = resolveTapFields({
    regulation: input.regulation,
    positions: input.positions,
    plusMinusSteps: input.plusMinusSteps,
    pitch: input.pitch,
    midPositions: input.midPositions,
  });

  const wantOctc = input.dutyKind === "octc";
  let candidates = SERIES.filter((s) => {
    if (isOctcSeries(s) !== wantOctc) return false;
    return seriesMatchesMounting(s, input) && seriesMatchesMedium(s, input);
  });

  candidates = candidates.filter((s) => {
    if (input.connection === "any") return true;
    return (
      s.connections.includes(input.connection) ||
      s.connections.includes("any")
    );
  });

  const wantStruct = input.preferStructure;
  if (wantStruct && wantStruct !== "auto") {
    candidates = candidates.filter((s) => s.structure === wantStruct);
  }

  if (!candidates.length) {
    return {
      ok: false,
      results: [],
      errorsEn: [
        wantOctc
          ? "No OCTC family matches this mounting / medium combination. Adjust filters or contact engineering."
          : "No OLTC family matches this mounting / medium combination. Adjust filters or contact engineering.",
      ],
      errorsZh: [
        wantOctc
          ? "没有无载系列匹配当前安装位置/介质。请调整条件，或联系工程确认。"
          : "没有系列匹配当前安装位置/介质。请调整条件，或联系工程确认。",
      ],
    };
  }

  const results: ModelResult[] = [];
  const seen = new Set<string>();

  for (const s of candidates) {
      if (!compoundCoversAcrossTap(s, input)) continue;

      // Pitch-aware Ust limit (CV2 brochure: 2000 V @ 10 contacts, 1500 V @ 12).
      // Hard reject �?do not keep the family by bumping current.
      // OCTC is de-energized: skip OLTC tap-position / pitch envelope.
      if (!isOctcSeries(s)) {
        const pitchMaxUst = maxStepVoltageForSeries(s, tap.pitch);
        if (input.stepVoltageV > pitchMaxUst + 0.5) continue;

        const maxPos =
          input.regulation === "linear"
            ? s.maxPositionsLinear
            : s.maxPositionsWithChangeOver;
        if (tap.positions > maxPos) continue;
      } else {
        let octcPos = input.positions;
        if (input.plusMinusSteps != null && input.plusMinusSteps > 0) {
          octcPos = 2 * input.plusMinusSteps + 1;
        }
        if (octcPos != null && octcPos > s.maxPositionsLinear) continue;
      }

      for (const att of buildAttempts(s, input)) {
        const phaseCurrents = s.currents[att.phases] ?? s.currents.I ?? [];

        // Covering catalogue I: smallest first, then the next step so a
        // customer-locked larger rating (CM-600, SHZV-1000, SHZVG-1500)
        // still appears in the ranked list.
        const need =
          input.stepVoltageV > 0
            ? (input.throughCurrentA * input.stepVoltageV) / 1000
            : 0;
        const capacityOk = (c: number) => {
          const psin = s.stepCapacityByCurrent?.[c];
          if (psin != null && need > psin + 0.5) return false;
          return true;
        };
        let covering = phaseCurrents.filter((c) => {
          if (!ratingCoversDuty(input.throughCurrentA, c)) return false;
          // Headroom: if duty sits in the top ~3% of a rating, bump (case 2: 489.7 �?600).
          // 480 A must still accept CM2-500 (2025 sales).
          // ~1 A epsilon: 349.9 A is S/�?U rounding of 350, not a commercial bump to 600.
          if (
            input.throughCurrentA + 1 < c &&
            input.throughCurrentA > c * 0.97
          ) {
            return false;
          }
          return capacityOk(c);
        });
        if (!covering.length) {
          // Keep max rating when the 97% bump has no next step.
          const maxKeep = phaseCurrents.filter(
            (c) =>
              ratingCoversDuty(input.throughCurrentA, c) && capacityOk(c),
          );
          if (maxKeep.length) covering = [Math.max(...maxKeep)];
        }
        if (!covering.length) continue;
        const currentsToEmit = covering.slice(0, 2);

        for (const current of currentsToEmit) {
        const octc = isOctcSeries(s);
        if (octc) continue;
        const selectorSize = s.usesSelectorSize
          ? pickSelectorSize(
              att.um,
              input.selectorSize ?? "auto",
              input.bilKv,
              input.pfKv,
              input.acrossTapBilKv,
              input.acrossTapPfKv,
              s.selectorSizes,
            )
          : "";
        const tapCode = tap.tapCode;
        const modelTap = tap.tapCode;

        const umToken = formatUmToken(att.um, selectorSize, s.usesSelectorSize);
        const phases = phaseToken(att.phases);
        const conn: Connection =
          input.connection === "any"
            ? s.connections.includes("Y")
              ? "Y"
              : s.connections[0]
            : input.connection;

        let mduStr = "";
        const mduPref = input.mdu ?? "none";
        if (mduPref && mduPref !== "none" && mduPref !== "auto") {
          mduStr = mduPref;
        } else if (mduPref === "auto") {
          mduStr = s.defaultMdu;
        }

        // I (and CM2/CM/CMD II) omit Y/D after current. D after Um is size.
        const modelConn: Connection = connectionLetterOnPhase(
          s,
          att.phases,
          conn,
        );

        let finalModel = buildModelString(
          s,
          phases,
          current,
          modelConn,
          umToken,
          modelTap,
          att.unitCount,
          input.octcSeries,
        );
        if (att.phases === "I") {
          finalModel = finalModel.replace(
            new RegExp(`(${s.code}-I-\\d+)[YD]/`),
            "$1/",
          );
        } else if (att.phases === "II" && modelConn === "any") {
          finalModel = finalModel.replace(
            new RegExp(`(${s.code}-II-\\d+)[YD]/`),
            "$1/",
          );
        }

        if (!commercialTypeExists(finalModel, s)) {
          continue;
        }

        if (seen.has(finalModel)) continue;
        seen.add(finalModel);

        const modelWithMdu = mduStr ? `${finalModel}+${mduStr}` : finalModel;
        const score = adequacyScore(s, input, current, att.um, att.unitCount);

        const reasonsEn: string[] = [];
        const reasonsZh: string[] = [];
        const warningsEn: string[] = [];
        const warningsZh: string[] = [];

        // 需求电流取整展示：174.954�?这种长小数没有工程意�?
        const dutyA =
          input.throughCurrentA >= 100
            ? String(Math.round(input.throughCurrentA))
            : String(Math.round(input.throughCurrentA * 10) / 10);
        reasonsEn.push(
          `Minimum-adequate path: ${s.nameEn}, Ium ${current} A >= ${dutyA} A, Um ${att.um} kV.`,
        );
        reasonsZh.push(
          `最低满足路径：${s.nameZh}，Ium ${current} A >= 需求 ${dutyA} A，Um ${att.um} kV。`,
        );

        if (s.structure === "compound" && !octc) {
          reasonsEn.push(
            "Compound type fits duty; preferred over larger combined types when eligible.",
          );
          reasonsZh.push(
            "复合式满足工况时优先于更大的组合式。",
          );
        }

        if (s.usesSelectorSize) {
          reasonsEn.push(
            `Tap selector grade ${selectorSize} (smallest covering Um` +
              (input.acrossTapBilKv
                ? ` + across-tap BIL ${input.acrossTapBilKv} kV`
                : "") +
              ").",
          );
          reasonsZh.push(
            `分接选择器等级 ${selectorSize}（满足 Um` +
              (input.acrossTapBilKv
                ? ` 与调压绕组间 BIL ${input.acrossTapBilKv} kV`
                : "") +
              " 的最小规格）。",
          );
        }

        reasonsEn.push(
          `Tap code ${tap.tapCode}: pitch ${tap.pitch}, ${tap.positions} pos, mid ${tap.mid}, ${input.regulation}.`,
        );
        reasonsZh.push(
          `分接代码 ${tap.tapCode}：节距 ${tap.pitch}，${tap.positions} 位，中间位 ${tap.mid}。`,
        );

        if (att.unitCount > 1) {
          if (att.deltaForced) {
            reasonsEn.push(
              `${att.unitCount}x single-phase: no brochure III type for this connection.`,
            );
            reasonsZh.push(
              `${att.unitCount} 台单相：样本没有这个连接的三相型号。`,
            );
          } else {
            reasonsEn.push(
              `${att.unitCount}x single-phase: no single III unit covers this current.`,
            );
            reasonsZh.push(
              `${att.unitCount} 台单相：无三相整机可覆盖此电流。`,
            );
          }
        }

        const earth = EARTH_INSULATION[att.um];
        if (earth) {
          reasonsEn.push(
            `Earth insulation (catalogue): PF ${earth.pf} / LI ${earth.bil} kV.`,
          );
          reasonsZh.push(
            `对地绝缘（样本）：工频 ${earth.pf} / 雷电 ${earth.bil} kV。`,
          );
        }

        if (current > input.throughCurrentA + 0.5) {
          warningsEn.push(`Through-current rounded up to ${current} A.`);
          warningsZh.push(`通过电流已上靠至 ${current} A。`);
        }
        const coveringUm = nearestUm(input.umKv, s.umKv);
        const extraUm =
          coveringUm != null && att.um > coveringUm + 0.1;
        if (extraUm) {
          reasonsEn.push(
            `Next catalogue Um ${att.um} kV (list twin of ${coveringUm} kV).`,
          );
          reasonsZh.push(
            `目录下一档 Um ${att.um} kV（${coveringUm} kV 的配对）。`,
          );
        } else if (att.um > input.umKv + 0.1) {
          warningsEn.push(`Um rounded up to ${att.um} kV.`);
          warningsZh.push(`Um 已上靠至 ${att.um} kV。`);
        }

        warningsEn.push(
          "Indicative selection from published technical data. Final OS requires engineering confirmation.",
        );
        warningsZh.push(
          "依据公开技术样本的选型建议。最终须工程确认。",
        );

        const maxStepVoltageV = octc
          ? null
          : maxStepVoltageForSeries(s, tap.pitch);
        const stepCapacityKva = s.stepCapacityByCurrent?.[current] ?? null;

        let confidence = 0.88;
        if (att.unitCount > 1) confidence -= 0.08;
        if (warningsEn.length > 2) confidence -= 0.03;
        confidence = Math.max(0.45, Math.min(0.96, confidence));

        results.push({
          seriesId: s.id,
          seriesCode: s.code,
          model: finalModel,
          modelWithMdu,
          phases: att.phases,
          currentA: current,
          connection: conn,
          umKv: att.um,
          selectorSize,
          umToken,
          tapCode,
          regulation: input.regulation,
          changeOver: octc ? "0" : tap.changeOver,
          pitch: octc ? 0 : tap.pitch,
          positions: octc
            ? input.positions ??
              (input.plusMinusSteps != null && input.plusMinusSteps > 0
                ? 2 * input.plusMinusSteps + 1
                : 5)
            : tap.positions,
          mid: octc ? 0 : tap.mid,
          mdu: mduStr,
          unitCount: att.unitCount,
          maxStepVoltageV,
          stepCapacityKva,
          earthPfKv: earth?.pf ?? null,
          earthBilKv: earth?.bil ?? null,
          reasonsEn,
          reasonsZh,
          warningsEn,
          warningsZh,
          confidence,
          adequacyScore: score,
        });
        }
      }
    }

  // Vacuum / oil are hard locks. Do not fall back across the arc mode
  // (oil 2915 A used to leak 3xSHZVGI; on-tank vacuum used to leak HWDK).
  let final = results;
  if (input.preferVacuum) {
    final = results.filter(
      (r) => SERIES.find((s) => s.id === r.seriesId)?.vacuum,
    );
  } else if (input.medium === "oil") {
    final = results.filter(
      (r) => SERIES.find((s) => s.id === r.seriesId)?.vacuum === false,
    );
  }

  final.sort((a, b) => {
    // Hard rule: any brochure-legal single-unit outranks any multi.
    if (a.unitCount !== b.unitCount) return a.unitCount - b.unitCount;
    if (b.adequacyScore !== a.adequacyScore)
      return b.adequacyScore - a.adequacyScore;
    return b.confidence - a.confidence;
  });

  if (!final.length) {
    return {
      ok: false,
      results: [],
      errorsEn: [
        "Parameters out of catalogue range (current, Um, step voltage, or positions).",
      ],
      errorsZh: [
        "参数超出目录范围（电流、Um、级电压或档位数）。",
      ],
    };
  }

  return {
    ok: true,
    results: diversifyResults(final).slice(0, 20),
    errorsEn: [],
    errorsZh: [],
  };
}

/** Same family / phase / unit count, next catalogue current above the primary. */
export function stepUpOf(
  primary: ModelResult,
  results: ModelResult[],
): ModelResult | null {
  const same = results.filter(
    (r) =>
      r.model !== primary.model &&
      r.seriesId === primary.seriesId &&
      r.phases === primary.phases &&
      r.unitCount === primary.unitCount &&
      r.currentA > primary.currentA,
  );
  if (!same.length) return null;
  same.sort((a, b) => a.currentA - b.currentA);
  return same[0];
}

/**
 * Visible “other options�? keep 3 slots. Same-family next I (step-up) and
 * a higher-Um twin stay; a second current of the same family at the same Um
 * yields to another family (oil: CM-600 out, CMD-400 in).
 */
export function pickOtherOptions(
  results: ModelResult[],
  n = 3,
): ModelResult[] {
  if (results.length <= 1) return [];
  const primary = results[0];
  const stepUp = stepUpOf(primary, results);
  const preferred: ModelResult[] = [];
  const overflow: ModelResult[] = [];
  if (stepUp) preferred.push(stepUp);
  for (const r of results.slice(1)) {
    if (r.model === primary.model) continue;
    if (preferred.some((x) => x.model === r.model)) continue;
    const sameFamilyUm = preferred.some(
      (x) =>
        x.seriesCode === r.seriesCode && Math.abs(x.umKv - r.umKv) < 0.1,
    );
    if (sameFamilyUm) overflow.push(r);
    else preferred.push(r);
  }
  return [...preferred, ...overflow].slice(0, n);
}

/** Published-doc fixtures used by tests. */
export const FIXTURES = {
  vv250Y76: {
    input: {
      mounting: "in_tank" as const,
      medium: "oil_vacuum" as const,
      preferVacuum: true,
      phases: "III" as const,
      connection: "Y" as const,
      throughCurrentA: 250,
      umKv: 76,
      stepVoltageV: 1500,
      regulation: "reversing" as const,
      plusMinusSteps: 8,
      midPositions: 3 as const,
      mdu: "none" as const,
    },
    expectContains: "VV-III-250Y/76",
  },
  vm500Y123B: {
    input: {
      mounting: "in_tank" as const,
      medium: "oil_vacuum" as const,
      preferVacuum: true,
      phases: "III" as const,
      connection: "Y" as const,
      throughCurrentA: 500,
      umKv: 123,
      stepVoltageV: 2000,
      regulation: "reversing" as const,
      plusMinusSteps: 8,
      midPositions: 3 as const,
      selectorSize: "B" as const,
      mdu: "none" as const,
    },
    expectContains: "VM-III-500Y/123B",
  },
};
