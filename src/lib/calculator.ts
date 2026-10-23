import {
  AGE_POINTS,
  BONUS_POINTS,
  CAREER_POINTS,
  EDUCATION_POINTS,
  LANGUAGE_POINTS,
  MINIMUM_SALARY_MAN_YEN,
  POSITION_POINTS,
  QUALIFICATION_POINTS,
  RESEARCH_POINTS,
  SALARY_POINTS_MANAGEMENT,
  SALARY_POINTS_STANDARD,
  THRESHOLDS,
} from "@/domain/policy";
import type {
  ActivityType,
  EducationLevel,
  Profile,
  ScoreLine,
  ScoreResult,
  ScoreSection,
  ScoreSectionId,
} from "@/domain/types";

function ageBandPoints(age: number): number {
  return AGE_POINTS.find((band) => age <= band.maxAge)?.points ?? 0;
}

function standardSalaryPoints(salaryManYen: number, age: number): number {
  for (const band of SALARY_POINTS_STANDARD) {
    if (salaryManYen >= band.minManYen) {
      return (
        band.pointsByAge.find((entry) => age <= entry.maxAge)?.points ?? 0
      );
    }
  }
  return 0;
}

function managementSalaryPoints(salaryManYen: number): number {
  return (
    SALARY_POINTS_MANAGEMENT.find((band) => salaryManYen >= band.minManYen)
      ?.points ?? 0
  );
}

export function educationPoints(
  activity: ActivityType,
  highest: EducationLevel,
  mbaMot: boolean,
  multipleDegrees: boolean,
): number {
  const table = EDUCATION_POINTS[activity];
  let points = 0;

  if (activity === "specialized") {
    if (highest === "doctorate") points = table.doctorate;
    else if (mbaMot) points = table.mbaMot;
    else if (highest === "masters") points = table.masters;
    else if (highest === "bachelor") points = table.bachelor;
  } else if (activity === "management") {
    if (mbaMot) points = table.mbaMot;
    else if (highest === "doctorate" || highest === "masters") {
      points = table.masters;
    } else if (highest === "bachelor") points = table.bachelor;
  } else {
    if (highest === "doctorate") points = table.doctorate;
    else if (highest === "masters") points = table.masters;
    else if (highest === "bachelor") points = table.bachelor;
  }

  if (
    multipleDegrees &&
    (highest === "doctorate" || highest === "masters")
  ) {
    points += table.multipleDegrees;
  }

  return points;
}

export function careerPoints(
  activity: ActivityType,
  years: number | null,
): number {
  if (years == null) return 0;
  return (
    CAREER_POINTS[activity].find((band) => years >= band.minYears)?.points ?? 0
  );
}

export function salaryPoints(profile: Profile): number {
  const salary = profile.annualSalaryManYen;
  if (salary == null) return 0;

  if (profile.activity === "management") {
    return managementSalaryPoints(salary);
  }

  if (profile.age == null) return 0;
  return standardSalaryPoints(salary, profile.age);
}

export function researchPoints(profile: Profile): number {
  if (profile.activity === "management") return 0;

  const count = [
    profile.research.patent,
    profile.research.grant,
    profile.research.papers,
    profile.research.other,
  ].filter(Boolean).length;

  if (profile.activity === "academic") {
    if (count >= 2) return RESEARCH_POINTS.academic.twoOrMore;
    if (count === 1) return RESEARCH_POINTS.academic.one;
    return 0;
  }

  return count > 0 ? RESEARCH_POINTS.specialized.one : 0;
}

export function qualificationPoints(profile: Profile): number {
  if (profile.activity !== "specialized") return 0;

  const count = new Set(profile.japanQualifications).size;
  if (count >= 2) return QUALIFICATION_POINTS.specialized.multiple;
  if (count === 1) return QUALIFICATION_POINTS.specialized.one;
  return 0;
}

export function foreignQualificationPoints(profile: Profile): number {
  return new Set(profile.foreignQualifications).size > 0
    ? BONUS_POINTS.foreignQualification
    : 0;
}

export function languagePoints(profile: Profile): number {
  const { jlpt, bjtScore, japaneseMajor } = profile.language;
  const japaneseInstitution = profile.education.japaneseInstitution;

  const hasN1 =
    jlpt === "n1" ||
    (bjtScore != null && bjtScore >= 480) ||
    (japaneseMajor && !japaneseInstitution);

  if (hasN1) return LANGUAGE_POINTS.n1;

  // N2 is excluded when the applicant already has the Japan-degree bonus or N1.
  if (japaneseInstitution) return 0;

  const hasN2 =
    jlpt === "n2" || (bjtScore != null && bjtScore >= 400 && bjtScore < 480);
  return hasN2 ? LANGUAGE_POINTS.n2 : 0;
}

export function positionPoints(profile: Profile): number {
  if (profile.activity !== "management") return 0;
  return POSITION_POINTS[profile.position];
}

function bonusLine(
  id: keyof typeof BONUS_POINTS | "position",
  points: number,
  labelKey: string,
): ScoreLine {
  return {
    id,
    section: "bonuses",
    points,
    labelKey,
    sourceId: "special-bonus-notice",
  };
}

function buildSection(
  id: ScoreSectionId,
  max: number,
  lines: ScoreLine[],
): ScoreSection {
  return {
    id,
    max,
    lines: lines.filter((line) => line.points !== 0 || line.section !== "bonuses"),
    points: lines.reduce((sum, line) => sum + line.points, 0),
  };
}

export function calculateScore(profile: Profile): ScoreResult {
  const activity = profile.activity;
  const edu = profile.education;

  const education = buildSection(
    "education",
    Math.max(EDUCATION_POINTS[activity].doctorate, EDUCATION_POINTS[activity].mbaMot) +
      EDUCATION_POINTS[activity].multipleDegrees,
    [
      {
        id: "education",
        section: "education",
        points: educationPoints(
          activity,
          edu.highest,
          edu.mbaMot,
          edu.multipleDegrees,
        ),
        labelKey: "score.education",
      },
    ],
  );

  const career = buildSection(
    "career",
    CAREER_POINTS[activity][0].points,
    [
      {
        id: "career",
        section: "career",
        points: careerPoints(activity, profile.careerYears),
        labelKey: "score.career",
      },
    ],
  );

  const salary = buildSection(
    "salary",
    activity === "management" ? 50 : 40,
    [
      {
        id: "salary",
        section: "salary",
        points: salaryPoints(profile),
        labelKey: "score.salary",
      },
    ],
  );

  const age = buildSection("age", 15, [
    {
      id: "age",
      section: "age",
      points: profile.age == null ? 0 : ageBandPoints(profile.age),
      labelKey: "score.age",
    },
  ]);

  const research = buildSection(
    "research",
    RESEARCH_POINTS[activity]?.twoOrMore ?? 0,
    [
      {
        id: "research",
        section: "research",
        points: researchPoints(profile),
        labelKey: "score.research",
      },
    ],
  );

  const qualifications = buildSection(
    "qualifications",
    activity === "specialized" ? QUALIFICATION_POINTS.specialized.multiple : 0,
    [
      {
        id: "qualifications",
        section: "qualifications",
        points: qualificationPoints(profile),
        labelKey: "score.qualifications",
      },
    ],
  );

  const position = buildSection("position", activity === "management" ? 10 : 0, [
    {
      id: "position",
      section: "position",
      points: positionPoints(profile),
      labelKey: "score.position",
    },
  ]);

  const language = buildSection("language", 15, [
    {
      id: "language",
      section: "language",
      points: languagePoints(profile),
      labelKey: "score.language",
    },
  ]);

  const bonusLines: ScoreLine[] = [
    bonusLine(
      "innovationSupport",
      profile.bonuses.innovationSupport ? BONUS_POINTS.innovationSupport : 0,
      "score.bonus.innovationSupport",
    ),
    bonusLine(
      "smeInnovation",
      profile.bonuses.innovationSupport && profile.bonuses.smeInnovation
        ? BONUS_POINTS.smeInnovation
        : 0,
      "score.bonus.smeInnovation",
    ),
    bonusLine(
      "localGovernmentSupport",
      profile.bonuses.localGovernmentSupport
        ? BONUS_POINTS.localGovernmentSupport
        : 0,
      "score.bonus.localGovernmentSupport",
    ),
    bonusLine(
      "smeRnd",
      profile.bonuses.smeRnd ? BONUS_POINTS.smeRnd : 0,
      "score.bonus.smeRnd",
    ),
    bonusLine(
      "growthField",
      profile.bonuses.growthField ? BONUS_POINTS.growthField : 0,
      "score.bonus.growthField",
    ),
    bonusLine(
      "jicaTraining",
      profile.bonuses.jicaTraining ? BONUS_POINTS.jicaTraining : 0,
      "score.bonus.jicaTraining",
    ),
    bonusLine(
      "investment100m",
      activity === "management" && profile.bonuses.investment100m
        ? BONUS_POINTS.investment100m
        : 0,
      "score.bonus.investment100m",
    ),
    bonusLine(
      "investmentManagement",
      (activity === "specialized" || activity === "management") &&
        profile.bonuses.investmentManagement
        ? BONUS_POINTS.investmentManagement
        : 0,
      "score.bonus.investmentManagement",
    ),
    bonusLine(
      "designatedUniversity",
      profile.education.designatedUniversity
        ? BONUS_POINTS.designatedUniversity
        : 0,
      "score.bonus.designatedUniversity",
    ),
    bonusLine(
      "japaneseInstitution",
      profile.education.japaneseInstitution
        ? BONUS_POINTS.japaneseInstitution
        : 0,
      "score.bonus.japaneseInstitution",
    ),
    bonusLine(
      "foreignQualification",
      foreignQualificationPoints(profile),
      "score.bonus.foreignQualification",
    ),
  ];

  const bonusMax =
    10 +
    10 +
    10 +
    5 +
    10 +
    5 +
    10 +
    10 +
    5 +
    (activity === "management" ? 5 : 0) +
    (activity === "specialized" || activity === "management" ? 10 : 0);

  const bonuses = buildSection("bonuses", bonusMax, bonusLines);

  const sections = [
    education,
    career,
    salary,
    age,
    research,
    qualifications,
    position,
    language,
    bonuses,
  ];

  const total = sections.reduce((sum, section) => sum + section.points, 0);
  const minimumSalary = MINIMUM_SALARY_MAN_YEN[activity];
  const salaryBelowMinimum =
    minimumSalary != null &&
    profile.annualSalaryManYen != null &&
    profile.annualSalaryManYen < minimumSalary;

  const incomplete: string[] = [];
  if (profile.age == null) incomplete.push("incomplete.age");
  if (profile.annualSalaryManYen == null) incomplete.push("incomplete.salary");
  if (profile.careerYears == null) incomplete.push("incomplete.career");

  const blockingReasons: string[] = [];
  if (salaryBelowMinimum) blockingReasons.push("status.salaryBelowMinimum");

  const salaryRequirementMet =
    minimumSalary == null ||
    (profile.annualSalaryManYen != null &&
      profile.annualSalaryManYen >= minimumSalary);

  return {
    total,
    sections,
    meets70: total >= THRESHOLDS.hsp1,
    meets80: total >= THRESHOLDS.prFastTrack,
    salaryMeetsMinimum: salaryRequirementMet,
    salaryBelowMinimum,
    eligible:
      total >= THRESHOLDS.hsp1 &&
      salaryRequirementMet &&
      blockingReasons.length === 0,
    incomplete,
    blockingReasons,
  };
}
