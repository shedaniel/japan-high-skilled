import { InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldItem, FieldLabel } from "@/components/ui/field";
import { SectionCard } from "@/components/calculator/ui";
import { activateRow } from "@/components/calculator/row-click";
import { sectionById, type CalculatorSectionProps } from "@/components/calculator/types";
import type { ResearchState } from "@/domain/types";
import { useI18n } from "@/i18n";
import type { MessageKey } from "@/i18n/messages";

const RESEARCH_ITEMS: { id: keyof ResearchState; labelKey: MessageKey }[] = [
  { id: "patent", labelKey: "field.patent" },
  { id: "grant", labelKey: "field.grant" },
  { id: "papers", labelKey: "field.papers" },
  { id: "other", labelKey: "field.otherResearch" },
];

export function ResearchSection({
  profile,
  update,
  score,
}: CalculatorSectionProps) {
  const { t } = useI18n();
  const researchSection = sectionById(score, "research");
  const count = RESEARCH_ITEMS.filter(
    (item) => profile.research[item.id],
  ).length;
  const isAcademic = profile.activity === "academic";

  return (
    <SectionCard
      description={t("section.research.description")}
      id="research"
      max={researchSection.max}
      points={researchSection.points}
      title={t("section.research")}
    >
      <div className="flex flex-col gap-4">
        <Alert variant="info">
          <InfoIcon aria-hidden="true" />
          <AlertDescription>
            <p>
              {isAcademic
                ? t("research.academicRule")
                : t("research.specializedRule")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              <Badge size="sm" variant="info">
                {t("research.count", { count })}
              </Badge>
              <Badge size="sm" variant="outline">
                {t("research.maxLabel", { points: researchSection.max })}
              </Badge>
            </div>
          </AlertDescription>
        </Alert>

        <div className="grid items-stretch gap-2">
          {RESEARCH_ITEMS.map((item) => (
            <Field className="w-full min-w-0" key={item.id}>
              <FieldItem
                className="flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-lg border p-3"
                onClick={(event) =>
                  activateRow(event, () =>
                    update((current) => ({
                      ...current,
                      research: {
                        ...current.research,
                        [item.id]: !current.research[item.id],
                      },
                    })),
                  )
                }
              >
                <Checkbox
                  aria-label={t(item.labelKey)}
                  checked={profile.research[item.id]}
                  onCheckedChange={(checked) =>
                    update((current) => ({
                      ...current,
                      research: {
                        ...current.research,
                        [item.id]: checked,
                      },
                    }))
                  }
                />
                <FieldLabel>{t(item.labelKey)}</FieldLabel>
              </FieldItem>
            </Field>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
