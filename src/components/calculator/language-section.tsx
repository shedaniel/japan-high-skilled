import { useEffect } from "react";
import { CircleAlertIcon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import { BandSelect } from "@/components/calculator/band-select";
import { activateRow } from "@/components/calculator/row-click";
import { PointsBadge, SectionCard } from "@/components/calculator/ui";
import {
  sectionById,
  type CalculatorSectionProps,
} from "@/components/calculator/types";
import { LANGUAGE_POINTS } from "@/domain/policy";
import type { LanguageState } from "@/domain/types";
import { useI18n } from "@/i18n";
import type { MessageKey } from "@/i18n/messages";
import { cn } from "@/lib/utils";

const JLPT_OPTIONS: {
  value: LanguageState["jlpt"];
  labelKey: MessageKey;
  descriptionKey?: MessageKey;
  points: number;
}[] = [
  {
    value: "n1",
    labelKey: "option.n1",
    descriptionKey: "language.n1Hint",
    points: LANGUAGE_POINTS.n1,
  },
  {
    value: "n2",
    labelKey: "option.n2",
    descriptionKey: "language.n2Hint",
    points: LANGUAGE_POINTS.n2,
  },
  {
    value: "none",
    labelKey: "option.jlptNone",
    points: LANGUAGE_POINTS.none,
  },
];

const BJT_BANDS: { value: string; labelKey: MessageKey }[] = [
  { value: "none", labelKey: "option.bjt.none" },
  { value: "400", labelKey: "option.bjt.400" },
  { value: "480", labelKey: "option.bjt.480" },
];

function isJlpt(value: string): value is LanguageState["jlpt"] {
  return value === "n1" || value === "n2" || value === "none";
}

function bjtBandValue(score: number | null): string {
  if (score == null || score < 400) return "none";
  if (score < 480) return "400";
  return "480";
}

export function LanguageSection({
  profile,
  update,
  score,
}: CalculatorSectionProps) {
  const { t } = useI18n();
  const languageSection = sectionById(score, "language");
  const { language } = profile;
  const bjtScore = language.bjtScore;
  const n1ByBjt = bjtScore != null && bjtScore >= 480;
  const n2ByBjt = bjtScore != null && bjtScore >= 400 && bjtScore < 480;
  const n1ByMajor =
    language.japaneseMajor && !profile.education.japaneseInstitution;
  const n1Equivalent = language.jlpt === "n1" || n1ByBjt || n1ByMajor;
  const n2Excluded =
    profile.education.japaneseInstitution ||
    language.jlpt === "n1" ||
    n1ByBjt ||
    n1ByMajor;
  const bjtPoints =
    language.jlpt === "n1"
      ? 0
      : n1ByBjt
        ? LANGUAGE_POINTS.n1
        : n2ByBjt && !n2Excluded
          ? LANGUAGE_POINTS.n2
          : 0;
  const bjtOptions = BJT_BANDS.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));

  useEffect(() => {
    if (language.jlpt !== "n2" || !n2Excluded) return;
    update((current) =>
      current.language.jlpt === "n2"
        ? {
            ...current,
            language: { ...current.language, jlpt: "none" },
          }
        : current,
    );
  }, [language.jlpt, n2Excluded, update]);

  return (
    <SectionCard
      description={t("section.language.description")}
      id="language"
      max={languageSection.max}
      points={languageSection.points}
      title={t("section.language")}
    >
      <div className="flex flex-col gap-5">
        <Fieldset className="flex flex-col gap-3">
          <FieldsetLegend>{t("field.jlpt")}</FieldsetLegend>
          <RadioGroup
            aria-label={t("field.jlpt")}
            className="grid items-stretch gap-2"
            onValueChange={(value) => {
              if (!isJlpt(value)) return;
              if (value === "n2" && n2Excluded) return;
              update((current) => ({
                ...current,
                language: { ...current.language, jlpt: value },
              }));
            }}
            value={language.jlpt}
          >
            {JLPT_OPTIONS.map((option) => {
              const disabled = option.value === "n2" && n2Excluded;
              return (
                <Field className="w-full min-w-0" disabled={disabled} key={option.value}>
                  <FieldItem
                    className={cn(
                      "flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-lg border p-3",
                      disabled && "cursor-not-allowed opacity-64",
                    )}
                    onClick={(event) =>
                      activateRow(event, () => {
                        if (disabled) return;
                        update((current) => ({
                          ...current,
                          language: { ...current.language, jlpt: option.value },
                        }));
                      }, disabled)
                    }
                  >
                    <Radio aria-label={t(option.labelKey)} disabled={disabled} value={option.value} />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <FieldLabel>{t(option.labelKey)}</FieldLabel>
                        {option.points > 0 ? (
                          <Badge
                            className="tabular-nums"
                            size="sm"
                            variant="success"
                          >
                            {t("common.pointsValuePlus", {
                              points: option.points,
                            })}
                          </Badge>
                        ) : null}
                      </div>
                      {option.descriptionKey ? (
                        <FieldDescription>
                          {t(option.descriptionKey)}
                        </FieldDescription>
                      ) : null}
                      {disabled ? (
                        <FieldDescription className="font-medium">
                          {t("language.n2Disabled")}
                        </FieldDescription>
                      ) : null}
                    </div>
                  </FieldItem>
                </Field>
              );
            })}
          </RadioGroup>
        </Fieldset>

        <Field className="w-full min-w-0">
          <div className="flex min-h-5 w-full flex-wrap items-center justify-between gap-2">
            <FieldLabel htmlFor="language-bjt">{t("field.bjt")}</FieldLabel>
            {bjtPoints > 0 ? <PointsBadge points={bjtPoints} /> : null}
          </div>
          <BandSelect
            ariaLabel={t("field.bjt")}
            id="language-bjt"
            onValueChange={(next) => {
              const nextScore = next === "none" ? null : Number(next);
              update((current) => ({
                ...current,
                language: {
                  ...current.language,
                  bjtScore: nextScore,
                },
              }));
            }}
            options={bjtOptions}
            value={bjtBandValue(bjtScore)}
          />
          <FieldDescription>{t("language.bjtHint")}</FieldDescription>
        </Field>

        <Field className="w-full min-w-0">
          <FieldItem
            className="flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-lg border p-3"
            onClick={(event) =>
              activateRow(event, () =>
                update((current) => ({
                  ...current,
                  language: {
                    ...current.language,
                    japaneseMajor: !current.language.japaneseMajor,
                  },
                })),
              )
            }
          >
            <Checkbox
              aria-label={t("field.japaneseMajor")}
              checked={language.japaneseMajor}
              onCheckedChange={(checked) =>
                update((current) => ({
                  ...current,
                  language: {
                    ...current.language,
                    japaneseMajor: checked,
                  },
                }))
              }
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <FieldLabel>{t("field.japaneseMajor")}</FieldLabel>
              <FieldDescription>{t("language.n1Hint")}</FieldDescription>
            </div>
          </FieldItem>
        </Field>

        {profile.education.japaneseInstitution && !n1Equivalent ? (
          <Alert variant="warning">
            <CircleAlertIcon aria-hidden="true" />
            <AlertDescription>
              {t("language.japanDegreeExclusion")}
            </AlertDescription>
          </Alert>
        ) : null}

        {!profile.education.japaneseInstitution &&
        (n1ByBjt || n1ByMajor) &&
        language.jlpt !== "n1" ? (
          <Alert variant="info">
            <InfoIcon aria-hidden="true" />
            <AlertDescription>
              {t("language.n1EquivalenceExclusion")}
            </AlertDescription>
          </Alert>
        ) : null}
      </div>
    </SectionCard>
  );
}
