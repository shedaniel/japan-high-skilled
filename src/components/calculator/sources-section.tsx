import { ExternalLinkIcon, InfoIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPolicyDate } from "@/components/calculator/format";
import {
  POLICY_SOURCES,
  POLICY_VERIFIED_AT,
  POLICY_VERSION,
} from "@/domain/policy";
import { useI18n } from "@/i18n";

export function SourcesSection() {
  const { locale, pick, t } = useI18n();

  return (
    <Card className="scroll-mt-24" id="sources">
      <CardHeader>
        <CardTitle render={<h2 />}>{t("sources.title")}</CardTitle>
        <CardDescription>{t("sources.description")}</CardDescription>
        <CardAction>
          <Badge size="sm" variant="outline">
            {t("app.policyVersion")}{" "}
            {formatPolicyDate(POLICY_VERSION, locale)}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardPanel className="flex flex-col gap-5">
        <ul className="grid gap-3 md:grid-cols-2">
          {POLICY_SOURCES.map((source) => {
            const title = pick(source.title);
            return (
              <li
                className="flex flex-col gap-2 rounded-xl border p-4"
                key={source.id}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <a
                    className="inline-flex items-start gap-1.5 font-medium text-sm underline-offset-4 hover:underline"
                    href={source.url}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <span>{title}</span>
                    <ExternalLinkIcon
                      aria-hidden="true"
                      className="mt-0.5 size-3.5 shrink-0 opacity-70"
                    />
                  </a>
                  <Badge size="sm" variant="outline">
                    {t("sources.asOf")}{" "}
                    {formatPolicyDate(source.asOf, locale)}
                  </Badge>
                </div>
                {source.note ? (
                  <p className="text-muted-foreground text-xs leading-relaxed">
                    {pick(source.note)}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>

        <Separator />

        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-xs">
              {t("app.policyVersion")}
            </dt>
            <dd className="font-medium text-sm tabular-nums">
              {formatPolicyDate(POLICY_VERSION, locale)}
            </dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-muted-foreground text-xs">
              {t("app.lastVerified")}
            </dt>
            <dd className="font-medium text-sm tabular-nums">
              {formatPolicyDate(POLICY_VERIFIED_AT, locale)}
            </dd>
          </div>
        </dl>

        <Alert variant="info">
          <InfoIcon aria-hidden="true" />
          <AlertDescription>
            <p>{t("app.disclaimer")}</p>
            <p>{t("footer.localOnly")}</p>
          </AlertDescription>
        </Alert>
      </CardPanel>
    </Card>
  );
}
