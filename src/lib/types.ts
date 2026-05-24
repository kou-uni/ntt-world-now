export type Region =
  | "global"
  | "north-america"
  | "europe"
  | "southeast-asia"
  | "middle-east"
  | "africa"
  | "latin-america"
  | "japan";

export type Tier = "T1" | "T2" | "T3" | "T4" | "T5" | "T6";

export type TierMeta = {
  id: Tier;
  label: string;
  description: string;
};

export const TIERS: TierMeta[] = [
  { id: "T1", label: "国際通信社", description: "Reuters, Bloomberg, AP等 — 速報性・事実報道" },
  { id: "T2", label: "主要一般紙", description: "BBC, NYT, FT等 — 編集ガバナンス・国際信頼" },
  { id: "T3", label: "テレコム業界紙", description: "Light Reading, Mobile World Live等 — 業界深度" },
  { id: "T4", label: "テックメディア", description: "TechCrunch, Wired等 — トレンド・製品分析" },
  { id: "T5", label: "投資・金融", description: "Nikkei Asia, Seeking Alpha等 — 市場・株主視点" },
  { id: "T6", label: "VC・思想", description: "a16z, Stratechery等 — 戦略・未来予測" },
];

export type RegionMeta = {
  id: Region;
  label: string;
};

export const REGIONS: RegionMeta[] = [
  { id: "global", label: "グローバル" },
  { id: "north-america", label: "北米" },
  { id: "europe", label: "欧州" },
  { id: "southeast-asia", label: "東南アジア" },
  { id: "middle-east", label: "中東" },
  { id: "africa", label: "アフリカ" },
  { id: "latin-america", label: "中南米" },
  { id: "japan", label: "日本" },
];

export type SourceId = string;

export type Source = {
  id: SourceId;
  name: string;
  shortName: string;
  homepage: string;
  feedUrl: string;
  feedType: "rss" | "scrape";
  tier: Tier;
  region: Region;
  /** このソースがGoogle Newsか直接RSSか — UI表示用 */
  isAggregator?: boolean;
  /** 取得した記事をNTTキーワードでフィルタするか（直接RSSは true、Google Newsは false：クエリ済み） */
  filterByKeywords?: boolean;
};

export type NewsItem = {
  id: string;
  sourceId: SourceId;
  title: string;
  url: string;
  publishedAt: string;
  /** 記事内で検出されたNTT関連ブランド（旧買収企業名等） */
  matchedBrands?: string[];
};

export type SourceFeed = {
  sourceId: SourceId;
  items: NewsItem[];
  fetchedAt: string;
  error?: string;
};
