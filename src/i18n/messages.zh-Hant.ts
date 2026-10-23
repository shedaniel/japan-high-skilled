import type { MessageKey } from "@/i18n/messages";

export const zhHant: Record<MessageKey, string> = {
  "app.title": "高度專門職點數計算機",
  "app.subtitle":
    "計算您在留資格「高度専門職」（高度專門職，HSP 1号）於日本「高度人才積分制」下的得分。",
  "app.disclaimer":
    "本工具為獨立計算程式，並非法律意見。點數係依據下方連結的官方表格與名單計算。申請前，請向出入境在留管理廳確認最新規定。",
  "app.lastVerified": "制度資料最終確認日",
  "app.policyVersion": "制度版本",

  "nav.language": "語言",
  "nav.reset": "重設",
  "nav.resetConfirmTitle": "要重設所有回答嗎？",
  "nav.resetConfirmBody":
    "這將清除儲存在此瀏覽器中的回答內容，語言設定則會保留。",
  "nav.export": "匯出 JSON",
  "nav.import": "匯入 JSON",
  "nav.saved": "已儲存於本機",
  "nav.notSaved": "尚未儲存",

  "activity.label": "活動類別",
  "activity.academic": "1号イ — 學術研究",
  "activity.academic.short": "學術研究（イ）",
  "activity.academic.description":
    "與日本公私機構訂約，從事研究、研究指導或教學活動。",
  "activity.specialized": "1号ロ — 專業／技術",
  "activity.specialized.short": "專業／技術（ロ）",
  "activity.specialized.description":
    "與日本公私機構訂約，從事需運用自然科學或人文科學領域知識或技術的業務。",
  "activity.management": "1号ハ — 經營管理",
  "activity.management.short": "經營管理（ハ）",
  "activity.management.description":
    "於日本公私機構從事事業的經營或管理活動。",

  "section.profile": "年齡、收入與經驗",
  "section.profile.description":
    "上列數值以申請當時為準。收入須為從事高度專門職活動時的預估年收入，而非去年的收入。",
  "section.education": "學歷",
  "section.education.description":
    "學歷基本加計僅以最高學歷計算。多重學位與 MBA／MOT 可另行加計點數。",
  "section.research": "研究實績",
  "section.research.description":
    "僅適用於 1号イ 與 1号ロ。須提出證明文件，且下列件數門檻的要求相當嚴格。",
  "section.qualifications": "資格",
  "section.qualifications.description":
    "請具體選擇您持有的資格。僅與預定從事工作相關的資格列入計算。",
  "section.language": "日語能力",
  "section.language.description":
    "JLPT、BJT 與日語專科為擇一適用。若已申報日本大學畢業加計或 N1，則不計入 N2。",
  "section.bonuses": "其他特別加計",
  "section.bonuses.description":
    "各項加計皆有各自的證明文件要求；選擇前請確認官方來源。",
  "section.results": "您的得分",
  "section.results.description":
    "高度專門職 1号須達 70 點。達 80 點即可適用 1 年永居許可途徑。",

  "field.age": "申請時年齡",
  "field.age.hint": "用於年齡加計與收入配點。",
  "field.salary": "預估年收入（級距）",
  "field.salary.hint": "不包含通勤津貼與住宅津貼。",
  "field.career": "相關經驗",
  "field.career.hint": "僅計算預定從事工作相關的經驗。",
  "field.highestDegree": "最高學歷",
  "field.mbaMot": "MBA 或 MOT（經營管理相關之專職學位）",
  "field.multipleDegrees":
    "於不同領域持有 2 個以上的博士／碩士／專職學位",
  "field.university": "用於判定加分大學的學校",
  "field.university.hint":
    "可從官方世界排名、超級全球大學與創新亞洲等名單中搜尋。選擇學校後加計點數會自動填入，您仍可自行調整。",
  "field.university.none": "尚未選擇學校",
  "field.university.search": "搜尋學校",
  "field.university.placeholder": "校名、國家或日文名稱",
  "field.university.empty": "找不到符合的學校。",
  "field.university.notListed": "我的學校不在名單中",
  "field.university.notListedHint":
    "請自行查核官方名單與最新的 QS／THE／ARWU 排名。名單每年更新。",
  "field.designatedUniversity": "畢業自告示大學（+10）",
  "field.designatedUniversity.hint":
    "符合下列任一項：世界排名名單、超級全球大學，或創新亞洲合作校。三種分類不可重複加計。",
  "field.japaneseInstitution": "畢業自日本大學或研究所（+10）",
  "field.japaneseInstitution.hint":
    "學位須取得自日本的大學、研究所、短期大學或同等機構。可與告示大學加計同時適用。",
  "field.jlpt": "JLPT 等級",
  "field.bjt": "BJT 商用日語（分數級距）",
  "field.japaneseMajor": "畢業自日語專科的外國大學",
  "field.position": "於機構中的職位",
  "field.patent": "以發明人身分取得專利（1 件以上）",
  "field.grant": "接受政府等公費補助或競爭型資金的研究（3 次以上）",
  "field.papers":
    "登載於已登記學術論文資料庫的論文（3 篇以上，且為第一作者或通訊作者）",
  "field.otherResearch": "法務大臣認可之其他研究實績",

  "option.none": "無",
  "option.select": "請選擇…",
  "option.doctorate": "博士學位（不含專職學位）",
  "option.masters": "碩士或專職學位",
  "option.bachelor": "大學學位或同等學歷",
  "option.representative": "代表董事／代表執行役",
  "option.director": "董事／執行役",
  "option.n1": "N1",
  "option.n2": "N2",
  "option.jlptNone": "無 JLPT",
  "option.yes": "是",
  "option.no": "否",
  "option.unspecified": "未指定",
  "option.age.29": "29 歲以下",
  "option.age.32": "30–34",
  "option.age.37": "35–39",
  "option.age.45": "40 歲以上",
  "option.career.0": "未滿 3 年",
  "option.career.3": "3–4 年",
  "option.career.5": "5–6 年",
  "option.career.7": "7–9 年",
  "option.career.10": "10 年以上",
  "option.salary.0": "¥3,000,000 以下",
  "option.salary.300": "¥3,000,000–3,999,999",
  "option.salary.400": "¥4,000,000–4,999,999",
  "option.salary.500": "¥5,000,000–5,999,999",
  "option.salary.600": "¥6,000,000–6,999,999",
  "option.salary.700": "¥7,000,000–7,999,999",
  "option.salary.800": "¥8,000,000–8,999,999",
  "option.salary.900": "¥9,000,000–9,999,999",
  "option.salary.1000": "¥10,000,000–14,999,999",
  "option.salary.1500": "¥15,000,000–19,999,999",
  "option.salary.2000": "¥20,000,000–24,999,999",
  "option.salary.2500": "¥25,000,000–29,999,999",
  "option.salary.3000": "¥30,000,000 以上",
  "option.bjt.none": "未應考／低於 400 分",
  "option.bjt.400": "400–479（N2 相当）",
  "option.bjt.480": "480 以上（N1 相当）",

  "score.total": "總計",
  "score.points": "點",
  "score.education": "學歷",
  "score.career": "實務經驗",
  "score.salary": "年收入",
  "score.age": "年齡",
  "score.research": "研究實績",
  "score.qualifications": "資格",
  "score.position": "職位",
  "score.language": "日語能力",
  "score.bonuses": "特別加計",
  "score.bonus.innovationSupport": "創新促進支援措施",
  "score.bonus.smeInnovation": "接受創新促進支援措施的中小企業",
  "score.bonus.localGovernmentSupport": "地方政府支援措施",
  "score.bonus.smeRnd": "研發費用占營收 3% 以上的中小企業",
  "score.bonus.growthField": "成長領域的先端計畫",
  "score.bonus.jicaTraining": "JICA 創新亞洲研修",
  "score.bonus.investment100m": "¥100,000,000 以上的投資",
  "score.bonus.investmentManagement": "投資運用業務",
  "score.bonus.designatedUniversity": "告示大學",
  "score.bonus.japaneseInstitution": "日本大學畢業",
  "score.bonus.foreignQualification": "外國資格或表彰",

  "status.eligible": "已達 70 點門檻",
  "status.notEligible": "未達 70 點門檻",
  "status.needMore": "還差 {points} 點",
  "status.fastTrack": "80 點以上：1 年永居許可途徑",
  "status.standardRoute": "70 點以上：3 年永居許可途徑",
  "status.salaryBelowMinimum":
    "1号ロ 與 1号ハ 的預估年收入須達 ¥3,000,000 以上，與總點數無關。",
  "status.provisional": "暫定分數 — 請補齊尚未填寫的欄位。",
  "status.incomplete": "缺少資訊",
  "status.sources": "資料來源與最後更新",
  "status.viewSource": "查看官方來源",

  "incomplete.age": "請輸入申請時的年齡。",
  "incomplete.salary": "請輸入您的預估年收入。",
  "incomplete.career": "請輸入您的相關實務經驗。",

  "bonus.innovationSupport.title": "雇主接受指定的創新促進支援措施",
  "bonus.innovationSupport.description":
    "您的契約機構接受法務省公告所列的支援措施（例如補助或認證）。",
  "bonus.smeInnovation.title": "同一雇主為中小企業",
  "bonus.smeInnovation.description":
    "僅在適用創新促進支援措施加計時可用。雇主須符合中小企業基本法的定義。",
  "bonus.localGovernmentSupport.title": "雇主接受地方政府支援措施",
  "bonus.localGovernmentSupport.description":
    "雇主接受法務大臣認可的支援措施，該措施旨在吸引高度人才外國人移居地方地區。",
  "bonus.smeRnd.title": "研發費用占營收 3% 以上的中小企業",
  "bonus.smeRnd.description":
    "雇主為中小企業，且其當年度研究開發費用總額超過營收的 3%。",
  "bonus.growthField.title": "從事成長領域的先端計畫",
  "bonus.growthField.description":
    "您本人須實際參與法務省成長領域名單所列的計畫（AI、IoT、再生醫療等），僅雇主參與並不適用。",
  "bonus.jicaTraining.title": "完成 1 年以上的 JICA 創新亞洲研修",
  "bonus.jicaTraining.description":
    "研修須為創新亞洲事業的一環，且為期至少 1 年。若係利用日本大學課程進行者，不得與日本大學畢業加計重複適用。",
  "bonus.investment100m.title": "對事業投資 ¥100,000,000 以上",
  "bonus.investment100m.description":
    "1号ハ：您本人於自己所經營的日本事業中自行投資 ¥100,000,000 以上。",
  "bonus.investmentManagement.title": "從事投資運用業務",
  "bonus.investmentManagement.description":
    "1号ロ 與 1号ハ：從事與第二類金融商品交易業、投資顧問／代理業務或投資運用業務相關的工作。",

  "university.sources.ranking": "世界排名",
  "university.sources.sgu": "超級全球大學",
  "university.sources.innovative-asia": "創新亞洲",
  "university.sources.japanese-mext": "日本大學名錄",
  "university.japan": "日本",
  "university.designated": "告示大學 +10",
  "university.notDesignated": "非告示大學",
  "university.selected": "已選擇",
  "university.clear": "清除選擇",
  "university.resultCount": "{count} 所大學",

  "qualification.japanNational": "日本國家資格與 IT 檢定",
  "qualification.foreign": "外國資格與表彰",
  "qualification.search": "搜尋資格",
  "qualification.empty": "找不到符合的資格。",
  "qualification.selectedCount": "已選 {count} 項",
  "qualification.rule.japan":
    "1 項資格 = 5 點；2 項以上 = 10 點。僅適用於 1号ロ，且資格須與您的工作相關。",
  "qualification.rule.foreign":
    "持有任一項表列的外國資格或表彰 = 5 點。多項不重複加計。",
  "qualification.other": "其他資格（未列於表內）",
  "qualification.otherHint":
    "若您持有的資格是與工作相關的日本國家資格但未收錄於本表，可自訂新增。是否符合由出入境在留管理廳判定。",
  "qualification.addCustom": "新增自訂資格",
  "qualification.customPlaceholder": "資格名稱",

  "language.n1": "N1 相当",
  "language.n2": "N2 相当",
  "language.none": "無日語能力加計",
  "language.n1Hint":
    "JLPT N1、BJT 480 分以上，或外國大學日語專科 = 15 點。",
  "language.n2Hint":
    "JLPT N2 或 BJT 400 分以上 = 10 點。若已申報日本大學畢業加計或 N1，則不適用。",
  "language.japanDegreeExclusion":
    "由於您已申報日本大學畢業加計，N2 不予加計。N1 仍可加計。",

  "benefits.title": "此分數可換取哪些待遇",
  "benefits.70.title": "70 點以上 — HSP 1号",
  "benefits.70.body":
    "取得 HSP 1号 居留資格的必要條件。累積 3 年符合資格的居留期間後，可依 70 點途徑申請永居許可，並可於 3 年後變更為 HSP 2号。",
  "benefits.80.title": "80 點以上 — 永居的快速途徑",
  "benefits.80.body":
    "以 80 點以上維持 1 年符合資格的居留期間後，可依快速途徑申請永居許可。須持續維持分數，其他永居許可要件亦仍適用。",
  "benefits.hsp2.title": "HSP 2号",
  "benefits.hsp2.body":
    "以 HSP 1号（或符合資格的 特定活動）居留滿 3 年且達 70 點以上者即可變更。無居留期限限制，且活動範圍較為寬廣。",

  "sources.title": "官方資料來源",
  "sources.description":
    "本計算器中的每一個數值都可追溯至下列文件。各資料檔案中亦記錄了每張表格的來源。",
  "sources.open": "開啟",
  "sources.asOf": "基準日",

  "footer.builtWith": "以 Vite、pnpm 與 coss ui 打造。",
  "footer.localOnly":
    "您的回答僅儲存在此瀏覽器的本機儲存空間，不會上傳。",
  "common.close": "關閉",
  "common.cancel": "取消",
  "common.add": "新增",
  "common.remove": "移除",
  "common.search": "搜尋",
  "common.clear": "清除",
  "common.open": "開啟",
  "common.back": "返回",
  "common.points": "點",
  "common.pointsMax": "最高 {points} 點",
  "common.selected": "已選擇",
  "common.none": "無",
  "common.optional": "選填",
  "common.required": "必填",
  "common.learnMore": "詳細說明",

  "university.filter.all": "全部",
  "university.filter.designated": "告示大學 +10",
  "university.filter.japan": "僅日本",
  "university.showMore": "顯示更多結果",
  "university.manualTitle": "名單中找不到您的學校？",
  "university.manualBody":
    "官方名單每年更新。請查核法務省的名單以及最新的 QS、THE、ARWU 排名，再於下方勾選方塊記錄您的判定結果。",
  "university.officialList": "開啟官方加分大學名單",
  "university.listAsOf": "官方名單基準日：{date}",
  "university.total": "名錄中有 {count} 所大學",
  "university.designatedSources": "符合的分類：{sources}",
  "university.searchHint": "可嘗試英文或日文校名，或輸入國家名稱。",
  "university.noResults": "找不到符合搜尋條件的學校。",
  "university.resetSearch": "重設搜尋條件",

  "qualification.filter.all": "全部",
  "qualification.filter.japan": "日本國家資格／IT",
  "qualification.filter.foreign": "外國",
  "qualification.category.legal": "法律",
  "qualification.category.accounting": "會計／稅務",
  "qualification.category.real-estate": "不動產",
  "qualification.category.medical": "醫療／保健",
  "qualification.category.welfare": "福利／照護",
  "qualification.category.education": "教育",
  "qualification.category.engineering": "工程",
  "qualification.category.construction": "營建",
  "qualification.category.it": "IT",
  "qualification.category.safety": "安全／產業",
  "qualification.category.service": "服務",
  "qualification.category.design": "設計獎項",
  "qualification.category.fashion": "時尚獎項",
  "qualification.category.actuarial": "精算",
  "qualification.custom": "自訂",
  "qualification.removeCustom": "移除自訂資格",
  "qualification.addCustomHint":
    "請僅新增與您預定從事工作相關的日本國家資格（業務独占／名称独占，即僅限具備該資格者從事該業務或使用該名稱）。",
  "qualification.pointsPreview": "資格加計 {points} 點",
  "qualification.maxReached": "已達資格加計上限",

  "nav.savedAt": "已儲存於本機 {time}",
  "nav.localeEnglish": "英文",
  "nav.localeJapanese": "日文",
  "nav.localeTraditionalChinese": "繁體中文",
  "nav.resetAction": "重設所有回答",
  "nav.exported": "已將資料匯出為 JSON。",
  "nav.imported": "已匯入資料。",
  "nav.importError": "無法匯入此檔案。請選擇結構版本為 1 的 JSON 匯出檔。",

  "activity.hint": "活動類別決定適用的配點表與輸入項目。",

  "section.pointsSummary": "{points} / {max} 點",

  "common.pointsValuePlus": "+{points} 點",

  "field.salary.minimum":
    "1号ロ 與 1号ハ 的預估年收入須達 {amount} 以上。",

  "education.mbaMotHint":
    "本項取代一般學歷加計點數，並採用其中較高的數值。",
  "education.multipleDegreesHint":
    "僅在最高學歷為博士或碩士／專職學位時適用。",
  "education.universityBonusTotal": "大學加計",
  "education.universityBonusValue": "{points} / 20 點",
  "education.universityBonusMax":
    "最高 20 點：告示大學 +10、日本大學畢業 +10。",
  "education.manualSources": "未記錄來源標記",
  "education.sourceNote":
    "來源標記依據所選學校的資料，並可透過下方勾選方塊覆寫。",

  "research.academicRule":
    "1号イ：1 件符合資格的實績 = 20 點；2 件以上 = 25 點。",
  "research.specializedRule":
    "1号ロ：1 件以上符合資格的實績 = 15 點（上限）。",
  "research.count": "4 件中已選 {count} 件",
  "research.maxLabel": "上限 {points} 點",

  "qualification.japanOnlySpecialized":
    "日本國家資格加計僅適用於 1号ロ。",
  "qualification.maxJapan": "上限 10 點",
  "qualification.maxForeign": "上限 5 點",
  "qualification.foreignForAll": "外國資格與表彰適用於所有活動類別。",

  "language.bjtHint": "480 分以上視為 N1；400–479 分視為 N2。",
  "language.n1EquivalenceExclusion":
    "因您已符合 N1 相當條件（BJT 480 分以上或日語專科），故不評估 N2。",
  "language.n2Disabled": "此組合不適用 N2。",

  "bonus.sourceLabel": "官方資料：{title}",
  "bonus.requiresInnovation": "須搭配創新促進支援措施",
  "bonus.earned": "已加計：+{points} 點",
  "bonus.sectionIncludesExtras":
    "此合計另包含上方學歷與資格區段所設定的大學加計與外國資格加計。",
  "bonus.positionHint":
    "請選擇公司登記簿及公司章程所記載的職位。",
  "bonus.positionOnly": "職位加計僅適用於 1号ハ。",
  "bonus.pointsAvailable": "可加計 {points} 點",

  "score.threshold70": "70 點門檻",
  "score.threshold80": "80 點門檻",
  "score.thresholdReached": "已達標",
  "score.thresholdMissing": "尚差 {points} 點",
  "score.breakdown": "點數明細",
  "score.sources": "此分數的依據",
  "score.salaryRequirement": "預估年收入下限",
  "score.salaryRequirementMet": "已符合",
  "score.salaryRequirementMissing": "尚未填寫",
  "score.salaryRequirementBelow": "低於下限",
  "score.gapTo80": "距 80 點尚差 {points} 點",
  "status.blockedBySalary": "點數門檻已達，但年收入條件尚未符合。",

  "benefits.unlocked": "已達成",
  "benefits.locked": "尚未達成",
};
