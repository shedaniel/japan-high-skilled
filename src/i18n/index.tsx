import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale, LocalizedText } from "@/domain/types";
import { loadLocale, saveLocale } from "@/lib/storage";
import { en, ja, type MessageKey } from "@/i18n/messages";
import { zhHant } from "@/i18n/messages.zh-Hant";

type Params = Record<string, string | number>;

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey, params?: Params) => string;
  pick: (text: LocalizedText) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const CATALOGS: Record<Locale, Record<MessageKey, string>> = {
  en,
  ja,
  "zh-Hant": zhHant,
};

function detectLocale(): Locale {
  const stored = loadLocale();
  if (stored) return stored;
  if (typeof navigator !== "undefined") {
    const language = navigator.language.toLowerCase();
    if (language.startsWith("ja")) return "ja";
    if (language.startsWith("zh")) return "zh-Hant";
  }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    saveLocale(next);
  }, []);

  useEffect(() => {
    document.documentElement.lang =
      locale === "zh-Hant" ? "zh-Hant" : locale === "ja" ? "ja" : "en";
  }, [locale]);

  const t = useCallback(
    (key: MessageKey, params?: Params) => {
      const template = CATALOGS[locale][key] ?? CATALOGS.en[key] ?? key;
      if (!params) return template;
      return template.replace(/\{(\w+)\}/g, (_, name: string) =>
        String(params[name] ?? `{${name}}`),
      );
    },
    [locale],
  );

  const pick = useCallback(
    (text: LocalizedText) => {
      if (locale === "ja") return text.ja;
      if (locale === "zh-Hant") return text.zhHant ?? text.en;
      return text.en;
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, pick }),
    [locale, pick, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n must be used inside I18nProvider");
  return value;
}

export type { MessageKey };
