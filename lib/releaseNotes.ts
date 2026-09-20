import type { Lang } from "./i18n";

export type NoteKind = "fix" | "new" | "imp";
export type NoteGroup = { kind: NoteKind; items: string[] };
export type Release = {
  version: string;
  date: string;
  groups: NoteGroup[];
};

const v100: Record<Lang, Release> = {
  zh: {
    version: "1.0.0",
    date: "2026-09",
    groups: [
      {
        kind: "new",
        items: [
          "按公开真空/油有载样本册选型：紧凑系列优先，组合式随后。",
          "油灭弧和真空灭弧都是硬约束，盖不住就提示超出目录。",
        ],
      },
    ],
  },
  en: {
    version: "1.0.0",
    date: "2026-09",
    groups: [
      {
        kind: "new",
        items: [
          "Selects from published vacuum and oil on-load axes: compact families first.",
          "Vacuum and oil are hard locks; out of catalogue if nothing covers.",
        ],
      },
    ],
  },
  vi: {
    version: "1.0.0",
    date: "2026-09",
    groups: [
      {
        kind: "new",
        items: [
          "Chọn theo catalogue công khai: dòng compact trước.",
          "Chân không và dầu là ràng buộc cứng.",
        ],
      },
    ],
  },
  es: {
    version: "1.0.0",
    date: "2026-09",
    groups: [
      {
        kind: "new",
        items: [
          "Selección según catálogo público: familias compactas primero.",
          "Vacío y aceite son bloqueos duros.",
        ],
      },
    ],
  },
  tr: {
    version: "1.0.0",
    date: "2026-09",
    groups: [
      {
        kind: "new",
        items: [
          "Yayınlanmış katalog eksenlerinden seçim: önce kompakt aileler.",
          "Vakum ve yağ sert kilitlerdir.",
        ],
      },
    ],
  },
  ru: {
    version: "1.0.0",
    date: "2026-09",
    groups: [
      {
        kind: "new",
        items: [
          "Подбор по открытому каталогу: сначала компактные серии.",
          "Вакуум и масло — жёсткие ограничения.",
        ],
      },
    ],
  },
};

export const RELEASES: Record<Lang, Release[]> = {
  zh: [v100.zh],
  en: [v100.en],
  vi: [v100.vi],
  es: [v100.es],
  tr: [v100.tr],
  ru: [v100.ru],
};
