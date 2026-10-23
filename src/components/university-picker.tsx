"use client";

import { CheckIcon, SearchIcon, XIcon } from "lucide-react";
import * as React from "react";
import { useDeferredValue, useId, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Locale, UniversityRecord, UniversitySource } from "@/domain/types";
import { useI18n } from "@/i18n";
import type { MessageKey } from "@/i18n/messages";
import {
  OFFICIAL_UNIVERSITY_LIST_URL,
  UNIVERSITIES,
  UNIVERSITY_META,
} from "@/data/universities";
import { cn } from "@/lib/utils";

export interface UniversityPickerProps {
  selected: {
    id: string | null;
    nameEn: string;
    nameJa: string;
    countryEn: string;
    countryJa: string;
    sources: UniversitySource[];
  } | null;
  onSelect: (university: UniversityRecord) => void;
  onClear: () => void;
}

type UniversityFilter = "all" | "designated" | "japan";

const PAGE_SIZE = 80;

const FILTERS: readonly UniversityFilter[] = ["all", "designated", "japan"];

const FILTER_KEYS: Record<UniversityFilter, MessageKey> = {
  all: "university.filter.all",
  designated: "university.filter.designated",
  japan: "university.filter.japan",
};

const SOURCE_KEYS: Record<UniversitySource, MessageKey> = {
  ranking: "university.sources.ranking",
  sgu: "university.sources.sgu",
  "innovative-asia": "university.sources.innovative-asia",
  "japanese-mext": "university.sources.japanese-mext",
};

const SOURCE_ORDER: readonly UniversitySource[] = [
  "ranking",
  "sgu",
  "innovative-asia",
  "japanese-mext",
];

const DESIGNATED_SOURCES: readonly UniversitySource[] = [
  "ranking",
  "sgu",
  "innovative-asia",
];

function normalizeSearchText(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/[\s\p{P}]+/gu, "");
}

const SEARCH_INDEX = new Map<string, string>(
  UNIVERSITIES.map((university) => [
    university.id,
    normalizeSearchText(
      [
        university.nameEn,
        university.nameJa,
        university.countryEn,
        university.countryJa,
      ].join(" "),
    ),
  ]),
);

/**
 * Traditional Chinese keeps the official Japanese name as the primary label;
 * the English name is shown alongside it. University names are not translated.
 */
function displayName(
  university: Pick<UniversityRecord, "nameEn" | "nameJa">,
  locale: Locale,
): string {
  if (locale === "zh-Hant") {
    const ja = university.nameJa;
    const en = university.nameEn;
    if (!ja) return en;
    if (!en || en === ja) return ja;
    return `${ja} (${en})`;
  }
  return locale === "ja"
    ? university.nameJa || university.nameEn
    : university.nameEn || university.nameJa;
}

/** Country names are not translated: zh-Hant shows the Japanese and English forms. */
function displayCountry(
  university: Pick<UniversityRecord, "countryEn" | "countryJa">,
  locale: Locale,
): string {
  if (locale === "zh-Hant") {
    const ja = university.countryJa;
    const en = university.countryEn;
    if (!ja) return en;
    if (!en || en === ja) return ja;
    return `${ja} (${en})`;
  }
  return locale === "ja"
    ? university.countryJa || university.countryEn
    : university.countryEn || university.countryJa;
}

function isDesignated(university: UniversityRecord): boolean {
  return university.sources.some((source) =>
    DESIGNATED_SOURCES.includes(source),
  );
}

function SourceBadges({
  sources,
  size = "sm",
}: {
  sources: readonly UniversitySource[];
  size?: "sm" | "default";
}): React.JSX.Element {
  const { t } = useI18n();
  const present = SOURCE_ORDER.filter((source) => sources.includes(source));
  return (
    <>
      {present.map((source) => (
        <Badge key={source} size={size} variant="outline">
          {t(SOURCE_KEYS[source])}
        </Badge>
      ))}
    </>
  );
}

function isUniversityFilter(value: string | undefined): value is UniversityFilter {
  return value === "all" || value === "designated" || value === "japan";
}

export function UniversityPicker({
  selected,
  onSelect,
  onClear,
}: UniversityPickerProps): React.JSX.Element {
  const { locale, t } = useI18n();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<UniversityFilter>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const deferredQuery = useDeferredValue(query);

  const selectedName = selected ? displayName(selected, locale) : "";

  const results = useMemo(() => {
    const needle = normalizeSearchText(deferredQuery);
    return UNIVERSITIES.filter((university) => {
      if (filter === "designated" && !isDesignated(university)) return false;
      if (filter === "japan" && !university.isJapan) return false;
      if (!needle) return true;
      const haystack = SEARCH_INDEX.get(university.id);
      return haystack !== undefined && haystack.includes(needle);
    });
  }, [deferredQuery, filter]);

  const visibleResults = results.slice(0, visibleCount);
  const hasMore = results.length > visibleCount;

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setQuery("");
      setFilter("all");
      setVisibleCount(PAGE_SIZE);
    }
  }

  function handleQueryChange(nextQuery: string) {
    setQuery(nextQuery);
    setVisibleCount(PAGE_SIZE);
  }

  function handleFilterChange(values: string[]) {
    setFilter(isUniversityFilter(values[0]) ? values[0] : "all");
    setVisibleCount(PAGE_SIZE);
  }

  function resetSearch() {
    setQuery("");
    setFilter("all");
    setVisibleCount(PAGE_SIZE);
  }

  function handleSelect(university: UniversityRecord) {
    onSelect(university);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <div className="flex w-full items-center gap-2">
        <DialogTrigger
          render={
            <Button
              aria-label={
                selected
                  ? `${t("university.selected")}: ${selectedName}`
                  : t("field.university.search")
              }
              className="h-auto min-h-9 w-full flex-1 justify-start gap-2 py-2 text-left font-normal"
              variant="outline"
            />
          }
        >
          <SearchIcon aria-hidden="true" className="shrink-0" />
          <span className="flex min-w-0 flex-1 flex-col items-start gap-1">
            <span
              className={cn(
                "w-full truncate",
                !selected && "text-muted-foreground",
              )}
            >
              {selected ? selectedName : t("field.university.search")}
            </span>
            {selected && selected.sources.length > 0 ? (
              <span className="flex flex-wrap gap-1">
                <SourceBadges sources={selected.sources} />
              </span>
            ) : null}
          </span>
        </DialogTrigger>
        {selected ? (
          <Button
            aria-label={t("university.clear")}
            onClick={onClear}
            size="icon"
            title={t("university.clear")}
            variant="ghost"
          >
            <XIcon aria-hidden="true" />
          </Button>
        ) : null}
      </div>

      <DialogPopup
        className="sm:max-w-2xl"
        closeProps={{ "aria-label": t("common.close") }}
      >
        <DialogHeader>
          <DialogTitle>{t("field.university.search")}</DialogTitle>
          <DialogDescription>{t("university.searchHint")}</DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <div className="flex flex-col gap-3">
            <Input
              aria-label={t("field.university.search")}
              aria-controls={listId}
              autoFocus
              onChange={(event) => handleQueryChange(event.currentTarget.value)}
              placeholder={t("field.university.placeholder")}
              type="search"
              value={query}
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <ToggleGroup
                aria-label={t("field.university")}
                onValueChange={handleFilterChange}
                size="sm"
                value={[filter]}
                variant="outline"
              >
                {FILTERS.map((value) => (
                  <ToggleGroupItem key={value} value={value}>
                    {t(FILTER_KEYS[value])}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <p
                aria-live="polite"
                className="text-muted-foreground text-sm"
              >
                {t("university.resultCount", { count: results.length })}
              </p>
            </div>

            {results.length === 0 ? (
              <div className="flex flex-col items-center gap-3 border-border/64 border-y py-8 text-center">
                <p className="text-muted-foreground text-sm">
                  {t("university.noResults")}
                </p>
                <Button onClick={resetSearch} size="sm" variant="outline">
                  {t("university.resetSearch")}
                </Button>
              </div>
            ) : (
              <>
                <ul className="flex flex-col gap-1" id={listId}>
                  {visibleResults.map((university) => {
                    const name = displayName(university, locale);
                    const country = displayCountry(university, locale);
                    const isSelected = selected?.id === university.id;
                    return (
                      <li key={university.id}>
                        <button
                          aria-pressed={isSelected}
                          className={cn(
                            "flex w-full flex-col gap-1 rounded-lg border border-transparent px-3 py-2 text-left outline-none transition-colors hover:bg-accent/64 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background",
                            isSelected && "border-primary/32 bg-accent/64",
                          )}
                          onClick={() => handleSelect(university)}
                          type="button"
                        >
                          <span className="flex items-start justify-between gap-2">
                            <span className="min-w-0 break-words font-medium">
                              {name}
                            </span>
                            {isSelected ? (
                              <CheckIcon
                                aria-hidden="true"
                                className="mt-0.5 shrink-0 text-primary"
                              />
                            ) : null}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {country}
                          </span>
                          <span className="flex flex-wrap gap-1">
                            <SourceBadges sources={university.sources} />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>

                {hasMore ? (
                  <Button
                    className="w-full"
                    onClick={() =>
                      setVisibleCount((count) => count + PAGE_SIZE)
                    }
                    variant="outline"
                  >
                    {t("university.showMore")}
                  </Button>
                ) : null}
              </>
            )}
          </div>
        </DialogPanel>

        <DialogFooter className="sm:justify-start" variant="bare">
          <div className="flex w-full flex-col gap-2">
            <div className="space-y-1">
              <p className="font-medium text-sm">
                {t("university.manualTitle")}
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {t("university.manualBody")}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <a
                className="font-medium text-sm underline underline-offset-4 hover:text-primary"
                href={OFFICIAL_UNIVERSITY_LIST_URL}
                rel="noreferrer"
                target="_blank"
              >
                {t("university.officialList")}
              </a>
              <span className="text-muted-foreground text-xs">
                {t("university.listAsOf", {
                  date: UNIVERSITY_META.sources.ranking?.as_of ?? "",
                })}
              </span>
            </div>
          </div>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}
