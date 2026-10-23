import { useI18n } from "@/i18n";

export function AppFooter() {
  const { t } = useI18n();

  return (
    <footer className="border-t bg-muted/24">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-1.5 px-4 py-6 text-muted-foreground text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>{t("footer.builtWith")}</p>
        <p>{t("footer.localOnly")}</p>
      </div>
    </footer>
  );
}
