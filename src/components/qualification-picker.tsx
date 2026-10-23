"use client";

import { CheckIcon, ChevronDownIcon, XIcon } from "lucide-react";
import * as React from "react";
import { useDeferredValue, useId, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  FOREIGN_QUALIFICATIONS,
  JAPAN_QUALIFICATIONS,
} from "@/data/qualifications";
import type { Locale, QualificationRecord } from "@/domain/types";
import { activateRow } from "@/components/calculator/row-click";
import { useI18n } from "@/i18n";
import type { MessageKey } from "@/i18n/messages";
import { cn } from "@/lib/utils";

export interface QualificationPickerProps {
  kind: "japan" | "foreign";
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  customQualifications?: {
    id: string;
    nameJa: string;
    nameEn: string;
  }[];
  onAddCustom?: (entry: { nameJa: string; nameEn: string }) => void;
  onRemoveCustom?: (id: string) => void;
  disabled?: boolean;
}

type CustomQualification = NonNullable<
  QualificationPickerProps["customQualifications"]
>[number];

function normalizeSearchText(value: string): string {
  return value.normalize("NFKC").toLowerCase().replace(/[\s\p{P}]+/gu, "");
}

function buildSearchIndex(
  records: readonly QualificationRecord[],
): Map<string, string> {
  return new Map(
    records.map((record) => [
      record.id,
      normalizeSearchText(
        [
          record.nameEn,
          record.nameJa,
          record.country?.en ?? "",
          record.country?.ja ?? "",
        ].join(" "),
      ),
    ]),
  );
}

const JAPAN_SEARCH_INDEX = buildSearchIndex(JAPAN_QUALIFICATIONS);
const FOREIGN_SEARCH_INDEX = buildSearchIndex(FOREIGN_QUALIFICATIONS);

function matchesSearch(
  index: Map<string, string>,
  id: string,
  needle: string,
): boolean {
  if (!needle) return true;
  return index.get(id)?.includes(needle) ?? false;
}

function categoryMessageKey(category: string): MessageKey {
  return `qualification.category.${category}` as MessageKey;
}

/**
 * Traditional Chinese keeps the official Japanese name as the primary label
 * and shows the English name as the secondary line; university and
 * qualification names are not translated.
 */
function pickName(
  locale: Locale,
  nameJa: string,
  nameEn: string,
): { primary: string; secondary: string } {
  if (locale === "zh-Hant") {
    const primary = nameJa || nameEn;
    const secondary = nameEn;
    return { primary, secondary: secondary === primary ? "" : secondary };
  }
  const primary = locale === "ja" ? nameJa || nameEn : nameEn || nameJa;
  const secondary = locale === "ja" ? nameEn : nameJa;
  return { primary, secondary: secondary === primary ? "" : secondary };
}

export function QualificationPicker({
  kind,
  selectedIds,
  onChange,
  customQualifications,
  onAddCustom,
  onRemoveCustom,
  disabled = false,
}: QualificationPickerProps): React.JSX.Element {
  const { locale, pick, t } = useI18n();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [customName, setCustomName] = useState("");
  const deferredQuery = useDeferredValue(query);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const needle = normalizeSearchText(deferredQuery);

  const visibleCustoms = useMemo<CustomQualification[]>(() => {
    if (kind !== "japan") return [];
    const customs = customQualifications ?? [];
    if (!needle) return customs;
    return customs.filter((entry) =>
      normalizeSearchText([entry.nameEn, entry.nameJa].join(" ")).includes(
        needle,
      ),
    );
  }, [customQualifications, kind, needle]);

  const japanGroups = useMemo<Array<[string, QualificationRecord[]]>>(() => {
    if (kind !== "japan") return [];
    const groups = new Map<string, QualificationRecord[]>();
    for (const record of JAPAN_QUALIFICATIONS) {
      if (!matchesSearch(JAPAN_SEARCH_INDEX, record.id, needle)) continue;
      const bucket = groups.get(record.category);
      if (bucket) {
        bucket.push(record);
      } else {
        groups.set(record.category, [record]);
      }
    }
    return [...groups.entries()];
  }, [kind, needle]);

  const foreignResults = useMemo<QualificationRecord[]>(() => {
    if (kind !== "foreign") return [];
    return FOREIGN_QUALIFICATIONS.filter((record) =>
      matchesSearch(FOREIGN_SEARCH_INDEX, record.id, needle),
    );
  }, [kind, needle]);

  const title = t(
    kind === "japan" ? "qualification.japanNational" : "qualification.foreign",
  );
  const rule = t(
    kind === "japan" ? "qualification.rule.japan" : "qualification.rule.foreign",
  );
  const triggerLabel =
    selectedIds.length > 0
      ? t("qualification.selectedCount", { count: selectedIds.length })
      : t("option.select");

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (nextOpen) {
      setQuery("");
      setCustomName("");
    }
  }

  function setSelected(id: string, nextChecked: boolean) {
    if (nextChecked) {
      if (selectedSet.has(id)) return;
      onChange([...selectedIds, id]);
      return;
    }
    if (!selectedSet.has(id)) return;
    onChange(selectedIds.filter((selectedId) => selectedId !== id));
  }

  function handleAddCustom(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = customName.trim();
    if (!value || !onAddCustom) return;
    onAddCustom({ nameJa: value, nameEn: value });
    setCustomName("");
  }

  function handleRemoveCustom(id: string) {
    onRemoveCustom?.(id);
  }

  const totalResults =
    visibleCustoms.length +
    (kind === "japan"
      ? japanGroups.reduce((count, [, records]) => count + records.length, 0)
      : foreignResults.length);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <Button
            aria-label={`${title}: ${triggerLabel}`}
            className={cn(
              "w-full justify-between gap-2 font-normal",
              selectedIds.length === 0 && "text-muted-foreground",
            )}
            disabled={disabled}
            variant="outline"
          />
        }
      >
        <span className="min-w-0 truncate">{triggerLabel}</span>
        <ChevronDownIcon aria-hidden="true" className="shrink-0" />
      </DialogTrigger>

      <DialogPopup className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{rule}</DialogDescription>
        </DialogHeader>

        <DialogPanel>
          <div className="flex flex-col gap-3" id={listId}>
            <Input
              aria-controls={listId}
              aria-label={t("qualification.search")}
              autoFocus
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder={t("qualification.search")}
              type="search"
              value={query}
            />

            {kind === "japan" && visibleCustoms.length > 0 ? (
              <section
                aria-label={t("qualification.custom")}
                className="flex flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-2 px-1">
                  <h3 className="font-medium text-sm">
                    {t("qualification.custom")}
                  </h3>
                  <Badge size="sm" variant="outline">
                    {visibleCustoms.length}
                  </Badge>
                </div>
                <ul className="flex flex-col gap-1">
                  {visibleCustoms.map((entry) => (
                    <CustomRow
                      key={entry.id}
                      entry={entry}
                      onRemove={() => handleRemoveCustom(entry.id)}
                    />
                  ))}
                </ul>
                <Separator className="my-2" />
              </section>
            ) : null}

            <div aria-live="polite" className="sr-only">
              {t("qualification.selectedCount", { count: selectedIds.length })}
            </div>

            {totalResults === 0 ? (
              <p className="py-8 text-center text-muted-foreground text-sm">
                {t("qualification.empty")}
              </p>
            ) : kind === "japan" ? (
              <div className="flex flex-col gap-4">
                {japanGroups.map(([category, records], groupIndex) => {
                  const headingId = `${listId}-category-${groupIndex}`;
                  return (
                    <section
                      aria-labelledby={headingId}
                      className="flex flex-col gap-1"
                      key={category}
                    >
                      <h3
                        className="px-1 font-medium text-muted-foreground text-xs uppercase tracking-wide"
                        id={headingId}
                      >
                        {t(categoryMessageKey(category))}
                      </h3>
                      <ul className="flex flex-col gap-1">
                        {records.map((record) => (
                          <QualificationRow
                            checked={selectedSet.has(record.id)}
                            key={record.id}
                            locale={locale}
                            onToggle={(nextChecked) =>
                              setSelected(record.id, nextChecked)
                            }
                            record={record}
                          />
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            ) : (
              <ul className="flex flex-col gap-1">
                {foreignResults.map((record) => (
                  <QualificationRow
                    checked={selectedSet.has(record.id)}
                    key={record.id}
                    locale={locale}
                    onToggle={(nextChecked) =>
                      setSelected(record.id, nextChecked)
                    }
                    record={record}
                    country={record.country ? pick(record.country) : undefined}
                  />
                ))}
              </ul>
            )}
          </div>
        </DialogPanel>

        <DialogFooter
          className="flex-col items-stretch gap-3 sm:flex-col sm:items-stretch"
          variant="bare"
        >
          {kind === "japan" && onAddCustom ? (
            <form
              className="flex w-full flex-col gap-2"
              onSubmit={handleAddCustom}
            >
              <div className="flex flex-col gap-1">
                <p className="font-medium text-sm">
                  {t("qualification.other")}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {t("qualification.otherHint")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Input
                  aria-label={t("qualification.addCustom")}
                  onChange={(event) => setCustomName(event.currentTarget.value)}
                  placeholder={t("qualification.customPlaceholder")}
                  value={customName}
                />
                <Button
                  disabled={!customName.trim()}
                  type="submit"
                  variant="outline"
                >
                  {t("common.add")}
                </Button>
              </div>
            </form>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-muted-foreground text-xs">
              {t("qualification.selectedCount", { count: selectedIds.length })}
            </p>
            <DialogClose render={<Button variant="outline" />}>
              {t("common.close")}
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogPopup>
    </Dialog>
  );
}

function QualificationRow({
  record,
  checked,
  locale,
  onToggle,
  country,
}: {
  record: QualificationRecord;
  checked: boolean;
  locale: Locale;
  onToggle: (checked: boolean) => void;
  country?: string;
}): React.JSX.Element {
  const { primary, secondary } = pickName(locale, record.nameJa, record.nameEn);

  return (
    <li
      className="cursor-pointer"
      onClick={(event) => activateRow(event, () => onToggle(!checked))}
    >
      <label
        className={cn(
          "flex w-full cursor-pointer items-start gap-3 rounded-lg border border-transparent px-3 py-2 transition-colors hover:bg-accent/64",
          checked && "border-primary/32 bg-accent/64",
        )}
      >
        <Checkbox
          aria-label={primary}
          checked={checked}
          className="mt-0.5"
          onCheckedChange={(nextChecked) => onToggle(nextChecked)}
        />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-start justify-between gap-2">
            <span className="min-w-0 break-words font-medium">{primary}</span>
            {checked ? (
              <CheckIcon
                aria-hidden="true"
                className="mt-0.5 shrink-0 text-primary"
              />
            ) : null}
          </span>
          {secondary ? (
            <span className="break-words text-muted-foreground text-xs">
              {secondary}
            </span>
          ) : null}
          {country ? (
            <span className="text-muted-foreground text-xs">{country}</span>
          ) : null}
        </span>
      </label>
    </li>
  );
}

function CustomRow({
  entry,
  onRemove,
}: {
  entry: CustomQualification;
  onRemove: () => void;
}): React.JSX.Element {
  const { locale, t } = useI18n();
  const { primary, secondary } = pickName(locale, entry.nameJa, entry.nameEn);

  return (
    <li
      className="flex cursor-pointer items-center gap-1 rounded-lg border border-border/64 bg-muted/32 pe-1"
      onClick={(event) => activateRow(event, onRemove)}
    >
      <label className="flex w-full min-w-0 flex-1 cursor-pointer items-start gap-3 px-3 py-2">
        <Checkbox
          aria-label={primary}
          checked
          className="mt-0.5"
          onCheckedChange={(nextChecked) => {
            if (!nextChecked) onRemove();
          }}
        />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex flex-wrap items-center gap-2">
            <span className="min-w-0 break-words font-medium">{primary}</span>
            <Badge size="sm" variant="secondary">
              {t("qualification.custom")}
            </Badge>
          </span>
          {secondary ? (
            <span className="break-words text-muted-foreground text-xs">
              {secondary}
            </span>
          ) : null}
        </span>
      </label>
      <Button
        aria-label={`${t("qualification.removeCustom")}: ${primary}`}
        onClick={onRemove}
        size="icon-sm"
        variant="ghost"
      >
        <XIcon aria-hidden="true" />
      </Button>
    </li>
  );
}
