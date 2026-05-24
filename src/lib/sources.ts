export type CompanyId =
  | "ntt"
  | "ntt-east"
  | "ntt-west"
  | "docomo"
  | "docomo-business";

export type Source = {
  id: CompanyId;
  name: string;
  shortName: string;
  color: string;
  accent: string;
  homepage: string;
  newsPage: string;
  feedType: "rss" | "scrape";
  feedUrl: string;
};

export const SOURCES: Source[] = [
  {
    id: "ntt",
    name: "NTT(持株会社)",
    shortName: "NTT",
    color: "#0033A0",
    accent: "bg-[#0033A0]",
    homepage: "https://group.ntt/jp/",
    newsPage: "https://group.ntt/jp/newsrelease/",
    feedType: "rss",
    feedUrl: "https://group.ntt/jp/newsrelease/rss/release.rdf",
  },
  {
    id: "ntt-east",
    name: "NTT東日本",
    shortName: "東日本",
    color: "#E60012",
    accent: "bg-[#E60012]",
    homepage: "https://www.ntt-east.co.jp/",
    newsPage: "https://www.ntt-east.co.jp/release/",
    feedType: "rss",
    feedUrl: "https://www.ntt-east.co.jp/rss/release.rdf",
  },
  {
    id: "ntt-west",
    name: "NTT西日本",
    shortName: "西日本",
    color: "#00A0E9",
    accent: "bg-[#00A0E9]",
    homepage: "https://www.ntt-west.co.jp/",
    newsPage: "https://www.ntt-west.co.jp/news/",
    feedType: "scrape",
    feedUrl: "https://www.ntt-west.co.jp/news/",
  },
  {
    id: "docomo",
    name: "NTTドコモ",
    shortName: "ドコモ",
    color: "#CC0033",
    accent: "bg-[#CC0033]",
    homepage: "https://www.docomo.ne.jp/",
    newsPage: "https://www.docomo.ne.jp/info/news_release/",
    feedType: "rss",
    feedUrl: "https://www.docomo.ne.jp/info/rss/news_release.rdf",
  },
  {
    id: "docomo-business",
    name: "NTTドコモビジネス",
    shortName: "ドコモビジネス",
    color: "#0066CC",
    accent: "bg-[#0066CC]",
    homepage: "https://www.ntt.com/",
    newsPage: "https://www.ntt.com/about-us/press-releases.html",
    feedType: "scrape",
    feedUrl: "https://www.ntt.com/about-us/press-releases.html",
  },
];

export function getSource(id: CompanyId): Source {
  const s = SOURCES.find((x) => x.id === id);
  if (!s) throw new Error(`Unknown source: ${id}`);
  return s;
}
