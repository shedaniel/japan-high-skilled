import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldDescription,
  FieldItem,
  FieldLabel,
} from "@/components/ui/field";
import { Fieldset, FieldsetLegend } from "@/components/ui/fieldset";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { UniversityPicker } from "@/components/university-picker";
import { activateRow } from "@/components/calculator/row-click";
import { PointsBadge, SectionCard, SourceLink, SourceNote } from "@/components/calculator/ui";
import {
  sectionById,
  universityBonusPoints,
  type CalculatorSectionProps,
} from "@/components/calculator/types";
import { EDUCATION_POINTS } from "@/domain/policy";
import type { EducationLevel, UniversityRecord, UniversitySource } from "@/domain/types";
import { useI18n } from "@/i18n";
import type { MessageKey } from "@/i18n/messages";
import { educationPoints } from "@/lib/calculator";
import { cn } from "@/lib/utils";

const DEGREE_OPTIONS: { value: EducationLevel; labelKey: MessageKey }[] = [
  { value: "doctorate", labelKey: "option.doctorate" },
  { value: "masters", labelKey: "option.masters" },
  { value: "bachelor", labelKey: "option.bachelor" },
  { value: "none", labelKey: "option.none" },
];

const SOURCE_KEYS: Record<UniversitySource, MessageKey> = {
  ranking: "university.sources.ranking",
  sgu: "university.sources.sgu",
  "innovative-asia": "university.sources.innovative-asia",
  "japanese-mext": "university.sources.japanese-mext",
};

const DESIGNATED_UNIVERSITY_SOURCES: readonly UniversitySource[] = [
  "ranking",
  "sgu",
  "innovative-asia",
];

function isEducationLevel(value: string): value is EducationLevel {
  return (
    value === "doctorate" ||
    value === "masters" ||
    value === "bachelor" ||
    value === "none"
  );
}

export function EducationSection({
  profile,
  update,
  score,
}: CalculatorSectionProps) {
  const { t } = useI18n();
  const education = profile.education;
  const educationSection = sectionById(score, "education");
  const universityBonus = universityBonusPoints(score);
  const showsMbaMot = profile.activity !== "academic";
  const multipleDegreesEnabled =
    education.highest === "doctorate" || education.highest === "masters";
  const hasUniversitySelection = Boolean(
    education.universityId ||
      education.universityNameEn ||
      education.universityNameJa,
  );
  const selected = hasUniversitySelection
    ? {
        id: education.universityId,
        nameEn: education.universityNameEn,
        nameJa: education.universityNameJa,
        countryEn: education.universityCountryEn,
        countryJa: education.universityCountryJa,
        sources: education.universitySources,
      }
    : null;
  const designatedSources = education.universitySources.filter((source) =>
    DESIGNATED_UNIVERSITY_SOURCES.includes(source),
  );

  function handleUniversitySelect(university: UniversityRecord) {
    update((current) => ({
      ...current,
      education: {
        ...current.education,
        universityId: university.id,
        universityNameEn: university.nameEn,
        universityNameJa: university.nameJa,
        universityCountryEn: university.countryEn,
        universityCountryJa: university.countryJa,
        universitySources: university.sources,
        designatedUniversity: university.sources.some((source) =>
          DESIGNATED_UNIVERSITY_SOURCES.includes(source),
        ),
        japaneseInstitution: university.isJapan,
      },
    }));
  }

  function handleUniversityClear() {
    update((current) => ({
      ...current,
      education: {
        ...current.education,
        universityId: null,
        universityNameEn: "",
        universityNameJa: "",
        universityCountryEn: "",
        universityCountryJa: "",
        universitySources: [],
      },
    }));
  }

  return (
    <SectionCard
      description={t("section.education.description")}
      id="education"
      max={educationSection.max}
      points={educationSection.points}
      title={t("section.education")}
    >
      <div className="flex flex-col gap-6">
        <Fieldset className="flex flex-col gap-3">
          <FieldsetLegend>{t("field.highestDegree")}</FieldsetLegend>
          <RadioGroup
            aria-label={t("field.highestDegree")}
            className="grid items-stretch gap-2 sm:grid-cols-2"
            onValueChange={(value) => {
              if (!isEducationLevel(value)) return;
              update((current) => ({
                ...current,
                education: { ...current.education, highest: value },
              }));
            }}
            value={education.highest}
          >
            {DEGREE_OPTIONS.map((option) => {
              const points =
                option.value === "none"
                  ? 0
                  : educationPoints(
                      profile.activity,
                      option.value,
                      false,
                      false,
                    );
              return (
                <Field className="h-full w-full min-w-0" key={option.value}>
                  <FieldItem
                    className="flex h-full w-full min-w-0 cursor-pointer items-start gap-3 rounded-lg border p-3"
                    onClick={(event) =>
                      activateRow(event, () =>
                        update((current) => ({
                          ...current,
                          education: {
                            ...current.education,
                            highest: option.value,
                          },
                        })),
                      )
                    }
                  >
                    <Radio aria-label={t(option.labelKey)} value={option.value} />
                    <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2">
                      <FieldLabel>{t(option.labelKey)}</FieldLabel>
                      {points > 0 ? (
                        <Badge
                          className="tabular-nums"
                          size="sm"
                          variant="success"
                        >
                          {t("common.pointsValuePlus", { points })}
                        </Badge>
                      ) : null}
                    </div>
                  </FieldItem>
                </Field>
              );
            })}
          </RadioGroup>
        </Fieldset>

        <div className="grid items-stretch gap-3">
          {showsMbaMot ? (
            <Field className="w-full min-w-0">
              <FieldItem
                className="flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-lg border p-3"
                onClick={(event) =>
                  activateRow(event, () =>
                    update((current) => ({
                      ...current,
                      education: {
                        ...current.education,
                        mbaMot: !current.education.mbaMot,
                      },
                    })),
                  )
                }
              >
                <Checkbox
                  aria-label={t("field.mbaMot")}
                  checked={education.mbaMot}
                  onCheckedChange={(checked) =>
                    update((current) => ({
                      ...current,
                      education: {
                        ...current.education,
                        mbaMot: checked,
                      },
                    }))
                  }
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <FieldLabel>{t("field.mbaMot")}</FieldLabel>
                    <PointsBadge
                      points={EDUCATION_POINTS[profile.activity].mbaMot}
                    />
                  </div>
                  <FieldDescription>
                    {t("education.mbaMotHint")}
                  </FieldDescription>
                </div>
              </FieldItem>
            </Field>
          ) : null}

          <Field className="w-full min-w-0" disabled={!multipleDegreesEnabled}>
            <FieldItem
              className={cn(
                "flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-lg border p-3",
                !multipleDegreesEnabled && "cursor-not-allowed opacity-64",
              )}
              onClick={(event) =>
                activateRow(
                  event,
                  () =>
                    update((current) => ({
                      ...current,
                      education: {
                        ...current.education,
                        multipleDegrees: !current.education.multipleDegrees,
                      },
                    })),
                  !multipleDegreesEnabled,
                )
              }
            >
              <Checkbox
                aria-label={t("field.multipleDegrees")}
                checked={education.multipleDegrees}
                disabled={!multipleDegreesEnabled}
                onCheckedChange={(checked) =>
                  update((current) => ({
                    ...current,
                    education: {
                      ...current.education,
                      multipleDegrees: checked,
                    },
                  }))
                }
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <FieldLabel>{t("field.multipleDegrees")}</FieldLabel>
                  <PointsBadge
                    points={EDUCATION_POINTS[profile.activity].multipleDegrees}
                  />
                </div>
                <FieldDescription>
                  {t("education.multipleDegreesHint")}
                </FieldDescription>
              </div>
            </FieldItem>
          </Field>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm">{t("field.university")}</span>
            <p className="text-muted-foreground text-xs">
              {t("field.university.hint")}
            </p>
          </div>
          <UniversityPicker
            onClear={handleUniversityClear}
            onSelect={handleUniversitySelect}
            selected={selected}
          />
          <p className="text-muted-foreground text-xs">
            {t("education.sourceNote")}
          </p>
        </div>

        <div className="grid items-stretch gap-3">
          <Field className="w-full min-w-0">
            <FieldItem
              className="flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-lg border p-3"
              onClick={(event) =>
                activateRow(event, () =>
                  update((current) => ({
                    ...current,
                    education: {
                      ...current.education,
                      designatedUniversity:
                        !current.education.designatedUniversity,
                    },
                  })),
                )
              }
            >
              <Checkbox
                aria-label={t("field.designatedUniversity")}
                checked={education.designatedUniversity}
                onCheckedChange={(checked) =>
                  update((current) => ({
                    ...current,
                    education: {
                      ...current.education,
                      designatedUniversity: checked,
                    },
                  }))
                }
              />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <FieldLabel>{t("field.designatedUniversity")}</FieldLabel>
                <FieldDescription>
                  {t("field.designatedUniversity.hint")}
                </FieldDescription>
                <div className="flex flex-wrap gap-1.5">
                  {designatedSources.length > 0 ? (
                    designatedSources.map((source) => (
                      <Badge key={source} size="sm" variant="info">
                        {t(SOURCE_KEYS[source])}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground text-xs">
                      {t("education.manualSources")}
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <SourceLink sourceId="university-list-2026" />
                  <SourceNote sourceId="university-list-2026" />
                </div>
              </div>
            </FieldItem>
          </Field>

          <Field className="w-full min-w-0">
            <FieldItem
              className="flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-lg border p-3"
              onClick={(event) =>
                activateRow(event, () =>
                  update((current) => ({
                    ...current,
                    education: {
                      ...current.education,
                      japaneseInstitution:
                        !current.education.japaneseInstitution,
                    },
                  })),
                )
              }
            >
              <Checkbox
                aria-label={t("field.japaneseInstitution")}
                checked={education.japaneseInstitution}
                onCheckedChange={(checked) =>
                  update((current) => ({
                    ...current,
                    education: {
                      ...current.education,
                      japaneseInstitution: checked,
                    },
                  }))
                }
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <FieldLabel>{t("field.japaneseInstitution")}</FieldLabel>
                <FieldDescription>
                  {t("field.japaneseInstitution.hint")}
                </FieldDescription>
                <SourceLink sourceId="mext-universities" />
              </div>
            </FieldItem>
          </Field>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-muted/40 p-4">
          <div className="flex flex-col gap-1">
            <span className="font-medium text-sm">
              {t("education.universityBonusTotal")}
            </span>
            <span className="text-muted-foreground text-xs">
              {t("education.universityBonusMax")}
            </span>
          </div>
          <Badge
            className="tabular-nums"
            size="lg"
            variant={universityBonus > 0 ? "success" : "outline"}
          >
            {t("education.universityBonusValue", { points: universityBonus })}
          </Badge>
        </div>
      </div>
    </SectionCard>
  );
}
