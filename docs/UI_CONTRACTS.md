# UI contracts and file ownership

This file is the integration contract for the calculator UI. It is intentionally
short and code-oriented. Policy sources and update procedures live in
`docs/POLICY.md`; dataset generation lives in `docs/DATA.md`.

## Runtime stack

- Vite + React 19 + TypeScript
- Tailwind CSS v4 (`src/index.css`)
- coss ui primitives are already installed under `src/components/ui/*`
  (Base UI based). Import them with `@/components/ui/<name>`.
- `src/i18n/index.tsx` exports `useI18n()`:
  - `t(key, params?)` — flat message keys from `src/i18n/messages.ts`
  - `pick({ en, ja, zhHant? })` — for `LocalizedText`
  - `locale`, `setLocale`
  - `Locale` is `"en" | "ja" | "zh-Hant"`. In `zh-Hant`, university and
    qualification names stay in Japanese with the English name alongside;
    `pick()` falls back to English when a `zhHant` string is missing.
- `src/lib/storage.ts` exports `useProfile()`:
  - `profile`, `setProfile`, `reset`, `savedAt`
  - The hook already persists to `localStorage` on every change and syncs
    across tabs via the `storage` event.
- `src/lib/calculator.ts` exports `calculateScore(profile): ScoreResult`.
- `src/domain/types.ts` is the single source of truth for `Profile`,
  `UniversityRecord`, `QualificationRecord`, and `ScoreResult`.
- `src/domain/policy.ts` contains every point table and every official source.

## Component contracts

### `src/components/university-picker.tsx`

```ts
import type { UniversityRecord, UniversitySource } from "@/domain/types";

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

export function UniversityPicker(props: UniversityPickerProps): JSX.Element;
```

The component owns a `Dialog` with search, filters, result list, source badges,
and a "not listed" note with the official list link. It must not mutate the
profile directly; the parent decides how a selection maps to
`education.designatedUniversity` and `education.japaneseInstitution`.

### `src/components/qualification-picker.tsx`

```ts
import type { QualificationRecord } from "@/domain/types";

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

export function QualificationPicker(
  props: QualificationPickerProps,
): JSX.Element;
```

For `kind="japan"`, show `JAPAN_QUALIFICATIONS` (national qualifications plus
IT告示 exams) and allow multi-select plus a custom entry. For
`kind="foreign"`, show `FOREIGN_QUALIFICATIONS` and allow multi-select; the
calculator caps the bonus at 5 points regardless of count. The component must
not mutate the profile directly.

### Main UI (owned by the UI task)

`src/App.tsx` composes the page. It may add files under
`src/components/calculator/` and `src/components/layout/`. It must import the
two pickers above and use the existing `src/i18n/messages.ts` keys or add new
ones itself (the pickers only use keys that already exist).

## Data exports

### Universities

`src/data/universities/index.ts` must export:

```ts
export const UNIVERSITIES: UniversityRecord[];
export const UNIVERSITY_BY_ID: Map<string, UniversityRecord>;
export const UNIVERSITY_META: {
  generatedAt: string;
  sources: Record<string, { url: string; title_en: string; title_ja: string; as_of: string }>;
  counts: { total: number; japan: number; designated: number };
};
export const OFFICIAL_UNIVERSITY_LIST_URL: string;
```

`UniversalRecord.sources` contains one or more of
`"ranking" | "sgu" | "innovative-asia" | "japanese-mext"`. A record is
designated if it has any of the first three. `isJapan` drives the Japan-degree
bonus. The generated JSON is authoritative; do not hand-edit it.

### Qualifications

`src/data/qualifications/index.ts` already exports:

```ts
export const JAPAN_QUALIFICATIONS: QualificationRecord[];
export const FOREIGN_QUALIFICATIONS: QualificationRecord[];
export const ALL_QUALIFICATIONS: QualificationRecord[];
export const QUALIFICATIONS_BY_ID: Map<string, QualificationRecord>;
```

## Mapping a university selection

The main UI should do this in `onSelect`:

```ts
setProfile((current) => ({
  ...current,
  education: {
    ...current.education,
    universityId: university.id,
    universityNameEn: university.nameEn,
    universityNameJa: university.nameJa,
    universityCountryEn: university.countryEn,
    universityCountryJa: university.countryJa,
    universitySources: university.sources,
    designatedUniversity: university.sources.some((s) =>
      ["ranking", "sgu", "innovative-asia"].includes(s),
    ),
    japaneseInstitution: university.isJapan,
  },
}));
```

`onClear` clears the university fields but leaves the two manual bonus
checkboxes untouched.

## Mapping custom qualifications

The main UI should add a custom entry with an id such as
`custom-${crypto.randomUUID()}` and append it to both
`profile.customQualifications` and `profile.japanQualifications`. Removing it
must remove it from both arrays. Custom entries never count as foreign
qualifications.

## Verification

Run these from the repository root after integration:

```bash
pnpm typecheck
pnpm test
pnpm build
```

For a browser smoke test, run `pnpm dev --port 5180` and check the rendered
page at `http://127.0.0.1:5180/`.
