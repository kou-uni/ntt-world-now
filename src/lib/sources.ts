export type SourceId =
  | "ntt"
  | "nttdata"
  | "docomo"
  | "nttud"
  | "ntt-east"
  | "ntt-west"
  | "ntt-global"
  | "docomo-business"
  | "media-ntt"
  | "soumu"
  | "kddi"
  | "softbank"
  | "rakuten-mobile";

export type SourceKind =
  | "primary"
  | "international"
  | "media"
  | "regulator"
  | "competitor";

export type Source = {
  id: SourceId;
  name: string;
  shortName: string;
  color: string;
  homepage: string;
  newsPage: string;
  feedType: "rss" | "scrape";
  feedUrl: string;
  kind: SourceKind;
  titleSelector?: string;
};

// Tab 1: 国内主要(順序はユーザー指定: N, データ, ドコモ, アーバン, 東日本, 西日本)
export const PRIMARY_SOURCES: Source[] = [
  {
    id: "ntt",
    name: "NTT(持株会社)",
    shortName: "N",
    color: "#0033A0",
    homepage: "https://group.ntt/jp/",
    newsPage: "https://group.ntt/jp/newsrelease/",
    feedType: "rss",
    feedUrl: "https://group.ntt/jp/newsrelease/rss/release.rdf",
    kind: "primary",
  },
  {
    id: "nttdata",
    name: "NTTデータ",
    shortName: "データ",
    color: "#1E4E9E",
    homepage: "https://www.nttdata.com/jp/ja/",
    newsPage: "https://www.nttdata.com/jp/ja/news/",
    feedType: "scrape",
    feedUrl: "https://www.nttdata.com/jp/ja/news/",
    kind: "primary",
  },
  {
    id: "docomo",
    name: "NTTドコモ",
    shortName: "ドコモ",
    color: "#CC0033",
    homepage: "https://www.docomo.ne.jp/",
    newsPage: "https://www.docomo.ne.jp/info/news_release/",
    feedType: "rss",
    feedUrl: "https://www.docomo.ne.jp/info/rss/news_release.rdf",
    kind: "primary",
  },
  {
    id: "nttud",
    name: "NTT都市開発",
    shortName: "アーバン",
    color: "#0F7B6C",
    homepage: "https://www.nttud.co.jp/",
    newsPage:
      "https://news.google.com/search?q=%22NTT%E9%83%BD%E5%B8%82%E9%96%8B%E7%99%BA%22&hl=ja&gl=JP&ceid=JP:ja",
    feedType: "rss",
    feedUrl:
      "https://news.google.com/rss/search?q=%22NTT%E9%83%BD%E5%B8%82%E9%96%8B%E7%99%BA%22&hl=ja&gl=JP&ceid=JP:ja",
    kind: "primary",
  },
  {
    id: "ntt-east",
    name: "NTT東日本",
    shortName: "東日本",
    color: "#E60012",
    homepage: "https://www.ntt-east.co.jp/",
    newsPage: "https://www.ntt-east.co.jp/release/",
    feedType: "rss",
    feedUrl: "https://www.ntt-east.co.jp/rss/release.rdf",
    kind: "primary",
  },
  {
    id: "ntt-west",
    name: "NTT西日本",
    shortName: "西日本",
    color: "#00A0E9",
    homepage: "https://www.ntt-west.co.jp/",
    newsPage: "https://www.ntt-west.co.jp/news/",
    feedType: "scrape",
    feedUrl: "https://www.ntt-west.co.jp/news/",
    kind: "primary",
  },
];

// Tab 2: 国外・関連
export const INTERNATIONAL_SOURCES: Source[] = [
  {
    id: "ntt-global",
    name: "NTT Global (EN)",
    shortName: "Global",
    color: "#1A1A1A",
    homepage: "https://group.ntt/en/",
    newsPage: "https://group.ntt/en/newsrelease/",
    feedType: "rss",
    feedUrl: "https://group.ntt/en/newsrelease/rss/release.rdf",
    kind: "international",
  },
  {
    id: "docomo-business",
    name: "NTTドコモビジネス",
    shortName: "ドコモビジネス",
    color: "#0066CC",
    homepage: "https://www.ntt.com/",
    newsPage: "https://www.ntt.com/about-us/press-releases.html",
    feedType: "scrape",
    feedUrl: "https://www.ntt.com/about-us/press-releases.html",
    kind: "international",
  },
];

// Tab 3-A: メディア
export const MEDIA_SOURCES: Source[] = [
  {
    id: "media-ntt",
    name: "メディア報道(NTT)",
    shortName: "メディア",
    color: "#737373",
    homepage: "https://news.google.com/",
    newsPage:
      "https://news.google.com/search?q=NTT&hl=ja&gl=JP&ceid=JP:ja",
    feedType: "rss",
    feedUrl:
      "https://news.google.com/rss/search?q=NTT+-%E3%83%A9%E3%82%B0%E3%83%93%E3%83%BC+-%E3%83%AA%E3%83%BC%E3%82%B0%E3%83%AF%E3%83%B3+-%E9%87%8E%E7%90%83+-%E3%82%B5%E3%83%83%E3%82%AB%E3%83%BC&hl=ja&gl=JP&ceid=JP:ja",
    kind: "media",
  },
];

// Tab 3-B: 規制
export const REGULATOR_SOURCES: Source[] = [
  {
    id: "soumu",
    name: "総務省",
    shortName: "総務省",
    color: "#5D6D7E",
    homepage: "https://www.soumu.go.jp/",
    newsPage: "https://www.soumu.go.jp/menu_news/s-news/",
    feedType: "rss",
    feedUrl: "https://www.soumu.go.jp/news.rdf",
    kind: "regulator",
  },
];

// Tab 4: 競合
export const COMPETITOR_SOURCES: Source[] = [
  {
    id: "kddi",
    name: "KDDI",
    shortName: "KDDI",
    color: "#EB5505",
    homepage: "https://newsroom.kddi.com/",
    newsPage:
      "https://news.google.com/search?q=KDDI&hl=ja&gl=JP&ceid=JP:ja",
    feedType: "rss",
    feedUrl:
      "https://news.google.com/rss/search?q=KDDI&hl=ja&gl=JP&ceid=JP:ja",
    kind: "competitor",
  },
  {
    id: "softbank",
    name: "ソフトバンク",
    shortName: "ソフトバンク",
    color: "#A6A6A6",
    homepage: "https://www.softbank.jp/corp/news/",
    newsPage:
      "https://news.google.com/search?q=%22%E3%82%BD%E3%83%95%E3%83%88%E3%83%90%E3%83%B3%E3%82%AF%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE+OR+%E3%82%BD%E3%83%95%E3%83%88%E3%83%90%E3%83%B3%E3%82%AF%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%22&hl=ja&gl=JP&ceid=JP:ja",
    feedType: "rss",
    feedUrl:
      "https://news.google.com/rss/search?q=%22%E3%82%BD%E3%83%95%E3%83%88%E3%83%90%E3%83%B3%E3%82%AF%E6%A0%AA%E5%BC%8F%E4%BC%9A%E7%A4%BE+OR+%E3%82%BD%E3%83%95%E3%83%88%E3%83%90%E3%83%B3%E3%82%AF%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB%22&hl=ja&gl=JP&ceid=JP:ja",
    kind: "competitor",
  },
  {
    id: "rakuten-mobile",
    name: "楽天モバイル",
    shortName: "楽天",
    color: "#BF0000",
    homepage: "https://corp.mobile.rakuten.co.jp/",
    newsPage:
      "https://news.google.com/search?q=%E6%A5%BD%E5%A4%A9%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB&hl=ja&gl=JP&ceid=JP:ja",
    feedType: "rss",
    feedUrl:
      "https://news.google.com/rss/search?q=%E6%A5%BD%E5%A4%A9%E3%83%A2%E3%83%90%E3%82%A4%E3%83%AB+-%E9%87%8E%E7%90%83+-%E3%82%A4%E3%83%BC%E3%82%B0%E3%83%AB%E3%82%B9+-%E3%83%9E%E3%83%AA%E3%83%BC%E3%83%B3%E3%82%BA+-%E3%82%B9%E3%83%9D%E3%83%BC%E3%83%84&hl=ja&gl=JP&ceid=JP:ja",
    kind: "competitor",
  },
];

export const ALL_SOURCES: Source[] = [
  ...PRIMARY_SOURCES,
  ...INTERNATIONAL_SOURCES,
  ...MEDIA_SOURCES,
  ...REGULATOR_SOURCES,
  ...COMPETITOR_SOURCES,
];

export function getSource(id: SourceId): Source {
  const s = ALL_SOURCES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown source: ${id}`);
  return s;
}
