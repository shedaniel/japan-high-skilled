import type { UniversityRecord, UniversitySource } from "@/domain/types";
import generated from "./generated.json";

export interface UniversitySourceMeta {
  url: string;
  title_en: string;
  title_ja: string;
  as_of: string;
}

export interface UniversityMeta {
  generatedAt: string;
  sources: Record<string, UniversitySourceMeta>;
  counts: { total: number; japan: number; designated: number };
}

const UNIVERSITY_SOURCES: readonly UniversitySource[] = [
  "ranking",
  "sgu",
  "innovative-asia",
  "japanese-mext",
];

const INSTITUTION_TYPES = ["national", "public", "private"] as const;

type InstitutionType = (typeof INSTITUTION_TYPES)[number];

interface RawUniversity {
  id?: unknown;
  nameEn?: unknown;
  nameJa?: unknown;
  countryEn?: unknown;
  countryJa?: unknown;
  isJapan?: unknown;
  sources?: unknown;
  institutionType?: unknown;
}

interface RawSourceMeta {
  url?: unknown;
  title_en?: unknown;
  title_ja?: unknown;
  as_of?: unknown;
}

interface RawMeta {
  generatedAt?: unknown;
  sources?: unknown;
  counts?: unknown;
}

function requireString(value: unknown, field: string, index: number): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(
      `generated.json: universities[${index}].${field} must be a non-empty string`,
    );
  }
  return value;
}

function isUniversitySource(value: unknown): value is UniversitySource {
  return (
    typeof value === "string" &&
    (UNIVERSITY_SOURCES as readonly string[]).includes(value)
  );
}

function isInstitutionType(value: unknown): value is InstitutionType {
  return (
    typeof value === "string" &&
    (INSTITUTION_TYPES as readonly string[]).includes(value)
  );
}

function validateUniversity(value: unknown, index: number): UniversityRecord {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(
      `generated.json: universities[${index}] is not an object`,
    );
  }
  const record = value as RawUniversity;

  const sources = record.sources;
  if (
    !Array.isArray(sources) ||
    sources.length === 0 ||
    !sources.every(isUniversitySource)
  ) {
    throw new Error(
      `generated.json: universities[${index}].sources must be a non-empty array of known sources`,
    );
  }

  if (typeof record.isJapan !== "boolean") {
    throw new Error(
      `generated.json: universities[${index}].isJapan must be a boolean`,
    );
  }

  const institutionType = record.institutionType;
  if (institutionType !== undefined && !isInstitutionType(institutionType)) {
    throw new Error(
      `generated.json: universities[${index}].institutionType is invalid`,
    );
  }

  return {
    id: requireString(record.id, "id", index),
    nameEn: requireString(record.nameEn, "nameEn", index),
    nameJa: requireString(record.nameJa, "nameJa", index),
    countryEn: requireString(record.countryEn, "countryEn", index),
    countryJa: requireString(record.countryJa, "countryJa", index),
    isJapan: record.isJapan,
    sources: [...sources],
    ...(institutionType === undefined ? {} : { institutionType }),
  };
}

function validateSourceMeta(
  value: unknown,
  key: string,
): UniversitySourceMeta {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error(
      `generated.json: meta.sources.${key} must be an object`,
    );
  }
  const record = value as RawSourceMeta;
  if (
    typeof record.url !== "string" ||
    typeof record.title_en !== "string" ||
    typeof record.title_ja !== "string" ||
    typeof record.as_of !== "string"
  ) {
    throw new Error(
      `generated.json: meta.sources.${key} must contain url, title_en, title_ja and as_of strings`,
    );
  }
  return {
    url: record.url,
    title_en: record.title_en,
    title_ja: record.title_ja,
    as_of: record.as_of,
  };
}

function validateMeta(value: unknown): UniversityMeta {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    throw new Error("generated.json: meta is not an object");
  }
  const record = value as RawMeta;

  if (typeof record.generatedAt !== "string") {
    throw new Error("generated.json: meta.generatedAt must be a string");
  }

  if (
    typeof record.sources !== "object" ||
    record.sources === null ||
    Array.isArray(record.sources)
  ) {
    throw new Error("generated.json: meta.sources must be an object");
  }
  const sources: Record<string, UniversitySourceMeta> = {};
  for (const [key, source] of Object.entries(record.sources)) {
    sources[key] = validateSourceMeta(source, key);
  }

  if (
    typeof record.counts !== "object" ||
    record.counts === null ||
    Array.isArray(record.counts)
  ) {
    throw new Error("generated.json: meta.counts must be an object");
  }
  const counts = record.counts as {
    total?: unknown;
    japan?: unknown;
    designated?: unknown;
  };
  if (
    typeof counts.total !== "number" ||
    typeof counts.japan !== "number" ||
    typeof counts.designated !== "number"
  ) {
    throw new Error(
      "generated.json: meta.counts must contain numeric total, japan and designated",
    );
  }

  return {
    generatedAt: record.generatedAt,
    sources,
    counts: {
      total: counts.total,
      japan: counts.japan,
      designated: counts.designated,
    },
  };
}

const rawUniversities: unknown = generated.universities;

if (!Array.isArray(rawUniversities)) {
  throw new Error("generated.json: universities must be an array");
}

export const UNIVERSITIES: UniversityRecord[] = rawUniversities.map(
  validateUniversity,
);

export const UNIVERSITY_BY_ID = new Map<string, UniversityRecord>();
for (const university of UNIVERSITIES) {
  if (UNIVERSITY_BY_ID.has(university.id)) {
    throw new Error(
      `generated.json: duplicate university id "${university.id}"`,
    );
  }
  UNIVERSITY_BY_ID.set(university.id, university);
}

export const UNIVERSITY_META: UniversityMeta = validateMeta(generated.meta);

const rankingSource = UNIVERSITY_META.sources.ranking;
if (!rankingSource) {
  throw new Error("generated.json: meta.sources.ranking is required");
}

export const OFFICIAL_UNIVERSITY_LIST_URL: string = rankingSource.url;
