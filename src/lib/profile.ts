import type { Profile } from "@/domain/types";

export function createDefaultProfile(): Profile {
  return {
    version: 1,
    activity: "specialized",
    age: null,
    annualSalaryManYen: null,
    careerYears: null,
    education: {
      highest: "none",
      mbaMot: false,
      multipleDegrees: false,
      universityId: null,
      universityNameEn: "",
      universityNameJa: "",
      universityCountryEn: "",
      universityCountryJa: "",
      universitySources: [],
      designatedUniversity: false,
      japaneseInstitution: false,
    },
    research: {
      patent: false,
      grant: false,
      papers: false,
      other: false,
    },
    position: "none",
    japanQualifications: [],
    foreignQualifications: [],
    customQualifications: [],
    language: {
      jlpt: "none",
      bjtScore: null,
      japaneseMajor: false,
    },
    bonuses: {
      innovationSupport: false,
      smeInnovation: false,
      localGovernmentSupport: false,
      smeRnd: false,
      growthField: false,
      jicaTraining: false,
      investment100m: false,
      investmentManagement: false,
    },
  };
}

export function normalizeProfile(value: unknown): Profile {
  const base = createDefaultProfile();
  if (!value || typeof value !== "object") return base;

  const input = value as Partial<Profile>;
  const education = (input.education ?? {}) as Partial<Profile["education"]>;
  const research = (input.research ?? {}) as Partial<Profile["research"]>;
  const language = (input.language ?? {}) as Partial<Profile["language"]>;
  const bonuses = (input.bonuses ?? {}) as Partial<Profile["bonuses"]>;

  return {
    ...base,
    ...input,
    version: 1,
    education: { ...base.education, ...education },
    research: { ...base.research, ...research },
    language: { ...base.language, ...language },
    bonuses: { ...base.bonuses, ...bonuses },
    customQualifications: Array.isArray(input.customQualifications)
      ? input.customQualifications.filter(
          (item): item is Profile["customQualifications"][number] =>
            Boolean(item) &&
            typeof item === "object" &&
            typeof (item as { id?: unknown }).id === "string" &&
            typeof (item as { nameJa?: unknown }).nameJa === "string" &&
            typeof (item as { nameEn?: unknown }).nameEn === "string",
        )
      : [],
    japanQualifications: Array.isArray(input.japanQualifications)
      ? input.japanQualifications.filter(
          (id): id is string => typeof id === "string",
        )
      : [],
    foreignQualifications: Array.isArray(input.foreignQualifications)
      ? input.foreignQualifications.filter(
          (id): id is string => typeof id === "string",
        )
      : [],
  };
}
