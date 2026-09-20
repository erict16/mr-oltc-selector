import type { Lang } from "./i18n";

export type AgentGuideCopy = {
  back: string;
  title: string;
  lead: string;
  s1t: string;
  s1b: string;
  s1wb?: string;
  s1wbBody?: string;
  wbShot?: string;
  wbShotAlt?: string;
  s1other?: string;
  s1otherBody?: string;
  s1prompt: string;
  s1copy: string;
  s1alt: string;
  dl: string;
  hub: string;
  s2t: string;
  s2b: string;
  s2q: string;
  s3t: string;
  s3b: string;
  s3note: string;
  tagOltc: string;
  tagOctc: string;
  tagDry: string;
  more: string;
  moreLead: string;
  exDry: string;
  qDry: string;
  exShzv: string;
  qShzv: string;
  cli: string;
  cliBody: string;
  install: string;
  run: string;
  copy: string;
  copied: string;
  limit: string;
};

const PIN = "npx -y mr-oltc-selector@1.0.1";
const INSTALL_LINE =
  "请根据 https://skillhub.cn/install/skillhub.md，安装有载开关选型助手。";

const zh: AgentGuideCopy = {
  back: "选型",
  title: "让 AI 助手帮你选型",
  lead: "三步：装上技能，发参数，拿型号。",
  s1t: "装上技能",
  s1b: "如果你用 WorkBuddy，可以在「技能」里搜「有载开关选型」。",
  s1wb: "WorkBuddy",
  s1wbBody: "打开「专家·技能·连接器」，搜「有载开关选型」，点卡片右边的 +。",
  s1other: "其它助手也可以",
  s1otherBody: "把这句话发给它，它自己从 SkillHub 装好。",
  s1prompt: INSTALL_LINE,
  s1copy: "复制这句话",
  s1alt: "其他装法：",
  dl: "下载技能包 zip",
  hub: "在 SkillHub 上查看",
  s2t: "把参数发给它",
  s2b: "像聊天一样，有什么发什么。参数不确定，它会来问你。",
  s2q: "帮我选个有载开关：110 kV，±8×1.25%，350 A，高压侧中性点，真空箱内。",
  s3t: "拿到型号和理由",
  s3b: "型号都来自公开样本册，不编。",
  s3note: "过了样本册检查，可以拿去询价；下单前仍要工程确认。",
  tagOltc: "有载",
  tagOctc: "无载",
  tagDry: "干式",
  more: "更多选型案例",
  moreLead: "参数不一样，问法一样。",
  exDry: "紧凑",
  qDry: "帮我选：25 MVA，110 kV，星点，真空，±8×1.25%，350 A。",
  exShzv: "组合式",
  qShzv: "帮我选有载开关：500 A，123 kV，星点，真空，±8×1.25%。",
  cli: "想自己跑命令行？",
  cliBody: `技能和网页版共用同一套选型引擎。终端用钉死的版本：${PIN}`,
  install: "安装",
  run: "有载例子",
  copy: "复制",
  copied: "已复制",
  limit: "出采购文件前，需要工程确认。",
};

const en: AgentGuideCopy = {
  back: "Selector",
  title: "Let an AI assistant pick the type",
  lead: "Three steps: install the skill, send the data, get the type.",
  s1t: "Install the skill",
  s1b: "Send this line to your AI assistant. It installs the skill from SkillHub.",
  s1prompt:
    "Follow https://skillhub.cn/install/skillhub.md and install the on-load tap-changer selector skill.",
  s1copy: "Copy the line",
  s1alt: "Other ways:",
  dl: "Download the skill zip",
  hub: "View on SkillHub",
  s2t: "Send the transformer data",
  s2b: "Just chat. If a parameter is unclear, it asks.",
  s2q: "Select an on-load tap-changer: 110 kV, ±8×1.25%, 350 A, HV neutral, vacuum in-tank.",
  s3t: "Get the type and the reason",
  s3b: "Types come from the published brochure. Nothing is invented.",
  s3note: "If it passes the brochure check, you can enquire. Engineering still confirms before order.",
  tagOltc: "On-load",
  tagOctc: "Off-circuit",
  tagDry: "Compact",
  more: "More examples",
  moreLead: "Same question shape, different duty.",
  exDry: "Compact",
  qDry: "Select: 25 MVA, 110 kV, star-point, vacuum, ±8×1.25%, 350 A.",
  exShzv: "Combined",
  qShzv: "Select an OLTC: 500 A, 123 kV, star-point, vacuum, ±8×1.25%.",
  cli: "Want the CLI?",
  cliBody: `The skill and the web app share the same engine. Pin the version: ${PIN}`,
  install: "Install",
  run: "On-load example",
  copy: "Copy",
  copied: "Copied",
  limit: "Engineering confirmation is still required before purchase.",
};

const copies: Record<Lang, AgentGuideCopy> = {
  zh,
  en,
  vi: { ...en, back: "Chọn loại" },
  es: { ...en, back: "Selector" },
  tr: { ...en, back: "Seçici" },
  ru: { ...en, back: "Подбор" },
};

export function agentGuide(lang: Lang): AgentGuideCopy {
  return copies[lang] ?? en;
}
