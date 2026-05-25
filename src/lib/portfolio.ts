/**
 * NTT DOCOMO Ventures ポートフォリオ会社データ
 *
 * 出典: https://www.nttdocomo-v.com/en/portfolio/ (165社)
 * 取得日: 2026-05-25
 *
 * 各社のステータス:
 * - active   : 現役の被投資企業
 * - ipo      : 公開済み (TSE, Nasdaq, NYSE 等)
 * - acquired : 他社に買収済み（または親会社統合済み）
 * - unicorn  : ユニコーン認定（評価額 $1B+）※currently active と併存
 */

export type PortfolioCategory =
  | "AI"
  | "Security"
  | "Cloud/Infra"
  | "Communication"
  | "DeepTech"
  | "Mobility"
  | "Healthcare"
  | "Fintech"
  | "IoT"
  | "Web3"
  | "Entertainment"
  | "Energy"
  | "DX/SaaS"
  | "Marketing"
  | "Other";

export type PortfolioRegion =
  | "japan"
  | "north-america"
  | "europe"
  | "israel"
  | "asia-other"
  | "global";

export type PortfolioStatus = "active" | "ipo" | "acquired" | "unicorn";

export type PortfolioCompany = {
  id: string;
  name: string;
  category: PortfolioCategory;
  region: PortfolioRegion;
  status: PortfolioStatus;
  /** 注目度: ユニコーン・大型exit・戦略的に重要なものは true */
  highlight?: boolean;
  homepage?: string;
  description: string;
  /** Google News 検索のためのキーワード（社名で一意でない場合のみ補助） */
  searchKeywords?: string[];
  /** Exit ノート（買収済みの場合） */
  exitNote?: string;
};

export const PORTFOLIO: PortfolioCompany[] = [
  // ========================================================================
  // 🦄 UNICORNS (公式公表7社)
  // ========================================================================
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    category: "AI",
    region: "global",
    status: "unicorn",
    highlight: true,
    homepage: "https://elevenlabs.io/",
    description: "生成AIによる人間らしい音声合成。Voice AI ユニコーン",
  },
  {
    id: "ayar-labs",
    name: "Ayar Labs",
    category: "DeepTech",
    region: "north-america",
    status: "unicorn",
    highlight: true,
    homepage: "https://ayarlabs.com/",
    description: "光I/O (シリコンフォトニクス) チップ。2024年ユニコーン",
  },
  {
    id: "wasabi",
    name: "Wasabi Technologies",
    category: "Cloud/Infra",
    region: "north-america",
    status: "unicorn",
    highlight: true,
    homepage: "https://wasabi.com/",
    description: "高性能・低価格クラウドストレージ",
    searchKeywords: ["Wasabi Technologies"],
  },
  {
    id: "commonwealth-fusion",
    name: "Commonwealth Fusion Systems",
    category: "Energy",
    region: "north-america",
    status: "active",
    highlight: true,
    homepage: "https://cfs.energy/",
    description: "MIT発の核融合発電スタートアップ",
  },
  {
    id: "astranis",
    name: "Astranis Space Technologies",
    category: "DeepTech",
    region: "north-america",
    status: "active",
    highlight: true,
    homepage: "https://www.astranis.com/",
    description: "小型静止衛星による通信インフラ",
  },
  {
    id: "sakana-ai",
    name: "Sakana AI",
    category: "AI",
    region: "japan",
    status: "active",
    highlight: true,
    homepage: "https://sakana.ai/",
    description: "進化的アプローチで基盤モデルを開発する日本のAI企業",
  },

  // ========================================================================
  // 🏢 IPO COMPANIES (上場済み)
  // ========================================================================
  {
    id: "soracom",
    name: "Soracom",
    category: "IoT",
    region: "japan",
    status: "ipo",
    highlight: true,
    homepage: "https://soracom.io/",
    description: "IoT通信プラットフォーム。2024年3月TSE上場",
    searchKeywords: ["SORACOM"],
  },
  {
    id: "abeja",
    name: "ABEJA",
    category: "AI",
    region: "japan",
    status: "ipo",
    highlight: true,
    homepage: "https://www.abejainc.com/",
    description: "AI/BigDataソリューション。TSE上場",
  },
  {
    id: "riskified",
    name: "Riskified",
    category: "Fintech",
    region: "israel",
    status: "ipo",
    highlight: true,
    homepage: "https://www.riskified.com/",
    description: "EC向け不正検知・チャージバック保証 (NYSE: RSKD)",
  },
  {
    id: "safie",
    name: "Safie",
    category: "Security",
    region: "japan",
    status: "ipo",
    homepage: "https://safie.co.jp/",
    description: "クラウドカメラ・映像セキュリティ",
  },
  {
    id: "ga-technologies",
    name: "GA technologies",
    category: "DX/SaaS",
    region: "japan",
    status: "ipo",
    homepage: "https://www.ga-tech.co.jp/",
    description: "不動産DXプラットフォーム RENOSY",
  },
  {
    id: "medley",
    name: "Medley",
    category: "Healthcare",
    region: "japan",
    status: "ipo",
    homepage: "https://www.medley.jp/",
    description: "医療プラットフォーム CLINICS, JobMedley",
  },
  {
    id: "shift",
    name: "SHIFT",
    category: "DX/SaaS",
    region: "japan",
    status: "ipo",
    homepage: "https://www.shiftinc.jp/",
    description: "ソフトウェアテスト・品質保証",
    searchKeywords: ["SHIFT Inc"],
  },
  {
    id: "gumi",
    name: "gumi",
    category: "Entertainment",
    region: "japan",
    status: "ipo",
    homepage: "https://gumi.co.jp/",
    description: "モバイルゲーム開発",
  },
  {
    id: "kaizen-platform",
    name: "Kaizen Platform",
    category: "Marketing",
    region: "japan",
    status: "ipo",
    homepage: "https://kaizenplatform.com/",
    description: "デジタル体験 (DX) 改善プラットフォーム",
  },
  {
    id: "spacemarket",
    name: "Spacemarket",
    category: "DX/SaaS",
    region: "japan",
    status: "ipo",
    homepage: "https://www.spacemarket.com/",
    description: "スペースシェアリング",
  },
  {
    id: "now-gg",
    name: "now.gg",
    category: "Entertainment",
    region: "north-america",
    status: "ipo",
    homepage: "https://now.gg/",
    description: "クラウドゲーミングプラットフォーム",
  },
  {
    id: "sitetracker",
    name: "Sitetracker",
    category: "DX/SaaS",
    region: "north-america",
    status: "ipo",
    homepage: "https://www.sitetracker.com/",
    description: "通信・エネルギーインフラ展開管理SaaS",
  },
  {
    id: "qd-laser",
    name: "QD Laser",
    category: "DeepTech",
    region: "japan",
    status: "ipo",
    homepage: "https://www.qdlaser.com/",
    description: "量子ドットレーザー・網膜走査ディスプレイ",
  },
  {
    id: "cyber-security-cloud",
    name: "Cyber Security Cloud",
    category: "Security",
    region: "japan",
    status: "ipo",
    homepage: "https://www.cscloud.co.jp/",
    description: "WAF・AIセキュリティ",
  },
  {
    id: "photosynth",
    name: "Photosynth",
    category: "IoT",
    region: "japan",
    status: "ipo",
    homepage: "https://photosynth.co.jp/",
    description: "スマートロック Akerun",
  },
  {
    id: "retty",
    name: "Retty",
    category: "DX/SaaS",
    region: "japan",
    status: "ipo",
    homepage: "https://corp.retty.me/",
    description: "実名グルメサービス",
  },
  {
    id: "mfs",
    name: "MFS (MoneyForward Subsidiary)",
    category: "Fintech",
    region: "japan",
    status: "ipo",
    homepage: "https://www.mortgagefactory.jp/",
    description: "住宅ローン比較プラットフォーム MOGECHECK",
    searchKeywords: ["MFS Inc"],
  },
  {
    id: "otonomo",
    name: "Otonomo Technologies",
    category: "Mobility",
    region: "israel",
    status: "ipo",
    homepage: "https://otonomo.io/",
    description: "コネクテッドカーデータプラットフォーム",
  },
  {
    id: "elements",
    name: "ELEMENTS",
    category: "Entertainment",
    region: "japan",
    status: "ipo",
    homepage: "https://elementsinc.jp/",
    description: "AI・XR・生体認証ソリューション",
  },
  {
    id: "fastlabel",
    name: "FastLabel",
    category: "AI",
    region: "japan",
    status: "ipo",
    homepage: "https://fastlabel.ai/",
    description: "AI開発向けデータプラットフォーム",
  },

  // ========================================================================
  // 🤝 ACQUIRED COMPANIES (大型exit中心)
  // ========================================================================
  {
    id: "auth0",
    name: "Auth0",
    category: "Security",
    region: "north-america",
    status: "acquired",
    highlight: true,
    homepage: "https://auth0.com/",
    description: "ID認証プラットフォーム",
    exitNote: "2021年 Okta が $6.5B で買収",
  },
  {
    id: "mist-systems",
    name: "Mist Systems",
    category: "Cloud/Infra",
    region: "north-america",
    status: "acquired",
    highlight: true,
    homepage: "https://www.juniper.net/us/en/products/wireless/mist.html",
    description: "AI駆動の無線ネットワーク",
    exitNote: "2019年 Juniper Networks が $405M で買収",
  },
  {
    id: "skydio",
    name: "Skydio",
    category: "DeepTech",
    region: "north-america",
    status: "acquired",
    highlight: true,
    homepage: "https://www.skydio.com/",
    description: "自律飛行ドローン",
    exitNote: "ユニコーン、企業向けドローンリーダー",
  },
  {
    id: "threatquotient",
    name: "ThreatQuotient",
    category: "Security",
    region: "north-america",
    status: "acquired",
    homepage: "https://www.threatq.com/",
    description: "脅威インテリジェンス管理プラットフォーム",
    exitNote: "2025年 Securonix が買収",
  },
  {
    id: "volocopter",
    name: "Volocopter",
    category: "Mobility",
    region: "europe",
    status: "acquired",
    homepage: "https://www.volocopter.com/",
    description: "都市型eVTOL (空飛ぶタクシー)",
  },
  {
    id: "trifacta",
    name: "Trifacta",
    category: "Cloud/Infra",
    region: "north-america",
    status: "acquired",
    homepage: "https://www.trifacta.com/",
    description: "データラングリング",
    exitNote: "2022年 Alteryx が $400M で買収",
  },
  {
    id: "jumpcloud",
    name: "JumpCloud",
    category: "Security",
    region: "north-america",
    status: "active",
    highlight: true,
    homepage: "https://jumpcloud.com/",
    description: "オープンディレクトリ・ゼロトラスト管理",
  },
  {
    id: "counterack",
    name: "CounterTack",
    category: "Security",
    region: "north-america",
    status: "acquired",
    description: "エンドポイント脅威検知 (現 GoSecure)",
    exitNote: "GoSecure に統合",
  },
  {
    id: "wiliot",
    name: "Wiliot",
    category: "IoT",
    region: "israel",
    status: "active",
    homepage: "https://www.wiliot.com/",
    description: "Bluetoothベース無電源IoTセンサー",
  },
  {
    id: "vdoo",
    name: "VDOO",
    category: "Security",
    region: "israel",
    status: "acquired",
    description: "IoT/組込みデバイスセキュリティ",
    exitNote: "JFrog が買収",
  },
  {
    id: "cliqr",
    name: "Cliqr Technologies",
    category: "Cloud/Infra",
    region: "north-america",
    status: "acquired",
    description: "ハイブリッドクラウド管理",
    exitNote: "Cisco が買収 ($260M)",
  },
  {
    id: "enterprisedb",
    name: "EnterpriseDB",
    category: "Cloud/Infra",
    region: "north-america",
    status: "active",
    highlight: true,
    homepage: "https://www.enterprisedb.com/",
    description: "PostgreSQL エンタープライズ版",
  },
  {
    id: "kinvey",
    name: "Kinvey",
    category: "Cloud/Infra",
    region: "north-america",
    status: "acquired",
    description: "モバイルバックエンドBaaS",
    exitNote: "Progress Software が買収",
  },
  {
    id: "inbenta",
    name: "Inbenta",
    category: "AI",
    region: "north-america",
    status: "acquired",
    homepage: "https://www.inbenta.com/",
    description: "対話型AI・カスタマーサポート",
  },
  {
    id: "fyusion",
    name: "Fyusion",
    category: "AI",
    region: "north-america",
    status: "acquired",
    description: "3Dビジョン・コンピュータビジョン",
  },

  // ========================================================================
  // 🚀 ACTIVE COMPANIES
  // ========================================================================
  {
    id: "turing",
    name: "Turing",
    category: "AI",
    region: "japan",
    status: "active",
    highlight: true,
    homepage: "https://tur.ing/",
    description: "完全自動運転を生成AIで実現",
    searchKeywords: ["Turing Motors"],
  },
  {
    id: "hayden-ai",
    name: "Hayden AI",
    category: "AI",
    region: "north-america",
    status: "active",
    homepage: "https://www.hayden.ai/",
    description: "コンピュータビジョン×都市インフラ",
  },
  {
    id: "alation",
    name: "Alation",
    category: "Cloud/Infra",
    region: "north-america",
    status: "active",
    highlight: true,
    homepage: "https://www.alation.com/",
    description: "データカタログ・データインテリジェンス",
  },
  {
    id: "tiledb",
    name: "TileDB",
    category: "Cloud/Infra",
    region: "north-america",
    status: "active",
    homepage: "https://tiledb.com/",
    description: "ゲノム・地理空間データ向け宇宙汎用DB",
  },
  {
    id: "rapidsos",
    name: "RapidSOS",
    category: "Communication",
    region: "north-america",
    status: "active",
    highlight: true,
    homepage: "https://rapidsos.com/",
    description: "次世代緊急通報プラットフォーム",
  },
  {
    id: "cloudian",
    name: "Cloudian",
    category: "Cloud/Infra",
    region: "north-america",
    status: "active",
    highlight: true,
    homepage: "https://cloudian.com/",
    description: "オンプレ・ハイブリッドオブジェクトストレージ",
  },
  {
    id: "pixie-dust",
    name: "Pixie Dust Technologies",
    category: "DeepTech",
    region: "japan",
    status: "active",
    homepage: "https://pixiedusttech.com/",
    description: "波動制御技術 (超音波・空間音響等)",
  },
  {
    id: "bastion-platforms",
    name: "Bastion Platforms",
    category: "Security",
    region: "north-america",
    status: "active",
    description: "セキュリティクラウドプラットフォーム",
  },
  {
    id: "securenavi",
    name: "SecureNavi",
    category: "Security",
    region: "japan",
    status: "active",
    homepage: "https://secure-navi.jp/",
    description: "ISMS・Pマーク認証取得支援SaaS",
  },
  {
    id: "fluxinc",
    name: "FLUX",
    category: "Energy",
    region: "japan",
    status: "active",
    homepage: "https://flux.jp/",
    description: "電力データ・エネルギーマネジメント",
  },
  {
    id: "happy-robot",
    name: "HappyRobot",
    category: "IoT",
    region: "japan",
    status: "active",
    description: "ロボティクス・IoT",
  },
  {
    id: "doppel",
    name: "Doppel",
    category: "Entertainment",
    region: "north-america",
    status: "active",
    homepage: "https://doppel.com/",
    description: "AI生成エンタメ・XR",
  },
  {
    id: "blocksmith",
    name: "BLOCKSMITH&Co.",
    category: "Web3",
    region: "japan",
    status: "active",
    description: "Web3・ブロックチェーンソリューション",
  },
  {
    id: "ugo",
    name: "ugo",
    category: "Mobility",
    region: "japan",
    status: "active",
    homepage: "https://ugo.plus/",
    description: "業務用アバターロボット",
    searchKeywords: ["ugo robot"],
  },
  {
    id: "josys",
    name: "Josys",
    category: "DX/SaaS",
    region: "japan",
    status: "active",
    homepage: "https://www.josys.com/",
    description: "SaaS・デバイス統合管理",
  },
  {
    id: "mapped",
    name: "Mapped",
    category: "DX/SaaS",
    region: "north-america",
    status: "active",
    homepage: "https://www.mapped.com/",
    description: "ビルテック・施設データ統合",
  },
  {
    id: "ev-motors-japan",
    name: "EV Motors Japan",
    category: "Mobility",
    region: "japan",
    status: "active",
    homepage: "https://evm-j.com/",
    description: "商用EV (バス・トラック) 開発",
  },
  {
    id: "whill",
    name: "WHILL",
    category: "Mobility",
    region: "japan",
    status: "active",
    homepage: "https://whill.inc/",
    description: "近距離モビリティ (電動車椅子等)",
  },
  {
    id: "techtouch",
    name: "Techtouch",
    category: "DX/SaaS",
    region: "japan",
    status: "active",
    homepage: "https://techtouch.jp/",
    description: "業務システム向けデジタルアダプション",
  },

  // ========================================================================
  // その他のActiveソート用 (上記以外、簡潔記載)
  // ========================================================================
  { id: "ecommit", name: "ECOMMIT", category: "DX/SaaS", region: "japan", status: "active", description: "EC物流DX" },
  { id: "new-space-intelligence", name: "New Space Intelligence", category: "DeepTech", region: "japan", status: "active", description: "衛星データ解析" },
  { id: "paradigm-ai", name: "Paradigm AI", category: "AI", region: "global", status: "active", description: "AIプラットフォーム" },
  { id: "miresso", name: "MiRESSO", category: "Healthcare", region: "japan", status: "active", description: "医療・ヘルスケア" },
  { id: "linq", name: "LinQ", category: "Communication", region: "japan", status: "active", description: "コミュニケーション" },
  { id: "argu-eye", name: "Argu Eye", category: "DeepTech", region: "global", status: "active", description: "XR・ビジョン技術" },
  { id: "yoriso", name: "Yoriso", category: "Healthcare", region: "japan", status: "active", description: "医療・終活" },
  { id: "lisse", name: "Lisse", category: "Healthcare", region: "japan", status: "active", description: "医療・ヘルスケア" },
  { id: "phealth-tech", name: "Personal Health Tech", category: "Healthcare", region: "japan", status: "active", description: "個人健康データ" },
  { id: "jiffcy", name: "Jiffcy", category: "DX/SaaS", region: "japan", status: "active", description: "モバイルSaaS" },
  { id: "biome", name: "Biome", category: "Other", region: "japan", status: "active", description: "生物多様性データ" },
  { id: "asilla", name: "Asilla", category: "IoT", region: "global", status: "active", description: "AI行動解析" },
  { id: "meetsmore", name: "MeetsMore", category: "DX/SaaS", region: "japan", status: "active", description: "プロ向けマッチング" },
  { id: "openrec", name: "OPENREC", category: "Entertainment", region: "japan", status: "active", description: "ゲーム配信" },
  { id: "tacoms", name: "tacoms", category: "IoT", region: "japan", status: "active", description: "飲食店IoT" },
  { id: "total-future-healthcare", name: "Total Future Healthcare", category: "Healthcare", region: "global", status: "active", description: "医療プラットフォーム" },
  { id: "fogg", name: "Fogg", category: "AI", region: "global", status: "active", description: "AIマーケティング" },
  { id: "dhost-global", name: "dhost Global", category: "Cloud/Infra", region: "global", status: "active", description: "クラウドSaaS" },
  { id: "tvision", name: "TVision Insights", category: "Marketing", region: "global", status: "active", description: "TV視聴計測AI" },
  { id: "soxai", name: "SOXAI", category: "AI", region: "japan", status: "active", description: "スマートリング・ヘルスデータ" },
  { id: "mint-town", name: "Mint Town", category: "Fintech", region: "japan", status: "active", description: "金融サービス" },
  { id: "parallel", name: "Parallel", category: "Cloud/Infra", region: "global", status: "active", description: "クラウドインフラ" },
  { id: "ai-model", name: "AI model", category: "AI", region: "japan", status: "active", description: "AIモデル開発" },
  { id: "minto", name: "Minto", category: "DX/SaaS", region: "japan", status: "active", description: "デジタルサービス" },
  { id: "fez", name: "FEZ", category: "Entertainment", region: "japan", status: "active", description: "メディア・コンテンツ" },
  { id: "polipoli", name: "PoliPoli", category: "DX/SaaS", region: "japan", status: "active", description: "政治家×市民の対話プラットフォーム" },
  { id: "goopass", name: "GOOPASS", category: "DX/SaaS", region: "japan", status: "active", description: "カメラ機材サブスク" },
  { id: "metawave", name: "Metawave", category: "DeepTech", region: "north-america", status: "active", description: "メタマテリアル・5G/AVレーダー" },
  { id: "light-field-lab", name: "Light Field Lab", category: "DeepTech", region: "north-america", status: "active", description: "ホログラフィックディスプレイ" },
  { id: "realeyes", name: "Realeyes", category: "Marketing", region: "europe", status: "active", description: "感情AI・広告解析" },
  { id: "rafay", name: "Rafay Systems", category: "Cloud/Infra", region: "north-america", status: "active", description: "Kubernetes管理プラットフォーム" },
  { id: "matchmove", name: "MatchMove", category: "Fintech", region: "asia-other", status: "active", description: "シンガポール発BaaS" },
];

/** 注目企業のみ抽出（Heroカード等で使用） */
export const HIGHLIGHTS = PORTFOLIO.filter((c) => c.highlight);

/** ユニコーン */
export const UNICORNS = PORTFOLIO.filter((c) => c.status === "unicorn");

/** カテゴリ別グループ */
export function groupByCategory(): Record<PortfolioCategory, PortfolioCompany[]> {
  const groups = {} as Record<PortfolioCategory, PortfolioCompany[]>;
  for (const c of PORTFOLIO) {
    if (!groups[c.category]) groups[c.category] = [];
    groups[c.category].push(c);
  }
  return groups;
}

/** ステータス別グループ */
export function groupByStatus(): Record<PortfolioStatus, PortfolioCompany[]> {
  const groups = {} as Record<PortfolioStatus, PortfolioCompany[]>;
  for (const c of PORTFOLIO) {
    if (!groups[c.status]) groups[c.status] = [];
    groups[c.status].push(c);
  }
  return groups;
}

/** 検索用に各社のキーワードを構築 */
export function searchQueryFor(c: PortfolioCompany): string {
  const keywords = c.searchKeywords ?? [c.name];
  return keywords.map((k) => `"${k}"`).join(" OR ");
}

/** 注目企業のニュースを取得するためのGoogle News URL（OR検索） */
export function highlightNewsFeedUrl(): string {
  const orClause = HIGHLIGHTS.map((c) => searchQueryFor(c)).join(" OR ");
  const q = encodeURIComponent(orClause);
  return `https://news.google.com/rss/search?q=${q}&hl=en-US&gl=US&ceid=US:en`;
}

export const CATEGORIES: PortfolioCategory[] = [
  "AI",
  "Security",
  "Cloud/Infra",
  "DeepTech",
  "Communication",
  "IoT",
  "Mobility",
  "Healthcare",
  "Fintech",
  "Web3",
  "Entertainment",
  "Energy",
  "DX/SaaS",
  "Marketing",
  "Other",
];

export const STATUS_LABELS: Record<PortfolioStatus, string> = {
  unicorn: "Unicorn",
  ipo: "IPO",
  acquired: "Acquired",
  active: "Active",
};

export const REGION_LABELS: Record<PortfolioRegion, string> = {
  japan: "Japan",
  "north-america": "N. America",
  europe: "Europe",
  israel: "Israel",
  "asia-other": "Asia",
  global: "Global",
};
