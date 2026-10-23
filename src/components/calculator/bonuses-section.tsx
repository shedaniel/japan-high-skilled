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
import { activateRow } from "@/components/calculator/row-click";
import { SectionCard, SourceLink } from "@/components/calculator/ui";
import {
  bonusLinePoints,
  sectionById,
  type CalculatorSectionProps,
} from "@/components/calculator/types";
import { BONUS_POINTS, POSITION_POINTS } from "@/domain/policy";
import type { ActivityType, BonusState, Position } from "@/domain/types";
import { useI18n } from "@/i18n";
import type { MessageKey } from "@/i18n/messages";
import { cn } from "@/lib/utils";

interface BonusDefinition {
  id: keyof BonusState;
  titleKey: MessageKey;
  descriptionKey: MessageKey;
  sourceId: string;
  activities?: ActivityType[];
  requires?: keyof BonusState;
}

const BONUS_DEFINITIONS: BonusDefinition[] = [
  {
    id: "innovationSupport",
    titleKey: "bonus.innovationSupport.title",
    descriptionKey: "bonus.innovationSupport.description",
    sourceId: "special-bonus-notice",
  },
  {
    id: "smeInnovation",
    titleKey: "bonus.smeInnovation.title",
    descriptionKey: "bonus.smeInnovation.description",
    sourceId: "sme-law",
    requires: "innovationSupport",
  },
  {
    id: "localGovernmentSupport",
    titleKey: "bonus.localGovernmentSupport.title",
    descriptionKey: "bonus.localGovernmentSupport.description",
    sourceId: "special-bonus-notice",
  },
  {
    id: "smeRnd",
    titleKey: "bonus.smeRnd.title",
    descriptionKey: "bonus.smeRnd.description",
    sourceId: "special-bonus-notice",
  },
  {
    id: "growthField",
    titleKey: "bonus.growthField.title",
    descriptionKey: "bonus.growthField.description",
    sourceId: "growth-fields",
  },
  {
    id: "jicaTraining",
    titleKey: "bonus.jicaTraining.title",
    descriptionKey: "bonus.jicaTraining.description",
    sourceId: "special-bonus-notice",
  },
  {
    id: "investment100m",
    titleKey: "bonus.investment100m.title",
    descriptionKey: "bonus.investment100m.description",
    sourceId: "special-bonus-notice",
    activities: ["management"],
  },
  {
    id: "investmentManagement",
    titleKey: "bonus.investmentManagement.title",
    descriptionKey: "bonus.investmentManagement.description",
    sourceId: "special-bonus-notice",
    activities: ["specialized", "management"],
  },
];

const POSITION_OPTIONS: {
  value: Position;
  labelKey: MessageKey;
  points: number;
}[] = [
  {
    value: "representative",
    labelKey: "option.representative",
    points: POSITION_POINTS.representative,
  },
  {
    value: "director",
    labelKey: "option.director",
    points: POSITION_POINTS.director,
  },
  {
    value: "none",
    labelKey: "option.none",
    points: POSITION_POINTS.none,
  },
];

function isPosition(value: string): value is Position {
  return (
    value === "representative" || value === "director" || value === "none"
  );
}

function BonusItem({
  definition,
  profile,
  update,
  score,
}: CalculatorSectionProps & { definition: BonusDefinition }) {
  const { t } = useI18n();
  const disabled = definition.requires
    ? !profile.bonuses[definition.requires]
    : false;
  const earned = bonusLinePoints(score, definition.id);

  function handleCheckedChange(checked: boolean) {
    update((current) => ({
      ...current,
      bonuses: {
        ...current.bonuses,
        [definition.id]: checked,
        ...(definition.id === "innovationSupport" && !checked
          ? { smeInnovation: false }
          : {}),
      },
    }));
  }

  return (
    <Field className="w-full min-w-0" disabled={disabled}>
      <FieldItem
        className={cn(
          "flex w-full min-w-0 items-start gap-3 rounded-xl border p-4",
          disabled ? "cursor-not-allowed opacity-64" : "cursor-pointer",
        )}
        onClick={(event) =>
          activateRow(
            event,
            () => handleCheckedChange(!profile.bonuses[definition.id]),
            disabled,
          )
        }
      >
        <Checkbox
          aria-label={t(definition.titleKey)}
          checked={profile.bonuses[definition.id]}
          disabled={disabled}
          onCheckedChange={handleCheckedChange}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <FieldLabel>{t(definition.titleKey)}</FieldLabel>
            <div className="flex flex-wrap gap-1.5">
              <Badge
                className="tabular-nums"
                size="sm"
                variant={earned > 0 ? "success" : "outline"}
              >
                {t("bonus.pointsAvailable", {
                  points: BONUS_POINTS[definition.id],
                })}
              </Badge>
              {earned > 0 ? (
                <Badge className="tabular-nums" size="sm" variant="success">
                  {t("bonus.earned", { points: earned })}
                </Badge>
              ) : null}
              {disabled ? (
                <Badge size="sm" variant="warning">
                  {t("bonus.requiresInnovation")}
                </Badge>
              ) : null}
            </div>
          </div>
          <FieldDescription>
            {t(definition.descriptionKey)}
          </FieldDescription>
          <SourceLink sourceId={definition.sourceId} />
        </div>
      </FieldItem>
    </Field>
  );
}

export function BonusesSection({
  profile,
  update,
  score,
}: CalculatorSectionProps) {
  const { t } = useI18n();
  const bonusSection = sectionById(score, "bonuses");
  const positionSection = sectionById(score, "position");
  const isManagement = profile.activity === "management";
  const visibleDefinitions = BONUS_DEFINITIONS.filter(
    (definition) =>
      !definition.activities ||
      definition.activities.includes(profile.activity),
  );

  return (
    <SectionCard
      description={t("section.bonuses.description")}
      id="bonuses"
      max={bonusSection.max}
      points={bonusSection.points}
      title={t("section.bonuses")}
    >
      <div className="flex flex-col gap-5">
        <p className="text-muted-foreground text-xs">
          {t("bonus.sectionIncludesExtras")}
        </p>

        {isManagement ? (
          <div className="flex flex-col gap-3 rounded-xl border p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-medium text-sm">{t("score.position")}</h3>
              <Badge
                className="tabular-nums"
                size="sm"
                variant={positionSection.points > 0 ? "success" : "outline"}
              >
                {t("section.pointsSummary", {
                  max: positionSection.max,
                  points: positionSection.points,
                })}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              {t("bonus.positionHint")}
            </p>
            <Fieldset className="flex flex-col gap-3">
              <FieldsetLegend className="sr-only">
                {t("field.position")}
              </FieldsetLegend>
              <RadioGroup
                aria-label={t("field.position")}
                className="grid items-stretch gap-2 sm:grid-cols-3"
                onValueChange={(value) => {
                  if (!isPosition(value)) return;
                  update((current) => ({ ...current, position: value }));
                }}
                value={profile.position}
              >
                {POSITION_OPTIONS.map((option) => (
                  <Field className="w-full min-w-0" key={option.value}>
                    <FieldItem
                      className="flex w-full min-w-0 cursor-pointer items-start gap-3 rounded-lg border p-3"
                      onClick={(event) =>
                        activateRow(event, () =>
                          update((current) => ({
                            ...current,
                            position: option.value,
                          })),
                        )
                      }
                    >
                      <Radio aria-label={t(option.labelKey)} value={option.value} />
                      <div className="flex min-w-0 flex-1 flex-wrap items-center justify-between gap-2">
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
                    </FieldItem>
                  </Field>
                ))}
              </RadioGroup>
            </Fieldset>
            <SourceLink sourceId="point-table-ja" />
          </div>
        ) : (
          <p className="text-muted-foreground text-xs">
            {t("bonus.positionOnly")}
          </p>
        )}

        <div className="grid items-stretch gap-3">
          {visibleDefinitions.map((definition) => (
            <BonusItem
              definition={definition}
              key={definition.id}
              profile={profile}
              score={score}
              update={update}
            />
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
