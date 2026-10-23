import {
  CheckIcon,
  CircleAlertIcon,
  DownloadIcon,
  GraduationCapIcon,
  RotateCcwIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { Alert, AlertAction, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogClose,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPopup,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatSavedAt } from "@/components/calculator/format";
import {
  downloadProfile,
  parseProfileJson,
} from "@/components/calculator/profile-io";
import type { Profile } from "@/domain/types";
import { useI18n } from "@/i18n";
import type { MessageKey } from "@/i18n/messages";

export interface AppHeaderProps {
  profile: Profile;
  savedAt: Date | null;
  onReset: () => void;
  onImport: (profile: Profile) => void;
}

export function AppHeader({
  profile,
  savedAt,
  onReset,
  onImport,
}: AppHeaderProps) {
  const { locale, setLocale, t } = useI18n();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [notice, setNotice] = useState<{
    variant: "success" | "error";
    messageKey: MessageKey;
  } | null>(null);

  function handleExport() {
    downloadProfile(profile);
    setNotice({ variant: "success", messageKey: "nav.exported" });
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0];
    event.currentTarget.value = "";
    if (!file) return;

    try {
      const nextProfile = parseProfileJson(await file.text());
      onImport(nextProfile);
      setNotice({ variant: "success", messageKey: "nav.imported" });
    } catch {
      setNotice({ variant: "error", messageKey: "nav.importError" });
    }
  }

  function handleReset() {
    onReset();
    setNotice(null);
  }

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="hidden size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
              <GraduationCapIcon aria-hidden="true" className="size-6" />
            </div>
            <div className="min-w-0">
              <h1 className="font-heading font-semibold text-2xl leading-tight sm:text-3xl">
                {t("app.title")}
              </h1>
              <p className="mt-1 max-w-3xl text-muted-foreground text-sm">
                {t("app.subtitle")}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <ToggleGroup
              aria-label={t("nav.language")}
              onValueChange={(values) => {
                const next = values.at(-1);
                if (next === "en" || next === "ja" || next === "zh-Hant") {
                  setLocale(next);
                }
              }}
              size="sm"
              value={[locale]}
              variant="outline"
            >
              <ToggleGroupItem
                aria-label={t("nav.localeEnglish")}
                value="en"
              >
                EN
              </ToggleGroupItem>
              <ToggleGroupItem
                aria-label={t("nav.localeJapanese")}
                value="ja"
              >
                JA
              </ToggleGroupItem>
              <ToggleGroupItem
                aria-label={t("nav.localeTraditionalChinese")}
                value="zh-Hant"
              >
                ZH
              </ToggleGroupItem>
            </ToggleGroup>

            <Badge
              className="gap-1.5"
              size="lg"
              variant={savedAt ? "success" : "outline"}
            >
              {savedAt ? (
                <CheckIcon aria-hidden="true" />
              ) : (
                <CircleAlertIcon aria-hidden="true" />
              )}
              {savedAt
                ? t("nav.savedAt", {
                    time: formatSavedAt(savedAt, locale),
                  })
                : t("nav.notSaved")}
            </Badge>

            <AlertDialog>
              <AlertDialogTrigger
                render={<Button size="sm" variant="outline" />}
              >
                <RotateCcwIcon aria-hidden="true" />
                {t("nav.reset")}
              </AlertDialogTrigger>
              <AlertDialogPopup>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {t("nav.resetConfirmTitle")}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {t("nav.resetConfirmBody")}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogClose render={<Button variant="outline" />}>
                    {t("common.cancel")}
                  </AlertDialogClose>
                  <AlertDialogClose
                    render={
                      <Button
                        onClick={handleReset}
                        variant="destructive"
                      />
                    }
                  >
                    {t("nav.resetAction")}
                  </AlertDialogClose>
                </AlertDialogFooter>
              </AlertDialogPopup>
            </AlertDialog>

            <Button onClick={handleExport} size="sm" variant="outline">
              <DownloadIcon aria-hidden="true" />
              {t("nav.export")}
            </Button>

            <Button
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              variant="outline"
            >
              <UploadIcon aria-hidden="true" />
              {t("nav.import")}
            </Button>
            <input
              accept=".json,application/json"
              className="hidden"
              onChange={handleFileChange}
              ref={fileInputRef}
              tabIndex={-1}
              type="file"
            />
          </div>
        </div>

        {notice ? (
          <Alert variant={notice.variant === "error" ? "error" : "success"}>
            {notice.variant === "error" ? (
              <CircleAlertIcon aria-hidden="true" />
            ) : (
              <CheckIcon aria-hidden="true" />
            )}
            <AlertDescription>{t(notice.messageKey)}</AlertDescription>
            <AlertAction>
              <Button
                aria-label={t("common.close")}
                onClick={() => setNotice(null)}
                size="icon-xs"
                variant="ghost"
              >
                <XIcon aria-hidden="true" />
              </Button>
            </AlertAction>
          </Alert>
        ) : null}
      </div>
    </header>
  );
}
