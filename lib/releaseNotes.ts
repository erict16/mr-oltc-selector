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
    version: "1.0.2",
    date: "2026-09",
    groups: [
      {
        kind: "imp",
        items: [
          "按钮改成红橙色，页面底色仍是原来的冷色。",
          "型号串改成连写，例如 VV-III-250Y/76-10193W。",
        ],
      },
    ],
  },
  en: {
    version: "1.0.2",
    date: "2026-09",
    groups: [
      {
        kind: "imp",
        items: [
          "Buttons are vermilion; the sheet stays cool.",
          "Type strings are compact, e.g. VV-III-250Y/76-10193W.",
        ],
      },
    ],
  },
  vi: {
    version: "1.0.2",
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
    version: "1.0.2",
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
    version: "1.0.2",
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
    version: "1.0.2",
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
