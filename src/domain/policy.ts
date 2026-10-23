import type { ActivityType, LocalizedText } from "./types";

export interface PolicySource {
  id: string;
  title: LocalizedText;
  url: string;
  asOf: string;
  note?: LocalizedText;
}

export const POLICY_VERSION = "2026-04-01" as const;
export const POLICY_VERIFIED_AT = "2026-10-24" as const;

export const THRESHOLDS = {
  hsp1: 70,
  hsp2: 70,
  prStandard: 70,
  prFastTrack: 80,
} as const;

export const ACTIVITY_TYPES: ActivityType[] = [
  "academic",
  "specialized",
  "management",
];

export const MINIMUM_SALARY_MAN_YEN: Record<ActivityType, number | null> = {
  academic: null,
  specialized: 300,
  management: 300,
};

export const AGE_POINTS = [
  { maxAge: 29, points: 15 },
  { maxAge: 34, points: 10 },
  { maxAge: 39, points: 5 },
  { maxAge: Infinity, points: 0 },
] as const;

export const EDUCATION_POINTS = {
  academic: {
    doctorate: 30,
    masters: 20,
    bachelor: 10,
    mbaMot: 0,
    multipleDegrees: 5,
  },
  specialized: {
    doctorate: 30,
    masters: 20,
    bachelor: 10,
    mbaMot: 25,
    multipleDegrees: 5,
  },
  management: {
    doctorate: 20,
    masters: 20,
    bachelor: 10,
    mbaMot: 25,
    multipleDegrees: 5,
  },
} as const;

export const CAREER_POINTS = {
  academic: [
    { minYears: 7, points: 15 },
    { minYears: 5, points: 10 },
    { minYears: 3, points: 5 },
  ],
  specialized: [
    { minYears: 10, points: 20 },
    { minYears: 7, points: 15 },
    { minYears: 5, points: 10 },
    { minYears: 3, points: 5 },
  ],
  management: [
    { minYears: 10, points: 25 },
    { minYears: 7, points: 20 },
    { minYears: 5, points: 15 },
    { minYears: 3, points: 10 },
  ],
} as const;

/**
 * Standard salary table for 1号イ and 1号ロ. Points depend on both the salary
 * band and the applicant's age band. Bands are upper-inclusive in 万円; the
 * table's dashes (no points) are represented by omitting the age band.
 */
export const SALARY_POINTS_STANDARD: {
  minManYen: number;
  pointsByAge: { maxAge: number; points: number }[];
}[] = [
  {
    minManYen: 1000,
    pointsByAge: [
      { maxAge: 29, points: 40 },
      { maxAge: 34, points: 40 },
      { maxAge: 39, points: 40 },
      { maxAge: Infinity, points: 40 },
    ],
  },
  {
    minManYen: 900,
    pointsByAge: [
      { maxAge: 29, points: 35 },
      { maxAge: 34, points: 35 },
      { maxAge: 39, points: 35 },
      { maxAge: Infinity, points: 35 },
    ],
  },
  {
    minManYen: 800,
    pointsByAge: [
      { maxAge: 29, points: 30 },
      { maxAge: 34, points: 30 },
      { maxAge: 39, points: 30 },
      { maxAge: Infinity, points: 30 },
    ],
  },
  {
    minManYen: 700,
    pointsByAge: [
      { maxAge: 29, points: 25 },
      { maxAge: 34, points: 25 },
      { maxAge: 39, points: 25 },
    ],
  },
  {
    minManYen: 600,
    pointsByAge: [
      { maxAge: 29, points: 20 },
      { maxAge: 34, points: 20 },
      { maxAge: 39, points: 20 },
    ],
  },
  {
    minManYen: 500,
    pointsByAge: [
      { maxAge: 29, points: 15 },
      { maxAge: 34, points: 15 },
    ],
  },
  {
    minManYen: 400,
    pointsByAge: [{ maxAge: 29, points: 10 }],
  },
];

export const SALARY_POINTS_MANAGEMENT = [
  { minManYen: 3000, points: 50 },
  { minManYen: 2500, points: 40 },
  { minManYen: 2000, points: 30 },
  { minManYen: 1500, points: 20 },
  { minManYen: 1000, points: 10 },
] as const;

export const RESEARCH_POINTS = {
  academic: {
    one: 20,
    twoOrMore: 25,
  },
  specialized: {
    one: 15,
    twoOrMore: 15,
  },
  management: null,
} as const;

export const QUALIFICATION_POINTS = {
  specialized: {
    one: 5,
    multiple: 10,
  },
} as const;

export const POSITION_POINTS = {
  representative: 10,
  director: 5,
  none: 0,
} as const;

export const LANGUAGE_POINTS = {
  n1: 15,
  n2: 10,
  none: 0,
} as const;

export const BONUS_POINTS = {
  innovationSupport: 10,
  smeInnovation: 10,
  localGovernmentSupport: 10,
  smeRnd: 5,
  growthField: 10,
  jicaTraining: 5,
  investment100m: 5,
  investmentManagement: 10,
  designatedUniversity: 10,
  japaneseInstitution: 10,
  foreignQualification: 5,
} as const;

export const POLICY_SOURCES: PolicySource[] = [
  {
    id: "moj-evaluate",
    title: {
      en: "Immigration Services Agency — How points are evaluated",
      ja: "出入国在留管理庁「ポイント評価の仕組みは？」",
      zhHant: "出入國在留管理廳「如何評估點數」",
    },
    url: "https://www.moj.go.jp/isa/applications/resources/newimmiact_3_evaluate_index.html",
    asOf: "2026-10-24",
    note: {
      en: "Entry point for the current point table, special bonus notice, university list, and related lists.",
      ja: "最新のポイント計算表・特別加算告示・加点大学一覧などの公式入口。",
      zhHant: "最新點數計算表、特別加計告示、加計大學一覽等官方資料之入口。",
    },
  },
  {
    id: "point-table-ja",
    title: {
      en: "Points calculation table (Japanese, effective 2023-04-01)",
      ja: "ポイント計算表（令和5年4月1日以降）",
      zhHant: "點數計算表（2023年4月1日起適用）",
    },
    url: "https://www.moj.go.jp/isa/content/930001657.pdf",
    asOf: "2023-04-01",
  },
  {
    id: "point-table-en",
    title: {
      en: "Points calculation table (English)",
      ja: "ポイント計算表（英語）",
      zhHant: "點數計算表（英文版）",
    },
    url: "https://www.moj.go.jp/isa/content/001398882.pdf",
    asOf: "2023-04-01",
  },
  {
    id: "special-bonus-notice",
    title: {
      en: "Special bonus public notice (final amendment 2026-03-31)",
      ja: "特別加算告示（最終改正 令和8年3月31日）",
      zhHant: "特別加計告示（2026年3月31日最終修正）",
    },
    url: "https://www.moj.go.jp/isa/content/930001665.pdf",
    asOf: "2026-03-31",
    note: {
      en: "Defines the innovation-support measures, designated universities, JICA training, and investment-management work.",
      ja: "イノベーション促進支援措置、加点大学、JICA研修、投資運用業等に係る業務を定める告示。",
      zhHant: "規定創新促進支援措施、加計大學、JICA研修及投資運用業相關業務之告示。",
    },
  },
  {
    id: "university-list-2026",
    title: {
      en: "Designated universities for the +10 bonus (as of January 2026)",
      ja: "加点対象となる大学一覧（令和8年1月時点）",
      zhHant: "可加計10點之大學一覽（2026年1月時點）",
    },
    url: "https://www.moj.go.jp/isa/content/001335478.pdf",
    asOf: "2026-01",
    note: {
      en: "World-ranking list. Foreign universities must appear in at least two of QS/THE/ARWU top 300; Japanese universities need one.",
      ja: "世界大学ランキングに基づく一覧。外国の大学はQS/THE/ARWUのうち2以上で300位以内、本邦の大学はいずれかで掲載されていれば対象。",
      zhHant: "依世界大學排名之列表。外國大學須於QS／THE／ARWU其中兩項排名前300名內，日本大學則任一榜單有刊登即符合。",
    },
  },
  {
    id: "sgu",
    title: {
      en: "MEXT Super Global University project (Top / Globalization Leader types)",
      ja: "文部科学省 スーパーグローバル大学創成支援事業（トップ型・グローバル化牽引型）",
      zhHant: "文部科学省 頂尖全球大學育成計畫（頂尖型・全球化引領型）",
    },
    url: "https://www.mext.go.jp/a_menu/koutou/kaikaku/sekaitenkai/1360288.htm",
    asOf: "2026-10-24",
  },
  {
    id: "innovative-asia",
    title: {
      en: "MOFA Innovative Asia partner universities",
      ja: "外務省 イノベーティブ・アジア事業 パートナー校",
      zhHant: "外務省 創新亞洲計畫 合作院校",
    },
    url: "https://www.moj.go.jp/isa/content/930001659.pdf",
    asOf: "2026-10-24",
  },
  {
    id: "foreign-qualifications",
    title: {
      en: "Foreign qualifications and awards eligible for +5",
      ja: "加点対象となる外国の資格、表彰等一覧（令和5年12月改訂）",
      zhHant: "可加計5點之外國資格・獎項一覽（2023年12月修訂）",
    },
    url: "https://www.moj.go.jp/isa/content/930001661.pdf",
    asOf: "2023-12",
  },
  {
    id: "japanese-language",
    title: {
      en: "Japanese-language ability eligible for bonus points",
      ja: "加点対象となる日本語能力一覧",
      zhHant: "可加計點數之日語能力一覽",
    },
    url: "https://www.moj.go.jp/isa/content/930001656.pdf",
    asOf: "2026-10-24",
  },
  {
    id: "growth-fields",
    title: {
      en: "Growth-field advanced projects (as of March 2026)",
      ja: "将来において成長発展が期待される分野の先端的な事業一覧（令和8年3月時点）",
      zhHant: "未來可望成長領域之先端事業一覽（2026年3月時點）",
    },
    url: "https://www.moj.go.jp/isa/content/001458720.pdf",
    asOf: "2026-03",
  },
  {
    id: "mext-universities",
    title: {
      en: "MEXT national university directory (2026)",
      ja: "文部科学省 令和7年度全国大学一覧",
      zhHant: "文部科学省 2026年度全國大學一覽",
    },
    url: "https://www.mext.go.jp/a_menu/koutou/ichiran/mext_00050.html",
    asOf: "2026-06",
    note: {
      en: "Used to identify Japanese universities and institution type for the +10 Japan-degree bonus.",
      ja: "日本の大学卒業加点の判定に用いる日本の大学・設置区分の一覧。",
      zhHant: "用於判定日本大學及設置區分，以適用日本大學畢業加計10點。",
    },
  },
  {
    id: "sme-law",
    title: {
      en: "Small and Medium Enterprise Basic Act (definition of SME)",
      ja: "中小企業基本法（中小企業者の定義）",
      zhHant: "中小企業基本法（中小企業之定義）",
    },
    url: "https://elaws.e-gov.go.jp/document?lawid=338AC0000000181",
    asOf: "2026-10-24",
  },
  {
    id: "pr-guideline",
    title: {
      en: "Guidelines for permission for permanent residence",
      ja: "永住許可に関するガイドライン",
      zhHant: "永居許可相關準則",
    },
    url: "https://www.moj.go.jp/isa/10_00279.html",
    asOf: "2026-10-01",
  },
  {
    id: "hsp-status",
    title: {
      en: "Status of residence “Highly Skilled Professional”",
      ja: "在留資格「高度専門職」（高度人材ポイント制）",
      zhHant: "在留資格「高度專門職」（高度人才積分制）",
    },
    url: "https://www.moj.go.jp/isa/applications/status/designatedactivities02_00004.html",
    asOf: "2026-10-24",
  },
  {
    id: "hsp2-criteria",
    title: {
      en: "Criteria for changing to Highly Skilled Professional (2)",
      ja: "「高度専門職2号」への変更基準",
      zhHant: "變更為「高度專門職2號」之基準",
    },
    url: "https://www.moj.go.jp/isa/content/930001650.pdf",
    asOf: "2026-10-24",
  },
];
