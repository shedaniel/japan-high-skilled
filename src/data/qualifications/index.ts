import type { QualificationRecord } from "@/domain/types";
import { FOREIGN_QUALIFICATIONS } from "./foreign";
import { IT_EXAMS } from "./it-exams";
import { JAPAN_NATIONAL_QUALIFICATIONS } from "./japan-national";

export { FOREIGN_QUALIFICATIONS, IT_EXAMS, JAPAN_NATIONAL_QUALIFICATIONS };

/** Qualifications that count toward the 1号ロ 5/10-point qualification bonus. */
export const JAPAN_QUALIFICATIONS: QualificationRecord[] = [
  ...JAPAN_NATIONAL_QUALIFICATIONS,
  ...IT_EXAMS,
];

export const ALL_QUALIFICATIONS: QualificationRecord[] = [
  ...JAPAN_QUALIFICATIONS,
  ...FOREIGN_QUALIFICATIONS,
];

export const QUALIFICATIONS_BY_ID = new Map(
  ALL_QUALIFICATIONS.map((record) => [record.id, record]),
);

export const QUALIFICATION_CATEGORIES = [
  "legal",
  "accounting",
  "real-estate",
  "medical",
  "welfare",
  "education",
  "engineering",
  "construction",
  "it",
  "safety",
  "service",
  "design",
  "fashion",
  "actuarial",
] as const;

export type QualificationCategory = (typeof QUALIFICATION_CATEGORIES)[number];
