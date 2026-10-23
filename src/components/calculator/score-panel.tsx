import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
} from "lucide-react";
import { Fragment } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { SourceLink } from "@/components/calculator/ui";
import { formatYenFromManYen } from "@/components/calculator/format";
import { MINIMUM_SALARY_MAN_YEN, THRESHOLDS } from "@/domain/policy";
import type {
  Profile,
  ScoreResult,
  ScoreSectionId,
} from "@/domain/types";
import { useI18n } from "@/i18n";
import type { MessageKey } from "@/i18n/messages";

const SECTION_KEYS: Record<ScoreSectionId, MessageKey> = {
  education: "score.education",
  career: "score.career",
  salary: "score.salary",
  age: "score.age",
  research: "score.research",
  qualifications: "score.qualifications",
  position: "score.position",
  language: "score.language",
  bonuses: "score.bonuses",
};

const THRESHOLD_KEYS: MessageKey[] = [
  "score.threshold70",
  "score.threshold80",
];

export function ScorePanel({
  profile,
  score,
}: {
  profile: Profile;
  score: ScoreResult;
}) {
  const { locale, t } = useI18n();
  const complete = score.incomplete.length === 0;
  const salaryOk = score.salaryMeetsMinimum;
  const minimumSalary = MINIMUM_SALARY_MAN_YEN[profile.activity];
  const gap70 = Math.max(0, THRESHOLDS.hsp1 - score.total);
  const gap80 = Math.max(0, THRESHOLDS.prFastTrack - score.total);
  const statusVariant = score.eligible
    ? "success"
    : score.meets70
      ? "warning"
      : "error";
  const StatusIcon = score.eligible ? CircleCheckIcon : CircleAlertIcon;
  const statusTitle = score.eligible
    ? t("status.eligible")
    : score.meets70
      ? t("status.blockedBySalary")
      : t("status.notEligible");
  const salaryState =
    profile.annualSalaryManYen == null
      ? t("score.salaryRequirementMissing")
      : score.salaryBelowMinimum
        ? t("score.salaryRequirementBelow")
        : t("score.salaryRequirementMet");
  const visibleSections = score.sections.filter(
    (section) => section.max > 0 || section.points > 0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle render={<h2 />}>{t("section.results")}</CardTitle>
        <CardDescription>{t("section.results.description")}</CardDescription>
      </CardHeader>
      <CardPanel className="flex flex-col gap-5">
        <div>
          <p className="text-muted-foreground text-xs uppercase tracking-wide">
            {t("score.total")}
          </p>
          <div className="mt-1 flex items-baseline gap-2">
            <p
              className="font-heading font-semibold text-5xl leading-none tabular-nums"
              data-testid="score-total"
            >
              {score.total}
            </p>
            <p className="text-muted-foreground text-sm">
              {t("score.points")}
            </p>
          </div>
        </div>

        <div className="relative pb-5">
          <Progress
            aria-label={t("score.total")}
            aria-valuetext={`${score.total} ${t("score.points")}`}
            max={100}
            value={Math.min(score.total, 100)}
          >
            <ProgressTrack className="h-2.5">
              <ProgressIndicator
                className={score.meets70 ? "bg-success" : "bg-primary"}
              />
            </ProgressTrack>
          </Progress>
          {[THRESHOLDS.hsp1, THRESHOLDS.prFastTrack].map((threshold) => (
            <span
              aria-hidden="true"
              className={
                score.total >= threshold
                  ? "absolute top-0 h-2.5 w-0.5 -translate-x-1/2 rounded-full bg-success"
                  : "absolute top-0 h-2.5 w-0.5 -translate-x-1/2 rounded-full bg-foreground/50"
              }
              key={threshold}
              style={{ left: `${threshold}%` }}
            />
          ))}
          {[THRESHOLDS.hsp1, THRESHOLDS.prFastTrack].map((threshold) => (
            <span
              aria-hidden="true"
              className="absolute top-3.5 -translate-x-1/2 text-[10px] text-muted-foreground tabular-nums"
              key={threshold}
              style={{ left: `${threshold}%` }}
            >
              {threshold}
            </span>
          ))}
        </div>

        <div
          className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 text-sm"
          data-testid="score-threshold-grid"
        >
          {THRESHOLD_KEYS.map((key, index) => {
            const threshold =
              index === 0 ? THRESHOLDS.hsp1 : THRESHOLDS.prFastTrack;
            const reached = score.total >= threshold;
            return (
              <Fragment key={key}>
                <span>{t(key)}</span>
                <span
                  className={
                    reached
                      ? "text-end font-medium text-success-foreground"
                      : "text-end text-muted-foreground"
                  }
                >
                  {reached
                    ? t("score.thresholdReached")
                    : t("score.thresholdMissing", {
                        points: threshold - score.total,
                      })}
                </span>
              </Fragment>
            );
          })}
          {minimumSalary != null ? (
            <Fragment>
              <span>{t("score.salaryRequirement")}</span>
              <span className="flex flex-col items-end gap-0.5">
                <span className="font-medium tabular-nums">
                  {formatYenFromManYen(minimumSalary, locale)}
                </span>
                <span className="text-muted-foreground text-xs">
                  {salaryState}
                </span>
              </span>
            </Fragment>
          ) : null}
          <p className="col-span-2 text-muted-foreground text-xs">
            {t("status.standardRoute")}
          </p>
        </div>

        <Alert variant={statusVariant}>
          <StatusIcon aria-hidden="true" />
          <AlertTitle>{statusTitle}</AlertTitle>
          <AlertDescription>
            {!score.meets70 ? (
              <p>{t("status.needMore", { points: gap70 })}</p>
            ) : null}
            {score.salaryBelowMinimum ? (
              <p>{t("status.salaryBelowMinimum")}</p>
            ) : null}
            {score.meets70 && !score.meets80 ? (
              <p>{t("score.gapTo80", { points: gap80 })}</p>
            ) : null}
            {score.meets80 && score.salaryMeetsMinimum ? (
              <p>{t("status.fastTrack")}</p>
            ) : null}
          </AlertDescription>
        </Alert>

        {score.incomplete.length > 0 ? (
          <Alert variant="info">
            <InfoIcon aria-hidden="true" />
            <AlertTitle>{t("status.provisional")}</AlertTitle>
            <AlertDescription>
              <ul className="list-disc ps-4">
                {score.incomplete.map((key) => (
                  <li key={key}>{t(key as MessageKey)}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        ) : null}

        <Separator />

        <div className="flex flex-col gap-3">
          <h3 className="font-medium text-sm">{t("score.breakdown")}</h3>
          <ul className="flex flex-col gap-3">
            {visibleSections.map((section) => (
              <li key={section.id}>
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span>{t(SECTION_KEYS[section.id])}</span>
                  <span className="text-muted-foreground text-xs tabular-nums">
                    {t("section.pointsSummary", {
                      max: section.max,
                      points: section.points,
                    })}
                  </span>
                </div>
                <Progress
                  aria-label={`${t(SECTION_KEYS[section.id])}: ${section.points}/${section.max}`}
                  className="gap-1.5"
                  max={Math.max(section.max, 1)}
                  value={Math.min(section.points, Math.max(section.max, 1))}
                >
                  <ProgressTrack className="h-1.5">
                    <ProgressIndicator />
                  </ProgressTrack>
                </Progress>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-sm">{t("benefits.title")}</h3>
          {[
            {
              titleKey: "benefits.70.title" as MessageKey,
              bodyKey: "benefits.70.body" as MessageKey,
              unlocked: score.meets70 && complete && salaryOk,
            },
            {
              titleKey: "benefits.80.title" as MessageKey,
              bodyKey: "benefits.80.body" as MessageKey,
              unlocked: score.meets80 && complete && salaryOk,
            },
            {
              titleKey: "benefits.hsp2.title" as MessageKey,
              bodyKey: "benefits.hsp2.body" as MessageKey,
              unlocked: score.meets70 && complete && salaryOk,
            },
          ].map((benefit) => (
            <div
              className="rounded-lg border p-3"
              key={benefit.titleKey}
            >
              <div className="flex flex-wrap items-center justify-between gap-1.5">
                <h4 className="font-medium text-xs">{t(benefit.titleKey)}</h4>
                <Badge
                  size="sm"
                  variant={benefit.unlocked ? "success" : "outline"}
                >
                  {benefit.unlocked
                    ? t("benefits.unlocked")
                    : t("benefits.locked")}
                </Badge>
              </div>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                {t(benefit.bodyKey)}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <h3 className="font-medium text-sm">{t("score.sources")}</h3>
          <SourceLink sourceId="point-table-ja" />
          <SourceLink sourceId="special-bonus-notice" />
          <SourceLink sourceId="pr-guideline" />
        </div>
      </CardPanel>
    </Card>
  );
}
