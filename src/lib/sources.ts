import type { Source, PaywallLevel } from "./types";

/**
 * NTTグループ関連の検索キーワード。
 * 「NTT」名を含まない旧買収ブランド・VC投資先まで含める。
 * 詳細はメモリ project_nApp_ntt_brands.md 参照。
 */
export const NTT_BRANDS = {
  core: ["NTT", "DOCOMO", "NTT DATA", "NTT Ltd"],
  // NTT DATA系（コンサル/SI）
  dataGroup: ["Dimension Data", "everis", "itelligence", "Sapphire Systems"],
  // NTT Ltd系（DC/ネットワーク/セキュリティ）
  ltdGroup: [
    "Arkadin",
    "e-shelter",
    "Netmagic",
    "RagingWire",
    "Secure-24",
    "WhiteHat Security",
    "Gyron",
    "Transatel",
    "Oakton",
    "Emerio",
    "CAPSiDE",
  ],
  // 最新買収 2025-2026
  recent: ["Zero & One", "Niveus Solutions", "Applicable"],
  // DOCOMO Ventures主要投資先
  vcPortfolio: [
    "Dialpad",
    "Auth0",
    "Riskified",
    "Ayar Labs",
    "ElevenLabs",
    "Wasabi",
    "Soracom",
    "ABEJA",
    "ThreatQuotient",
  ],
  // 資本提携
  affiliates: ["Globe Telecom"],
} as const;

export const ALL_BRAND_KEYWORDS: string[] = [
  ...NTT_BRANDS.core,
  ...NTT_BRANDS.dataGroup,
  ...NTT_BRANDS.ltdGroup,
  ...NTT_BRANDS.recent,
  ...NTT_BRANDS.vcPortfolio,
  ...NTT_BRANDS.affiliates,
];

/**
 * Google News RSS 用クエリ。OR検索。
 * 「NTT」だけだと野球（NTT West vs ...）が混ざるのでノイズ除外を入れる。
 */
function gnewsQuery(brands: readonly string[], extraExclude = ""): string {
  const orClause = brands.map((b) => `"${b}"`).join(" OR ");
  const exclude = "-野球 -baseball -football -hockey -サッカー";
  return encodeURIComponent(`(${orClause}) ${exclude} ${extraExclude}`.trim());
}

function gnewsRss(region: {
  hl: string;
  gl: string;
  ceid: string;
}, q: string): string {
  return `https://news.google.com/rss/search?q=${q}&hl=${region.hl}&gl=${region.gl}&ceid=${region.ceid}`;
}

// 旧買収ブランド系（地域報道で頻出）
const BRAND_QUERY = gnewsQuery([
  ...NTT_BRANDS.core,
  ...NTT_BRANDS.dataGroup,
  ...NTT_BRANDS.ltdGroup,
  ...NTT_BRANDS.recent,
  ...NTT_BRANDS.affiliates,
]);

// VC関連ニュース用（NTT AND 投資先）
const VC_QUERY = encodeURIComponent(
  `"NTT" (${NTT_BRANDS.vcPortfolio.map((b) => `"${b}"`).join(" OR ")})`
);

export const SOURCES: Source[] = [
  // ========================================================================
  // GLOBAL — T1 国際通信社 / T2 主要紙 / T3 業界紙 / T4 テック
  // ========================================================================
  {
    id: "reuters-tech",
    name: "Reuters Technology",
    shortName: "Reuters",
    homepage: "https://www.reuters.com/technology/",
    feedUrl: gnewsRss(
      { hl: "en-US", gl: "US", ceid: "US:en" },
      encodeURIComponent(`site:reuters.com (${["NTT", "DOCOMO", "NTT DATA", "Dimension Data"].map((b) => `"${b}"`).join(" OR ")})`)
    ),
    feedType: "rss",
    tier: "T1",
    region: "global",
    isAggregator: true,
    paywall: "free",
  },
  {
    id: "bloomberg",
    name: "Bloomberg",
    shortName: "Bloomberg",
    homepage: "https://www.bloomberg.com/",
    feedUrl: gnewsRss(
      { hl: "en-US", gl: "US", ceid: "US:en" },
      encodeURIComponent(`site:bloomberg.com (${["NTT", "DOCOMO", "NTT DATA"].map((b) => `"${b}"`).join(" OR ")})`)
    ),
    feedType: "rss",
    tier: "T1",
    region: "global",
    isAggregator: true,
    paywall: "hard",
  },
  {
    id: "ft",
    name: "Financial Times",
    shortName: "FT",
    homepage: "https://www.ft.com/",
    feedUrl: gnewsRss(
      { hl: "en-US", gl: "US", ceid: "US:en" },
      // "Company Announcement" 転載ノイズを除外
      encodeURIComponent(`site:ft.com ("NTT" OR "DOCOMO" OR "NTT Data" OR "Dimension Data") -"Company Announcement"`)
    ),
    feedType: "rss",
    tier: "T2",
    region: "global",
    isAggregator: true,
    paywall: "hard",
  },
  {
    id: "bbc-business",
    name: "BBC Business",
    shortName: "BBC",
    homepage: "https://www.bbc.com/business",
    feedUrl: gnewsRss(
      { hl: "en-GB", gl: "GB", ceid: "GB:en" },
      encodeURIComponent(`site:bbc.com (${["NTT", "DOCOMO", "Dimension Data"].map((b) => `"${b}"`).join(" OR ")})`)
    ),
    feedType: "rss",
    tier: "T2",
    region: "global",
    isAggregator: true,
  },
  {
    id: "lightreading",
    name: "Light Reading",
    shortName: "Light Reading",
    homepage: "https://www.lightreading.com/",
    feedUrl: gnewsRss(
      { hl: "en-US", gl: "US", ceid: "US:en" },
      encodeURIComponent(`site:lightreading.com (${["NTT", "DOCOMO"].map((b) => `"${b}"`).join(" OR ")})`)
    ),
    feedType: "rss",
    tier: "T3",
    region: "global",
    isAggregator: true,
  },
  {
    id: "telecoms-com",
    name: "Telecoms.com",
    shortName: "Telecoms.com",
    homepage: "https://www.telecoms.com/",
    feedUrl: gnewsRss(
      { hl: "en-US", gl: "US", ceid: "US:en" },
      encodeURIComponent(`site:telecoms.com (${["NTT", "DOCOMO"].map((b) => `"${b}"`).join(" OR ")})`)
    ),
    feedType: "rss",
    tier: "T3",
    region: "global",
    isAggregator: true,
  },
  // 業界専門紙: Mobile World Live (直接RSS、NTT関連だけ品質スコアで自動絞り込み)
  {
    id: "mobile-world-live",
    name: "Mobile World Live",
    shortName: "MWL",
    homepage: "https://www.mobileworldlive.com/",
    feedUrl: "https://www.mobileworldlive.com/feed/",
    feedType: "rss",
    tier: "T3",
    region: "global",
    isAggregator: false,
    paywall: "free",
  },
  {
    id: "capacity-media",
    name: "Capacity Media",
    shortName: "Capacity",
    homepage: "https://www.capacitymedia.com/",
    feedUrl: gnewsRss(
      { hl: "en-US", gl: "US", ceid: "US:en" },
      encodeURIComponent(`site:capacitymedia.com (${["NTT", "DOCOMO", "Dimension Data"].map((b) => `"${b}"`).join(" OR ")})`)
    ),
    feedType: "rss",
    tier: "T3",
    region: "global",
    isAggregator: true,
  },
  {
    id: "techcrunch",
    name: "TechCrunch",
    shortName: "TechCrunch",
    homepage: "https://techcrunch.com/",
    feedUrl: gnewsRss(
      { hl: "en-US", gl: "US", ceid: "US:en" },
      // VC投資先名（Dialpad/Ayar Labs/ElevenLabs等）はSpotifyノイズを呼ぶので除外
      encodeURIComponent(`site:techcrunch.com ("NTT" OR "DOCOMO" OR "NTT Data")`)
    ),
    feedType: "rss",
    tier: "T4",
    region: "global",
    isAggregator: true,
  },
  {
    id: "theverge",
    name: "The Verge",
    shortName: "Verge",
    homepage: "https://www.theverge.com/",
    feedUrl: gnewsRss(
      { hl: "en-US", gl: "US", ceid: "US:en" },
      encodeURIComponent(`site:theverge.com (${["NTT", "DOCOMO"].map((b) => `"${b}"`).join(" OR ")})`)
    ),
    feedType: "rss",
    tier: "T4",
    region: "global",
    isAggregator: true,
  },
  {
    id: "wired",
    name: "WIRED",
    shortName: "WIRED",
    homepage: "https://www.wired.com/",
    feedUrl: gnewsRss(
      { hl: "en-US", gl: "US", ceid: "US:en" },
      encodeURIComponent(`site:wired.com (${["NTT", "DOCOMO"].map((b) => `"${b}"`).join(" OR ")})`)
    ),
    feedType: "rss",
    tier: "T4",
    region: "global",
    isAggregator: true,
  },
  // (削除: The Information - 完全有料サイト)
  // (削除: Seeking Alpha - 99%が目次ノイズ、株価ページ羅列)
  // (削除: Barron's - NTT直接記事が極めて少ない・ペイウォール強)

  // T5 投資・金融
  {
    id: "nikkei-asia",
    name: "Nikkei Asia",
    shortName: "Nikkei Asia",
    homepage: "https://asia.nikkei.com/",
    feedUrl: gnewsRss(
      { hl: "en-US", gl: "US", ceid: "US:en" },
      encodeURIComponent(`site:asia.nikkei.com (${["NTT", "DOCOMO"].map((b) => `"${b}"`).join(" OR ")})`)
    ),
    feedType: "rss",
    tier: "T5",
    region: "global",
    isAggregator: true,
  },

  // T6 VC・思想 (削除: Stratechery 完全有料 / a16z NTT言及ほぼゼロ / VC Watch ノイズ多)
  //  → 後段の Phase 3 で「中程度品質タブ」を導入する際に復活予定

  // ========================================================================
  // NORTH AMERICA
  // ========================================================================
  {
    id: "gnews-us",
    name: "米国メディア（横断）",
    shortName: "US",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "en-US", gl: "US", ceid: "US:en" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "north-america",
    isAggregator: true,
  },
  {
    id: "gnews-canada",
    name: "カナダメディア（横断）",
    shortName: "Canada",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "en-CA", gl: "CA", ceid: "CA:en" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "north-america",
    isAggregator: true,
  },

  // ========================================================================
  // EUROPE
  // ========================================================================
  {
    id: "gnews-uk",
    name: "英国メディア（横断）",
    shortName: "UK",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "en-GB", gl: "GB", ceid: "GB:en" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "europe",
    isAggregator: true,
  },
  {
    id: "gnews-germany",
    name: "ドイツメディア（横断）",
    shortName: "Germany",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "de", gl: "DE", ceid: "DE:de" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "europe",
    isAggregator: true,
  },
  {
    id: "gnews-france",
    name: "フランスメディア（横断）",
    shortName: "France",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "fr", gl: "FR", ceid: "FR:fr" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "europe",
    isAggregator: true,
  },
  {
    id: "gnews-italy",
    name: "イタリアメディア（横断）",
    shortName: "Italy",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "it", gl: "IT", ceid: "IT:it" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "europe",
    isAggregator: true,
  },
  {
    id: "gnews-spain",
    name: "スペインメディア（横断）",
    shortName: "Spain",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "es", gl: "ES", ceid: "ES:es" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "europe",
    isAggregator: true,
  },

  // ========================================================================
  // SOUTHEAST ASIA
  // ========================================================================
  {
    id: "gnews-singapore",
    name: "シンガポールメディア",
    shortName: "Singapore",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "en-SG", gl: "SG", ceid: "SG:en" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "southeast-asia",
    isAggregator: true,
  },
  {
    id: "gnews-indonesia",
    name: "インドネシアメディア",
    shortName: "Indonesia",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "id", gl: "ID", ceid: "ID:id" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "southeast-asia",
    isAggregator: true,
  },
  {
    id: "gnews-philippines",
    name: "フィリピンメディア（Globe Telecom含む）",
    shortName: "Philippines",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss(
      { hl: "en-PH", gl: "PH", ceid: "PH:en" },
      encodeURIComponent(
        `("NTT" OR "DOCOMO" OR "Globe Telecom") -野球 -baseball -football`
      )
    ),
    feedType: "rss",
    tier: "T2",
    region: "southeast-asia",
    isAggregator: true,
  },
  {
    id: "gnews-thailand",
    name: "タイメディア",
    shortName: "Thailand",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "th", gl: "TH", ceid: "TH:th" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "southeast-asia",
    isAggregator: true,
  },
  {
    id: "gnews-vietnam",
    name: "ベトナムメディア",
    shortName: "Vietnam",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "vi", gl: "VN", ceid: "VN:vi" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "southeast-asia",
    isAggregator: true,
  },
  {
    id: "gnews-malaysia",
    name: "マレーシアメディア",
    shortName: "Malaysia",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "en-MY", gl: "MY", ceid: "MY:en" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "southeast-asia",
    isAggregator: true,
  },
  {
    id: "gnews-india",
    name: "インドメディア（Netmagic含む）",
    shortName: "India",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "en-IN", gl: "IN", ceid: "IN:en" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "southeast-asia",
    isAggregator: true,
  },

  // ========================================================================
  // MIDDLE EAST
  // ========================================================================
  {
    id: "gnews-uae",
    name: "UAEメディア（Zero & One含む）",
    shortName: "UAE",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "en-AE", gl: "AE", ceid: "AE:en" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "middle-east",
    isAggregator: true,
  },
  {
    id: "gnews-saudi",
    name: "サウジアラビアメディア",
    shortName: "Saudi Arabia",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "ar", gl: "SA", ceid: "SA:ar" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "middle-east",
    isAggregator: true,
  },
  {
    id: "gnews-israel",
    name: "イスラエルメディア（Riskified等）",
    shortName: "Israel",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "en-IL", gl: "IL", ceid: "IL:en" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "middle-east",
    isAggregator: true,
  },

  // ========================================================================
  // AFRICA
  // ========================================================================
  {
    id: "gnews-south-africa",
    name: "南アフリカメディア（Dimension Data発祥）",
    shortName: "South Africa",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "en-ZA", gl: "ZA", ceid: "ZA:en" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "africa",
    isAggregator: true,
  },
  {
    id: "gnews-nigeria",
    name: "ナイジェリアメディア",
    shortName: "Nigeria",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "en-NG", gl: "NG", ceid: "NG:en" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "africa",
    isAggregator: true,
  },
  {
    id: "gnews-kenya",
    name: "ケニアメディア",
    shortName: "Kenya",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "en-KE", gl: "KE", ceid: "KE:en" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "africa",
    isAggregator: true,
  },

  // ========================================================================
  // LATIN AMERICA
  // ========================================================================
  {
    id: "gnews-brazil",
    name: "ブラジルメディア（everis拠点）",
    shortName: "Brazil",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "pt-BR", gl: "BR", ceid: "BR:pt" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "latin-america",
    isAggregator: true,
  },
  {
    id: "gnews-mexico",
    name: "メキシコメディア",
    shortName: "Mexico",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss({ hl: "es-419", gl: "MX", ceid: "MX:es-419" }, BRAND_QUERY),
    feedType: "rss",
    tier: "T2",
    region: "latin-america",
    isAggregator: true,
  },

  // ========================================================================
  // JAPAN（世界の中の一つとして並列扱い）
  // ========================================================================
  {
    id: "gnews-japan",
    name: "日本メディア横断",
    shortName: "JP メディア",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss(
      { hl: "ja", gl: "JP", ceid: "JP:ja" },
      encodeURIComponent(`NTT -ラグビー -リーグワン -野球 -サッカー`)
    ),
    feedType: "rss",
    tier: "T2",
    region: "japan",
    isAggregator: true,
  },
  {
    id: "gnews-japan-tech",
    name: "日本テックメディア",
    shortName: "JP Tech",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss(
      { hl: "ja", gl: "JP", ceid: "JP:ja" },
      encodeURIComponent(
        `(site:itmedia.co.jp OR site:nikkei.com OR site:impress.co.jp OR site:techcrunch.com) NTT -ラグビー -野球`
      )
    ),
    feedType: "rss",
    tier: "T4",
    region: "japan",
    isAggregator: true,
  },
  {
    id: "gnews-japan-business",
    name: "日本ビジネス・投資",
    shortName: "JP Business",
    homepage: "https://news.google.com/",
    feedUrl: gnewsRss(
      { hl: "ja", gl: "JP", ceid: "JP:ja" },
      encodeURIComponent(
        `(site:nikkei.com OR site:diamond.jp OR site:toyokeizai.net OR site:reuters.com) NTT -ラグビー -野球`
      )
    ),
    feedType: "rss",
    tier: "T5",
    region: "japan",
    isAggregator: true,
  },
];

/**
 * ソースのpaywall度を返す（明示されてなければ ID から推定）
 * - hard: 強いペイウォール（Bloomberg, FT, WSJ, NYT, Barron's, The Information等）
 * - soft: 月数本無料系（Nikkei Asia 等）
 * - free: 無料 or 集約サービス（Google News横断、業界専門紙等）
 */
function inferPaywall(id: string, explicit?: PaywallLevel): PaywallLevel {
  if (explicit) return explicit;
  if (/bloomberg|ft$|wsj|nytimes|washingtonpost|barrons|the-information/.test(id))
    return "hard";
  if (/nikkei|le-monde/.test(id)) return "soft";
  return "free";
}

export function getSource(id: string): Source {
  const s = SOURCES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown source: ${id}`);
  return { ...s, paywall: inferPaywall(s.id, s.paywall) };
}

export function sourcesByRegion(region: string): Source[] {
  return SOURCES.filter((s) => s.region === region);
}
