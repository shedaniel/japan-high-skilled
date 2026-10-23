import type { QualificationRecord } from "@/domain/types";

const COUNTRY_ZH_HANT: Record<string, string> = {
  Japan: "日本",
  China: "中國",
  Philippines: "菲律賓",
  Vietnam: "越南",
  Myanmar: "緬甸",
  Taiwan: "台灣",
  Malaysia: "馬來西亞",
  Thailand: "泰國",
  Mongolia: "蒙古",
  Bangladesh: "孟加拉",
  Singapore: "新加坡",
  "Republic of Korea": "韓國",
};

function it(
  id: string,
  nameJa: string,
  nameEn: string,
  countryEn = "Japan",
  countryJa = "日本",
): QualificationRecord {
  return {
    id,
    nameJa,
    nameEn,
    kind: "it-exam",
    category: "it",
    country: {
      en: countryEn,
      ja: countryJa,
      zhHant: COUNTRY_ZH_HANT[countryEn] ?? countryEn,
    },
  };
}

/**
 * IT告示 (技術・人文知識・国際業務の上陸許可基準) に定める試験。
 * These count toward the same 1号ロ qualification bonus as Japanese national
 * qualifications: one = 5 points, two or more = 10 points.
 *
 * Source: 出入国在留管理庁 ポイント計算表 ボーナス③ and the IT告示.
 */
export const IT_EXAMS: QualificationRecord[] = [
  // Japan — current
  it("it-jp-security-support", "情報処理安全確保支援士", "Registered Information Security Specialist"),
  it("it-jp-strategist", "ITストラテジスト", "IT Strategist"),
  it("it-jp-architect", "システムアーキテクト", "System Architect"),
  it("it-jp-pm", "プロジェクトマネージャ", "Project Manager"),
  it("it-jp-network", "ネットワークスペシャリスト", "Network Specialist"),
  it("it-jp-database", "データベーススペシャリスト", "Database Specialist"),
  it("it-jp-embedded", "エンベデッドシステムスペシャリスト", "Embedded Systems Specialist"),
  it("it-jp-service-manager", "ITサービスマネージャ", "IT Service Manager"),
  it("it-jp-auditor", "システム監査技術者", "Systems Auditor"),
  it("it-jp-applied", "応用情報技術者", "Applied Information Technology Engineer"),
  it("it-jp-fundamental", "基本情報技術者", "Fundamental Information Technology Engineer"),
  it("it-jp-security-management", "情報セキュリティマネジメント", "Information Security Management"),

  // Japan — legacy
  it("it-jp-legacy-type1-cert", "第一種情報処理技術者認定試験", "Type 1 Information Technology Engineer Certification (legacy)"),
  it("it-jp-legacy-type2-cert", "第二種情報処理技術者認定試験", "Type 2 Information Technology Engineer Certification (legacy)"),
  it("it-jp-legacy-type1", "第一種情報処理技術者試験", "Type 1 Information Technology Engineer Examination (legacy)"),
  it("it-jp-legacy-type2", "第二種情報処理技術者試験", "Type 2 Information Technology Engineer Examination (legacy)"),
  it("it-jp-legacy-special", "特種情報処理技術者試験", "Special Information Technology Engineer Examination (legacy)"),
  it("it-jp-legacy-audit", "情報処理システム監査技術者試験", "Information Processing Systems Auditor Examination (legacy)"),
  it("it-jp-legacy-online", "オンライン情報処理技術者試験", "Online Information Technology Engineer Examination (legacy)"),
  it("it-jp-legacy-operations", "システム運用管理エンジニア試験", "System Operations Management Engineer Examination (legacy)"),
  it("it-jp-legacy-production", "プロダクションエンジニア試験", "Production Engineer Examination (legacy)"),
  it("it-jp-legacy-microcomputer", "マイコン応用システムエンジニア試験", "Microcomputer Applied Systems Engineer Examination (legacy)"),
  it("it-jp-legacy-analyst", "システムアナリスト試験", "Systems Analyst Examination (legacy)"),
  it("it-jp-legacy-application", "アプリケーションエンジニア試験", "Application Engineer Examination (legacy)"),
  it("it-jp-legacy-senior-admin", "上級システムアドミニストレータ試験", "Senior Systems Administrator Examination (legacy)"),
  it("it-jp-legacy-software", "ソフトウェア開発技術者試験", "Software Development Engineer Examination (legacy)"),
  it("it-jp-legacy-tech-network", "テクニカルエンジニア（ネットワーク）試験", "Technical Engineer (Network) Examination (legacy)"),
  it("it-jp-legacy-tech-database", "テクニカルエンジニア（データベース）試験", "Technical Engineer (Database) Examination (legacy)"),
  it("it-jp-legacy-tech-system", "テクニカルエンジニア（システム管理）試験", "Technical Engineer (System Management) Examination (legacy)"),
  it("it-jp-legacy-tech-embedded", "テクニカルエンジニア（エンベデッドシステム）試験", "Technical Engineer (Embedded Systems) Examination (legacy)"),
  it("it-jp-legacy-tech-security", "テクニカルエンジニア（情報セキュリティ）試験", "Technical Engineer (Information Security) Examination (legacy)"),
  it("it-jp-legacy-security-admin", "情報セキュリティアドミニストレータ試験", "Information Security Administrator Examination (legacy)"),
  it("it-jp-legacy-security-specialist", "情報セキュリティスペシャリスト試験", "Information Security Specialist Examination (legacy)"),

  // China
  it("it-cn-system-analyst", "系統分析師（システム・アナリスト）", "System Analyst", "China", "中国"),
  it("it-cn-project-manager", "信息系統項目管理師（インフォメーション・システム・プロジェクト・マネージャ）", "Information System Project Manager", "China", "中国"),
  it("it-cn-architect", "系統架構設計師（システム・アーキテクト）", "System Architecture Designer", "China", "中国"),
  it("it-cn-software-designer", "軟件設計師（ソフトウェア設計エンジニア）", "Software Designer", "China", "中国"),
  it("it-cn-network-engineer", "網絡工程師（ネットワーク・エンジニア）", "Network Engineer", "China", "中国"),
  it("it-cn-database-engineer", "數據庫系統工程師（データベース・システム・エンジニア）", "Database System Engineer", "China", "中国"),
  it("it-cn-programmer", "程序員（プログラマ）", "Programmer", "China", "中国"),

  // Philippines
  it("it-ph-fe-philnits", "基本情報技術者試験（PhilNITS）", "Fundamental Information Technology Engineer (PhilNITS)", "Philippines", "フィリピン"),
  it("it-ph-ap-philnits", "応用情報技術者試験（PhilNITS）", "Applied Information Technology Engineer (PhilNITS)", "Philippines", "フィリピン"),
  it("it-ph-fe-jitse", "基本情報技術者試験（JITSE Phil）", "Fundamental Information Technology Engineer (JITSE Phil)", "Philippines", "フィリピン"),

  // Vietnam
  it("it-vn-fe-hitc", "基本情報技術者試験（HITC）", "Fundamental Information Technology Engineer (HITC)", "Vietnam", "ベトナム"),
  it("it-vn-ap-hitc", "応用情報技術者試験（HITC）", "Applied Information Technology Engineer (HITC)", "Vietnam", "ベトナム"),
  it("it-vn-fe-vitec", "基本情報技術者試験（VITEC）", "Fundamental Information Technology Engineer (VITEC)", "Vietnam", "ベトナム"),
  it("it-vn-sd-vitec", "ソフトウェア開発技術者試験（VITEC）", "Software Design and Development Engineer (VITEC)", "Vietnam", "ベトナム"),
  it("it-vn-ap-vitec", "応用情報技術者試験（VITEC）", "Applied Information Technology Engineer (VITEC)", "Vietnam", "ベトナム"),

  // Myanmar
  it("it-mm-fe", "基本情報技術者試験（MCF）", "Fundamental Information Technology Engineer (MCF)", "Myanmar", "ミャンマー"),
  it("it-mm-ap", "応用情報技術者試験（MCF）", "Applied Information Technology Engineer (MCF)", "Myanmar", "ミャンマー"),

  // Taiwan
  it("it-tw-software", "軟体設計専業人員試験（III）", "Software Design and Development IT Expert (III)", "Taiwan", "台湾"),
  it("it-tw-network", "網路通訊専業人員試験（III）", "Network Communication IT Expert (III)", "Taiwan", "台湾"),
  it("it-tw-security", "資訊安全管理専業人員試験（III）", "Information System Security IT Expert (III)", "Taiwan", "台湾"),

  // Malaysia
  it("it-my-fe", "基本情報技術者試験（METEOR）", "Fundamental Information Technology Professional (METEOR)", "Malaysia", "マレーシア"),

  // Thailand
  it("it-th-fe-nstda", "基本情報技術者試験（NSTDA）", "Fundamental Information Technology Engineer (NSTDA)", "Thailand", "タイ"),
  it("it-th-ap-nstda", "応用情報技術者試験（NSTDA）", "Applied Information Technology Engineer (NSTDA)", "Thailand", "タイ"),
  it("it-th-fe-nectec", "基本情報技術者試験（NECTEC）", "Fundamental Information Technology Engineer (NECTEC)", "Thailand", "タイ"),

  // Mongolia
  it("it-mn-fe", "基本情報技術者試験（NITP）", "Fundamental Information Technology Engineer (NITP)", "Mongolia", "モンゴル"),
  it("it-mn-ap", "応用情報技術者試験（NITP）", "Applied Information Technology Engineer (NITP)", "Mongolia", "モンゴル"),

  // Bangladesh
  it("it-bd-fe", "基本情報技術者試験（BCC）", "Fundamental Information Technology Engineer (BCC)", "Bangladesh", "バングラデシュ"),
  it("it-bd-ap", "応用情報技術者試験（BCC）", "Applied Information Technology Engineer (BCC)", "Bangladesh", "バングラデシュ"),

  // Singapore
  it("it-sg-citpm", "サーティファイドITプロジェクトマネージャ（CITPM）", "Certified IT Project Manager (CITPM)", "Singapore", "シンガポール"),

  // Korea
  it("it-kr-engineer", "情報処理技師", "Information Processing Engineer", "Republic of Korea", "韓国"),
  it("it-kr-industrial-engineer", "情報処理産業技師", "Industrial Information Processing Engineer", "Republic of Korea", "韓国"),
];
