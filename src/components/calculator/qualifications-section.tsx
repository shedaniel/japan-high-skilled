import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { QualificationPicker } from "@/components/qualification-picker";
import { SectionCard } from "@/components/calculator/ui";
import {
  bonusLinePoints,
  sectionById,
  type CalculatorSectionProps,
} from "@/components/calculator/types";
import { useI18n } from "@/i18n";

export function QualificationsSection({
  profile,
  update,
  score,
}: CalculatorSectionProps) {
  const { t } = useI18n();
  const isSpecialized = profile.activity === "specialized";
  const qualificationSection = sectionById(score, "qualifications");
  const foreignPoints = bonusLinePoints(score, "foreignQualification");

  function handleAddCustom(entry: { nameJa: string; nameEn: string }) {
    const id = `custom-${crypto.randomUUID()}`;
    update((current) => ({
      ...current,
      customQualifications: [...current.customQualifications, { id, ...entry }],
      japanQualifications: [...current.japanQualifications, id],
    }));
  }

  function handleRemoveCustom(id: string) {
    update((current) => ({
      ...current,
      customQualifications: current.customQualifications.filter(
        (entry) => entry.id !== id,
      ),
      japanQualifications: current.japanQualifications.filter(
        (qualificationId) => qualificationId !== id,
      ),
    }));
  }

  return (
    <SectionCard
      description={t("section.qualifications.description")}
      id="qualifications"
      max={isSpecialized ? qualificationSection.max : undefined}
      points={isSpecialized ? qualificationSection.points : undefined}
      title={t("section.qualifications")}
    >
      <div className="flex flex-col gap-5">
        {isSpecialized ? (
          <div className="flex flex-col gap-3 rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium text-sm">
                {t("qualification.japanNational")}
              </h3>
              <div className="flex flex-wrap gap-1.5">
                <Badge
                  size="sm"
                  variant={
                    qualificationSection.points > 0 ? "success" : "outline"
                  }
                >
                  {t("qualification.pointsPreview", {
                    points: qualificationSection.points,
                  })}
                </Badge>
                <Badge size="sm" variant="outline">
                  {t("qualification.maxJapan")}
                </Badge>
              </div>
            </div>
            <p className="text-muted-foreground text-xs">
              {t("qualification.rule.japan")}
            </p>
            <QualificationPicker
              customQualifications={profile.customQualifications}
              kind="japan"
              onAddCustom={handleAddCustom}
              onChange={(ids) =>
                update((current) => ({
                  ...current,
                  japanQualifications: ids,
                }))
              }
              onRemoveCustom={handleRemoveCustom}
              selectedIds={profile.japanQualifications}
            />
          </div>
        ) : (
          <Alert variant="info">
            <InfoIcon aria-hidden="true" />
            <AlertDescription>
              {t("qualification.japanOnlySpecialized")}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col gap-3 rounded-xl border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-medium text-sm">
              {t("qualification.foreign")}
            </h3>
            <div className="flex flex-wrap gap-1.5">
              <Badge
                size="sm"
                variant={foreignPoints > 0 ? "success" : "outline"}
              >
                {t("qualification.pointsPreview", {
                  points: foreignPoints,
                })}
              </Badge>
              <Badge size="sm" variant="outline">
                {t("qualification.maxForeign")}
              </Badge>
            </div>
          </div>
          <p className="text-muted-foreground text-xs">
            {t("qualification.rule.foreign")}
          </p>
          <QualificationPicker
            kind="foreign"
            onChange={(ids) =>
              update((current) => ({
                ...current,
                foreignQualifications: ids,
              }))
            }
            selectedIds={profile.foreignQualifications}
          />
          <p className="text-muted-foreground text-xs">
            {t("qualification.foreignForAll")}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
