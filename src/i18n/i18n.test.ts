import { describe, expect, it } from "vitest";
import { en, ja } from "@/i18n/messages";
import { zhHant } from "@/i18n/messages.zh-Hant";
import { POLICY_SOURCES } from "@/domain/policy";
import { ALL_QUALIFICATIONS } from "@/data/qualifications";

const PLACEHOLDER = /\{[a-zA-Z]+\}/g;

describe("message catalogs", () => {
  it("covers every key in all three locales", () => {
    const keys = Object.keys(en);
    expect(keys.length).toBeGreaterThan(200);
    expect(Object.keys(ja).sort()).toEqual([...keys].sort());
    expect(Object.keys(zhHant).sort()).toEqual([...keys].sort());
  });

  it("keeps interpolation placeholders identical across locales", () => {
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(
        (zhHant[key].match(PLACEHOLDER) ?? []).sort(),
        key,
      ).toEqual((en[key].match(PLACEHOLDER) ?? []).sort());
      expect(
        (ja[key].match(PLACEHOLDER) ?? []).sort(),
        key,
      ).toEqual((en[key].match(PLACEHOLDER) ?? []).sort());
    }
  });

  it("has no empty translations", () => {
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(en[key].trim().length, key).toBeGreaterThan(0);
      expect(ja[key].trim().length, key).toBeGreaterThan(0);
      expect(zhHant[key].trim().length, key).toBeGreaterThan(0);
    }
  });

  it("translates the catalog instead of mirroring English", () => {
    const keys = Object.keys(en) as (keyof typeof en)[];
    const translated = keys.filter((key) => zhHant[key] !== en[key]);
    expect(translated.length / keys.length).toBeGreaterThan(0.9);
  });
});

describe("localized policy sources", () => {
  it("provides Japanese and Traditional Chinese titles for every source", () => {
    for (const source of POLICY_SOURCES) {
      expect(source.title.ja.trim().length, source.id).toBeGreaterThan(0);
      expect(source.title.zhHant?.trim().length, source.id).toBeGreaterThan(0);
    }
  });
});

describe("qualification country labels", () => {
  it("provides a Traditional Chinese label for every country tag", () => {
    for (const record of ALL_QUALIFICATIONS) {
      if (!record.country) continue;
      expect(record.country.zhHant?.trim().length, record.id).toBeGreaterThan(0);
    }
  });
});
