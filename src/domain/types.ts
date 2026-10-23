export type Locale = "en" | "ja" | "zh-Hant";

export type LocalizedText = {
  en: string;
  ja: string;
  /** Optional Traditional Chinese text; falls back to English when absent. */
  zhHant?: string;
};

export type ActivityType = "academic" | "specialized" | "management";

export type EducationLevel = "doctorate" | "masters" | "bachelor" | "none";

export type Position = "representative" | "director" | "none";

export type UniversitySource =
  | "ranking"
  | "sgu"
  | "innovative-asia"
  | "japanese-mext";

export interface UniversityRecord {
  id: string;
  nameEn: string;
  nameJa: string;
  countryEn: string;
  countryJa: string;
  isJapan: boolean;
  sources: UniversitySource[];
  /** Set for institutions in the MEXT national/public/private university directory. */
  institutionType?: "national" | "public" | "private";
}

export type QualificationKind = "japan-national" | "it-exam" | "foreign";

export interface QualificationRecord {
  id: string;
  nameEn: string;
  nameJa: string;
  kind: QualificationKind;
  category: string;
  country?: LocalizedText;
  note?: LocalizedText;
}

export interface EducationState {
  highest: EducationLevel;
  /** MBA or MOT professional degree (specialized / management only). */
  mbaMot: boolean;
  /** Two or more doctor/master/professional degrees in different fields. */
  multipleDegrees: boolean;
  universityId: string | null;
  universityNameEn: string;
  universityNameJa: string;
  universityCountryEn: string;
  universityCountryJa: string;
  universitySources: UniversitySource[];
  designatedUniversity: boolean;
  japaneseInstitution: boolean;
}

export interface ResearchState {
  patent: boolean;
  grant: boolean;
  papers: boolean;
  other: boolean;
}

export interface LanguageState {
  jlpt: "n1" | "n2" | "none";
  bjtScore: number | null;
  /** Graduated from a foreign university with a Japanese-language major. */
  japaneseMajor: boolean;
}

export interface BonusState {
  innovationSupport: boolean;
  smeInnovation: boolean;
  localGovernmentSupport: boolean;
  smeRnd: boolean;
  growthField: boolean;
  jicaTraining: boolean;
  investment100m: boolean;
  investmentManagement: boolean;
}

export interface Profile {
  version: 1;
  activity: ActivityType;
  age: number | null;
  annualSalaryManYen: number | null;
  careerYears: number | null;
  education: EducationState;
  research: ResearchState;
  position: Position;
  /** Japanese national qualifications and IT告示 exams, by qualification id. */
  japanQualifications: string[];
  foreignQualifications: string[];
  /** Free-text qualifications added by the user when not in the catalog. */
  customQualifications: {
    id: string;
    nameJa: string;
    nameEn: string;
  }[];
  language: LanguageState;
  bonuses: BonusState;
}

export type ScoreSectionId =
  | "education"
  | "career"
  | "salary"
  | "age"
  | "research"
  | "qualifications"
  | "position"
  | "language"
  | "bonuses";

export interface ScoreLine {
  id: string;
  section: ScoreSectionId;
  points: number;
  labelKey: string;
  sourceId?: string;
}

export interface ScoreSection {
  id: ScoreSectionId;
  points: number;
  max: number;
  lines: ScoreLine[];
}

export interface ScoreResult {
  total: number;
  sections: ScoreSection[];
  meets70: boolean;
  meets80: boolean;
  salaryMeetsMinimum: boolean;
  salaryBelowMinimum: boolean;
  eligible: boolean;
  incomplete: string[];
  blockingReasons: string[];
}
