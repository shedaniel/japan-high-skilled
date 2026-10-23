#!/usr/bin/env python3
"""Build src/data/universities/generated.json from official Japanese government sources.

Usage:
    python3 -m pip install -r scripts/requirements.txt
    python3 scripts/build-universities.py

The script downloads the source documents into scripts/.cache and parses:
  1. The Immigration Services Agency designated-university list (world rankings).
  2. The MEXT Super Global University list (hard-coded; the project list is stable).
  3. The MOFA Innovative Asia partner-university list.
  4. The MEXT national/public/private university directory (names, type, English name).

The generated file is committed so the web app has no runtime network dependency.
Re-run this script when the official lists change, then review the diff.
"""

from __future__ import annotations

import hashlib
import json
import re
import sys
import urllib.request
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CACHE = ROOT / "scripts" / ".cache"
OUT = ROOT / "src" / "data" / "universities" / "generated.json"

SOURCES = {
    "ranking": {
        "url": "https://www.moj.go.jp/isa/content/001335478.pdf",
        "title_en": "Designated universities for the +10 bonus (as of January 2026)",
        "title_ja": "加点対象となる大学一覧（令和8年1月時点）",
        "as_of": "2026-01",
    },
    "sgu": {
        "url": "https://www.mext.go.jp/a_menu/koutou/kaikaku/sekaitenkai/1360288.htm",
        "title_en": "MEXT Super Global University project (Top / Globalization Leader types)",
        "title_ja": "スーパーグローバル大学創成支援事業（トップ型・グローバル化牽引型）",
        "as_of": "2026-10-24",
    },
    "innovative-asia": {
        "url": "https://www.moj.go.jp/isa/content/930001659.pdf",
        "title_en": "MOFA Innovative Asia partner universities",
        "title_ja": "イノベーティブ・アジア事業 パートナー校",
        "as_of": "2026-10-24",
    },
    "japanese-mext": {
        "url": "https://www.mext.go.jp/a_menu/koutou/ichiran/mext_00050.html",
        "title_en": "MEXT national university directory (2026)",
        "title_ja": "令和7年度全国大学一覧",
        "as_of": "2026-06",
    },
}

# Super Global University project: 13 Top type + 24 Globalization Leader type.
# Names are the official Japanese university names, with common English names.
SGU = [
    ("北海道大学", "Hokkaido University"),
    ("東北大学", "Tohoku University"),
    ("筑波大学", "University of Tsukuba"),
    ("東京大学", "The University of Tokyo"),
    ("東京医科歯科大学", "Tokyo Medical and Dental University"),
    ("東京科学大学", "Institute of Science Tokyo"),
    ("東京工業大学", "Tokyo Institute of Technology"),
    ("名古屋大学", "Nagoya University"),
    ("京都大学", "Kyoto University"),
    ("大阪大学", "Osaka University"),
    ("広島大学", "Hiroshima University"),
    ("九州大学", "Kyushu University"),
    ("慶應義塾大学", "Keio University"),
    ("早稲田大学", "Waseda University"),
    ("千葉大学", "Chiba University"),
    ("東京外国語大学", "Tokyo University of Foreign Studies"),
    ("東京芸術大学", "Tokyo University of the Arts"),
    ("長岡技術科学大学", "Nagaoka University of Technology"),
    ("金沢大学", "Kanazawa University"),
    ("豊橋技術科学大学", "Toyohashi University of Technology"),
    ("京都工芸繊維大学", "Kyoto Institute of Technology"),
    ("奈良先端科学技術大学院大学", "Nara Institute of Science and Technology"),
    ("岡山大学", "Okayama University"),
    ("熊本大学", "Kumamoto University"),
    ("国際教養大学", "Akita International University"),
    ("会津大学", "University of Aizu"),
    ("国際基督教大学", "International Christian University"),
    ("芝浦工業大学", "Shibaura Institute of Technology"),
    ("上智大学", "Sophia University"),
    ("東洋大学", "Toyo University"),
    ("法政大学", "Hosei University"),
    ("明治大学", "Meiji University"),
    ("立教大学", "Rikkyo University"),
    ("創価大学", "Soka University"),
    ("国際大学", "International University of Japan"),
    ("立命館大学", "Ritsumeikan University"),
    ("関西学院大学", "Kwansei Gakuin University"),
    ("立命館アジア太平洋大学", "Ritsumeikan Asia Pacific University"),
]

# Innovative Asia partner universities. (Japanese, English, country_en, country_ja)
INNOVATIVE_ASIA = [
    ("インド工科大学カラグプール校", "Indian Institute of Technology Kharagpur", "India", "インド"),
    ("インド工科大学カンプール校", "Indian Institute of Technology Kanpur", "India", "インド"),
    ("インド工科大学グワハティ校", "Indian Institute of Technology Guwahati", "India", "インド"),
    ("インド工科大学デリー校", "Indian Institute of Technology Delhi", "India", "インド"),
    ("インド工科大学ハイデラバード校", "Indian Institute of Technology Hyderabad", "India", "インド"),
    ("インド工科大学マドラス校", "Indian Institute of Technology Madras", "India", "インド"),
    ("インド工科大学ムンバイ校", "Indian Institute of Technology Bombay", "India", "インド"),
    ("インド工科大学ルールキー校", "Indian Institute of Technology Roorkee", "India", "インド"),
    ("インド情報技術大学ジャバルプル校", "Indian Institute of Information Technology, Design and Manufacturing, Jabalpur", "India", "インド"),
    ("インドネシア大学", "Universitas Indonesia", "Indonesia", "インドネシア"),
    ("ガジャマダ大学", "Universitas Gadjah Mada", "Indonesia", "インドネシア"),
    ("スラバヤ工科大学", "Institut Teknologi Sepuluh Nopember", "Indonesia", "インドネシア"),
    ("ダルマプルサダ大学", "Universitas Darma Persada", "Indonesia", "インドネシア"),
    ("ハサヌディン大学", "Universitas Hasanuddin", "Indonesia", "インドネシア"),
    ("バンドン工科大学", "Institut Teknologi Bandung", "Indonesia", "インドネシア"),
    ("ボゴール農業大学", "Bogor Agricultural University", "Indonesia", "インドネシア"),
    ("カンボジア工科大学", "Institute of Technology of Cambodia", "Cambodia", "カンボジア"),
    ("王立プノンペン大学", "Royal University of Phnom Penh", "Cambodia", "カンボジア"),
    ("シンガポール国立大学", "National University of Singapore", "Singapore", "シンガポール"),
    ("南洋理工大学", "Nanyang Technological University", "Singapore", "シンガポール"),
    ("コロンボ大学", "University of Colombo", "Sri Lanka", "スリランカ"),
    ("ペラデニヤ大学", "University of Peradeniya", "Sri Lanka", "スリランカ"),
    ("アジア工科大学", "Asian Institute of Technology", "Thailand", "タイ"),
    ("カセサート大学", "Kasetsart University", "Thailand", "タイ"),
    ("コンケン大学", "Khon Kaen University", "Thailand", "タイ"),
    ("泰日工業大学", "Thai-Nichi Institute of Technology", "Thailand", "タイ"),
    ("タマサート大学シリントーン国際工科院", "Thammasat University (Sirindhorn International Institute of Technology)", "Thailand", "タイ"),
    ("チュラロンコン大学", "Chulalongkorn University", "Thailand", "タイ"),
    ("チェンマイ大学", "Chiang Mai University", "Thailand", "タイ"),
    ("ブラパー大学", "Burapha University", "Thailand", "タイ"),
    ("プリンスオブソンクラー大学", "Prince of Songkla University", "Thailand", "タイ"),
    ("マヒドン大学", "Mahidol University", "Thailand", "タイ"),
    ("モンクット王工科大学トンブリ校", "King Mongkut's University of Technology Thonburi", "Thailand", "タイ"),
    ("モンクット王工科大学ラカバン校", "King Mongkut's Institute of Technology Ladkrabang", "Thailand", "タイ"),
    ("ＮＥＤ工科大学カラチ校", "NED University of Engineering and Technology, Karachi", "Pakistan", "パキスタン"),
    ("パキスタン国立科学技術大学", "National University of Sciences and Technology, Islamabad", "Pakistan", "パキスタン"),
    ("ラホール工科大学", "University of Engineering and Technology, Lahore", "Pakistan", "パキスタン"),
    ("ダッカ大学", "University of Dhaka", "Bangladesh", "バングラデシュ"),
    ("イスラム・バングラデシュ工科大学", "Bangladesh University of Engineering and Technology", "Bangladesh", "バングラデシュ"),
    ("アテネオ・デ・マニラ大学", "Ateneo de Manila University", "Philippines", "フィリピン"),
    ("デラサール大学", "De La Salle University", "Philippines", "フィリピン"),
    ("フィリピン大学ディリマン校", "University of the Philippines Diliman", "Philippines", "フィリピン"),
    ("ミンダナオ国立大学イリガン工科校", "Mindanao State University - Iligan Institute of Technology", "Philippines", "フィリピン"),
    ("ブルネイ大学", "Universiti Brunei Darussalam", "Brunei", "ブルネイ"),
    ("ブルネイ工科大学", "Brunei Institute of Technology", "Brunei", "ブルネイ"),
    ("日越大学", "Vietnam-Japan University", "Vietnam", "ベトナム"),
    ("ハノイ工科大学", "Hanoi University of Science and Technology", "Vietnam", "ベトナム"),
    ("ハノイ工業大学", "Hanoi University of Industry", "Vietnam", "ベトナム"),
    ("ホーチミン市工科大学", "Ho Chi Minh City University of Technology", "Vietnam", "ベトナム"),
    ("ホーチミン工業大学", "Industrial University of Ho Chi Minh City", "Vietnam", "ベトナム"),
    ("ペトロナス工科大学", "Universiti Teknologi Petronas", "Malaysia", "マレーシア"),
    ("マネジメント・サイエンス大学", "Management and Science University", "Malaysia", "マレーシア"),
    ("マラヤ大学", "Universiti Malaya", "Malaysia", "マレーシア"),
    ("マレーシア科学大学", "Universiti Sains Malaysia", "Malaysia", "マレーシア"),
    ("マレーシア工科大学", "Universiti Teknologi Malaysia", "Malaysia", "マレーシア"),
    ("マレーシア国民大学", "Universiti Kebangsaan Malaysia", "Malaysia", "マレーシア"),
    ("マレーシア・サバ大学", "Universiti Malaysia Sabah", "Malaysia", "マレーシア"),
    ("マレーシア・トゥン・フセイン・オン大学", "Universiti Tun Hussein Onn Malaysia", "Malaysia", "マレーシア"),
    ("マレーシア・マラ工科大学", "Universiti Teknologi MARA", "Malaysia", "マレーシア"),
    ("マレーシア・プトラ大学", "Universiti Putra Malaysia", "Malaysia", "マレーシア"),
    ("マンダレー工科大学", "Mandalay Technological University", "Myanmar", "ミャンマー"),
    ("ヤンゴン工科大学", "Yangon Technological University", "Myanmar", "ミャンマー"),
    ("ヤンゴン大学", "University of Yangon", "Myanmar", "ミャンマー"),
    ("ラオス国立大学", "National University of Laos", "Laos", "ラオス"),
]

MEXT_FILES = {
    "national": "https://www.mext.go.jp/content/20260620-mxt_daigakuc01-000050331_01.xlsx",
    "public": "https://www.mext.go.jp/content/20260620-mxt_daigakuc01-000050331_02.xlsx",
}
for i in range(1, 9):
    stamp = "20261021" if i == 2 else "20260620"
    MEXT_FILES[f"private-{i}"] = (
        f"https://www.mext.go.jp/content/{stamp}-mxt_daigakuc01-000050331_03-{i}.xlsx"
    )


def fetch(url: str, name: str) -> Path:
    CACHE.mkdir(parents=True, exist_ok=True)
    suffix = Path(url).suffix or ".bin"
    path = CACHE / f"{name}{suffix}"
    if path.exists() and path.stat().st_size > 1000:
        return path
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    with urllib.request.urlopen(req, timeout=120) as response:
        path.write_bytes(response.read())
    return path


def normalize(value: str) -> str:
    return re.sub(r"[\s　()（）・,，.．]", "", value).lower()


def university_id(name_ja: str, name_en: str) -> str:
    key = normalize(name_ja) or normalize(name_en)
    return "u-" + hashlib.sha1(key.encode("utf-8")).hexdigest()[:10]


def parse_ranking(path: Path) -> list[dict]:
    import pdfplumber

    rows: list[dict] = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            for table in page.extract_tables():
                for row in table:
                    cells = [(c or "").replace("\n", " ").strip() for c in row]
                    if len(cells) < 3:
                        continue
                    name_en, name_ja, country = cells[0], cells[1], cells[2]
                    if not name_en or "Name of university" in name_en:
                        continue
                    country_en, _, country_ja = country.partition(" / ")
                    rows.append(
                        {
                            "nameEn": name_en,
                            "nameJa": name_ja,
                            "countryEn": country_en.strip(),
                            "countryJa": country_ja.strip() or country_en.strip(),
                            "isJapan": country_en.strip() == "Japan",
                            "sources": ["ranking"],
                        }
                    )
    return rows


def parse_mext(path: Path, institution_type: str) -> list[dict]:
    import openpyxl

    wb = openpyxl.load_workbook(path, read_only=True, data_only=True)
    rows: list[dict] = []
    for sheet in wb.sheetnames:
        ws = wb[sheet]
        first = next(ws.iter_rows(max_row=1, values_only=True), None)
        title = ""
        if first:
            title = next((str(v) for v in first if v), "")
        match = re.match(r"^(国立|公立|私立)\s*(.+?)（(.+)）\s*$", title)
        if match:
            name_ja, name_en = match.group(2).strip(), match.group(3).strip()
        else:
            name_ja, name_en = sheet.strip(), ""
        rows.append(
            {
                "nameJa": name_ja,
                "nameEn": name_en,
                "countryEn": "Japan",
                "countryJa": "日本",
                "isJapan": True,
                "institutionType": institution_type,
                "sources": ["japanese-mext"],
            }
        )
    wb.close()
    return rows


def merge(records: list[dict]) -> list[dict]:
    by_key: dict[str, dict] = {}
    for record in records:
        # The ranking list spells former names as "Current (Previously: A / B)".
        # Use the current name as the merge key so it joins the MEXT directory entry.
        ja = re.sub(r"[（(](?:統合前|Previously)[^）)]*[）)]", "", record["nameJa"])
        key = normalize(ja)
        if not key:
            key = normalize(record["nameEn"])
        current = by_key.get(key)
        if not current:
            current = {
                "nameEn": record.get("nameEn", ""),
                "nameJa": record.get("nameJa", ""),
                "countryEn": record.get("countryEn", "Japan"),
                "countryJa": record.get("countryJa", "日本"),
                "isJapan": record.get("isJapan", False),
                "sources": [],
            }
            by_key[key] = current
        if not current["nameEn"] and record.get("nameEn"):
            current["nameEn"] = record["nameEn"]
        if record.get("institutionType"):
            current["institutionType"] = record["institutionType"]
        if record.get("isJapan"):
            current["isJapan"] = True
            current["countryEn"] = "Japan"
            current["countryJa"] = "日本"
        for source in record.get("sources", []):
            if source not in current["sources"]:
                current["sources"].append(source)
    result = []
    for record in by_key.values():
        record["id"] = university_id(record["nameJa"], record["nameEn"])
        result.append(record)
    result.sort(key=lambda r: (r["nameEn"] or "zzz", r["nameJa"]))
    return result


def main() -> None:
    if str(ROOT) not in sys.path:
        sys.path.insert(0, str(ROOT))

    records: list[dict] = []

    ranking_pdf = fetch(SOURCES["ranking"]["url"], "ranking-2026-01")
    records.extend(parse_ranking(ranking_pdf))

    for name_ja, name_en in SGU:
        records.append(
            {
                "nameJa": name_ja,
                "nameEn": name_en,
                "countryEn": "Japan",
                "countryJa": "日本",
                "isJapan": True,
                "sources": ["sgu"],
            }
        )

    for name_ja, name_en, country_en, country_ja in INNOVATIVE_ASIA:
        records.append(
            {
                "nameJa": name_ja,
                "nameEn": name_en,
                "countryEn": country_en,
                "countryJa": country_ja,
                "isJapan": False,
                "sources": ["innovative-asia"],
            }
        )

    for key, url in MEXT_FILES.items():
        institution_type = "national" if key == "national" else "public" if key == "public" else "private"
        path = fetch(url, f"mext-{key}")
        records.extend(parse_mext(path, institution_type))

    universities = merge(records)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "meta": {
                    "generatedAt": date.today().isoformat(),
                    "sources": SOURCES,
                    "counts": {
                        "total": len(universities),
                        "japan": sum(1 for u in universities if u["isJapan"]),
                        "designated": sum(
                            1
                            for u in universities
                            if any(
                                s in u["sources"] for s in ("ranking", "sgu", "innovative-asia")
                            )
                        ),
                    },
                },
                "universities": universities,
            },
            ensure_ascii=False,
            indent=2,
        )
        + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {OUT} ({len(universities)} universities)")


if __name__ == "__main__":
    main()
