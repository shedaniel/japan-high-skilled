# Policy reference and maintenance guide

This document is the human-readable counterpart to `src/domain/policy.ts`. The
code is authoritative for what the calculator does; this document records the
rules, the source for each rule, and the procedure for keeping both in sync.

## Version and verification

| Field | Value |
| --- | --- |
| `POLICY_VERSION` | `2026-04-01` |
| `POLICY_VERIFIED_AT` | `2026-10-24` |
| Point table implemented | Points calculation table effective 2023-04-01, plus special-bonus amendments through 2026-03-31 |
| University list snapshot | Official designated-university list as of January 2026 |

`POLICY_VERSION` is the calculator's policy snapshot label, not a government
effective date. The underlying point table has been effective since 2023-04-01;
the special-bonus notice was last amended on 2026-03-31. `POLICY_VERIFIED_AT`
is the date on which the constants were last checked against the sources below.

## Official sources

The identifiers in the first column are the `id` values in `POLICY_SOURCES` in
`src/domain/policy.ts`.

| ID | Document | URL | As of |
| --- | --- | --- | --- |
| `moj-evaluate` | Immigration Services Agency — How points are evaluated (entry point) | https://www.moj.go.jp/isa/applications/resources/newimmiact_3_evaluate_index.html | 2026-10-24 |
| `point-table-ja` | Points calculation table (Japanese, effective 2023-04-01) | https://www.moj.go.jp/isa/content/930001657.pdf | 2023-04-01 |
| `point-table-en` | Points calculation table (English) | https://www.moj.go.jp/isa/content/001398882.pdf | 2023-04-01 |
| `special-bonus-notice` | Special bonus public notice (final amendment 2026-03-31) | https://www.moj.go.jp/isa/content/930001665.pdf | 2026-03-31 |
| `university-list-2026` | Designated universities for the +10 bonus (January 2026) | https://www.moj.go.jp/isa/content/001335478.pdf | 2026-01 |
| `sgu` | MEXT Super Global University project | https://www.mext.go.jp/a_menu/koutou/kaikaku/sekaitenkai/1360288.htm | 2026-10-24 |
| `innovative-asia` | MOFA Innovative Asia partner universities | https://www.moj.go.jp/isa/content/930001659.pdf | 2026-10-24 |
| `foreign-qualifications` | Foreign qualifications and awards eligible for +5 (December 2023 revision) | https://www.moj.go.jp/isa/content/930001661.pdf | 2023-12 |
| `japanese-language` | Japanese-language ability eligible for bonus points | https://www.moj.go.jp/isa/content/930001656.pdf | 2026-10-24 |
| `growth-fields` | Growth-field advanced projects (March 2026) | https://www.moj.go.jp/isa/content/001458720.pdf | 2026-03 |
| `mext-universities` | MEXT national university directory (2026) | https://www.mext.go.jp/a_menu/koutou/ichiran/mext_00050.html | 2026-06 |
| `sme-law` | Small and Medium Enterprise Basic Act (SME definition) | https://elaws.e-gov.go.jp/document?lawid=338AC0000000181 | 2026-10-24 |
| `pr-guideline` | Guidelines for permission for permanent residence (revised 2026-10-01) | https://www.moj.go.jp/isa/10_00279.html | 2026-10-01 |
| `hsp-status` | Status of residence “Highly Skilled Professional” | https://www.moj.go.jp/isa/applications/status/designatedactivities02_00004.html | 2026-10-24 |
| `hsp2-criteria` | Criteria for changing to Highly Skilled Professional (2) | https://www.moj.go.jp/isa/content/930001650.pdf | 2026-10-24 |

## Scoring model

A profile has one `activity` value, and every table is applied for that
activity only:

| Code | Activity | Japanese |
| --- | --- | --- |
| `academic` | 1号イ — academic research | 高度学術研究活動 |
| `specialized` | 1号ロ — specialized/technical | 高度専門・技術活動 |
| `management` | 1号ハ — business management | 高度経営・管理活動 |

The total is the sum of the sections. There is no cap on the total; caps apply
per item, per section, and through the stacking rules below. A section's
maximum is shown in the UI and is reproduced here.

| Section | イ | ロ | ハ |
| --- | ---: | ---: | ---: |
| Education | 35 | 35 | 30 |
| Career | 15 | 20 | 25 |
| Salary | 40 | 40 | 50 |
| Age | 15 | 15 | 15 |
| Research | 25 | 15 | 0 |
| Qualifications | 0 | 10 | 0 |
| Position | 0 | 0 | 10 |
| Language | 15 | 15 | 15 |
| Bonuses | item-based | item-based | item-based |

## Applicability matrix

`Yes` means the item is scored for that activity. `—` means the item is not
scored, even if the profile contains a value.

| Item | イ | ロ | ハ | Notes |
| --- | :---: | :---: | :---: | --- |
| Education | Yes | Yes | Yes | Different tables. |
| Career | Yes | Yes | Yes | Different year bands. |
| Salary | Yes | Yes | Yes | Age-banded table for イ/ロ; management table for ハ. |
| Age | Yes | Yes | Yes | Same table. |
| Research | Yes | Yes | — | ハ always 0. |
| Qualifications | — | Yes | — | Only 1号ロ earns qualification points. |
| Position | — | — | Yes | Only 1号ハ earns position points. |
| Language | Yes | Yes | Yes | Same table. |
| General bonuses | Yes | Yes | Yes | See the bonus table for the two investment exceptions. |
| Investment of ¥100 million or more | — | — | Yes | Management only. |
| Investment-management business | — | Yes | Yes | イ excluded. |

## Education

`highest` is one of `doctorate`, `masters`, `bachelor`, or `none`.

| Education | イ | ロ | ハ |
| --- | ---: | ---: | ---: |
| Doctorate | 30 | 30 | 20 |
| Master's | 20 | 20 | 20 |
| Bachelor's | 10 | 10 | 10 |
| MBA / MOT professional degree | 0 | 25 | 25 |
| Two or more degrees in different fields | +5 | +5 | +5 |

Application order in `src/lib/calculator.ts`:

- **イ:** doctorate, then master's, then bachelor's. MBA/MOT adds nothing.
- **ロ:** doctorate, then MBA/MOT (25), then master's (20), then bachelor's.
  A doctorate is worth more than an MBA/MOT.
- **ハ:** MBA/MOT (25), then doctorate or master's (20), then bachelor's.
  An MBA/MOT is worth more than a doctorate here.
- The multiple-degree +5 is added only when the highest level is a doctorate
  or a master's. It is not added for a bachelor's, `none`, or an MBA/MOT-only
  profile.
- The section maximum is therefore 35 for イ/ロ and 30 for ハ.

## Career

Years are whole years of relevant practical experience. The bands are
inclusive lower bounds; the highest satisfied band applies.

| Career | イ | ロ | ハ |
| --- | ---: | ---: | ---: |
| 3 years or more | 5 | 5 | 10 |
| 5 years or more | 10 | 10 | 15 |
| 7 years or more | 15 | 15 | 20 |
| 10 years or more | — | 20 | 25 |

イ has no 10-year band. A missing career value scores 0 and is reported as an
incomplete field.

## Salary

The table uses annual salary in 万円 (10,000-yen units). Salary bands are
inclusive lower bounds; age bands are inclusive upper bounds. A dash means the
cell is not in the table and scores 0.

The calculator collects the salary band as a dropdown (for example
`¥6,000,000–6,999,999`) and stores the band's lower bound. That is enough to
score every cell of both tables, because points only change at the band
boundaries. The same applies to age and to years of practical experience:
the UI offers the bands that the tables use.

### Standard table (1号イ and 1号ロ)

| Annual salary (万円) | Age 29 or under | Age 34 or under | Age 39 or under | Age 40 or over |
| --- | ---: | ---: | ---: | ---: |
| 1,000 or more | 40 | 40 | 40 | 40 |
| 900 or more | 35 | 35 | 35 | 35 |
| 800 or more | 30 | 30 | 30 | 30 |
| 700 or more | 25 | 25 | 25 | — |
| 600 or more | 20 | 20 | 20 | — |
| 500 or more | 15 | 15 | — | — |
| 400 or more | 10 | — | — | — |
| Under 400 | 0 | 0 | 0 | 0 |

The highest salary band that the salary reaches is used. Within that band, the
first age band whose upper limit is at least the applicant's age is used. If
the age is missing, the standard table scores 0.

### Management table (1号ハ)

The management table ignores age.

| Annual salary (万円) | Points |
| --- | ---: |
| 3,000 or more | 50 |
| 2,500 or more | 40 |
| 2,000 or more | 30 |
| 1,500 or more | 20 |
| 1,000 or more | 10 |
| Under 1,000 | 0 |

## Age

| Age | Points |
| --- | ---: |
| 29 or under | 15 |
| 34 or under | 10 |
| 39 or under | 5 |
| 40 or over | 0 |

## Research achievements

The profile has four independent checkboxes: patent, grant, papers, and other.

| Count of selected items | イ | ロ | ハ |
| --- | ---: | ---: | ---: |
| 0 | 0 | 0 | 0 |
| 1 | 20 | 15 | 0 |
| 2 or more | 25 | 15 | 0 |

For ロ, any non-zero count is capped at 15; additional items do not add points.
The calculator does not evaluate the quality or documentary sufficiency of an
achievement.

## Qualifications

Qualification points exist only for 1号ロ.

| Japanese qualification count | ロ points |
| --- | ---: |
| 0 | 0 |
| 1 | 5 |
| 2 or more | 10 |

Counting rules:

- “Japanese” qualifications are qualifications granted under Japanese law; the
  term does not refer to the applicant's nationality.
- The count is the number of distinct qualification IDs in
  `profile.japanQualifications`, deduplicated with a `Set`.
- Japanese national qualifications are 業務独占資格 (exclusive practice) or
  名称独占資格 (title-restricted). The catalogs cover common qualifications;
  the official rules do not publish a closed list, so a custom entry is
  allowed for a qualification that is not in the catalog.
- IT告示 examinations count in the same bucket as Japanese national
  qualifications: one is 5 points, two or more are 10. The catalog includes
  Japanese IT exams and the foreign IT exams named in the IT告示.
- The qualification must be related to the intended work. The calculator
  cannot verify this; the user attests to it, and the immigration office makes
  the final decision.
- A custom entry counts toward the 5/10-point Japanese qualification total.
  It never counts as a foreign qualification.

## Foreign qualifications and awards

| Foreign qualification count | Points | Scope |
| --- | ---: | --- |
| 1 or more listed qualification or award | 5 | All activity types |

Only one 5-point bonus is awarded regardless of how many foreign
qualifications are selected; the list does not stack. The catalog follows the
December 2023 revision of the official foreign-qualification list. The
calculator does not assess whether a particular award category or edition is
on the current official list beyond membership in the catalog.

## Position

Position points exist only for 1号ハ.

| Position | Points |
| --- | ---: |
| Representative director / representative executive officer / representative managing member (代表取締役・代表執行役・代表権のある業務執行社員) | 10 |
| Director / executive officer / managing member (取締役・執行役・業務執行社員) | 5 |
| None | 0 |

## Japanese language

Only the highest applicable language bonus is awarded; N1 and N2 never stack.

| Evidence | Points | Conditions |
| --- | ---: | --- |
| JLPT N1 | 15 | — |
| BJT score of 480 or more | 15 | Treated as N1-equivalent. |
| Graduated from a foreign university with a Japanese-language major | 15 | Only when the Japan-degree flag is not set. |
| JLPT N2 | 10 | Excluded if N1-equivalent evidence or the Japan-degree flag applies. |
| BJT score of 400 to 479 | 10 | Excluded under the same conditions as N2. |
| None | 0 | — |

Exclusions enforced by `languagePoints()`:

- If the profile claims the Japanese university degree bonus
  (`education.japaneseInstitution`), N2 points are not available. N1 can still
  be earned through JLPT N1 or BJT 480+.
- A Japanese-language major at a foreign university is treated as N1-equivalent
  only when the applicant is not also claiming the Japan-degree flag.
- N1 takes precedence over N2 whenever both are present.

## Special bonuses

Each bonus is a boolean. A bonus is awarded once, only when its condition is
met. The “Applies to” column is the activity scope enforced by the calculator.

| Bonus | Points | Applies to | Condition in the calculator |
| --- | ---: | --- | --- |
| Innovation support measure (`innovationSupport`) | 10 | イ / ロ / ハ | The employer or project receives a qualifying innovation-support measure. |
| SME receiving an innovation support measure (`smeInnovation`) | 10 | イ / ロ / ハ | `innovationSupport` is also selected, and the employer is an SME. |
| Local-government support measure (`localGovernmentSupport`) | 10 | イ / ロ / ハ | The employer receives a qualifying local-government support measure. |
| SME with R&D ratio above 3% (`smeRnd`) | 5 | イ / ロ / ハ | SME R&D expenditure exceeds 3% of total revenue. |
| Growth-field advanced project (`growthField`) | 10 | イ / ロ / ハ | The project is on the growth-field list (March 2026). |
| JICA Innovative Asia training (`jicaTraining`) | 5 | イ / ロ / ハ | Completed the specified JICA training as part of the Innovative Asia programme for at least one year. |
| Investment of ¥100 million or more (`investment100m`) | 5 | ハ | The management activity involves an investment of at least ¥100 million. |
| Investment-management business (`investmentManagement`) | 10 | ロ / ハ | Work in an investment-management business or a related specified business. |
| Designated university (`designatedUniversity`) | 10 | イ / ロ / ハ | One of the three designated-university routes applies. |
| Japanese university degree (`japaneseInstitution`) | 10 | イ / ロ / ハ | Graduated from a Japanese university, graduate school, junior college, or equivalent. |
| Foreign qualification or award (`foreignQualification`) | 5 | イ / ロ / ハ | At least one listed foreign qualification or award. |

Stacking and dependency rules:

- `smeInnovation` is dependent: the calculator awards 0 if
  `innovationSupport` is not also selected. This prevents claiming the SME
  variant without the underlying measure.
- The three designated-university routes do not stack with each other; the
  designated-university bonus is 10 points regardless of how many routes a
  school satisfies.
- The Japanese university degree bonus is a separate 10 points and does stack
  with the designated-university bonus. A Japanese university that is also on
  a designated list can therefore contribute 20 bonus points.
- Foreign qualifications do not stack with each other.
- The calculator does not enforce the official note that JICA training cannot
  be combined with the Japan-degree bonus when the training used Japanese
  university courses. Do not select both in that fact pattern.
- All bonuses are self-declared. The app does not upload or verify supporting
  documents, SME status, investment amounts, or project listings.

## Minimum salary

| Activity | Minimum annual salary | Effect |
| --- | ---: | --- |
| イ | None in the point table | The salary section can still score, but no minimum-salary block is applied. |
| ロ | ¥3,000,000 | Below the minimum is a blocking reason and makes `eligible` false. |
| ハ | ¥3,000,000 | Below the minimum is a blocking reason and makes `eligible` false. |

For ロ and ハ, a missing salary does not satisfy the minimum: `eligible` is
false and `salary` is reported as incomplete. For イ, the minimum check is not
evaluated. The calculator only checks the number entered; other status
requirements and documentary proof are outside its scope.

## Thresholds, permanent residence, and HSP 2号

| Threshold | Constant | Meaning |
| ---: | --- | --- |
| 70 | `THRESHOLDS.hsp1`, `THRESHOLDS.prStandard` | Minimum for HSP 1号 and the standard 70-point permanent-residence route. |
| 80 | `THRESHOLDS.prFastTrack` | The one-year permanent-residence fast track. |

- **HSP 1号:** requires 70 points plus the minimum salary where applicable and
  the other requirements of the status. `eligible` combines the 70-point check,
  the salary check, and the blocking reasons; `meets70` is only the score check.
- **Permanent residence at 70:** the standard route requires 70 or more
  points at the time of application and continuously for the preceding three
  years (or 70+ three years before the application and maintained since). The
  other permanent-residence requirements still apply.
- **Permanent residence at 80:** the fast-track route requires 80 or more
  points at the time of application and continuously for the preceding year
  (or 80+ one year before the application and maintained since). The other
  permanent-residence requirements still apply.
- **HSP 2号:** available after three years as HSP 1号 (or qualifying 特定活動)
  with 70 or more points. It has no period-of-stay limit and broader activity
  permissions. See `hsp2-criteria`.

The app calculates points only. It does not count residence years, assess
tax/pension/health-insurance compliance, or decide whether a particular period
of stay qualifies.

## University bonus rules

| Route | Condition | Applies to | Points |
| --- | --- | --- | ---: |
| World-ranking list | Foreign university: appears in at least two of QS, THE, and ARWU top 300. Japanese university: appears in at least one. | Foreign and Japanese | 10 |
| Super Global University (SGU) | Member of the MEXT Top type or Globalization Leader type. | Japanese | 10 |
| Innovative Asia | Partner university of the MOFA Innovative Asia programme. | Foreign | 10 |
| Japanese university degree | Graduated from a Japanese university, graduate school, junior college, or equivalent institution. | Japanese | 10 |

Rules:

- The first three routes are mutually exclusive for scoring: a school that
  appears on several lists still yields one 10-point designated-university
  bonus.
- The Japanese university degree bonus is independent and stacks with the
  designated-university bonus.
- The official list is the January 2026 version. The committed dataset has
  1,148 institutions: 820 Japanese, 455 designated (127 Japanese and 328
  foreign), with 389 ranking entries, 38 SGU entries, and 64 Innovative Asia
  entries across all records.
- Selecting a university sets `designatedUniversity` when any of `ranking`,
  `sgu`, or `innovative-asia` is present, and sets `japaneseInstitution` when
  `isJapan` is true. The two manual checkboxes remain available for schools
  that are not in the dataset.
- Categories do not stack, but the Japanese degree bonus does. A Japanese
  university on the ranking or SGU list can produce 20 bonus points.
- The app trusts the dataset and the manual checkboxes. It does not verify
  graduation, degree level, or whether a school's name in the dataset matches
  the applicant's diploma.

Dataset generation, merge rules, and review steps are in
[docs/DATA.md](DATA.md).

## Edge cases and ambiguities

1. **Age at application.** The tables use age bands with inclusive upper
   limits. The app asks for the band that contains the applicant's age; it does
   not compute age from a birth date or decide the legally relevant assessment
   date. An applicant close to a band boundary should verify the date used by
   the immigration office.
2. **Salary definition.** The app asks for a salary band rather than an exact
   amount, because points only change at the band boundaries, and it does not
   annualize, prorate, or decide whether bonuses, allowances, or non-cash
   compensation count. Confirm the band against the remuneration documents you
   must submit.
3. **Multiple degrees.** The +5 requires two or more doctor/master/professional
   degrees in different fields. The app only checks the boolean and the highest
   level; it does not verify that the fields differ.
4. **MBA/MOT.** The app treats the MBA/MOT flag as independent of `highest`.
   For ロ it is worth 25 but a doctorate (30) outranks it; for ハ it is worth 25
   and outranks a doctorate (20). Whether a particular programme is an
   qualifying MBA/MOT is not assessed.
5. **Research evidence.** The four checkboxes are a coarse model. The official
   assessment of patents, grants, papers, and “other” achievements, including
   quality and the applicant's role, is not reproduced. In イ, two or more
   items raise the score from 20 to 25; in ロ, any number is capped at 15.
6. **N2 exclusion.** A Japan-degree claimant cannot also claim N2. N1 can
   still be claimed through JLPT N1 or BJT 480+. A Japanese-language major at a
   foreign university is N1-equivalent only when the Japan-degree flag is not
   set.
7. **SME innovation dependency.** `smeInnovation` is only awarded together with
   `innovationSupport`. SME status is self-declared and is not checked against
   the Small and Medium Enterprise Basic Act.
8. **Annual list churn.** Local-government support measures, innovation-support
   measures, growth-field projects, designated universities, and foreign
   qualifications are updated on their own schedules. A score calculated today
   can change when a list is revised, even if the point table itself is
   unchanged.
9. **JICA training stacking.** The official guidance excludes combining the
   JICA training bonus with the Japan-degree bonus when the training used
   Japanese university courses. The calculator does not encode that exclusion,
   so users must avoid double counting in that case.
10. **Investment bonuses.** The ¥100 million investment bonus is management
    only. The investment-management bonus applies to ロ and ハ. The app does
    not verify the investment amount, the business category, or any
    registration.
11. **University names and mergers.** The ranking list may use former names or
    “Current (Previously: …)” annotations. The build script strips the
    annotation before merging, but near-duplicates and very recent mergers
    should be checked by hand.
12. **Permanent residence and HSP 2号.** Only the point threshold is modeled.
    Residence-year counting, tax and social-insurance compliance, guarantor
    requirements, and the other grounds for permission are outside the app.
13. **Salary-table dashes.** A dash means zero points for that age/salary
    combination, not ineligibility. Only the minimum-salary rule can block
    eligibility.
14. **1号イ salary.** There is no fixed minimum in the point table used by the
    app, but the status still has its own requirements. A missing salary is
    still reported as an incomplete field.

## Annual maintenance checklist

Run this checklist when the point table, a bonus notice, or any supporting
list changes. Record the verification date in `POLICY_VERIFIED_AT`.

| What to verify | Source | Where it lives |
| --- | --- | --- |
| Point values and thresholds | `point-table-ja`, `point-table-en` | `src/domain/policy.ts` |
| Special bonuses and their conditions | `special-bonus-notice` | `BONUS_POINTS`, bonus logic in `src/lib/calculator.ts` |
| Designated universities, SGU, Innovative Asia | `university-list-2026`, `sgu`, `innovative-asia` | `scripts/build-universities.py` and regenerated JSON |
| Japanese institution directory and institution types | `mext-universities` | `scripts/build-universities.py` and regenerated JSON |
| Foreign qualifications and awards | `foreign-qualifications` | `src/data/qualifications/foreign.ts` |
| Japanese national qualifications and IT exams | `point-table-ja`, IT告示 | `src/data/qualifications/japan-national.ts`, `it-exams.ts` |
| Japanese-language evidence | `japanese-language` | `LANGUAGE_POINTS` and `languagePoints()` |
| Growth-field projects | `growth-fields` | `BONUS_POINTS.growthField` and the bonus copy; the project list itself is not embedded |
| SME definition | `sme-law` | No code constant; cited in the bonus description |
| Permanent-residence routes | `pr-guideline` | `THRESHOLDS` and UI copy |
| HSP 2号 criteria | `hsp2-criteria` | UI copy and this document |

Procedure:

1. Fetch each source and compare it with the tables above. Do not change the
   calculator from memory or from a secondary summary.
2. Update `src/domain/policy.ts` for point changes, thresholds, minimum salary,
   or source URLs/as-of dates.
3. For university changes, edit the hard-coded lists or source URLs in
   `scripts/build-universities.py` if necessary, then run
   `pnpm data:universities`. Review the generated diff. Never hand-edit
   `src/data/universities/generated.json`.
4. For qualification changes, edit the relevant catalog. Keep IDs stable;
   changing an ID invalidates saved profiles that reference it.
5. Update `docs/POLICY.md` and, if schemas or counts changed, `docs/DATA.md`.
6. Run the gates:

   ```bash
   pnpm test
   pnpm typecheck
   pnpm build
   ```

   `pnpm test` covers `src/lib/calculator.test.ts` for the scoring rules and
   `src/data/data-integrity.test.ts` for the university and qualification data.
   If a changed point value is not covered by an existing case, add a focused
   test before committing.

7. If a source changed but the values did not, update only the `asOf` date and
   `POLICY_VERIFIED_AT`; if the policy version changed, update
   `POLICY_VERSION` and this document's version table.

Do not hand-edit generated data. The university JSON is overwritten by the
build script, and `src/data/universities/index.ts` validates it at import time.
