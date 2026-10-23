import { describe, expect, it } from "vitest";

import type { ActivityType, Profile, ScoreResult, ScoreSectionId } from "@/domain/types";
import {
  calculateScore,
  careerPoints,
  educationPoints,
  foreignQualificationPoints,
  languagePoints,
  positionPoints,
  qualificationPoints,
  researchPoints,
  salaryPoints,
} from "@/lib/calculator";
import { createDefaultProfile, normalizeProfile } from "@/lib/profile";

type ProfileOverrides = Partial<
  Omit<Profile, "education" | "research" | "language" | "bonuses">
> & {
  education?: Partial<Profile["education"]>;
  research?: Partial<Profile["research"]>;
  language?: Partial<Profile["language"]>;
  bonuses?: Partial<Profile["bonuses"]>;
};

function makeProfile(partial: ProfileOverrides = {}): Profile {
  const base = createDefaultProfile();
  return {
    ...base,
    ...partial,
    education: { ...base.education, ...partial.education },
    research: { ...base.research, ...partial.research },
    language: { ...base.language, ...partial.language },
    bonuses: { ...base.bonuses, ...partial.bonuses },
  };
}

function section(result: ScoreResult, id: ScoreSectionId) {
  const found = result.sections.find((entry) => entry.id === id);
  if (!found) throw new Error(`missing section: ${id}`);
  return found;
}

function researchProfile(count: number, activity: ActivityType): Profile {
  const flags = ["patent", "grant", "papers", "other"] as const;
  const research: Profile["research"] = {
    patent: false,
    grant: false,
    papers: false,
    other: false,
  };
  for (const flag of flags.slice(0, count)) research[flag] = true;
  return makeProfile({ activity, research });
}

/** A complete profile with a fully controlled total, used for eligibility tests. */
function eligibilityProfile(total: 65 | 70 | 75 | 80): Profile {
  const base = {
    activity: "specialized" as const,
    age: 29,
    education: { highest: "bachelor" as const },
  };

  switch (total) {
    case 65:
      return makeProfile({
        ...base,
        annualSalaryManYen: 700,
        careerYears: 5,
        japanQualifications: ["jp-cpa"],
      });
    case 70:
      return makeProfile({
        ...base,
        annualSalaryManYen: 700,
        careerYears: 5,
        language: { jlpt: "n2" },
      });
    case 75:
      return makeProfile({
        ...base,
        annualSalaryManYen: 700,
        careerYears: 10,
        japanQualifications: ["jp-cpa"],
      });
    case 80:
      return makeProfile({
        ...base,
        annualSalaryManYen: 800,
        careerYears: 10,
        japanQualifications: ["jp-cpa"],
      });
  }
}

describe("educationPoints", () => {
  it("scores 1号イ (academic) degrees", () => {
    expect(educationPoints("academic", "doctorate", false, false)).toBe(30);
    expect(educationPoints("academic", "masters", false, false)).toBe(20);
    expect(educationPoints("academic", "bachelor", false, false)).toBe(10);
    expect(educationPoints("academic", "none", false, false)).toBe(0);
  });

  it("ignores MBA/MOT for 1号イ", () => {
    expect(educationPoints("academic", "none", true, false)).toBe(0);
    expect(educationPoints("academic", "masters", true, false)).toBe(20);
  });

  it("scores 1号ロ (specialized) degrees, MBA/MOT before master", () => {
    expect(educationPoints("specialized", "doctorate", false, false)).toBe(30);
    expect(educationPoints("specialized", "masters", false, false)).toBe(20);
    expect(educationPoints("specialized", "masters", true, false)).toBe(25);
    expect(educationPoints("specialized", "bachelor", false, false)).toBe(10);
    expect(educationPoints("specialized", "none", false, false)).toBe(0);
  });

  it("does not add master points on top of MBA/MOT", () => {
    expect(educationPoints("specialized", "masters", true, false)).toBe(25);
    expect(educationPoints("specialized", "doctorate", true, false)).toBe(30);
  });

  it("scores 1号ハ (management) degrees", () => {
    expect(educationPoints("management", "masters", true, false)).toBe(25);
    expect(educationPoints("management", "doctorate", false, false)).toBe(20);
    expect(educationPoints("management", "masters", false, false)).toBe(20);
    expect(educationPoints("management", "bachelor", false, false)).toBe(10);
    expect(educationPoints("management", "none", false, false)).toBe(0);
  });

  it("adds multiple-degree points only for doctorate/master holders", () => {
    expect(educationPoints("academic", "doctorate", false, true)).toBe(35);
    expect(educationPoints("academic", "masters", false, true)).toBe(25);
    expect(educationPoints("academic", "bachelor", false, true)).toBe(10);
    expect(educationPoints("academic", "none", false, true)).toBe(0);

    expect(educationPoints("specialized", "doctorate", false, true)).toBe(35);
    expect(educationPoints("specialized", "masters", false, true)).toBe(25);
    expect(educationPoints("specialized", "masters", true, true)).toBe(30);
    expect(educationPoints("specialized", "bachelor", false, true)).toBe(10);

    expect(educationPoints("management", "doctorate", false, true)).toBe(25);
    expect(educationPoints("management", "masters", false, true)).toBe(25);
    expect(educationPoints("management", "masters", true, true)).toBe(30);
    expect(educationPoints("management", "bachelor", false, true)).toBe(10);
  });

  it("adds the multiple-degree bonus at most once", () => {
    // MBA/MOT 25 + one 5-point multiple-degree bonus, never 20 + 25 + 5.
    expect(educationPoints("specialized", "masters", true, true)).toBe(30);
    expect(educationPoints("management", "masters", true, true)).toBe(30);
  });
});

describe("careerPoints", () => {
  const cases: {
    activity: ActivityType;
    expected: Record<number, number>;
  }[] = [
    {
      activity: "academic",
      expected: { 2: 0, 3: 5, 4: 5, 5: 10, 6: 10, 7: 15, 9: 15, 10: 15 },
    },
    {
      activity: "specialized",
      expected: { 2: 0, 3: 5, 4: 5, 5: 10, 6: 10, 7: 15, 9: 15, 10: 20 },
    },
    {
      activity: "management",
      expected: { 2: 0, 3: 10, 4: 10, 5: 15, 6: 15, 7: 20, 9: 20, 10: 25 },
    },
  ];

  for (const { activity, expected } of cases) {
    it(`applies ${activity} career boundaries`, () => {
      for (const [years, points] of Object.entries(expected)) {
        expect(careerPoints(activity, Number(years))).toBe(points);
      }
    });
  }

  it("returns 0 for null career years in every activity", () => {
    for (const { activity } of cases) {
      expect(careerPoints(activity, null)).toBe(0);
    }
  });
});

describe("age points", () => {
  it.each([
    [29, 15],
    [30, 10],
    [34, 10],
    [35, 5],
    [39, 5],
    [40, 0],
  ])("scores age %i as %i points", (age, points) => {
    const result = calculateScore(makeProfile({ age }));
    expect(section(result, "age").points).toBe(points);
  });

  it("scores a missing age as 0", () => {
    expect(section(calculateScore(makeProfile()), "age").points).toBe(0);
  });
});

describe("salaryPoints", () => {
  // Standard table for 1号イ and 1号ロ: value is 万円, upper-inclusive bands.
  const standardRows: [number, number, number][] = [
    // 399万: below the first point band.
    [399, 29, 0],
    [399, 34, 0],
    [399, 39, 0],
    [399, 40, 0],
    // 400-499万
    [400, 29, 10],
    [400, 34, 0],
    [400, 39, 0],
    [400, 40, 0],
    [499, 29, 10],
    [499, 34, 0],
    [499, 39, 0],
    [499, 40, 0],
    // 500-599万
    [500, 29, 15],
    [500, 34, 15],
    [500, 39, 0],
    [500, 40, 0],
    [599, 29, 15],
    [599, 34, 15],
    [599, 39, 0],
    [599, 40, 0],
    // 600-699万
    [600, 29, 20],
    [600, 34, 20],
    [600, 39, 20],
    [600, 40, 0],
    [699, 29, 20],
    [699, 34, 20],
    [699, 39, 20],
    [699, 40, 0],
    // 700-799万
    [700, 29, 25],
    [700, 34, 25],
    [700, 39, 25],
    [700, 40, 0],
    [799, 29, 25],
    [799, 34, 25],
    [799, 39, 25],
    [799, 40, 0],
    // 800-899万
    [800, 29, 30],
    [800, 34, 30],
    [800, 39, 30],
    [800, 40, 30],
    [899, 29, 30],
    [899, 34, 30],
    [899, 39, 30],
    [899, 40, 30],
    // 900-999万
    [900, 29, 35],
    [900, 34, 35],
    [900, 39, 35],
    [900, 40, 35],
    [999, 29, 35],
    [999, 34, 35],
    [999, 39, 35],
    [999, 40, 35],
    // 1000万 and above
    [1000, 29, 40],
    [1000, 34, 40],
    [1000, 39, 40],
    [1000, 40, 40],
  ];

  it.each(standardRows)(
    "1号ロ salary %i万円 at age %i gives %i points",
    (salary, age, points) => {
      const profile = makeProfile({
        activity: "specialized",
        age,
        annualSalaryManYen: salary,
      });
      expect(salaryPoints(profile)).toBe(points);
    },
  );

  it("uses the same standard table for 1号イ", () => {
    expect(
      salaryPoints(
        makeProfile({ activity: "academic", age: 40, annualSalaryManYen: 1000 }),
      ),
    ).toBe(40);
    expect(
      salaryPoints(
        makeProfile({ activity: "academic", age: 40, annualSalaryManYen: 999 }),
      ),
    ).toBe(35);
  });

  it("requires an age for the standard table", () => {
    expect(
      salaryPoints(makeProfile({ activity: "specialized", annualSalaryManYen: 1000 })),
    ).toBe(0);
  });

  it("returns 0 when the salary is missing", () => {
    expect(salaryPoints(makeProfile({ activity: "specialized", age: 29 }))).toBe(0);
  });

  it.each([
    [999, 0],
    [1000, 10],
    [1499, 10],
    [1500, 20],
    [1999, 20],
    [2000, 30],
    [2499, 30],
    [2500, 40],
    [2999, 40],
    [3000, 50],
    [5000, 50],
  ])(
    "1号ハ management salary %i万円 gives %i points",
    (salary, points) => {
      expect(
        salaryPoints(
          makeProfile({
            activity: "management",
            annualSalaryManYen: salary,
          }),
        ),
      ).toBe(points);
    },
  );

  it("ignores age for the management salary table", () => {
    expect(
      salaryPoints(
        makeProfile({
          activity: "management",
          age: null,
          annualSalaryManYen: 3000,
        }),
      ),
    ).toBe(50);
  });
});

describe("researchPoints", () => {
  it("scores 1号イ 0/1/2+ categories as 0/20/25", () => {
    expect(researchPoints(researchProfile(0, "academic"))).toBe(0);
    expect(researchPoints(researchProfile(1, "academic"))).toBe(20);
    expect(researchPoints(researchProfile(2, "academic"))).toBe(25);
    expect(researchPoints(researchProfile(3, "academic"))).toBe(25);
    expect(researchPoints(researchProfile(4, "academic"))).toBe(25);
  });

  it("caps 1号ロ at 15 points for any research category", () => {
    expect(researchPoints(researchProfile(0, "specialized"))).toBe(0);
    expect(researchPoints(researchProfile(1, "specialized"))).toBe(15);
    expect(researchPoints(researchProfile(2, "specialized"))).toBe(15);
    expect(researchPoints(researchProfile(4, "specialized"))).toBe(15);
  });

  it("gives 1号ハ no research points", () => {
    expect(researchPoints(researchProfile(0, "management"))).toBe(0);
    expect(researchPoints(researchProfile(4, "management"))).toBe(0);
  });
});

describe("qualificationPoints", () => {
  it("scores 1号ロ 1/2/3 qualifications as 5/10/10", () => {
    expect(
      qualificationPoints(makeProfile({ activity: "specialized" })),
    ).toBe(0);
    expect(
      qualificationPoints(
        makeProfile({ activity: "specialized", japanQualifications: ["jp-cpa"] }),
      ),
    ).toBe(5);
    expect(
      qualificationPoints(
        makeProfile({
          activity: "specialized",
          japanQualifications: ["jp-cpa", "jp-lawyer"],
        }),
      ),
    ).toBe(10);
    expect(
      qualificationPoints(
        makeProfile({
          activity: "specialized",
          japanQualifications: ["jp-cpa", "jp-lawyer", "jp-tax-accountant"],
        }),
      ),
    ).toBe(10);
  });

  it("does not double count the same qualification id", () => {
    expect(
      qualificationPoints(
        makeProfile({
          activity: "specialized",
          japanQualifications: ["jp-cpa", "jp-cpa"],
        }),
      ),
    ).toBe(5);
  });

  it("gives 1号イ and 1号ハ no qualification points", () => {
    for (const activity of ["academic", "management"] as const) {
      expect(
        qualificationPoints(
          makeProfile({
            activity,
            japanQualifications: ["jp-cpa", "jp-lawyer"],
          }),
        ),
      ).toBe(0);
    }
  });
});

describe("languagePoints", () => {
  it("scores JLPT levels", () => {
    expect(languagePoints(makeProfile({ language: { jlpt: "n1" } }))).toBe(15);
    expect(languagePoints(makeProfile({ language: { jlpt: "n2" } }))).toBe(10);
    expect(languagePoints(makeProfile({ language: { jlpt: "none" } }))).toBe(0);
  });

  it("scores BJT 480 or above as N1 and 400-479 as N2", () => {
    expect(languagePoints(makeProfile({ language: { bjtScore: 480 } }))).toBe(15);
    expect(languagePoints(makeProfile({ language: { bjtScore: 600 } }))).toBe(15);
    expect(languagePoints(makeProfile({ language: { bjtScore: 479 } }))).toBe(10);
    expect(languagePoints(makeProfile({ language: { bjtScore: 400 } }))).toBe(10);
    expect(languagePoints(makeProfile({ language: { bjtScore: 399 } }))).toBe(0);
  });

  it("scores a Japanese-language major at a foreign university as N1", () => {
    expect(
      languagePoints(makeProfile({ language: { japaneseMajor: true } })),
    ).toBe(15);
  });

  it("drops N2 for Japan-degree holders, but keeps N1", () => {
    const japanDegree = { education: { japaneseInstitution: true } };

    expect(
      languagePoints(
        makeProfile({ ...japanDegree, language: { jlpt: "n2" } }),
      ),
    ).toBe(0);
    expect(
      languagePoints(
        makeProfile({ ...japanDegree, language: { jlpt: "n1" } }),
      ),
    ).toBe(15);
    expect(
      languagePoints(
        makeProfile({ ...japanDegree, language: { bjtScore: 480 } }),
      ),
    ).toBe(15);
    expect(
      languagePoints(
        makeProfile({ ...japanDegree, language: { japaneseMajor: true } }),
      ),
    ).toBe(0);
  });
});

describe("foreignQualificationPoints", () => {
  it("gives 5 points once regardless of the number of foreign qualifications", () => {
    expect(foreignQualificationPoints(makeProfile())).toBe(0);
    expect(
      foreignQualificationPoints(
        makeProfile({ foreignQualifications: ["f-us-cpa"] }),
      ),
    ).toBe(5);
    expect(
      foreignQualificationPoints(
        makeProfile({
          foreignQualifications: ["f-us-cpa", "f-lawyer-china"],
        }),
      ),
    ).toBe(5);
    expect(
      foreignQualificationPoints(
        makeProfile({
          foreignQualifications: [
            "f-us-cpa",
            "f-us-cpa",
            "f-lawyer-china",
            "f-lawyer-china",
          ],
        }),
      ),
    ).toBe(5);
  });
});

describe("bonus points", () => {
  function bonusPoints(profile: Profile): number {
    return section(calculateScore(profile), "bonuses").points;
  }

  it("only gives SME innovation support when innovation support is also set", () => {
    expect(bonusPoints(makeProfile({ bonuses: { smeInnovation: true } }))).toBe(0);
    expect(
      bonusPoints(makeProfile({ bonuses: { innovationSupport: true } })),
    ).toBe(10);
    expect(
      bonusPoints(
        makeProfile({ bonuses: { innovationSupport: true, smeInnovation: true } }),
      ),
    ).toBe(20);
  });

  it("gives the 5-point investment bonus only to 1号ハ", () => {
    expect(
      bonusPoints(
        makeProfile({
          activity: "management",
          bonuses: { investment100m: true },
        }),
      ),
    ).toBe(5);
    expect(
      bonusPoints(
        makeProfile({
          activity: "specialized",
          bonuses: { investment100m: true },
        }),
      ),
    ).toBe(0);
    expect(
      bonusPoints(
        makeProfile({
          activity: "academic",
          bonuses: { investment100m: true },
        }),
      ),
    ).toBe(0);
  });

  it("gives the 10-point investment-management bonus only to 1号ロ and 1号ハ", () => {
    expect(
      bonusPoints(
        makeProfile({
          activity: "specialized",
          bonuses: { investmentManagement: true },
        }),
      ),
    ).toBe(10);
    expect(
      bonusPoints(
        makeProfile({
          activity: "management",
          bonuses: { investmentManagement: true },
        }),
      ),
    ).toBe(10);
    expect(
      bonusPoints(
        makeProfile({
          activity: "academic",
          bonuses: { investmentManagement: true },
        }),
      ),
    ).toBe(0);
  });

  it("gives position points only to 1号ハ", () => {
    expect(
      positionPoints(
        makeProfile({ activity: "management", position: "representative" }),
      ),
    ).toBe(10);
    expect(
      positionPoints(makeProfile({ activity: "management", position: "director" })),
    ).toBe(5);
    expect(
      positionPoints(makeProfile({ activity: "management", position: "none" })),
    ).toBe(0);
    expect(
      positionPoints(
        makeProfile({ activity: "specialized", position: "representative" }),
      ),
    ).toBe(0);
    expect(
      positionPoints(makeProfile({ activity: "academic", position: "director" })),
    ).toBe(0);
  });

  it("includes position in the management score section only", () => {
    const management = calculateScore(
      makeProfile({ activity: "management", position: "representative" }),
    );
    expect(section(management, "position").points).toBe(10);

    const specialized = calculateScore(
      makeProfile({ activity: "specialized", position: "representative" }),
    );
    expect(section(specialized, "position").points).toBe(0);
  });

  it("gives the designated-university bonus to every activity", () => {
    for (const activity of ["academic", "specialized", "management"] as const) {
      expect(
        bonusPoints(
          makeProfile({
            activity,
            education: { designatedUniversity: true },
          }),
        ),
      ).toBe(10);
    }
  });

  it("gives the Japan-degree bonus to every activity", () => {
    for (const activity of ["academic", "specialized", "management"] as const) {
      expect(
        bonusPoints(
          makeProfile({
            activity,
            education: { japaneseInstitution: true },
          }),
        ),
      ).toBe(10);
    }
  });

  it("stacks the designated-university and Japan-degree bonuses", () => {
    expect(
      bonusPoints(
        makeProfile({
          education: { designatedUniversity: true, japaneseInstitution: true },
        }),
      ),
    ).toBe(20);
  });
});

describe("calculateScore eligibility", () => {
  it("crosses the 70-point threshold at exactly 70", () => {
    const below = calculateScore(eligibilityProfile(65));
    const at = calculateScore(eligibilityProfile(70));

    expect(below.total).toBe(65);
    expect(below.meets70).toBe(false);
    expect(below.meets80).toBe(false);
    expect(below.eligible).toBe(false);

    expect(at.total).toBe(70);
    expect(at.meets70).toBe(true);
    expect(at.meets80).toBe(false);
    expect(at.eligible).toBe(true);
  });

  it("crosses the 80-point threshold at exactly 80", () => {
    const below = calculateScore(eligibilityProfile(75));
    const at = calculateScore(eligibilityProfile(80));

    expect(below.total).toBe(75);
    expect(below.meets70).toBe(true);
    expect(below.meets80).toBe(false);
    expect(below.eligible).toBe(true);

    expect(at.total).toBe(80);
    expect(at.meets70).toBe(true);
    expect(at.meets80).toBe(true);
    expect(at.eligible).toBe(true);
  });

  it("only produces totals in 5-point steps, so 69 and 79 are unreachable", () => {
    for (const total of [65, 70, 75, 80] as const) {
      expect(calculateScore(eligibilityProfile(total)).total % 5).toBe(0);
    }
    expect(calculateScore(eligibilityProfile(65)).meets70).toBe(false);
    expect(calculateScore(eligibilityProfile(80)).meets80).toBe(true);
  });

  it("blocks 1号ロ below the 300万円 salary minimum even at 70+ points", () => {
    const result = calculateScore(
      makeProfile({
        activity: "specialized",
        age: 29,
        annualSalaryManYen: 299,
        careerYears: 10,
        education: { highest: "doctorate", multipleDegrees: true },
        language: { jlpt: "n1" },
      }),
    );

    expect(result.total).toBeGreaterThanOrEqual(70);
    expect(result.salaryBelowMinimum).toBe(true);
    expect(result.salaryMeetsMinimum).toBe(false);
    expect(result.blockingReasons).toContain("status.salaryBelowMinimum");
    expect(result.eligible).toBe(false);
  });

  it("blocks 1号ハ below the 300万円 salary minimum even at 70+ points", () => {
    const result = calculateScore(
      makeProfile({
        activity: "management",
        age: 29,
        annualSalaryManYen: 299,
        careerYears: 10,
        education: { highest: "masters", mbaMot: true },
        position: "representative",
        language: { jlpt: "n1" },
      }),
    );

    expect(result.total).toBeGreaterThanOrEqual(70);
    expect(result.salaryBelowMinimum).toBe(true);
    expect(result.salaryMeetsMinimum).toBe(false);
    expect(result.eligible).toBe(false);
  });

  it("accepts a salary of exactly 300万円", () => {
    const result = calculateScore(
      makeProfile({
        activity: "specialized",
        annualSalaryManYen: 300,
        careerYears: 10,
        education: { highest: "doctorate" },
        language: { jlpt: "n1" },
      }),
    );

    expect(result.salaryBelowMinimum).toBe(false);
    expect(result.salaryMeetsMinimum).toBe(true);
  });

  it("applies no salary minimum to 1号イ", () => {
    const result = calculateScore(
      makeProfile({
        activity: "academic",
        age: 29,
        annualSalaryManYen: 299,
        careerYears: 7,
        education: { highest: "doctorate" },
        research: { patent: true },
        language: { jlpt: "n1" },
      }),
    );

    expect(result.total).toBeGreaterThanOrEqual(70);
    expect(result.salaryBelowMinimum).toBe(false);
    expect(result.salaryMeetsMinimum).toBe(true);
    expect(result.eligible).toBe(true);
  });

  it("lists missing age, salary and career fields", () => {
    const result = calculateScore(makeProfile());

    expect(result.incomplete).toEqual([
      "incomplete.age",
      "incomplete.salary",
      "incomplete.career",
    ]);
    expect(result.eligible).toBe(false);
  });

  it("lists only the fields that are still missing", () => {
    const result = calculateScore(makeProfile({ age: 30 }));

    expect(result.incomplete).toEqual([
      "incomplete.salary",
      "incomplete.career",
    ]);
  });
});

describe("normalizeProfile", () => {
  it("preserves valid data and returns version 1", () => {
    const valid = makeProfile({
      activity: "management",
      age: 35,
      annualSalaryManYen: 800,
      careerYears: 7,
      position: "director",
      education: {
        highest: "masters",
        mbaMot: true,
        multipleDegrees: true,
        universityId: "u-1",
        universityNameEn: "Example University",
        universityNameJa: "例大学",
        designatedUniversity: true,
        japaneseInstitution: true,
      },
      research: { patent: true, papers: true },
      japanQualifications: ["jp-cpa", "jp-lawyer"],
      foreignQualifications: ["f-us-cpa"],
      customQualifications: [
        { id: "custom-1", nameJa: "独自資格", nameEn: "Custom Qualification" },
      ],
      language: { jlpt: "n1", bjtScore: 500, japaneseMajor: true },
      bonuses: { innovationSupport: true, growthField: true },
    });

    expect(normalizeProfile(valid)).toEqual(valid);
    expect(normalizeProfile(valid).version).toBe(1);
  });

  it("drops invalid qualification array entries", () => {
    const normalized = normalizeProfile({
      ...createDefaultProfile(),
      japanQualifications: ["jp-cpa", 7, null, { id: "jp-lawyer" }, "jp-lawyer"],
      foreignQualifications: [42, "f-us-cpa", undefined, false],
    } as unknown);

    expect(normalized.japanQualifications).toEqual(["jp-cpa", "jp-lawyer"]);
    expect(normalized.foreignQualifications).toEqual(["f-us-cpa"]);
  });

  it("drops invalid custom qualification objects", () => {
    const normalized = normalizeProfile({
      ...createDefaultProfile(),
      customQualifications: [
        { id: "custom-1", nameJa: "有効", nameEn: "Valid" },
        { id: 1, nameJa: "無効", nameEn: "Invalid id" },
        { id: "custom-2", nameJa: 2, nameEn: "Invalid nameJa" },
        { id: "custom-3", nameJa: "無効", nameEn: 3 },
        { id: "custom-4", nameJa: "無効" },
        null,
        "custom-5",
      ],
    } as unknown);

    expect(normalized.customQualifications).toEqual([
      { id: "custom-1", nameJa: "有効", nameEn: "Valid" },
    ]);
  });

  it("replaces non-array qualification fields with empty arrays", () => {
    const normalized = normalizeProfile({
      ...createDefaultProfile(),
      japanQualifications: "jp-cpa",
      foreignQualifications: { id: "f-us-cpa" },
      customQualifications: { id: "custom-1" },
    } as unknown);

    expect(normalized.japanQualifications).toEqual([]);
    expect(normalized.foreignQualifications).toEqual([]);
    expect(normalized.customQualifications).toEqual([]);
  });

  it("resets any stored version to 1", () => {
    const normalized = normalizeProfile({
      ...createDefaultProfile(),
      version: 2,
    } as unknown);

    expect(normalized.version).toBe(1);
  });

  it("falls back to the default profile for non-object input", () => {
    expect(normalizeProfile(null)).toEqual(createDefaultProfile());
    expect(normalizeProfile("profile")).toEqual(createDefaultProfile());
    expect(normalizeProfile(42)).toEqual(createDefaultProfile());
  });

  it("falls back to defaults for null nested objects", () => {
    const normalized = normalizeProfile({
      ...createDefaultProfile(),
      education: null,
      research: null,
      language: null,
      bonuses: null,
    } as unknown);

    expect(normalized).toEqual(createDefaultProfile());
  });
});
