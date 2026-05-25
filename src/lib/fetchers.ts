import Parser from "rss-parser";
import * as cheerio from "cheerio";
import { SOURCES, getSource, ALL_BRAND_KEYWORDS } from "./sources";
import type { Source, SourceFeed, NewsItem } from "./types";
import { scoreArticle } from "./scoring";

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const parser = new Parser({
  headers: {
    "User-Agent": UA,
    Accept: "application/rss+xml, application/xml, text/xml, */*",
  },
  timeout: 15000,
});

/** Google News のリダイレクト記事タイトル末尾に付く媒体名（" - Reuters"等）を残しつつ、検出だけはする */
function detectMatchedBrands(title: string): string[] {
  const lower = title.toLowerCase();
  return ALL_BRAND_KEYWORDS.filter((b) => lower.includes(b.toLowerCase()));
}

/**
 * Phase 2: タイトル後処理ノイズフィルタ
 * 各メディアのRSSが目次ページ・株価ページ・他社プレス転載などを返してくるケースを除外。
 */
const NOISE_PATTERNS: RegExp[] = [
  // 目次ページ系
  /\bPage\s+\d+(\s+of\s+[\d,]+)?\s*[\|–-]/i,
  /^Latest Stories News/i,
  /Recent News articles \| page/i,
  /Asia Pacific - Page \d+/i,
  /中文 - Page \d+/i,
  // FT の "Company Announcement"（他社プレス転載）
  /[–-]\s*Company Announcement/i,
  // Seeking Alpha 系
  /Stock Price.*Quote.*News.*Analysis/i,
  /SA Transcripts'?s Analysis/i,
  /Earnings Call (Transcript|Prepared Remarks)/i,
  /Q[1-4]\s*20\d{2}\s*Earnings Call/i,
  /Mutual Fund:[A-Z]+/i,
  /Competitor Stock Analysis/i,
  /Japan Stock Market Outlook.*Analysis/i,
  // 投資家向けデータ集約ページ
  /Funding Rounds (and|&)\s*List of Investors/i,
  /Price, Quote, News (and|&)\s*Analysis/i,
  // 記者の著者プロフィールページ
  /^[A-Z][a-z]+\s[A-Z][a-z]+\s*[-–]\s*Financial Times$/,
  // 不明瞭なtopicページ (例: "Automobiles - Financial Times")
  /^[A-Z][a-z]+\s*[-–]\s*Financial Times$/,
  // 株価コードページ（例: "NTTD.SI - Reuters", "3850.T - Stock Price"）
  /^[A-Z0-9]{2,5}(\.[A-Z]{1,3})?\s*-\s*(\|\s*)?(Stock Price|Latest News|Reuters|Bloomberg)/i,
  /^\d{4}\.T\b/i,
];

function isNoise(title: string): boolean {
  return NOISE_PATTERNS.some((p) => p.test(title));
}

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
    const title = it.title.trim();
    if (isNoise(title)) continue;
    items.push({
      id: `${source.id}:${it.link}`,
      sourceId: source.id,
      title,
      url: it.link,
      publishedAt: new Date(date).toISOString(),
      matchedBrands: detectMatchedBrands(title),
    });
  }
  return items;
}

async function decodeXml(res: Response): Promise<string> {
  const buf = await res.arrayBuffer();
  const bytes = new Uint8Array(buf);
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

async function fetchScrape(source: Source): Promise<NewsItem[]> {
  const res = await fetch(source.feedUrl, {
    headers: { "User-Agent": UA },
    next: { revalidate: false, tags: ["news", `news:${source.id}`] },
  });
  if (!res.ok) throw new Error(`HTML ${source.feedUrl} -> HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  const items: NewsItem[] = [];
  $("a[href]").each((_, el) => {
    const $a = $(el);
    const title = $a.text().trim().replace(/\s+/g, " ");
    const href = $a.attr("href");
    if (!title || title.length < 8 || !href) return;
    if (/^(mailto:|javascript:|#)/i.test(href)) return;
    if (isNoise(title)) return;
    items.push({
      id: `${source.id}:${href}`,
      sourceId: source.id,
      title,
      url: new URL(href, source.feedUrl).toString(),
      publishedAt: new Date().toISOString(),
      matchedBrands: detectMatchedBrands(title),
    });
  });
  return items.slice(0, 30);
}

export async function fetchSource(sourceId: string): Promise<SourceFeed> {
  const source = getSource(sourceId);
  const fetchedAt = new Date().toISOString();
  try {
    const rawItems =
      source.feedType === "rss"
        ? await fetchRss(source)
        : await fetchScrape(source);
    // 品質スコアリング
    const scored: NewsItem[] = rawItems.map((it) => {
      const q = scoreArticle(it, source);
      return { ...it, score: q.score, band: q.band };
    });
    // discard 帯は捨てる
    const filtered = scored.filter((it) => it.band !== "discard");
    filtered.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    return { sourceId, items: filtered.slice(0, 30), fetchedAt };
  } catch (e) {
    return {
      sourceId,
      items: [],
      fetchedAt,
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

export async function fetchAll(): Promise<SourceFeed[]> {
  const results = await Promise.allSettled(
    SOURCES.map((s) => fetchSource(s.id))
  );
  return results.map((r, i) =>
    r.status === "fulfilled"
      ? r.value
      : {
          sourceId: SOURCES[i].id,
          items: [],
          fetchedAt: new Date().toISOString(),
          error: String(r.reason),
        }
  );
}
