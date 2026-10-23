import { ChevronDownIcon, ExternalLinkIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { POLICY_SOURCES } from "@/domain/policy";
import { useI18n } from "@/i18n";
import { cn } from "@/lib/utils";

const SOURCE_BY_ID = new Map(
  POLICY_SOURCES.map((source) => [source.id, source]),
);

export interface SectionCardProps {
  id: string;
  title: string;
  description?: string;
  points?: number;
  max?: number;
  children: ReactNode;
}

export function SectionCard({
  id,
  title,
  description,
  points,
  max,
  children,
}: SectionCardProps) {
  const { t } = useI18n();

  return (
    <Card className="scroll-mt-24" id={id}>
      <CardHeader>
        <CardTitle render={<h2 />}>{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
        {points !== undefined && max !== undefined ? (
          <CardAction>
            <Badge
              className="tabular-nums"
              size="sm"
              variant={points > 0 ? "success" : "outline"}
            >
              {t("section.pointsSummary", { max, points })}
            </Badge>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardPanel>{children}</CardPanel>
    </Card>
  );
}

export function PointsBadge({
  points,
  className,
}: {
  points: number;
  className?: string;
}) {
  const { t } = useI18n();

  return (
    <Badge
      className={cn("tabular-nums", className)}
      size="sm"
      variant={points > 0 ? "success" : "outline"}
    >
      {t("common.pointsValuePlus", { points })}
    </Badge>
  );
}

export function SourceLink({ sourceId }: { sourceId: string }) {
  const { pick, t } = useI18n();
  const source = SOURCE_BY_ID.get(sourceId);
  if (!source) return null;
  const title = pick(source.title);

  return (
    <a
      className="inline-flex items-start gap-1.5 text-muted-foreground text-xs underline-offset-4 transition-colors hover:text-foreground hover:underline"
      href={source.url}
      rel="noreferrer"
      target="_blank"
    >
      <ExternalLinkIcon aria-hidden="true" className="mt-0.5 size-3.5 shrink-0" />
      <span>{t("bonus.sourceLabel", { title })}</span>
    </a>
  );
}

export function SourceNote({ sourceId }: { sourceId: string }) {
  const { pick, t } = useI18n();
  const source = SOURCE_BY_ID.get(sourceId);
  if (!source?.note) return null;

  return (
    <Collapsible>
      <CollapsibleTrigger className="group inline-flex items-center gap-1 text-muted-foreground text-xs underline-offset-4 hover:text-foreground hover:underline">
        <ChevronDownIcon
          aria-hidden="true"
          className="size-3.5 transition-transform group-data-[panel-open]:rotate-180"
        />
        {t("common.learnMore")}
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <p className="pt-2 text-muted-foreground text-xs leading-relaxed">
          {pick(source.note)}
        </p>
      </CollapsiblePanel>
    </Collapsible>
  );
}
