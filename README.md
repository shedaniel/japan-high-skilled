# Japan High-Skilled Professional Points Calculator

An independent, local-first calculator for Japan's Highly Skilled Professional
(HSP, 高度専門職) point system. It implements the point tables for HSP 1号
イ (academic research), ロ (specialized/technical work), and ハ (business
management), and shows what a score unlocks: HSP 1号 at 70 points, and the
one-year permanent-residence route at 80 points.

The tool is a single-page web app. It has no account system, no backend, and no
analytics; the profile stays in the browser.

## Features

- **Official point tables for all three activity types.** Education, career,
  salary (age-banded for イ/ロ, management table for ハ), age, research,
  qualifications, position, Japanese language, and every special bonus.
- **Band dropdowns instead of free-form numbers.** Age, salary, career, and
  BJT are chosen from the bands the official tables use, so the score cannot
  drift from the policy.
- **Exact qualification selection.** Searchable catalogs of Japanese national
  qualifications (業務独占資格 / 名称独占資格), IT告示 examinations, and the
  official list of foreign qualifications and awards. One Japanese
  qualification is 5 points, two or more are 10 for 1号ロ; any listed foreign
  qualification is 5 points and does not stack.
- **Searchable official university directory.** 1,148 institutions from the
  Immigration Services Agency ranking list, the MEXT Super Global University
  project, the MOFA Innovative Asia partner list, and the MEXT national
  university directory. Selecting a university fills the designated-university
  bonus and the Japan-degree flag; manual override is available for schools
  that are not listed.
- **Automatic score breakdown.** Each section shows its points, with the
  minimum-salary check and missing-field warnings applied to eligibility.
  Policy sources are linked next to the fields they explain.
- **Local persistence.** The profile is saved to `localStorage` on every change
  and synchronized across tabs. No data leaves the device.
- **English, Japanese, and Traditional Chinese UI.** The locale is detected
  from the browser and can be switched at any time; the choice is persisted
  separately from the profile. In Traditional Chinese, university and
  qualification names stay in Japanese with the English name alongside, since
  those are official names that are not translated.
- **Threshold guidance.** 70/80-point outcomes, the three-year permanent
  residence route, the one-year fast track, and the requirements for changing
  to HSP 2号.

## Stack

| Layer | Choice |
| --- | --- |
| Build tool | Vite 8 |
| Package manager | pnpm |
| UI | React 19 + TypeScript |
| Styling | Tailwind CSS v4 |
| Components | coss ui primitives (Base UI) under `src/components/ui` |
| Tests | Vitest |

## Getting started

Requirements: Node.js and pnpm. Python 3 is only needed to regenerate the
university dataset.

```bash
pnpm install
pnpm dev
```

The development server prints its URL (Vite defaults to
`http://localhost:5173/`).

### Commands

| Command | Purpose |
| --- | --- |
| `pnpm install` | Install dependencies. |
| `pnpm dev` | Start the Vite development server with HMR. |
| `pnpm build` | Type-check the project and build the production bundle. |
| `pnpm test` | Run the Vitest suite once. |
| `pnpm typecheck` | Type-check without emitting output. |
| `pnpm data:universities` | Regenerate `src/data/universities/generated.json` from the official source documents. Requires Python and network access on the first run. |

`pnpm test:watch` and `pnpm preview` are also available. `pnpm lint` runs
Oxlint.

## Project layout

| Path | Contents |
| --- | --- |
| `src/domain/policy.ts` | Every point table, threshold, minimum salary, and official source. Authoritative for all numbers. |
| `src/domain/types.ts` | Shared types: `Profile`, `UniversityRecord`, `QualificationRecord`, `ScoreResult`. |
| `src/lib/calculator.ts` | Pure scoring functions; turns a `Profile` into `ScoreResult`. |
| `src/lib/profile.ts` | Default and normalized profile shapes. |
| `src/lib/storage.ts` | `localStorage` persistence and cross-tab synchronization. |
| `src/data/universities/generated.json` | Committed university dataset generated from official documents. Never edit by hand. |
| `src/data/universities/index.ts` | Validates the dataset at import time and exports lookups. |
| `src/data/qualifications/` | Japanese national qualifications, IT exams, and foreign qualifications. |
| `src/components/` | Calculator UI, university picker, and qualification picker. |
| `src/i18n/` | Message catalogs and the `useI18n()` hook. |
| `docs/POLICY.md` | Policy rules, exact tables, sources, and the annual maintenance procedure. |
| `docs/DATA.md` | Dataset schemas, generation pipeline, storage format, and validation. |
| `docs/UI_CONTRACTS.md` | Component and data-export contracts used during integration. |

## Policy data

All policy numbers live in `src/domain/policy.ts`, not in components. The file
also carries `POLICY_VERSION`, `POLICY_VERIFIED_AT`, and the `POLICY_SOURCES`
list with URLs and as-of dates.

- To change a point value or threshold, edit `src/domain/policy.ts` and update
  `docs/POLICY.md`.
- To refresh the university directory, run `pnpm data:universities`; do not
  hand-edit `generated.json`.
- To add or correct a qualification, edit the catalogs under
  `src/data/qualifications/`.

See [docs/POLICY.md](docs/POLICY.md) for the rules and source-by-source
maintenance checklist, and [docs/DATA.md](docs/DATA.md) for the dataset and
storage schemas.

## Disclaimer

This is an independent tool. It is not affiliated with the Immigration Services
Agency, the Ministry of Justice, or any other government body, and it is not
legal advice. Immigration decisions depend on documents and facts that the
calculator does not collect.

Point tables, bonus notices, university lists, and qualification lists change.
Always confirm the current requirements with the official sources listed in
[docs/POLICY.md](docs/POLICY.md) before relying on a result. The repository
records the verification date but cannot guarantee that a source has not
changed since then.
