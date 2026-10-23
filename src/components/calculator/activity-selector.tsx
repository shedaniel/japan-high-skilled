import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SectionCard } from "@/components/calculator/ui";
import type { ActivityType } from "@/domain/types";
import { useI18n } from "@/i18n";
import type { MessageKey } from "@/i18n/messages";

const ACTIVITY_OPTIONS: {
  value: ActivityType;
  labelKey: MessageKey;
  descriptionKey: MessageKey;
}[] = [
  {
    value: "academic",
    labelKey: "activity.academic",
    descriptionKey: "activity.academic.description",
  },
  {
    value: "specialized",
    labelKey: "activity.specialized",
    descriptionKey: "activity.specialized.description",
  },
  {
    value: "management",
    labelKey: "activity.management",
    descriptionKey: "activity.management.description",
  },
];

function isActivityType(value: string): value is ActivityType {
  return (
    value === "academic" || value === "specialized" || value === "management"
  );
}

export function ActivitySelector({
  activity,
  onChange,
}: {
  activity: ActivityType;
  onChange: (activity: ActivityType) => void;
}) {
  const { t } = useI18n();

  return (
    <SectionCard
      description={t("activity.hint")}
      id="activity"
      title={t("activity.label")}
    >
      <ToggleGroup
        aria-label={t("activity.label")}
        className="grid w-full gap-2 sm:grid-cols-3"
        onValueChange={(values) => {
          const next = values.at(-1);
          if (next && isActivityType(next) && next !== activity) onChange(next);
        }}
        value={[activity]}
      >
        {ACTIVITY_OPTIONS.map((option) => (
          <ToggleGroupItem
            className="h-auto min-h-24 w-full flex-col items-start justify-start gap-1.5 whitespace-normal rounded-xl border border-input bg-background p-4 text-left shadow-xs/5 data-pressed:border-primary data-pressed:bg-primary/5"
            key={option.value}
            value={option.value}
          >
            <span className="font-medium text-sm">{t(option.labelKey)}</span>
            <span className="font-normal text-muted-foreground text-xs leading-relaxed">
              {t(option.descriptionKey)}
            </span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </SectionCard>
  );
}
