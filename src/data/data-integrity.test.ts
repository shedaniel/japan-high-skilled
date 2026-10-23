import { describe, expect, it } from "vitest";

import {
  ALL_QUALIFICATIONS,
  FOREIGN_QUALIFICATIONS,
  IT_EXAMS,
  JAPAN_NATIONAL_QUALIFICATIONS,
  JAPAN_QUALIFICATIONS,
  QUALIFICATIONS_BY_ID,
} from "@/data/qualifications";
import {
  UNIVERSITIES,
  UNIVERSITY_BY_ID,
  UNIVERSITY_META,
} from "@/data/universities";
import type { QualificationKind, UniversityRecord, UniversitySource } from "@/domain/types";

const DESIGNATED_SOURCES: UniversitySource[] = [
  "ranking",
  "sgu",
  "innovative-asia",
];

function isDesignated(university: UniversityRecord): boolean {
  return university.sources.some((source) =>
    DESIGNATED_SOURCES.includes(source),
  );
}

function normalizeName(value: string): string {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

describe("university data", () => {
  it("has unique ids and a matching lookup map", () => {
    const ids = UNIVERSITIES.map((university) => university.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(UNIVERSITY_BY_ID.size).toBe(UNIVERSITIES.length);

    for (const university of UNIVERSITIES) {
      expect(UNIVERSITY_BY_ID.get(university.id)).toBe(university);
    }
  });

  it("gives every record a non-empty Japanese name", () => {
    const missing = UNIVERSITIES.filter(
      (university) => university.nameJa.trim().length === 0,
    );
    expect(missing.map((university) => university.id)).toEqual([]);
  });

  it("uses only known source tags", () => {
    const known: UniversitySource[] = [
      ...DESIGNATED_SOURCES,
      "japanese-mext",
    ];
    const invalid = UNIVERSITIES.filter((university) =>
      university.sources.some((source) => !known.includes(source)),
    );
    expect(invalid.map((university) => university.id)).toEqual([]);
  });

  it("marks every designated-university record with a designation source", () => {
    const designated = UNIVERSITIES.filter(isDesignated);
    expect(designated.length).toBeGreaterThan(300);
    const wrong = designated.filter(
      (university) =>
        !university.sources.some((source) =>
          DESIGNATED_SOURCES.includes(source),
        ),
    );
    expect(wrong.map((university) => university.id)).toEqual([]);
  });

  it("only uses japanese-mext for Japanese institutions", () => {
    const foreignMeXt = UNIVERSITIES.filter(
      (university) =>
        university.sources.includes("japanese-mext") && !university.isJapan,
    );
    expect(foreignMeXt.map((university) => university.id)).toEqual([]);
  });

  it("only leaves non-designated records in the MEXT Japan directory", () => {
    for (const university of UNIVERSITIES) {
      if (!isDesignated(university)) {
        expect(university.isJapan).toBe(true);
        expect(university.sources).toContain("japanese-mext");
      }
    }
  });

  it("meets the expected dataset size", () => {
    const japan = UNIVERSITIES.filter((university) => university.isJapan);
    const designated = UNIVERSITIES.filter(isDesignated);

    expect(UNIVERSITIES.length).toBeGreaterThan(1000);
    expect(japan.length).toBeGreaterThan(800);
    expect(designated.length).toBeGreaterThan(300);
  });

  it("keeps meta counts consistent with the records", () => {
    expect(UNIVERSITY_META.counts.total).toBe(UNIVERSITIES.length);
    expect(UNIVERSITY_META.counts.japan).toBe(
      UNIVERSITIES.filter((university) => university.isJapan).length,
    );
    expect(UNIVERSITY_META.counts.designated).toBe(
      UNIVERSITIES.filter(isDesignated).length,
    );
  });

  it("documents every source with an https URL", () => {
    const sources = Object.entries(UNIVERSITY_META.sources);
    expect(sources.length).toBeGreaterThan(0);

    for (const [key, source] of sources) {
      expect(source.url, key).toMatch(/^https:\/\/\S+$/);
      expect(source.title_en.trim().length, key).toBeGreaterThan(0);
      expect(source.title_ja.trim().length, key).toBeGreaterThan(0);
    }
  });
});

describe("qualification data", () => {
  it("has unique ids across every catalog", () => {
    const ids = ALL_QUALIFICATIONS.map((record) => record.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(QUALIFICATIONS_BY_ID.size).toBe(ALL_QUALIFICATIONS.length);
    expect(ALL_QUALIFICATIONS.length).toBe(
      JAPAN_QUALIFICATIONS.length + FOREIGN_QUALIFICATIONS.length,
    );
    expect(JAPAN_QUALIFICATIONS.length).toBe(
      JAPAN_NATIONAL_QUALIFICATIONS.length + IT_EXAMS.length,
    );
  });

  it("gives every record non-empty names", () => {
    const missing = ALL_QUALIFICATIONS.filter(
      (record) =>
        record.nameEn.trim().length === 0 || record.nameJa.trim().length === 0,
    );
    expect(missing.map((record) => record.id)).toEqual([]);
  });

  it("marks every foreign-catalog record as foreign", () => {
    const wrong = FOREIGN_QUALIFICATIONS.filter(
      (record) => record.kind !== "foreign",
    );
    expect(wrong.map((record) => record.id)).toEqual([]);

    const foreignInAll = ALL_QUALIFICATIONS.filter(
      (record) => record.kind === "foreign",
    );
    expect(foreignInAll.length).toBe(FOREIGN_QUALIFICATIONS.length);
  });

  it("uses only the Japanese qualification kinds in the Japan catalog", () => {
    const validKinds: QualificationKind[] = ["japan-national", "it-exam"];
    const wrong = JAPAN_QUALIFICATIONS.filter(
      (record) => !validKinds.includes(record.kind),
    );
    expect(wrong.map((record) => record.id)).toEqual([]);

    expect(
      JAPAN_NATIONAL_QUALIFICATIONS.every(
        (record) => record.kind === "japan-national",
      ),
    ).toBe(true);
    expect(IT_EXAMS.every((record) => record.kind === "it-exam")).toBe(true);
  });

  it("has no duplicate normalized names within a kind", () => {
    for (const kind of ["japan-national", "it-exam", "foreign"] as const) {
      const records = ALL_QUALIFICATIONS.filter(
        (record) => record.kind === kind,
      );
      const byJa = new Map<string, string>();
      const byEn = new Map<string, string>();

      for (const record of records) {
        const nameJa = normalizeName(record.nameJa);
        const nameEn = normalizeName(record.nameEn);
        expect(byJa.get(nameJa), `${kind}: ${record.nameJa}`).toBeUndefined();
        expect(byEn.get(nameEn), `${kind}: ${record.nameEn}`).toBeUndefined();
        byJa.set(nameJa, record.id);
        byEn.set(nameEn, record.id);
      }

      expect(byJa.size).toBe(records.length);
      expect(byEn.size).toBe(records.length);
    }
  });

  it("resolves every record through the id map", () => {
    for (const record of ALL_QUALIFICATIONS) {
      expect(QUALIFICATIONS_BY_ID.get(record.id)).toBe(record);
    }
  });
});
