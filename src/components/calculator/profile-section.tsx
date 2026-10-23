import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/components/ui/field";
import { BandSelect } from "@/components/calculator/band-select";
import { PointsBadge, SectionCard } from "@/components/calculator/ui";
import { formatYenFromManYen } from "@/components/calculator/format";
import {
  sectionById,
  type CalculatorSectionProps,
} from "@/components/calculator/types";
import { MINIMUM_SALARY_MAN_YEN } from "@/domain/policy";
import { useI18n } from "@/i18n";
import type { MessageKey } from "@/i18n/messages";

const AGE_BANDS: { value: string; labelKey: MessageKey }[] = [
  { value: "29", labelKey: "option.age.29" },
  { value: "32", labelKey: "option.age.32" },
  { value: "37", labelKey: "option.age.37" },
  { value: "45", labelKey: "option.age.45" },
  { value: "none", labelKey: "option.unspecified" },
];

const CAREER_BANDS: { value: string; labelKey: MessageKey }[] = [
  { value: "0", labelKey: "option.career.0" },
  { value: "3", labelKey: "option.career.3" },
  { value: "5", labelKey: "option.career.5" },
  { value: "7", labelKey: "option.career.7" },
  { value: "10", labelKey: "option.career.10" },
  { value: "none", labelKey: "option.unspecified" },
];

const SALARY_BANDS: { value: string; labelKey: MessageKey }[] = [
  { value: "0", labelKey: "option.salary.0" },
  { value: "300", labelKey: "option.salary.300" },
  { value: "400", labelKey: "option.salary.400" },
  { value: "500", labelKey: "option.salary.500" },
  { value: "600", labelKey: "option.salary.600" },
  { value: "700", labelKey: "option.salary.700" },
  { value: "800", labelKey: "option.salary.800" },
  { value: "900", labelKey: "option.salary.900" },
  { value: "1000", labelKey: "option.salary.1000" },
  { value: "1500", labelKey: "option.salary.1500" },
  { value: "2000", labelKey: "option.salary.2000" },
  { value: "2500", labelKey: "option.salary.2500" },
  { value: "3000", labelKey: "option.salary.3000" },
  { value: "none", labelKey: "option.unspecified" },
];

const SALARY_BAND_VALUES = SALARY_BANDS.filter(
  (band) => band.value !== "none",
)
  .map((band) => Number(band.value))
  .reverse();

function ageBandValue(age: number | null): string {
  if (age == null) return "none";
  if (age <= 29) return "29";
  if (age <= 34) return "32";
  if (age <= 39) return "37";
  return "45";
}

function careerBandValue(years: number | null): string {
  if (years == null) return "none";
  if (years < 3) return "0";
  if (years < 5) return "3";
  if (years < 7) return "5";
  if (years < 9) return "7";
  return "10";
}

function salaryBandValue(salaryManYen: number | null): string {
  if (salaryManYen == null) return "none";
  if (salaryManYen < 300) return "0";
  return String(
    SALARY_BAND_VALUES.find((value) => salaryManYen >= value) ?? 0,
  );
}

export function ProfileSection({
  profile,
  update,
  score,
}: CalculatorSectionProps) {
  const { locale, t } = useI18n();
  const agePoints = sectionById(score, "age").points;
  const salaryPoints = sectionById(score, "salary").points;
  const careerPoints = sectionById(score, "career").points;
  const minimumSalary = MINIMUM_SALARY_MAN_YEN[profile.activity];
  const ageOptions = AGE_BANDS.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));
  const careerOptions = CAREER_BANDS.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));
  const salaryOptions = SALARY_BANDS.map(({ value, labelKey }) => ({
    value,
    label: t(labelKey),
  }));

  return (
    <SectionCard
      description={t("section.profile.description")}
      id="profile"
      title={t("section.profile")}
    >
      <div className="grid gap-5 md:grid-cols-3 md:items-stretch">
        <Field className="w-full min-w-0">
          <div className="flex min-h-5 w-full items-center justify-between gap-2">
            <FieldLabel className="min-w-0 flex-1 truncate" htmlFor="profile-age">{t("field.age")}</FieldLabel>
            <PointsBadge className="shrink-0" points={agePoints} />
          </div>
          <BandSelect
            ariaLabel={t("field.age")}
            id="profile-age"
            onValueChange={(next) => {
              const age = next === "none" ? null : Number(next);
              update((current) => ({ ...current, age }));
            }}
            options={ageOptions}
            value={ageBandValue(profile.age)}
          />
          <FieldDescription>{t("field.age.hint")}</FieldDescription>
        </Field>

        <Field className="w-full min-w-0">
          <div className="flex min-h-5 w-full items-center justify-between gap-2">
            <FieldLabel className="min-w-0 flex-1 truncate" htmlFor="profile-salary">
              {t("field.salary")}
            </FieldLabel>
            <PointsBadge className="shrink-0" points={salaryPoints} />
          </div>
          <BandSelect
            ariaLabel={t("field.salary")}
            id="profile-salary"
            invalid={score.salaryBelowMinimum}
            onValueChange={(next) => {
              const annualSalaryManYen =
                next === "none" ? null : Number(next);
              update((current) => ({ ...current, annualSalaryManYen }));
            }}
            options={salaryOptions}
            value={salaryBandValue(profile.annualSalaryManYen)}
          />
          <FieldDescription>{t("field.salary.hint")}</FieldDescription>
        </Field>

        <Field className="w-full min-w-0">
          <div className="flex min-h-5 w-full items-center justify-between gap-2">
            <FieldLabel className="min-w-0 flex-1 truncate" htmlFor="profile-career">
              {t("field.career")}
            </FieldLabel>
            <PointsBadge className="shrink-0" points={careerPoints} />
          </div>
          <BandSelect
            ariaLabel={t("field.career")}
            id="profile-career"
            onValueChange={(next) => {
              const careerYears = next === "none" ? null : Number(next);
              update((current) => ({ ...current, careerYears }));
            }}
            options={careerOptions}
            value={careerBandValue(profile.careerYears)}
          />
          <FieldDescription>{t("field.career.hint")}</FieldDescription>
        </Field>
      </div>

      {minimumSalary != null ? (
        <Alert
          className="mt-5"
          variant={score.salaryBelowMinimum ? "warning" : "default"}
        >
          <InfoIcon aria-hidden="true" />
          <AlertDescription>
            <p>
              {t("field.salary.minimum", {
                amount: formatYenFromManYen(minimumSalary, locale),
              })}
            </p>
            {score.salaryBelowMinimum ? (
              <p>{t("status.salaryBelowMinimum")}</p>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : null}
    </SectionCard>
  );
}
