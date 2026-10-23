import type { Locale } from "@/domain/types";

function localeTag(locale: Locale): string {
  if (locale === "ja") return "ja-JP";
  if (locale === "zh-Hant") return "zh-TW";
  return "en-US";
}

/** Accepts YYYY-MM-DD or YYYY-MM, which is the format used by POLICY_SOURCES. */
export function formatPolicyDate(value: string, locale: Locale): string {
  const monthOnly = /^\d{4}-\d{2}$/.test(value);
  const date = new Date(`${value}${monthOnly ? "-01" : ""}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat(localeTag(locale), {
    day: monthOnly ? undefined : "numeric",
    month: "short",
    timeZone: "UTC",
    year: "numeric",
  }).format(date);
}

export function formatSavedAt(date: Date, locale: Locale): string {
  return new Intl.DateTimeFormat(localeTag(locale), {
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    month: "short",
  }).format(date);
}

export function formatYenFromManYen(manYen: number, locale: Locale): string {
  return new Intl.NumberFormat(localeTag(locale), {
    currency: "JPY",
    maximumFractionDigits: 0,
    style: "currency",
  }).format(manYen * 10_000);
}
