import type { QualificationRecord } from "@/domain/types";

const COUNTRY_ZH_HANT: Record<string, string> = {
  "United States": "美國",
  Brazil: "巴西",
  China: "中國",
  "Hong Kong": "香港",
  France: "法國",
  Germany: "德國",
  Ireland: "愛爾蘭",
  Italy: "義大利",
  "Republic of Korea": "韓國",
  Netherlands: "荷蘭",
  Nepal: "尼泊爾",
  "New Zealand": "紐西蘭",
  Paraguay: "巴拉圭",
  Singapore: "新加坡",
  Spain: "西班牙",
  Switzerland: "瑞士",
  "United Kingdom": "英國",
  India: "印度",
  "Saudi Arabia": "沙烏地阿拉伯",
  Philippines: "菲律賓",
  Russia: "俄羅斯",
  Taiwan: "台灣",
  Belgium: "比利時",
  "Sri Lanka": "斯里蘭卡",
  Austria: "奧地利",
  Australia: "澳洲",
  Canada: "加拿大",
};

function f(
  id: string,
  nameJa: string,
  nameEn: string,
  category: string,
  countryEn = "",
  countryJa = "",
): QualificationRecord {
  return {
    id,
    nameJa,
    nameEn,
    kind: "foreign",
    category,
    ...(countryEn
      ? {
          country: {
            en: countryEn,
            ja: countryJa,
            zhHant: COUNTRY_ZH_HANT[countryEn] ?? countryEn,
          },
        }
      : {}),
  };
}

/**
 * 高度人材ポイント制の加点対象となる外国の資格、表彰等一覧
 * (令和5年12月改訂). Any one = 5 points; multiple do not stack.
 */
export const FOREIGN_QUALIFICATIONS: QualificationRecord[] = [
  f("f-us-cpa", "米国公認会計士（USCPA）", "US Certified Public Accountant (USCPA)", "accounting", "United States", "米国"),

  // Foreign lawyer — the official list names these jurisdictions.
  f("f-lawyer-brazil", "外国弁護士（ブラジル）", "Foreign Lawyer — Brazil (Advogado)", "legal", "Brazil", "ブラジル"),
  f("f-lawyer-china", "外国弁護士（中国）", "Foreign Lawyer — China (律師)", "legal", "China", "中国"),
  f("f-lawyer-hongkong", "外国弁護士（香港）", "Foreign Lawyer — Hong Kong (Solicitor of the High Court)", "legal", "Hong Kong", "香港"),
  f("f-lawyer-france", "外国弁護士（フランス）", "Foreign Lawyer — France (Avocat)", "legal", "France", "フランス"),
  f("f-lawyer-germany", "外国弁護士（ドイツ）", "Foreign Lawyer — Germany (Rechtsanwalt)", "legal", "Germany", "ドイツ"),
  f("f-lawyer-ireland", "外国弁護士（アイルランド）", "Foreign Lawyer — Ireland (Solicitor)", "legal", "Ireland", "アイルランド"),
  f("f-lawyer-italy", "外国弁護士（イタリア）", "Foreign Lawyer — Italy (Avvocato)", "legal", "Italy", "イタリア"),
  f("f-lawyer-korea", "外国弁護士（韓国）", "Foreign Lawyer — Republic of Korea (Byeonhosa)", "legal", "Republic of Korea", "韓国"),
  f("f-lawyer-netherlands", "外国弁護士（オランダ）", "Foreign Lawyer — Netherlands (Advocaat)", "legal", "Netherlands", "オランダ"),
  f("f-lawyer-nepal", "外国弁護士（ネパール）", "Foreign Lawyer — Nepal (Advocate)", "legal", "Nepal", "ネパール"),
  f("f-lawyer-newzealand", "外国弁護士（ニュージーランド）", "Foreign Lawyer — New Zealand (Barrister and Solicitor)", "legal", "New Zealand", "ニュージーランド"),
  f("f-lawyer-paraguay", "外国弁護士（パラグアイ）", "Foreign Lawyer — Paraguay (Abogado)", "legal", "Paraguay", "パラグアイ"),
  f("f-lawyer-singapore", "外国弁護士（シンガポール）", "Foreign Lawyer — Singapore (Advocate and Solicitor)", "legal", "Singapore", "シンガポール"),
  f("f-lawyer-spain", "外国弁護士（スペイン）", "Foreign Lawyer — Spain (Abogado)", "legal", "Spain", "スペイン"),
  f("f-lawyer-switzerland", "外国弁護士（スイス）", "Foreign Lawyer — Switzerland (Avocat)", "legal", "Switzerland", "スイス"),
  f("f-lawyer-uk", "外国弁護士（イギリス）", "Foreign Lawyer — United Kingdom (Solicitor of the Senior Courts)", "legal", "United Kingdom", "イギリス"),
  f("f-lawyer-india", "外国弁護士（インド）", "Foreign Lawyer — India (Advocate)", "legal", "India", "インド"),
  f("f-lawyer-saudi", "外国弁護士（サウジアラビア）", "Foreign Lawyer — Saudi Arabia (Muhamy)", "legal", "Saudi Arabia", "サウジアラビア"),
  f("f-lawyer-philippines", "外国弁護士（フィリピン）", "Foreign Lawyer — Philippines (Attorney)", "legal", "Philippines", "フィリピン"),
  f("f-lawyer-russia", "外国弁護士（ロシア）", "Foreign Lawyer — Russia (Advokat)", "legal", "Russia", "ロシア"),
  f("f-lawyer-taiwan", "外国弁護士（台湾）", "Foreign Lawyer — Taiwan (律師)", "legal", "Taiwan", "台湾"),
  f("f-lawyer-belgium", "外国弁護士（ベルギー）", "Foreign Lawyer — Belgium (Advocaat)", "legal", "Belgium", "ベルギー"),
  f("f-lawyer-srilanka", "外国弁護士（スリランカ）", "Foreign Lawyer — Sri Lanka (Attorney-at-Law)", "legal", "Sri Lanka", "スリランカ"),
  f("f-lawyer-austria", "外国弁護士（オーストリア）", "Foreign Lawyer — Austria (Rechtsanwalt)", "legal", "Austria", "オーストリア"),
  f("f-lawyer-australia-act", "外国弁護士（オーストラリア・ACT）", "Foreign Lawyer — Australia (ACT, Legal Practitioner)", "legal", "Australia", "オーストラリア"),
  f("f-lawyer-australia-nsw", "外国弁護士（オーストラリア・NSW）", "Foreign Lawyer — Australia (NSW, Solicitor)", "legal", "Australia", "オーストラリア"),
  f("f-lawyer-australia-qld", "外国弁護士（オーストラリア・QLD）", "Foreign Lawyer — Australia (QLD, Solicitor)", "legal", "Australia", "オーストラリア"),
  f("f-lawyer-australia-vic", "外国弁護士（オーストラリア・VIC）", "Foreign Lawyer — Australia (VIC, Australian Lawyer)", "legal", "Australia", "オーストラリア"),
  f("f-lawyer-australia-wa", "外国弁護士（オーストラリア・WA）", "Foreign Lawyer — Australia (WA, Legal Practitioner)", "legal", "Australia", "オーストラリア"),
  f("f-lawyer-canada-bc", "外国弁護士（カナダ・BC州）", "Foreign Lawyer — Canada (British Columbia, Barrister and Solicitor)", "legal", "Canada", "カナダ"),
  f("f-lawyer-canada-on", "外国弁護士（カナダ・オンタリオ州）", "Foreign Lawyer — Canada (Ontario, Barrister and Solicitor)", "legal", "Canada", "カナダ"),
  ...["California", "Colorado", "District of Columbia", "Connecticut", "Florida", "Georgia", "Hawaii", "Illinois", "Louisiana", "Minnesota", "Maryland", "Massachusetts", "Michigan", "Missouri", "Nevada", "New Jersey", "New York", "Ohio", "Oregon", "Pennsylvania", "Tennessee", "Texas", "Virginia", "Washington", "North Carolina", "Utah"].map((state, index) =>
    f(
      `f-lawyer-us-${index}`,
      `外国弁護士（米国・${state}州）`,
      `Foreign Lawyer — United States (${state})`,
      "legal",
      "United States",
      "米国",
    ),
  ),

  f("f-actuary-us", "米国アクチュアリー（FSA）", "Fellow of the Society of Actuaries (FSA)", "actuarial", "United States", "米国"),
  f("f-actuary-uk", "英国アクチュアリー（FIA）", "Fellow of the Institute of Actuaries (FIA)", "actuarial", "United Kingdom", "イギリス"),

  f("f-if-gold", "iFデザインアワード（ゴールド）", "iF Design Award (Gold)", "design"),
  f("f-idea-gold", "インターナショナル・デザイン・エクセレンス賞（ゴールド）", "International Design Excellence Awards (Gold)", "design"),
  f("f-reddot-best", "レッドドット・デザイン賞（ベスト・オブ・ザ・ベスト）", "Red Dot Design Award (Best of the Best)", "design"),
  f("f-gooddesign-grand-gold", "グッドデザイン賞（大賞・金賞）", "Good Design Award (Grand Award / Gold Award)", "design"),
  f("f-dfa-grand", "アジアデザイン賞（グランドアワード）", "DFA Design for Asia Awards (Grand Award)", "design"),
  f("f-adc-gold", "ADCアニュアルアワード（ゴールド）", "ADC Annual Awards (Gold)", "design"),
  f("f-dandad-gold", "D&ADアワード（ゴールド）", "D&AD Awards (Gold)", "design"),
  f("f-cannes-design-gold", "カンヌライオンズ（デザイン部門グランプリ・ゴールド）", "Cannes Lions (Design: Grand Prix / Gold)", "design"),
  f("f-lvmh-prize", "LVMHプライズ（優勝）", "LVMH Prize for Young Fashion Designers (Winner)", "fashion"),
  f("f-woolmark-men", "インターナショナル・ウールマーク・プライズ（メンズ優勝）", "International Woolmark Prize (Menswear Winner)", "fashion"),
  f("f-woolmark-women", "インターナショナル・ウールマーク・プライズ（ウィメンズ優勝）", "International Woolmark Prize (Womenswear Winner)", "fashion"),
  f("f-bfc-designer", "英国ファッション・アワード（デザイナー・オブ・ザ・イヤー）", "British Fashion Council (Designer of the Year)", "fashion"),
];
