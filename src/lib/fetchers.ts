import Parser from "rss-parser";
import * as cheerio from "cheerio";
import {
  ALL_SOURCES,
  PRIMARY_SOURCES,
  INTERNATIONAL_SOURCES,
  MEDIA_SOURCES,
  REGULATOR_SOURCES,
  COMPETITOR_SOURCES,
  getSource,
  type SourceId,
  type Source,
} from "./sources";
import type { SourceFeed, NewsItem } from "./types";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const parser = new Parser({
  headers: {
    "User-Agent": UA,
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
  timeout: 15000,
});

async function fetchRss(source: Source): Promise<NewsItem[]> {
  const res = await fetch(source.feedUrl, {
    headers: { "User-Agent": UA },
    next: { revalidate: false, tags: ["news", `news:${source.id}`] },
  });
  if (!res.ok) throw new Error(`RSS ${source.feedUrl} -> HTTP ${res.status}`);
  const xml = await decodeXml(res);
  const feed = await parser.parseString(xml);
  const items: NewsItem[] = [];
  for (const it of feed.items ?? []) {
    if (!it.link || !it.title) continue;
    const date = it.isoDate || it.pubDate || new Date().toISOString();
    items.push({
      id: `${source.id}:${it.link}`,
      sourceId: source.id,
      title: it.title.trim(),
      url: it.link,
      publishedAt: new Date(date).toISOString(),
    });
  }
  return items;
}

async function decodeXml(res: Response): Promise<string> {
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
  // Peek the first ~200 bytes as ASCII to find encoding declaration.
  const head = new TextDecoder("ascii").decode(bytes.subarray(0, 200));
  const m = head.match(/encoding=["']([\w-]+)["']/i);
  const encoding = (m?.[1] ?? "utf-8").toLowerCase();
  try {
    const aliased =
      encoding === "shift_jis" || encoding === "shift-jis" || encoding === "x-sjis"
        ? "shift-jis"
        : encoding === "euc-jp" || encoding === "x-euc-jp"
          ? "euc-jp"
          : encoding;
    return new TextDecoder(aliased).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}

function parseJpDate(s: string): string | null {
  const m = s.match(/(20\d{2})[年./-](\d{1,2})[月./-](\d{1,2})/);
  if (!m) return null;
  const [, y, mo, d] = m;
  const iso = new Date(
    Date.UTC(Number(y), Number(mo) - 1, Number(d), 0, 0, 0)
  ).toISOString();
  return iso;
}

function absUrl(href: string, base: string): string {
  try {
    return new URL(href, base).toString();
  } catch {
    return href;
  }
}

async function fetchScrape(source: Source): Promise<NewsItem[]> {
  const res = await fetch(source.feedUrl, {
    headers: { "User-Agent": UA },
    next: { revalidate: false, tags: ["news", `news:${source.id}`] },
  });
  if (!res.ok) throw new Error(`HTML ${source.feedUrl} -> HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const items: NewsItem[] = [];
  const seen = new Set<string>();

  const candidates = $("li, dt, dd, tr, div, article").toArray();
  for (const el of candidates) {
    const $el = $(el);
    const text = $el.text();
    const date = parseJpDate(text);
    if (!date) continue;

    const $a = $el.find("a[href]").first();
    if (!$a.length) continue;
    const href = $a.attr("href");
    if (!href) continue;
    if (/^(mailto:|javascript:|#)/i.test(href)) continue;

    const absolute = absUrl(href, source.feedUrl);
    if (!isNewsLink(absolute, source.id)) continue;

    const rawTitle = source.titleSelector
      ? $a.find(source.titleSelector).first().text() || $a.text()
      : $a.text();
    const title = rawTitle
      .trim()
      .replace(/\s+/g, " ")
      .replace(/^20\d{2}[年./-]\d{1,2}[月./-]\d{1,2}日?\s*/, "")
      .replace(/（PDFファイル[^）]*）/g, "")
      .trim();
    if (!title || title.length < 4) continue;
    if (seen.has(absolute)) continue;
    seen.add(absolute);

    items.push({
      id: `${source.id}:${absolute}`,
      sourceId: source.id,
      title,
      url: absolute,
      publishedAt: date,
    });
    if (items.length >= 30) break;
  }
  return items;
}

function isNewsLink(url: string, sourceId: SourceId): boolean {
  if (sourceId === "ntt-west") {
    return (
      /ntt-west\.co\.jp\/news\/\d{4}\//.test(url) ||
      /ntt-west\.co\.jp\/news\/.*\.html/.test(url)
    );
  }
  if (sourceId === "docomo-business") {
    return /ntt\.com\/about-us\/(press-releases|news-center)\/.*\.html/.test(
      url
    );
  }
  if (sourceId === "nttdata") {
    return /nttdata\.com\/.*\/news\/(release|topics)\//.test(url);
  }
  if (sourceId === "nttud") {
    return (
      /nttud\.co\.jp\/news\/detail\//.test(url) ||
      /nttud\.co\.jp\/news_pdf\//.test(url) ||
      /nttud\.co\.jp\/news\/.*\.html/.test(url)
    );
  }
  return true;
}

export async function fetchSource(sourceId: SourceId): Promise<SourceFeed> {
  const source = getSource(sourceId);
  const fetchedAt = new Date().toISOString();
  try {
    const items =
      source.feedType === "rss"
        ? await fetchRss(source)
        : await fetchScrape(source);
    items.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return { sourceId, items: items.slice(0, 30), fetchedAt };
  } catch (e) {
    return {
      sourceId,
      items: [],
      fetchedAt,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export type AllFeeds = {
  primary: SourceFeed[];
  international: SourceFeed[];
  media: SourceFeed[];
  regulator: SourceFeed[];
  competitor: SourceFeed[];
};

export async function fetchAllGrouped(): Promise<AllFeeds> {
  const [primary, international, media, regulator, competitor] =
    await Promise.all([
      Promise.all(PRIMARY_SOURCES.map((s) => fetchSource(s.id))),
      Promise.all(INTERNATIONAL_SOURCES.map((s) => fetchSource(s.id))),
      Promise.all(MEDIA_SOURCES.map((s) => fetchSource(s.id))),
      Promise.all(REGULATOR_SOURCES.map((s) => fetchSource(s.id))),
      Promise.all(COMPETITOR_SOURCES.map((s) => fetchSource(s.id))),
    ]);
  return { primary, international, media, regulator, competitor };
}

export async function fetchAll(): Promise<SourceFeed[]> {
  return Promise.all(ALL_SOURCES.map((s) => fetchSource(s.id)));
}
